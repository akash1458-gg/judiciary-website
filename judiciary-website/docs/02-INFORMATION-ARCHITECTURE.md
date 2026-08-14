# Information Architecture & Sitemap

## Primary Navigation (Top Level)

1. **Home**
2. **Case Status**
3. **Cause List**
4. **Judgments & Orders**
5. **e-Filing**
6. **Services** (dropdown)
   - Certified Copies
   - Forms & Templates
   - Online Payment
   - Virtual Courts
   - Advocate Directory
   - Court Locator
7. **About Judiciary**
8. **News & Circulars**
9. **Help / FAQ**
10. **Login / Register** (or User Menu when logged in)

---

## Detailed Sitemap

```
/
├── Home
│
├── Case Status
│   ├── Search Form
│   └── Case Details /{cnr or case-id}
│       ├── Overview
│       ├── History / Timeline
│       ├── Parties & Advocates
│       ├── Orders & Judgments
│       └── Documents (if authorized)
│
├── Cause List
│   ├── Search / Filters (Date, Court, Judge, Court Complex)
│   └── Daily / Weekly View
│
├── Judgments & Orders
│   ├── Advanced Search
│   └── Order Detail / Download
│
├── e-Filing
│   ├── New Case Filing
│   ├── File Application / Document
│   ├── My Drafts
│   └── Filing Status
│
├── Services
│   ├── Certified Copy Request
│   ├── Forms & Templates
│   ├── Online Payments / ePay
│   ├── Virtual Court Rooms
│   ├── Advocate Directory
│   │   └── Advocate Profile
│   ├── Court Locator
│   │   └── Court Complex Detail
│   └── Grievance / Complaint
│
├── About
│   ├── About the Judiciary
│   ├── Organizational Structure
│   ├── Judges / Benches
│   ├── Acts & Rules
│   └── Contact Us
│
├── News & Circulars
│   ├── Latest News
│   ├── Circulars & Notifications
│   └── Practice Directions
│
├── Help
│   ├── FAQ
│   ├── User Manuals / Videos
│   └── Contact Support
│
├── User Area (Authenticated)
│   ├── Dashboard
│   ├── My Cases
│   ├── My Filings
│   ├── Alerts & Notifications
│   ├── Documents
│   ├── Payments
│   └── Profile / Settings
│
└── Admin / Staff Portal (separate subdomain or /admin)
    ├── Dashboard
    ├── Pending Filings
    ├── Case Registration
    ├── Cause List Management
    ├── Order Upload
    ├── User Management
    ├── Content Management
    ├── Reports & Statistics
    └── Audit Logs
```

---

## Key User Journeys

### 1. Litigant checking case status
Home → Case Status → Enter CNR / Party Name → View Case Details → Download latest order

### 2. Advocate filing a new case
Login → e-Filing → Select Case Type → Fill form → Upload documents → e-Sign → Pay fees → Submit → Track status

### 3. Public viewing today’s cause list
Home → Cause List → Select Court + Date → View / Download PDF

### 4. Staff accepting e-filing
Staff Login → Pending Filings → Review documents → Accept / Return → Generate CNR → Notify parties

---

## Design Principles for Navigation
- Maximum 2–3 clicks to any important task
- Clear labels in plain language (avoid pure legal jargon on public pages)
- Persistent search bar on key pages
- “My Cases” always visible when logged in
- Breadcrumbs on deep pages
- Mobile: bottom navigation or hamburger with clear hierarchy
