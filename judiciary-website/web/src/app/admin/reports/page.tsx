export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Statistics</h1>
        <p className="text-gray-600 mt-1">
          NJDG-style pendency and disposal overview
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pending", value: "12,458", sub: "This court complex" },
          { label: "Disposed (MTD)", value: "1,024", sub: "This month" },
          { label: "New Filings (MTD)", value: "892", sub: "This month" },
          { label: "Avg. Age of Cases", value: "18.4 mo", sub: "Pending matters" },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="text-2xl font-bold text-primary-900">{s.value}</div>
            <div className="text-sm font-medium text-gray-800 mt-1">{s.label}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Pendency by Case Type</h2>
          <div className="space-y-3">
            {[
              { type: "Civil Suits", count: 4820, pct: 39 },
              { type: "Criminal", count: 3210, pct: 26 },
              { type: "Writ Petitions", count: 1850, pct: 15 },
              { type: "Bail Applications", count: 980, pct: 8 },
              { type: "Others", count: 1598, pct: 12 },
            ].map((r) => (
              <div key={r.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{r.type}</span>
                  <span className="font-medium">{r.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Age-wise Pendency</h2>
          <div className="space-y-3">
            {[
              { band: "0–1 year", count: 3200, pct: 26 },
              { band: "1–3 years", count: 4100, pct: 33 },
              { band: "3–5 years", count: 2800, pct: 22 },
              { band: "5–10 years", count: 1650, pct: 13 },
              { band: "> 10 years", count: 708, pct: 6 },
            ].map((r) => (
              <div key={r.band}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{r.band}</span>
                  <span className="font-medium">{r.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-3">Export Options</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Download CSV
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            Download PDF Report
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
            NJDG Sync Status
          </button>
        </div>
      </div>
    </div>
  );
}
