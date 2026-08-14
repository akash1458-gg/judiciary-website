import { auth } from "@/auth";
import { NextResponse } from "next/server";

const STAFF_ROLES = new Set([
  "COURT_STAFF",
  "JUDGE",
  "ADMIN",
  "SUPER_ADMIN",
]);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      url.searchParams.set("reason", "admin");
      return NextResponse.redirect(url);
    }
    if (!STAFF_ROLES.has(session.user.role || "")) {
      const url = new URL("/", req.url);
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/dashboard") && !session?.user) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
