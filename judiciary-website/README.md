# National Judiciary Portal

Next.js App Router + **NextAuth (Auth.js v5)** + Prisma + Tailwind.

## Setup

```bash
cd web
npm install

# Generate client, create DB, seed demo users
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
# or: npm run db:setup

npm run dev
```

Open http://localhost:3000

## Demo accounts (seeded)

| Email | Password | Role | Redirect |
|-------|----------|------|----------|
| staff@court.gov | staff123 | COURT_STAFF | /admin |
| admin@court.gov | admin123 | ADMIN | /admin |
| advocate@email.com | advocate123 | ADVOCATE | /dashboard |
| litigant@email.com | litigant123 | LITIGANT | /dashboard |

## NextAuth (production-oriented)

### Files
| File | Purpose |
|------|---------|
| `src/auth.ts` | Auth.js config – Credentials provider, JWT session, Prisma adapter, role callbacks, audit events |
| `src/app/api/auth/[...nextauth]/route.ts` | Route handlers |
| `src/middleware.ts` | Protects `/admin/*` (staff roles) and `/dashboard/*` (any logged-in user) |
| `src/components/Providers.tsx` | `<SessionProvider>` |
| `prisma/schema.prisma` | User + Account + Session + VerificationToken + domain models |
| `prisma/seed.ts` | bcrypt-hashed demo users |

### Behaviour
- **Credentials** login with bcrypt password verify
- **JWT sessions** (8h) with `role` and `id` in token/session
- **PrismaAdapter** ready for OAuth / database sessions later
- **Middleware** role gate for admin
- **Audit logs** on signIn / signOut events
- Login uses `signIn("credentials")`; admin sidebar uses `signOut()`

### Env (`.env`)
```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_TRUST_HOST=true
```

For production PostgreSQL:
```
DATABASE_URL="postgresql://user:pass@host:5432/judiciary"
AUTH_SECRET="<strong secret>"
```

### Adding OAuth later
In `src/auth.ts` providers array, add e.g. Google/Azure AD and set client env vars. Adapter already supports Account linking.

## Routes

**Public:** `/` `/case-status` `/cause-list` `/judgments` `/efiling` `/login` `/register` `/advocates` `/virtual-courts`  
**User:** `/dashboard` (auth required)  
**Admin:** `/admin` … `/admin/audit-logs` (staff roles required)

## Security notes for production
1. Generate a strong `AUTH_SECRET` (`openssl rand -base64 32`)
2. Use HTTPS only; set secure cookies
3. Prefer PostgreSQL + connection pooling
4. Rate-limit login endpoint
5. Consider 2FA for staff accounts
6. Keep audit logs immutable and retained per policy
