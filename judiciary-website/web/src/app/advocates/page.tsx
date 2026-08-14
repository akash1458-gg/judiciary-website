"use client";

import { useState } from "react";
import Header from "@/components/Header";

const mockAdvocates = [
  {
    name: "Adv. Meera Patel",
    enrollment: "D/1234/2015",
    bar: "Delhi",
    practice: ["Civil", "Writ"],
    courts: "District Courts, High Court of Delhi",
    cases: 142,
    verified: true,
  },
  {
    name: "Adv. R.K. Singh",
    enrollment: "D/5678/2010",
    bar: "Delhi",
    practice: ["Criminal", "Bail"],
    courts: "District Courts, Sessions",
    cases: 310,
    verified: true,
  },
  {
    name: "Adv. Priya Sharma",
    enrollment: "D/9012/2018",
    bar: "Delhi",
    practice: ["Family", "Civil"],
    courts: "Family Court, District Courts",
    cases: 87,
    verified: true,
  },
  {
    name: "Adv. Anil Gupta",
    enrollment: "D/3456/2008",
    bar: "Delhi",
    practice: ["Commercial", "Arbitration"],
    courts: "High Court of Delhi, Commercial Court",
    cases: 256,
    verified: true,
  },
  {
    name: "Adv. Neha Verma",
    enrollment: "D/7890/2016",
    bar: "Delhi",
    practice: ["Civil", "Property"],
    courts: "District Courts",
    cases: 119,
    verified: false,
  },
];

export default function AdvocatesPage() {
  const [query, setQuery] = useState("");

  const filtered = mockAdvocates.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.enrollment.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header active="advocates" />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold text-primary-900 mb-2">
          Advocate Directory
        </h1>
        <p className="text-gray-600 mb-8">
          Search registered advocates by name or enrollment number
        </p>

        <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Search by Name or Enrollment No.
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Meera Patel or D/1234/2015"
                className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bar Council</label>
              <select className="w-full border rounded-lg px-3 py-2.5 bg-white">
                <option>All</option>
                <option>Delhi</option>
                <option>Maharashtra</option>
                <option>Karnataka</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2.5 rounded-lg font-medium">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <div
              key={a.enrollment}
              className="bg-white border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-primary-900">{a.name}</h3>
                    {a.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 font-mono">
                    {a.enrollment} • {a.bar} Bar
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {a.practice.map((p) => (
                  <span
                    key={p}
                    className="text-xs bg-primary-50 text-primary-800 px-2 py-0.5 rounded"
                  >
                    {p}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">{a.courts}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {a.cases} cases on record
                </span>
                <button className="text-primary-700 font-medium hover:underline">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No advocates found matching your search.
          </div>
        )}
      </main>
    </>
  );
}
