"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Header from "@/components/Header";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("next") || "";
  const reason = searchParams.get("reason");

  const [method, setMethod] = useState<"password" | "otp">("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Fetch session to know role for redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role as string | undefined;

      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (
        role === "COURT_STAFF" ||
        role === "ADMIN" ||
        role === "SUPER_ADMIN" ||
        role === "JUDGE"
      ) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ⚖️
          </div>
          <h1 className="text-2xl font-bold text-primary-900">Sign In</h1>
          <p className="text-gray-600 mt-1">
            {reason === "admin"
              ? "Staff login required to access the Admin Portal"
              : "Access your cases, e-filings and notifications"}
          </p>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMethod("password")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                method === "password"
                  ? "bg-white shadow text-primary-800"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Email / Password
            </button>
            <button
              type="button"
              onClick={() => setMethod("otp")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${
                method === "otp"
                  ? "bg-white shadow text-primary-800"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Mobile OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {method === "password" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@court.gov"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                OTP login can be enabled with an SMS provider (e.g. MSG91 / Twilio).
                Use Email / Password for demo accounts.
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded text-primary-600" />
                Remember me
              </label>
              <a href="#" className="text-primary-700 hover:underline">
                Forgot password?
              </a>
            </div>

            {method === "password" && (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-primary-700 font-medium hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-left">
          <p className="font-semibold text-amber-900 mb-2">
            Demo accounts (after seed)
          </p>
          <ul className="space-y-1 text-amber-900/90">
            <li>
              <strong>Staff:</strong> staff@court.gov / staff123
            </li>
            <li>
              <strong>Admin:</strong> admin@court.gov / admin123
            </li>
            <li>
              <strong>Advocate:</strong> advocate@email.com / advocate123
            </li>
            <li>
              <strong>Litigant:</strong> litigant@email.com / litigant123
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header active="login" />
      <Suspense fallback={<div className="p-12 text-center">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </>
  );
}
