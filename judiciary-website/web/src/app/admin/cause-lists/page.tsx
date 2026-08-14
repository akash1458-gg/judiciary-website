"use client";

import { useState } from "react";

export default function AdminCauseListsPage() {
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cause List Management</h1>
        <p className="text-gray-600 mt-1">
          Generate and publish daily cause lists
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Generate Cause List</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Court</label>
            <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
              <option>District Court No. 12</option>
              <option>District Court No. 8</option>
              <option>Sessions Court</option>
              <option>High Court – Court No. 5</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Judge / Bench</label>
            <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
              <option>Hon’ble Shri A.K. Verma</option>
              <option>Hon’ble Smt. P. Sharma</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              defaultValue="2026-08-15"
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setGenerated(true)}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2.5 rounded-lg font-medium"
            >
              Generate List
            </button>
          </div>
        </div>
      </div>

      {generated && (
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b flex items-center justify-between bg-green-50">
            <div>
              <h2 className="font-semibold text-gray-900">
                Cause List – 15 Aug 2026
              </h2>
              <p className="text-sm text-gray-600">
                District Court No. 12 • Hon’ble Shri A.K. Verma
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-sm px-3 py-1.5 border rounded-lg hover:bg-white">
                Preview PDF
              </button>
              <button className="text-sm px-3 py-1.5 bg-primary-700 text-white rounded-lg hover:bg-primary-800">
                Publish
              </button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">S.No</th>
                <th className="px-5 py-3 font-medium">Case No.</th>
                <th className="px-5 py-3 font-medium">Parties</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ["1", "CS/123/2024", "Rajesh Kumar Sharma vs State of Delhi", "Evidence"],
                ["2", "CS/456/2023", "Suresh Chand vs ABC Pvt Ltd", "Arguments"],
                ["3", "Bail/789/2026", "State vs Vikram Singh", "Bail Application"],
                ["4", "CS/334/2024", "Sunita Devi vs Ramesh Kumar", "Cross Examination"],
              ].map(([sno, cn, parties, purpose]) => (
                <tr key={sno} className="hover:bg-gray-50">
                  <td className="px-5 py-3">{sno}</td>
                  <td className="px-5 py-3 font-mono text-primary-700">{cn}</td>
                  <td className="px-5 py-3">{parties}</td>
                  <td className="px-5 py-3">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-gray-700">
        <p className="font-medium text-primary-800 mb-1">Tip</p>
        Published cause lists become visible on the public portal and are sent
        via SMS/email to linked parties and advocates.
      </div>
    </div>
  );
}
