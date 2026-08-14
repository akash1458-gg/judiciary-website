"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function CaseStatusPage() {
  const [showResults, setShowResults] = useState(false);

  return (
    <>
      <Header active="case-status" />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-primary-900 mb-6">
          Case Status Search
        </h1>

        {/* Search Form */}
        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowResults(true);
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Court Level
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 bg-white">
                  <option>District / Taluka Courts</option>
                  <option>High Courts</option>
                  <option>Supreme Court</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 bg-white">
                  <option>Select State</option>
                  <option>Delhi</option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Tamil Nadu</option>
                  <option>Uttar Pradesh</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District / Court Complex
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 bg-white">
                  <option>Select District</option>
                  <option>New Delhi</option>
                  <option>Mumbai</option>
                  <option>Bengaluru</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search By
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 bg-white">
                  <option value="cnr">CNR Number</option>
                  <option value="case">Case Number</option>
                  <option value="party">Party Name</option>
                  <option value="advocate">Advocate Name</option>
                  <option value="fir">FIR Number</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. DLCT01-123456-2024 or Party Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary-700 hover:bg-primary-800 text-white font-medium py-2.5 rounded-lg transition"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
            <div className="bg-primary-50 border-b px-6 py-4 flex flex-wrap justify-between items-center gap-3">
              <div>
                <h2 className="font-bold text-lg text-primary-900">
                  Case Details
                </h2>
                <p className="text-sm text-gray-600">
                  CNR:{" "}
                  <span className="font-mono font-medium">
                    DLCT01-000123-2024
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50">
                  Print
                </button>
                <button className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50">
                  Download PDF
                </button>
                <button className="text-sm px-3 py-1.5 bg-primary-700 text-white rounded hover:bg-primary-800">
                  Add to My Cases
                </button>
              </div>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Case Information
                  </h3>
                  <dl className="space-y-2 text-sm">
                    {[
                      ["Case Number", "CS/123/2024"],
                      ["Case Type", "Civil Suit"],
                      ["Filing Date", "15 Mar 2024"],
                      ["Registration Date", "18 Mar 2024"],
                      ["Current Stage", "Evidence"],
                      ["Next Hearing", "22 Aug 2026"],
                      ["Court", "District Court, New Delhi – Court No. 12"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex justify-between border-b pb-1"
                      >
                        <dt className="text-gray-600">{label}</dt>
                        <dd className="font-medium text-right">{value}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between border-b pb-1">
                      <dt className="text-gray-600">Status</dt>
                      <dd>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Pending – Hearing
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Parties
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-primary-800">
                        Petitioner(s)
                      </div>
                      <p>Rajesh Kumar Sharma</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Advocate: Adv. Meera Patel (D/1234/2015)
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-primary-800">
                        Respondent(s)
                      </div>
                      <p>State of Delhi & Ors.</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Advocate: Standing Counsel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="border-t px-6 py-5">
              <h3 className="font-semibold text-primary-900 mb-4">
                Case History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Business</th>
                      <th className="px-3 py-2 font-medium">Purpose</th>
                      <th className="px-3 py-2 font-medium">Judge</th>
                      <th className="px-3 py-2 font-medium">Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-3 py-2">22 Aug 2026</td>
                      <td className="px-3 py-2">Next Hearing</td>
                      <td className="px-3 py-2">Evidence</td>
                      <td className="px-3 py-2">Hon’ble Shri A.K. Verma</td>
                      <td className="px-3 py-2">—</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">10 Jul 2026</td>
                      <td className="px-3 py-2">Hearing</td>
                      <td className="px-3 py-2">Arguments</td>
                      <td className="px-3 py-2">Hon’ble Shri A.K. Verma</td>
                      <td className="px-3 py-2">
                        <a href="#" className="text-primary-700 hover:underline">
                          View
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">15 May 2026</td>
                      <td className="px-3 py-2">Hearing</td>
                      <td className="px-3 py-2">Framing of Issues</td>
                      <td className="px-3 py-2">Hon’ble Shri A.K. Verma</td>
                      <td className="px-3 py-2">
                        <a href="#" className="text-primary-700 hover:underline">
                          View
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">18 Mar 2024</td>
                      <td className="px-3 py-2">Registration</td>
                      <td className="px-3 py-2">Case Registered</td>
                      <td className="px-3 py-2">—</td>
                      <td className="px-3 py-2">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Orders */}
            <div className="border-t px-6 py-5 bg-gray-50">
              <h3 className="font-semibold text-primary-900 mb-3">
                Orders & Judgments
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between items-center bg-white border rounded-lg px-4 py-3">
                  <div>
                    <span className="font-medium">
                      Interim Order dated 10 Jul 2026
                    </span>
                    <span className="text-gray-500 ml-2">• 3 pages</span>
                  </div>
                  <a
                    href="#"
                    className="text-primary-700 font-medium hover:underline"
                  >
                    Download PDF
                  </a>
                </li>
                <li className="flex justify-between items-center bg-white border rounded-lg px-4 py-3">
                  <div>
                    <span className="font-medium">Order dated 15 May 2026</span>
                    <span className="text-gray-500 ml-2">• 2 pages</span>
                  </div>
                  <a
                    href="#"
                    className="text-primary-700 font-medium hover:underline"
                  >
                    Download PDF
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
