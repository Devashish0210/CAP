// app/documents/page.tsx
// Server Component: fetch NDC + Employee Details, derive LWD fallback, render DocumentsPage.

import DocumentsPage from "@/app/documents/_components/DocumentsPage";
import fetchNdc from "./_api-helpers/ndc";
import getEmployeeDetails from "../_api-helpers/emp-details";

// Helper: ensure a string is a valid date-like value
function coerceIsoOrUndefined(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  const t = Date.parse(s);
  return Number.isNaN(t) ? undefined : s;
}

export default async function Page() {
  // Fetch both in parallel on the server
  const [ndc, emp] = await Promise.all([fetchNdc(), getEmployeeDetails()]);

  // Try common LWD keys from Employee Details, else fallback to 1 April 2025
  const lwdFromEmp =
    emp?.lwd ??
    emp?.lastWorkingDay ??
    emp?.last_working_day ??
    emp?.LWD ??
    undefined;

  const lwdDate = coerceIsoOrUndefined(lwdFromEmp) ?? "2025-04-01";

  // Pass lwdDate along with NDC to the existing page component
  return <DocumentsPage ndc={{ ...ndc, lwdDate }} />;
}