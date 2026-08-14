import Header from "@/components/Header";

export default function CauseListPage() {
  return (
    <>
      <Header active="cause-list" />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-primary-900 mb-6">Cause List</h1>

        <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Court Level</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>District Courts</option>
                <option>High Courts</option>
                <option>Supreme Court</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State / Court</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>Delhi</option>
                <option>Maharashtra</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                defaultValue="2026-08-14"
                className="w-full border rounded-lg px-3 py-2.5"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2.5 rounded-lg font-medium">
                Show Cause List
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="bg-primary-50 px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h2 className="font-bold text-primary-900">
                District Court, New Delhi – Court No. 12
              </h2>
              <p className="text-sm text-gray-600">
                Hon’ble Shri A.K. Verma • 14 August 2026
              </p>
            </div>
            <button className="text-sm px-3 py-1.5 border rounded hover:bg-white">
              Download PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">S.No</th>
                  <th className="px-4 py-3 font-medium">Case No.</th>
                  <th className="px-4 py-3 font-medium">Parties</th>
                  <th className="px-4 py-3 font-medium">Purpose</th>
                  <th className="px-4 py-3 font-medium">Advocate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["1", "CS/123/2024", "Rajesh Kumar Sharma vs State of Delhi", "Evidence", "Adv. Meera Patel"],
                  ["2", "CS/456/2023", "Suresh Chand vs ABC Pvt Ltd", "Arguments", "Adv. R.K. Singh"],
                  ["3", "Bail/789/2026", "State vs Vikram Singh", "Bail Application", "Adv. Priya Sharma"],
                  ["4", "WP/112/2025", "Citizen Forum vs Municipal Corp", "Further Hearing", "Adv. Anil Gupta"],
                  ["5", "CS/334/2024", "Sunita Devi vs Ramesh Kumar", "Cross Examination", "Adv. Neha Verma"],
                ].map(([sno, caseNo, parties, purpose, advocate]) => (
                  <tr key={sno} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{sno}</td>
                    <td className="px-4 py-3 font-mono text-primary-700">{caseNo}</td>
                    <td className="px-4 py-3">{parties}</td>
                    <td className="px-4 py-3">{purpose}</td>
                    <td className="px-4 py-3">{advocate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
