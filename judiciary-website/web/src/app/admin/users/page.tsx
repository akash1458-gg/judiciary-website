"use client";

const users = [
  { name: "Adv. Meera Patel", email: "meera.patel@email.com", role: "Advocate", status: "Verified", joined: "12 Jan 2024" },
  { name: "Rajesh Kumar Sharma", email: "rajesh.k@email.com", role: "Litigant", status: "Active", joined: "05 Mar 2024" },
  { name: "Court Staff – Registrar", email: "registrar@court.gov", role: "Court Staff", status: "Active", joined: "01 Jan 2023" },
  { name: "Adv. R.K. Singh", email: "rk.singh@email.com", role: "Advocate", status: "Verified", joined: "18 Jun 2022" },
  { name: "Sunita Devi", email: "sunita.d@email.com", role: "Litigant", status: "Pending KYC", joined: "10 Aug 2026" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users & Roles</h1>
          <p className="text-gray-600 mt-1">Manage litigants, advocates and staff accounts</p>
        </div>
        <button className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg text-sm font-medium">
          + Add Staff User
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["All", "Advocate", "Litigant", "Court Staff", "Pending KYC"].map((f) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full text-sm ${
              f === "All" ? "bg-primary-100 text-primary-800 font-medium" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-5 py-3 font-medium text-gray-600">Name</th>
              <th className="px-5 py-3 font-medium text-gray-600">Email</th>
              <th className="px-5 py-3 font-medium text-gray-600">Role</th>
              <th className="px-5 py-3 font-medium text-gray-600">Status</th>
              <th className="px-5 py-3 font-medium text-gray-600">Joined</th>
              <th className="px-5 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u.email} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                <td className="px-5 py-3">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{u.role}</span>
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      u.status === "Verified" || u.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{u.joined}</td>
                <td className="px-5 py-3">
                  <button className="text-primary-700 hover:underline text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
