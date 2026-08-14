import Link from "next/link";

export default function Header({ active = "home" }: { active?: string }) {
  const navItems = [
    { href: "/", label: "Home", key: "home" },
    { href: "/case-status", label: "Case Status", key: "case-status" },
    { href: "/cause-list", label: "Cause List", key: "cause-list" },
    { href: "/judgments", label: "Judgments", key: "judgments" },
    { href: "/efiling", label: "e-Filing", key: "efiling" },
    { href: "/advocates", label: "Advocates", key: "advocates" },
    { href: "/virtual-courts", label: "Virtual Courts", key: "virtual-courts" },
    { href: "/dashboard", label: "Dashboard", key: "dashboard" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-900 text-white text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span>🇮🇳 National Judiciary Portal</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">Government of India Initiative</span>
          </div>
          <div className="flex gap-3 items-center">
            <button className="hover:underline">English</button>
            <span>|</span>
            <button className="hover:underline">हिन्दी</button>
            <span className="hidden sm:inline">|</span>
            <a href="#" className="hover:underline hidden sm:inline">
              Screen Reader
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-gradient-to-br from-primary-900 to-primary-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary-800 font-bold text-xl shadow">
                ⚖️
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  National Judiciary Portal
                </h1>
                <p className="text-sm text-blue-200">
                  eCourts Services • Transparent • Accessible • Efficient
                </p>
              </div>
            </Link>
            <div className="flex gap-3 items-center">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white text-primary-800 rounded font-medium hover:bg-blue-50 transition"
              >
                My Dashboard
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 border border-white rounded font-medium hover:bg-white/10 transition text-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-primary-800/80 border-t border-blue-700">
          <div className="max-w-7xl mx-auto px-4">
            <ul className="flex flex-wrap gap-1 text-sm font-medium">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 transition ${
                      active === item.key
                        ? "bg-primary-700 text-white"
                        : "hover:bg-primary-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#" className="block px-4 py-3 hover:bg-primary-700 transition">
                  Services ▾
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-3 hover:bg-primary-700 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="block px-4 py-3 hover:bg-primary-700 transition">
                  Help
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
