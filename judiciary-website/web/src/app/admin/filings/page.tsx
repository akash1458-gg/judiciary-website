"use client";

import { useState } from "react";

const initialFilings = [
  {
    id: "TMP-2026-084521",
    type: "Civil Suit",
    party: "Rajesh Kumar Sharma vs State of Delhi",
    court: "District Court No. 12",
    submitted: "14 Aug 2026, 11:45 PM",
    docs: 3,
    fee: "₹ 650",
    status: "Under Scrutiny",
  },
  {
    id: "TMP-2026-084518",
    type: "Bail Application",
    party: "State vs Vikram Singh",
    court: "Sessions Court",
    submitted: "14 Aug 2026, 6:20 PM",
    docs: 2,
    fee: "₹ 200",
    status: "Under Scrutiny",
  },
  {
    id: "TMP-2026-084515",
    type: "Writ Petition",
    party: "Citizen Forum vs Municipal Corp",
    court: "High Court of Delhi",
    submitted: "14 Aug 2026, 5:10 PM",
    docs: 5,
    fee: "₹ 1,200",
    status: "Under Scrutiny",
  },
  {
    id: "TMP-2026-084502",
    type: "Civil Suit",
    party: "Sunita Devi vs Ramesh Kumar",
    court: "District Court No. 5",
    submitted: "14 Aug 2026, 2:30 PM",
    docs: 4,
    fee: "₹ 500",
    status: "Returned",
  },
];

export default function AdminFilingsPage() {
  const [filings, setFilings] = useState(initialFilings);
  const [selected, setSelected] = useState<string | null>(null);

  const updateStatus = (id: string, status: string) => {
    setFilings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    );
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Filings</h1>
          <p className="text-gray-600 mt-1">
            Review, accept or return e-filed cases
          </p>
        </div>
        <div className="flex gap-2">
          <select className="border rounded-lg px-3 py-2 text-sm bg-white">
            <option>All Status</option>
            <option>Under Scrutiny</option>
            <option>Accepted</option>
            <option>Returned</option>
          </select>
          <input
            type="text"
            placeholder="Search filing no. / party"
            className="border rounded-lg px-3 py-2 text-sm w-48"
          />
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-600">Filing No.</th>
                <th className="px-5 py-3 font-medium text-gray-600">Type</th>
                <th className="px-5 py-3 font-medium text-gray-600">Parties</th>
                <th className="px-5 py-3 font-medium text-gray-600">Court</th>
                <th className="px-5 py-3 font-medium text-gray-600">Docs</th>
                <th className="px-5 py-3 font-medium text-gray-600">Fee</th>
                <th className="px-5 py-3 font-medium text-gray-600">Status</th>
                <th className="px-5 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filings.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-primary-700 font-medium">
                    {f.id}
                  </td>
                  <td className="px-5 py-3">{f.type}</td>
                  <td className="px-5 py-3 max-w-xs truncate">{f.party}</td>
                  <td className="px-5 py-3 text-gray-600">{f.court}</td>
                  <td className="px-5 py-3">{f.docs}</td>
                  <td className="px-5 py-3">{f.fee}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        f.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : f.status === "Returned"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {f.status === "Under Scrutiny" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(f.id, "Accepted")}
                          className="text-xs px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(f.id, "Returned")}
                          className="text-xs px-2.5 py-1 border border-red-300 text-red-700 rounded hover:bg-red-50"
                        >
                          Return
                        </button>
                        <button
                          onClick={() => setSelected(f.id)}
                          className="text-xs px-2.5 py-1 border rounded hover:bg-gray-50"
                        >
                          View
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelected(f.id)}
                        className="text-xs text-primary-700 hover:underline"
                      >
                        View details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal (simple) */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="font-semibold text-lg mb-4">
              Filing Details — {selected}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Documents and party details would appear here. In production this
              would show uploaded PDFs, e-signatures, and fee receipts.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => updateStatus(selected, "Accepted")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Accept & Generate CNR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
