"use client";

import { useEffect, useState } from "react";

type LogRow = {
  id: string;
  action: string;
  entity: string | null;
  entityId: string | null;
  userId: string | null;
  createdAt: string;
  metadata: string | null;
};

// Fallback demo data when DB is empty / offline
const DEMO_LOGS: LogRow[] = [
  {
    id: "1",
    action: "USER_LOGIN",
    entity: "User",
    entityId: "staff-1",
    userId: "staff-1",
    createdAt: new Date().toISOString(),
    metadata: JSON.stringify({ role: "COURT_STAFF", email: "staff@court.gov" }),
  },
  {
    id: "2",
    action: "FILING_ACCEPT",
    entity: "Filing",
    entityId: "TMP-2026-084521",
    userId: "staff-1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    metadata: JSON.stringify({ cnr: "DLCT01-000999-2026" }),
  },
  {
    id: "3",
    action: "ORDER_UPLOAD",
    entity: "OrderJudgment",
    entityId: "ord-1",
    userId: "staff-1",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    metadata: JSON.stringify({ caseNumber: "CS/123/2024" }),
  },
  {
    id: "4",
    action: "CAUSE_LIST_PUBLISH",
    entity: "CauseList",
    entityId: "cl-1",
    userId: "staff-1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    metadata: JSON.stringify({ date: "2026-08-15", court: "District Court No. 12" }),
  },
  {
    id: "5",
    action: "FILE_UPLOAD",
    entity: "Document",
    entityId: null,
    userId: "adv-1",
    createdAt: new Date(Date.now() - 90000000).toISOString(),
    metadata: JSON.stringify({ fileName: "Petition.pdf", size: 1200000 }),
  },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>(DEMO_LOGS);

  useEffect(() => {
    // Optional: fetch from API when available
    fetch("/api/audit-logs")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.logs?.length) setLogs(data.logs);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">
          Security and activity trail for compliance
        </p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-600">Time</th>
                <th className="px-5 py-3 font-medium text-gray-600">Action</th>
                <th className="px-5 py-3 font-medium text-gray-600">Entity</th>
                <th className="px-5 py-3 font-medium text-gray-600">User</th>
                <th className="px-5 py-3 font-medium text-gray-600">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {log.entity || "—"}
                    {log.entityId ? (
                      <span className="text-gray-400 ml-1 text-xs">
                        ({log.entityId.slice(0, 12)})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{log.userId || "—"}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 max-w-xs truncate">
                    {log.metadata || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-gray-700">
        Audit logs record logins, filing decisions, order uploads, payments and
        file uploads. In production these are immutable and retained per
        judicial data retention policy.
      </div>
    </div>
  );
}
