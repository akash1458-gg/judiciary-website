import Header from "@/components/Header";

export default function JudgmentsPage() {
  return (
    <>
      <Header active="judgments" />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-primary-900 mb-6">
          Judgments & Orders
        </h1>

        <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Court</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>All Courts</option>
                <option>Supreme Court</option>
                <option>High Courts</option>
                <option>District Courts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Case Type</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>All Types</option>
                <option>Civil</option>
                <option>Criminal</option>
                <option>Writ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2.5" />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2.5 rounded-lg font-medium">
                Search
              </button>
            </div>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by party name, case number, keywords..."
              className="w-full border rounded-lg px-3 py-2.5"
            />
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-3 bg-gray-50 border-b text-sm text-gray-600">
            Showing 1–10 of 1,248 results
          </div>
          <ul className="divide-y">
            {[
              {
                title: "Rajesh Kumar Sharma vs State of Delhi & Ors.",
                meta: "CS/123/2024 • District Court, New Delhi • Interim Order",
                date: "Date: 10 Jul 2026 • Judge: Hon’ble Shri A.K. Verma",
              },
              {
                title: "ABC Pvt Ltd vs Suresh Chand",
                meta: "CS/456/2023 • District Court, New Delhi • Final Judgment",
                date: "Date: 28 Jun 2026 • Judge: Hon’ble Smt. P. Sharma",
              },
              {
                title: "Citizen Forum vs Municipal Corporation",
                meta: "WP/112/2025 • High Court of Delhi • Judgment",
                date: "Date: 15 Jun 2026 • Bench: Hon’ble Justices X & Y",
              },
            ].map((item) => (
              <li key={item.title} className="p-5 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <a
                      href="#"
                      className="font-medium text-primary-800 hover:underline"
                    >
                      {item.title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">{item.meta}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-700 hover:underline whitespace-nowrap"
                  >
                    Download PDF
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
