import Link from "next/link";

const stats = [
  { label: "Pending Filings", value: "24", change: "+6 today", href: "/admin/filings", color: "bg-amber-50 border-amber-200 text-amber-900" },
  { label: "Cases Registered Today", value: "18", change: "CNR generated", href: "#", color: "bg-blue-50 border-blue-200 text-blue-900" },
  { label: "Hearings Listed", value: "142", change: "Tomorrow", href: "/admin/cause-lists", color: "bg-green-50 border-green-200 text-green-900" },
  { label: "Orders Pending Upload", value: "7", change: "Action needed", href: "/admin/orders", color: "bg-red-50 border-red-200 text-red-900" },
];

const recentFilings = [
  { id: "TMP-2026-084521", type: "Civil Suit", party: "Rajesh Kumar Sharma", court: "District Court No. 12", submitted: "14 Aug, 11:45 PM", status: "Under Scrutiny" },
  { id: "TMP-2026-084518", type: "Bail Application", party: "State vs Vikram Singh", court: "Sessions Court", submitted: "14 Aug, 6:20 PM", status: "Under Scrutiny" },
  { id: "TMP-2026-084510", type: "Writ Petition", party: "Citizen Forum", court: "High Court", submitted: "14 Aug, 4:05 PM", status: "Accepted" },
  { id: "TMP-2026-084502", type: "Civil Suit", party: "Sunita Devi", court: "District Court No. 5", submitted: "14 Aug, 2:30 PM", status: "Returned" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of today’s judicial work</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-xl border p-5 hover:shadow-md transition ${s.color}`}
          >
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-1">{s.label}</div>
            <div className="text-xs mt-2 opacity-80">{s.change}</div>
          </Link>
        ))}
      </div>

      {/* Recent pending filings */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Filings</h2>
          <Link href="/admin/filings" className="text-sm text-primary-700 hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-600">Filing No.</th>
                <th className="px-6 py-3 font-medium text-gray-600">Type</th>
                <th className="px-6 py-3 font-medium text-gray-600">Party</th>
                <th className="px-6 py-3 font-medium text-gray-600">Court</th>
                <th className="px-6 py-3 font-medium text-gray-600">Submitted</th>
                <th className="px-6 py-3 font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentFilings.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-primary-700">{f.id}</td>
                  <td className="px-6 py-3">{f.type}</td>
                  <td className="px-6 py-3">{f.party}</td>
                  <td className="px-6 py-3 text-gray-600">{f.court}</td>
                  <td className="px-6 py-3 text-gray-500">{f.submitted}</td>
                  <td className="px-6 py-3">
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
                  <td className="px-6 py-3">
                    <Link
                      href="/admin/filings"
                      className="text-primary-700 hover:underline font-medium"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: "/admin/filings", label: "Review Pending Filings", icon: "📥" },
          { href: "/admin/cause-lists", label: "Generate Cause List", icon: "📋" },
          { href: "/admin/orders", label: "Upload Order / Judgment", icon: "📄" },
          { href: "/admin/reports", label: "View Statistics", icon: "📈" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className="bg-white border rounded-xl p-5 hover:shadow-md hover:border-primary-300 transition flex items-center gap-4"
          >
            <span className="text-2xl">{a.icon}</span>
            <span className="font-medium text-gray-800">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
