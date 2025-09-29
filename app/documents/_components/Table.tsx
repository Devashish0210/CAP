// App/documents/_components/Table.tsx
"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/table";
import {
  Ndc, displayStatus, trim,
  deriveRmComment, deriveFinanceComment, deriveAdminComment, deriveCisComment, deriveHrssComment,
  deriveRelievingLetter, deriveServiceLetter, deriveFullFinalWithLwd
} from "./ndcLogic";

type Props = { ndc?: Partial<Ndc> };

const columns = [
  { key: "owner",   label: "NDC Owner" },
  { key: "status",  label: "Status" },
  { key: "comment", label: "Comment" },
];

export default function NdcTable({ ndc }: Props) {
  const d: Partial<Ndc> = ndc ?? {};

  const ff = deriveFullFinalWithLwd(d);      // Full & Final row status
  const rl = deriveRelievingLetter(d);       // Relieving Letter row messages
  const sl = deriveServiceLetter(d);         // Service Letter row status

  const rows = [
    { id: "rm",      owner: "Reporting Manager", status: d.rmNdcStatus,      comment: deriveRmComment(d.rmNdcStatus, d.rmNdcComment) },
    { id: "finance", owner: "Finance",           status: d.financeNdcStatus, comment: deriveFinanceComment(d.financeNdcStatus, d.financeNdcComment) },
    { id: "admin",   owner: "Admin",             status: d.adminNdcStatus,   comment: deriveAdminComment(d.adminNdcStatus, d.adminNdcComment) },
    { id: "cis",     owner: "CIS",               status: d.cisNdcStatus,     comment: deriveCisComment(d.cisNdcStatus, d.cisNdcComment) },
    { id: "hrss",    owner: "HRSS",              status: d.hrssNdcStatus,    comment: deriveHrssComment(d.hrssNdcStatus, d.hrssNdcComment) },
    { id: "payroll", owner: "Final Settlement",  status: d.payrollNdcStatus, comment: trim(d.payrollNdcComment) || ff.statusText },

    // New document rows (appended)
    { id: "rl",      owner: "Relieving Letter",  status: rl.statusText,      comment: rl.commentText },
    { id: "sl",      owner: "Service Letter",    status: sl.statusText,      comment: sl.commentText },
  ];

  return (
    <>
    <Table
      aria-label="My NDC Status"
      removeWrapper
      classNames={{
        base: "rounded-2xl shadow-sm border border-gray-200 overflow-hidden",
        table: "min-w-full",
        thead: "bg-transparent",
        th: "text-sm font-semibold text-slate-700 py-3 px-4 bg-transparent",
        tr: "odd:bg-slate-50 even:bg-white",
        td: "text-[15px] py-4 px-4 align-middle",
        wrapper: "bg-white",
      }}
    >
      <TableHeader columns={columns}>
        {(col) => <TableColumn key={col.key}>{col.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(row) => (
          <TableRow key={row.id}>
            <TableCell>{row.owner}</TableCell>
            <TableCell>{displayStatus(row.status)}</TableCell>
            <TableCell>{row.comment}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-900">
  <span className="font-medium">Note:</span>{" "}
  In case of pending NDC clearance, please coordinate with respective department POC for clearance or raise AskML ticket
</div>
</>
  );
}
