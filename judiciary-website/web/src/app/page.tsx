import Link from "next/link";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header active="home" />

      {/* Hero / Quick Search */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">
              Access Justice Anytime, Anywhere
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search case status, view cause lists, download judgments, and file
              cases online — all from one secure portal.
            </p>
          </div>

          {/* Quick Search Card */}
          <div className="max-w-3xl mx-auto bg-primary-50 border border-primary-100 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-primary-800 mb-4 text-lg">
              Quick Case Status Search
            </h3>
            <form action="/case-status" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
                  <option>CNR Number</option>
                  <option>Case Number</option>
                  <option>Party Name</option>
                  <option>Advocate Name</option>
                  <option>FIR Number</option>
                </select>
                <input
                  type="text"
                  name="q"
                  placeholder="Enter search value..."
                  className="md:col-span-2 border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="court" defaultChecked className="text-primary-600" />
                    District Courts
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="court" className="text-primary-600" />
                    High Courts
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="radio" name="court" className="text-primary-600" />
                    Supreme Court
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-2.5 rounded-lg font-medium transition"
                >
                  Search Case
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-primary-900 mb-6">Key Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { href: "/case-status", icon: "🔍", title: "Case Status", desc: "Track any case in real time" },
            { href: "/cause-list", icon: "📋", title: "Cause List", desc: "Today’s & upcoming hearings" },
            { href: "/judgments", icon: "📄", title: "Judgments", desc: "Search & download orders" },
            { href: "/efiling", icon: "📤", title: "e-Filing", desc: "File cases online securely" },
            { href: "#", icon: "💳", title: "e-Payment", desc: "Pay court fees online" },
            { href: "#", icon: "🎥", title: "Virtual Courts", desc: "Join hearings remotely" },
            { href: "#", icon: "👨‍⚖️", title: "Advocate Directory", desc: "Find registered advocates" },
            { href: "#", icon: "📊", title: "NJDG Statistics", desc: "Pendency & disposal data" },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white border rounded-xl p-5 hover:shadow-md hover:border-primary-300 transition group"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-primary-800 group-hover:text-primary-600">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-primary-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50M+", label: "Cases Tracked" },
              { value: "29,000+", label: "Court Establishments" },
              { value: "1.2 Cr+", label: "e-Filings" },
              { value: "4.1 Cr+", label: "Virtual Hearings" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Help */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-primary-900 mb-4">
            Latest Notifications
          </h2>
          <ul className="bg-white border rounded-xl divide-y">
            {[
              {
                date: "14 Aug 2026",
                text: "Revised e-Filing guidelines for High Courts effective from 1 September",
              },
              {
                date: "12 Aug 2026",
                text: "Summer vacation schedule and cause list arrangements published",
              },
              {
                date: "10 Aug 2026",
                text: "New virtual court links for District Courts – Phase 3 rollout",
              },
            ].map((item) => (
              <li key={item.date} className="p-4 hover:bg-gray-50">
                <a href="#" className="block">
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <p className="font-medium text-primary-800">{item.text}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary-900 mb-4">Need Help?</h2>
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <p className="text-gray-600">Common tasks made simple:</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-primary-700 hover:underline">
                  → How to find your CNR number
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-700 hover:underline">
                  → Step-by-step e-Filing guide
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-700 hover:underline">
                  → How to join a virtual hearing
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-700 hover:underline">
                  → Download forms & templates
                </a>
              </li>
            </ul>
            <a
              href="#"
              className="inline-block mt-2 text-sm font-medium text-primary-700 hover:underline"
            >
              View all FAQs →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
