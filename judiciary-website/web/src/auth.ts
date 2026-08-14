import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: UserRole | string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

const STAFF_ROLES = new Set([
  "COURT_STAFF",
  "JUDGE",
  "ADMIN",
  "SUPER_ADMIN",
]);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as never,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8 hours
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    // Add OAuth later, e.g.:
    // Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/admin")) {
        const role = session?.user?.role;
        return !!role && STAFF_ROLES.has(role);
      }
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_LOGIN",
            entity: "User",
            entityId: user.id,
            metadata: JSON.stringify({
              email: user.email,
              role: (user as { role?: string }).role,
              via: "next-auth",
            }),
          },
        });
      } catch {
        /* DB may be offline during first setup */
      }
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      try {
        await prisma.auditLog.create({
          data: {
            userId: (token?.id as string) || null,
            action: "USER_LOGOUT",
            entity: "User",
            entityId: (token?.id as string) || null,
            metadata: JSON.stringify({ via: "next-auth" }),
          },
        });
      } catch {
        /* ignore */
      }
    },
  },
  trustHost: true,
});

export function isStaffRole(role?: string | null): boolean {
  return !!role && STAFF_ROLES.has(role);
}
