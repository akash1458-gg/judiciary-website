/**
 * Simple demo auth helpers.
 * Production: replace with NextAuth / Auth.js + proper sessions.
 */

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "LITIGANT" | "ADVOCATE" | "COURT_STAFF" | "JUDGE" | "ADMIN" | "SUPER_ADMIN";
};

const STAFF_ROLES = new Set(["COURT_STAFF", "JUDGE", "ADMIN", "SUPER_ADMIN"]);

/** Demo users for local testing (no real passwords stored) */
export const DEMO_USERS: Record<string, SessionUser & { password: string }> = {
  "staff@court.gov": {
    id: "staff-1",
    name: "Court Registrar",
    email: "staff@court.gov",
    role: "COURT_STAFF",
    password: "staff123",
  },
  "admin@court.gov": {
    id: "admin-1",
    name: "System Admin",
    email: "admin@court.gov",
    role: "ADMIN",
    password: "admin123",
  },
  "advocate@email.com": {
    id: "adv-1",
    name: "Adv. Meera Patel",
    email: "advocate@email.com",
    role: "ADVOCATE",
    password: "advocate123",
  },
  "litigant@email.com": {
    id: "lit-1",
    name: "Rajesh Kumar",
    email: "litigant@email.com",
    role: "LITIGANT",
    password: "litigant123",
  },
};

export function isStaffRole(role: string): boolean {
  return STAFF_ROLES.has(role);
}

export function canAccessAdmin(role: string): boolean {
  return isStaffRole(role);
}

/** Cookie name used by demo auth */
export const SESSION_COOKIE = "judiciary_session";

export function encodeSession(user: SessionUser): string {
  // Demo only – base64 JSON. Use signed JWT in production.
  return Buffer.from(JSON.stringify(user)).toString("base64url");
}

export function decodeSession(token: string | undefined): SessionUser | null {
  if (!token) return null;
  try {
    const data = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    if (data?.id && data?.role) return data as SessionUser;
  } catch {
    /* ignore */
  }
  return null;
}
