"use client";

import Link from "next/link";
import Header from "@/components/Header";

// Mock data – replace with real API later
const mockCases = [
  {
    cnr: "DLCT01-000123-2024",
    caseNumber: "CS/123/2024",
    title: "Rajesh Kumar Sharma vs State of Delhi & Ors.",
    court: "District Court, New Delhi – Court No. 12",
    status: "Pending – Hearing",
    stage: "Evidence",
    nextHearing: "22 Aug 2026",
    side: "Petitioner",
    lastUpdate: "10 Jul 2026",
  },
  {
    cnr: "DLCT01-000456-2023",
    caseNumber: "CS/456/2023",
    title: "Suresh Chand vs ABC Pvt Ltd",
    court: "District Court, New Delhi – Court No. 8",
    status: "Pending – Arguments",
    stage: "Final Arguments",
    nextHearing: "28 Aug 2026",
    side: "Respondent",
    lastUpdate: "05 Aug 2026",
  },
  {
    cnr: "DLHC01-000789-2025",
    caseNumber: "WP/112/2025",
    title: "Citizen Forum vs Municipal Corporation",
    court: "High Court of Delhi",
    status: "Disposed",
    stage: "Judgment Delivered",
    nextHearing: "—",
    side: "Petitioner",
    lastUpdate: "15 Jun 2026",
  },
  {
    cnr: "DLCT01-000334-2024",
    caseNumber: "CS/334/2024",
    title: "Sunita Devi vs Ramesh Kumar",
    court: "District Court, New Delhi – Court No. 5",
    status: "Pending – Hearing",
    stage: "Cross Examination",
    nextHearing: "19 Aug 2026",
    side: "Petitioner",
    lastUpdate: "12 Aug 2026",
  },
];

const mockNotifications = [
  {
    id: 1,
    type: "hearing",
    title: "Hearing scheduled",
    message: "CS/123/2024 listed on 22 Aug 2026 for Evidence",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "order",
    title: "New order uploaded",
    message: "Interim order in CS/456/2023 is now available",
    time: "1 day ago",
    unread: true,
  },
  {
    id: 3,
    type: "filing",
    title: "Filing accepted",
    message: "Your application in CS/334/2024 has been registered",
    time: "3 days ago",
    unread: false,
  },
];

const stats = [
  { label: "Active Cases", value: "3", color: "bg-blue-50 text-blue-800" },
  { label: "Upcoming Hearings", value: "2", color: "bg-amber-50 text-amber-800" },
  { label: "Disposed", value: "1", color: "bg-green-50 text-green-800" },
  { label: "Pending Filings", value: "0", color: "bg-gray-50 text-gray-800" },
];

export default function DashboardPage() {
  return (
    <>
      <Header active="dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {/* Welcome + Stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary-900">My Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, <span className="font-medium">Adv. Meera Patel</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/efiling"
              className="px-4 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-medium text-sm transition"
            >
              + New e-Filing
            </Link>
            <Link
              href="/case-status"
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium text-sm transition"
            >
              Search Case
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-xl p-5 border ${s.color}`}
            >
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm mt-1 opacity-80">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* My Cases – Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-900">My Cases</h2>
              <div className="flex gap-2 text-sm">
                <button className="px-3 py-1 rounded-full bg-primary-100 text-primary-800 font-medium">
                  All
                </button>
                <button className="px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600">
                  Active
                </button>
                <button className="px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600">
                  Disposed
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {mockCases.map((c) => (
                <div
                  key={c.cnr}
                  className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-primary-700 font-medium">
                          {c.caseNumber}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            c.status.includes("Disposed")
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {c.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {c.side}
                        </span>
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">
                        {c.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{c.court}</p>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Stage: </span>
                          <span className="font-medium">{c.stage}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Next Hearing: </span>
                          <span className="font-medium text-primary-700">
                            {c.nextHearing}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Updated: </span>
                          <span>{c.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/case-status?cnr=${c.cnr}`}
                        className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                      >
                        View
                      </Link>
                      <button className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50">
                        Alerts
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button className="text-sm text-primary-700 hover:underline font-medium">
                View all cases →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-primary-900">Notifications</h2>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  2 new
                </span>
              </div>
              <ul className="divide-y">
                {mockNotifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-5 py-4 hover:bg-gray-50 ${
                      n.unread ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                          n.unread ? "bg-primary-600" : "bg-gray-300"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {n.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="px-5 py-3 border-t text-center">
                <button className="text-sm text-primary-700 hover:underline">
                  View all notifications
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-xl p-5">
              <h2 className="font-semibold text-primary-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                {[
                  { href: "/efiling", label: "Start new e-Filing", icon: "📤" },
                  { href: "/cause-list", label: "Today’s Cause List", icon: "📋" },
                  { href: "/judgments", label: "Search Judgments", icon: "📄" },
                  { href: "#", label: "Request Certified Copy", icon: "📑" },
                  { href: "#", label: "Update Profile / KYC", icon: "👤" },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm transition"
                  >
                    <span className="text-lg">{a.icon}</span>
                    <span className="font-medium text-gray-800">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile summary */}
            <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
              <h2 className="font-semibold text-primary-900 mb-3">
                Advocate Profile
              </h2>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Enrollment No.</dt>
                  <dd className="font-medium">D/1234/2015</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Bar Council</dt>
                  <dd className="font-medium">Delhi</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Status</dt>
                  <dd>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </dd>
                </div>
              </dl>
              <Link
                href="#"
                className="inline-block mt-4 text-sm text-primary-700 hover:underline font-medium"
              >
                Edit Profile →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
