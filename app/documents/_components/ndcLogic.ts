// App/documents/_components/ndcLogic.ts
export type Ndc = {
  // NDC Owner rows
  rmNdcStatus?: string; rmNdcComment?: string;
  financeNdcStatus?: string; financeNdcComment?: string;
  adminNdcStatus?: string; adminNdcComment?: string;
  cisNdcStatus?: string; cisNdcComment?: string;
  hrssNdcStatus?: string; hrssNdcComment?: string;
  payrollNdcStatus?: string; payrollNdcComment?: string; // Final Settlement (Payroll)

  // Additional fields for document rows
  ffStatus?: string;                 // "Positive" | "Negative" | "Negative but settled"
  ffNegativeButSettled?: boolean;    // optional flag if backend provides it
  lwdDate?: string;                  // ISO date or display string
};

// utils
export function trim(s?: string) { return (s ?? "").trim(); }
export function lc(s?: string) { return trim(s).toLowerCase(); }
export function isBlank(s?: string) { return trim(s) === ""; }
export function isCompleted(s?: string) { return lc(s) === "completed"; }
export function isInTransit(s?: string) {
  const v = lc(s);
  return v === "asset in-transit" || v === "asset in transit";
}
export function isPendingOrBlank(s?: string) {
  const v = lc(s);
  return v === "pending" || isBlank(s);
}
export function displayStatus(s?: string): string {
  return isBlank(s) ? "Pending" : trim(s);
}

// ordinal date, e.g., 1st April 2025 (fallback to 1st April 2025 if missing)
function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}
export function formatLwdOrDefault(iso?: string) {
  const d = iso && !isNaN(Date.parse(iso)) ? new Date(iso) : new Date("2025-04-01");
  const day = ordinal(d.getDate());
  const month = d.toLocaleString("en-GB", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

// Owner comment rules
export function deriveRmComment(status?: string, mihrComment?: string): string {
  const st = trim(status);
  if (isCompleted(st)) return "Your Reporting Manager clearance has been successfully completed";
  if (isBlank(st)) return "Reporting Manager clearance is pending for outstanding client or customer asset submissions";
  return trim(mihrComment);
}
export function deriveFinanceComment(status?: string, mihrComment?: string): string {
  const st = trim(status);
  if (isCompleted(st)) return trim(mihrComment);
  if (isBlank(st)) return "Finance team clearance is in progress";
  return trim(mihrComment);
}
export function deriveCisComment(status?: string, mihrComment?: string): string {
  const st = trim(status);
  if (isCompleted(st) || isInTransit(st)) return trim(mihrComment);
  if (isBlank(st)) return "CIS clearance is pending due to outstanding submission of Microland assets";
  return trim(mihrComment);
}
export function deriveHrssComment(status?: string, mihrComment?: string): string {
  const st = trim(status);
  if (isCompleted(st)) return trim(mihrComment);
  if (isBlank(st)) return "HRSS clearance is in progress";
  return trim(mihrComment);
}
export function deriveAdminComment(status?: string, mihrComment?: string): string {
  const st = trim(status);
  if (isCompleted(st) || isInTransit(st)) return trim(mihrComment);
  if (isBlank(st)) return "Admin clearance is pending for submission of ML ID, Access Card, Door/Project Keys";
  return trim(mihrComment);
}

// Relieving Letter
export function deriveRelievingLetter(ndc?: Partial<Ndc>) {
  const d = ndc ?? {};
  const financeOk = isCompleted(d.financeNdcStatus);
  const rmOk = isCompleted(d.rmNdcStatus);
  const adminOk = isCompleted(d.adminNdcStatus);        // spec calls for Admin = Completed
  const cisOk = isCompleted(d.cisNdcStatus) || isInTransit(d.cisNdcStatus);

  const ready = financeOk && rmOk && adminOk && cisOk;

  const anyPending =
    isPendingOrBlank(d.financeNdcStatus) ||
    isPendingOrBlank(d.rmNdcStatus) ||
    isPendingOrBlank(d.adminNdcStatus) ||
    isPendingOrBlank(d.cisNdcStatus);

  const statusText = ready ? "Your Relieving letter is now ready for download" : "";
  const commentText = !ready && anyPending
    ? "Certain NDC clearances are in-progress. You will receive notification upon completion of all clearances. Please revisit this page for your relieving letter once all clearances are finalized"
    : "";

  return { statusText, commentText };
}

// Service Letter
// Service Letter
export function deriveServiceLetter(ndc?: Partial<Ndc>) {
  const d = ndc ?? {};
  const adminDone = isCompleted(d.adminNdcStatus);
  const financeDone = isCompleted(d.financeNdcStatus);
  const cisDone = isCompleted(d.cisNdcStatus);
  const hrssDone = isCompleted(d.hrssNdcStatus);
  const rmDone = isCompleted(d.rmNdcStatus);
  const payrollDone = isCompleted(d.payrollNdcStatus);

  const allCompleted = adminDone && financeDone && cisDone && hrssDone && rmDone && payrollDone;
  const payrollPending = isPendingOrBlank(d.payrollNdcStatus);
  const othersAllCompleted = adminDone && financeDone && cisDone && hrssDone && rmDone;

  const ff = lc(d.ffStatus);
  const negButSettled = d.ffNegativeButSettled === true || ff === "negative but settled";

  // 1) Payroll Pending + others Completed
  if (payrollPending && othersAllCompleted) {
    const msg =
      "Your finance settlement is in progress. Final Settlement processing requires a minimum of 15 days. Please revisit this page after 15 calendar days from your LWD";
    return { statusText: msg, commentText: msg };
  }

  // 2) All Completed + F&F Positive or Negative but settled
  if (allCompleted && (ff === "positive" || negButSettled)) {
    const msg =
      "Your Service letter is ready for download. Your settlement amount will be credited to your registered Microland salary account within 5 working days.";
    return { statusText: msg, commentText: msg };
  }

  // 3) All Completed + F&F Negative
  if (allCompleted && ff === "negative") {
    const msg =
      "Your Service letter is on-hold due to outstanding negative Final settlement. Please clear all pending dues and revisit this page";
    return { statusText: msg, commentText: msg };
  }

  return { statusText: "", commentText: "Certain NDC clearances are in-progress. Please revisit this page for your service letter once all clearances are finalized" };
}


// Full & Final settlement (Payroll) – includes LWD message for Pending
export function deriveFullFinalWithLwd(ndc?: Partial<Ndc>) {
  const d = ndc ?? {};
  const payrollCompleted = isCompleted(d.payrollNdcStatus);
  const payrollPending = isPendingOrBlank(d.payrollNdcStatus);
  if (payrollCompleted) {
    return { statusText: "Your Full and Final settlement is now ready for download" };
  }
  if (payrollPending) {
    const lwd = formatLwdOrDefault(d.lwdDate);
    return {
      statusText:
        `Your Last Working Day was ${lwd}. ` +
        "Subject to NDC clearance completion, Final Settlement processing requires a minimum of 15 days. " +
        "Please revisit this page after 15 calendar days from your LWD",
    };
  }
  return { statusText: "" };
}
