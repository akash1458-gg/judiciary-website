"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/filings", label: "Pending Filings", icon: "📥" },
  { href: "/admin/cause-lists", label: "Cause Lists", icon: "📋" },
  { href: "/admin/orders", label: "Orders & Judgments", icon: "📄" },
  { href: "/admin/users", label: "Users & Roles", icon: "👥" },
  { href: "/admin/reports", label: "Reports & Stats", icon: "📈" },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: "🔒" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-primary-900 text-white min-h-screen flex flex-col shrink-0">
      <div className="p-5 border-b border-primary-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-800 font-bold">
            ⚖️
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Admin Portal</div>
            <div className="text-xs text-blue-200">National Judiciary</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                active
                  ? "bg-primary-700 text-white font-medium"
                  : "text-blue-100 hover:bg-primary-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-primary-700 text-sm">
        <div className="text-blue-200 text-xs mb-1">Logged in as</div>
        <div className="font-medium">{session?.user?.name || "Staff"}</div>
        <div className="text-xs text-blue-300 mt-0.5">
          {session?.user?.role || "COURT_STAFF"}
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <Link
            href="/"
            className="text-xs text-blue-200 hover:text-white underline"
          >
            ← Back to public site
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs text-left text-red-300 hover:text-red-200 underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
