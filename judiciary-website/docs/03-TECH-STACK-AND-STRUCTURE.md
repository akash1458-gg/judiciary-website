# Recommended Tech Stack & Project Structure

## Tech Stack (Production-Ready Recommendation)

### Frontend
- **Framework**: Next.js 15 (App Router) + TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui (or Radix + custom)
- **State / Data**: React Query (TanStack Query) + Zustand (light global state)
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js / Auth.js or Clerk (or custom JWT + OTP)
- **PDF Viewer**: react-pdf or pdf.js
- **Charts**: Recharts or Chart.js (for statistics)
- **i18n**: next-intl or react-i18next

### Backend
- **Runtime**: Node.js 20+
- **Framework**: NestJS (recommended for structure & security) **or** Next.js API Routes + separate service
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **Search**: PostgreSQL full-text search (start) → Elasticsearch / Meilisearch later
- **File Storage**: AWS S3 / MinIO / Cloudflare R2 (private buckets)
- **Queue**: BullMQ + Redis (for notifications, PDF processing, alerts)
- **Cache**: Redis

### Infrastructure & Security
- **Hosting**: Vercel (frontend) + Railway / Render / AWS (backend) or full AWS / GCP
- **Auth Security**: JWT + refresh tokens, role-based access control (RBAC)
- **File Security**: Signed URLs, virus scanning, encryption at rest
- **Compliance**: Audit logging, data residency, GDPR / local data protection laws
- **Monitoring**: Sentry + logging (Winston / Pino)
- **CI/CD**: GitHub Actions

### Optional / Later
- Mobile: React Native or Flutter
- AI: OpenAI / local LLM for summaries + chatbot
- Video: Daily.co / Agora / Zoom SDK for virtual courts
- Payments: Razorpay / Stripe / local gateway

---

## Suggested Monorepo / Project Structure

```
judiciary-website/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   └── api/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   └── admin/                  # Optional separate admin app
│
├── packages/
│   ├── database/               # Prisma schema & client
│   ├── ui/                     # Shared UI components
│   ├── config/                 # Shared ESLint, Tailwind, TS configs
│   └── types/                  # Shared TypeScript types
│
├── services/                   # Optional microservices later
│   ├── notification/
│   └── file-processor/
│
├── docs/
├── prototypes/                 # HTML/CSS prototypes (current)
└── README.md
```

---

## Database Schema Outline (High Level)

### Core Tables
- users (id, email, mobile, role, kyc_status, ...)
- advocates (user_id, enrollment_no, bar_council, ...)
- courts (id, name, type, complex_id, jurisdiction, ...)
- court_complexes
- cases (id, cnr, case_number, case_type, filing_date, status, court_id, ...)
- case_parties (case_id, name, type: petitioner/respondent, ...)
- case_advocates (case_id, advocate_id, side)
- case_history / hearings (case_id, date, stage, judge_id, remarks)
- orders_judgments (id, case_id, order_date, type, pdf_url, is_final, ...)
- filings (id, user_id, case_id?, status, documents, fees, ...)
- documents (id, filing_id / case_id, file_url, type, ...)
- cause_lists (id, court_id, date, judge_id, items JSON or related table)
- payments (id, user_id, amount, purpose, status, gateway_ref)
- notifications
- audit_logs
- content_pages / news / circulars

### Key Indexes
- cases.cnr (unique)
- cases.case_number + court_id
- Full-text indexes on party names, order text
- hearings.next_date

---

## Security Essentials
- All case data access controlled by role + ownership
- Signed, time-limited URLs for sensitive PDFs
- Rate limiting on search & filing endpoints
- Input validation + sanitization everywhere
- HTTPS only, secure cookies, CSRF protection
- Regular security audits & penetration testing (mandatory for judiciary systems)
