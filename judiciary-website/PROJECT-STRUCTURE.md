# National Judiciary Portal – Final Project Structure

**Archive:** `/home/workdir/artifacts/judiciary-website-final.zip` (94 KB, source only)

## Root layout

```
judiciary-website/
├── README.md                          # Setup + NextAuth guide
├── PROJECT-STRUCTURE.md               # This file
├── docs/
│   ├── 01-FEATURE-LIST-AND-ROADMAP.md
│   ├── 02-INFORMATION-ARCHITECTURE.md
│   └── 03-TECH-STACK-AND-STRUCTURE.md
├── schema/
│   └── schema.prisma                  # Original full schema reference
├── prototypes/                        # Static HTML prototypes (reference)
│   ├── index.html
│   ├── case-status.html
│   ├── cause-list.html
│   ├── judgments.html
│   └── efiling.html
└── web/                               # ★ Main Next.js application
    ├── package.json
    ├── .env / .env.example
    ├── prisma/
    │   ├── schema.prisma              # SQLite + NextAuth models
    │   └── seed.ts                    # Demo users (bcrypt)
    └── src/
        ├── auth.ts                    # NextAuth (Auth.js v5) config
        ├── middleware.ts              # Route protection
        ├── lib/
        │   ├── prisma.ts
        │   ├── auth.ts                # Helpers / legacy demo users
        │   ├── audit.ts
        │   ├── upload.ts
        │   └── payment.ts
        ├── components/
        │   ├── Header.tsx
        │   ├── Footer.tsx
        │   ├── Providers.tsx          # SessionProvider
        │   └── admin/AdminSidebar.tsx
        └── app/
            ├── layout.tsx
            ├── page.tsx               # Home
            ├── globals.css
            ├── login/page.tsx
            ├── register/page.tsx
            ├── case-status/page.tsx
            ├── cause-list/page.tsx
            ├── judgments/page.tsx
            ├── efiling/page.tsx       # 4-step wizard
            ├── dashboard/page.tsx
            ├── advocates/page.tsx
            ├── virtual-courts/page.tsx
            ├── api/auth/[...nextauth]/route.ts
            └── admin/
                ├── layout.tsx
                ├── page.tsx           # Staff dashboard
                ├── filings/page.tsx
                ├── cause-lists/page.tsx
                ├── orders/page.tsx
                ├── users/page.tsx
                ├── reports/page.tsx
                └── audit-logs/page.tsx
```

## Features delivered

| Area | Status |
|------|--------|
| Public case status, cause list, judgments | ✅ |
| 4-step e-Filing wizard | ✅ |
| Login / Register UI | ✅ |
| User Dashboard (My Cases) | ✅ |
| Advocate Directory | ✅ |
| Virtual Courts | ✅ |
| Admin portal (filings, lists, orders, users, reports) | ✅ |
| NextAuth v5 + role-based admin guard | ✅ |
| Prisma schema + seed | ✅ |
| File upload + payment stubs | ✅ |
| Audit logging | ✅ |

## Quick start

```bash
cd web
npm install --legacy-peer-deps
npx prisma generate && npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

## Demo logins

- Staff: `staff@court.gov` / `staff123` → `/admin`
- Admin: `admin@court.gov` / `admin123` → `/admin`
- Advocate: `advocate@email.com` / `advocate123` → `/dashboard`
- Litigant: `litigant@email.com` / `litigant123` → `/dashboard`

## Tech stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- NextAuth (Auth.js v5) + Prisma Adapter + bcrypt
- Prisma + SQLite (dev) / PostgreSQL (prod-ready schema)
