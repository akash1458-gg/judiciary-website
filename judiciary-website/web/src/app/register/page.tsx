"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"litigant" | "advocate">("litigant");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 900);
  };

  return (
    <>
      <Header active="register" />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ⚖️
            </div>
            <h1 className="text-2xl font-bold text-primary-900">
              Create Account
            </h1>
            <p className="text-gray-600 mt-1">
              Register as a litigant or advocate to use e-Filing and track cases
            </p>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8">
            {/* Role selector */}
            <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setRole("litigant")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition ${
                  role === "litigant"
                    ? "bg-white shadow text-primary-800"
                    : "text-gray-600"
                }`}
              >
                Litigant / Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole("advocate")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition ${
                  role === "advocate"
                    ? "bg-white shadow text-primary-800"
                    : "text-gray-600"
                }`}
              >
                Advocate
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {role === "advocate" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-primary-50 rounded-lg border border-primary-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment No. *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. D/1234/2015"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bar Council *
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                      <option value="">Select</option>
                      <option>Delhi</option>
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Tamil Nadu</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <label className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  required
                  className="mt-1 rounded text-primary-600"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-primary-700 underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary-700 underline">
                    Privacy Policy
                  </a>
                  . I confirm the information provided is accurate.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-700 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
