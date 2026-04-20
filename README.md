# Insure IT Group Corp — Website

Professional bilingual (EN/ES) insurance agency website for Insure IT Group Corp, a family-owned independent insurance agency serving Jacksonville, FL since 2013.

---

## Live Architecture Overview

```
User Browser
     |
     v
Amazon CloudFront (CDN / DDoS Protection / SSL)
     |
     v
EC2 t3.micro — Ubuntu + Nginx (reverse proxy → port 5000)
     |
     v
Node.js Server (Next.js 14 + Express.js — port 5000)
     |
     +----> Next.js App Router (SSG pages — Home, About, Plans)
     |
     +----> Express API Routes (/api/*)
                |
                +----> AWS RDS PostgreSQL 17 (db.t4g.micro)
                |
                +----> AWS S3 (document uploads from quote form)
```

---

## Tech Stack

### Frontend
| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | **Next.js 14** (App Router) | Migrated from Vite SPA — enables SSG/SSR for SEO |
| Language | TypeScript | Strict mode, full type safety |
| Styling | TailwindCSS 3 + shadcn/ui | Radix UI primitives |
| Animations | Framer Motion | Hero entrance, section transitions |
| Forms | React Hook Form + Zod | Quote modal, chatbot form |
| Server state | TanStack React Query v5 | Contact form submissions, feature requests |
| Routing | Next.js App Router | File-based, replaces Wouter SPA routing |
| i18n | Custom language context | EN/ES toggle with flag badge buttons |

### Backend
| Layer | Technology | Notes |
|-------|-----------|-------|
| Server | Express.js (Node.js) | Custom server integrated with Next.js |
| ORM | Drizzle ORM | Schema-first, PostgreSQL driver |
| Database | PostgreSQL 17 (AWS RDS) | db.t4g.micro |
| File uploads | Multer + AWS S3 SDK | Quote form document uploads |
| Validation | Zod | Request body validation on all API routes |

### Infrastructure
| Service | Detail | Cost |
|---------|--------|------|
| CDN | Amazon CloudFront | ~$0.00 (free tier — 1 TB/mo) |
| Web server | EC2 t3.micro (Ubuntu + Nginx) | ~$8.50/mo |
| Database | RDS db.t4g.micro (PostgreSQL 17) | ~$14.01/mo |
| Object storage | AWS S3 | Usage-based (minimal) |
| DNS | AWS Route 53 | ~$0.50/mo |
| **Total** | | **~$22.51/mo** |

---

## Project Structure

```
/
├── app/                        # Next.js App Router pages (SSG)
│   ├── layout.tsx              # Root layout — global CSS, providers, JSON-LD
│   ├── providers.tsx           # Client-side providers (React Query, Language, Tooltip)
│   ├── page.tsx                # Home page (/ route)
│   ├── about/page.tsx          # About page (/about)
│   ├── plans/page.tsx          # Plans page (/plans)
│   └── not-found.tsx           # 404 page
│
├── client/src/
│   ├── components/             # Shared UI components
│   │   ├── navigation.tsx      # Glassmorphism navbar — Next.js Link + usePathname
│   │   ├── footer.tsx          # Site footer
│   │   ├── logo.tsx            # Logo with WebM shield animation
│   │   ├── chatbot.tsx         # AI assistant "Liz" — Next.js useRouter
│   │   ├── quote-modal.tsx     # Quote request modal with file upload
│   │   ├── testimonials-carousel.tsx  # 2×2 grid, 3 pages of 4, auto-cycles 6s
│   │   ├── theme-provider.tsx  # Language context (EN/ES)
│   │   ├── section-divider.tsx # Animated wave SVG dividers
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── pages/                  # Page content components (all "use client")
│   │   ├── landing.tsx         # Homepage content (~1,240 lines)
│   │   ├── about.tsx           # About page — team, story
│   │   ├── plans.tsx           # Insurance plans
│   │   └── not-found.tsx       # 404 content
│   │
│   └── lib/
│       ├── translations.ts     # All EN/ES string content
│       ├── queryClient.ts      # TanStack React Query client
│       └── conversation-types.ts  # Chatbot conversation types
│
├── server/
│   ├── index.ts                # Entry point — Express + Next.js custom server
│   ├── routes.ts               # All API routes (contact, S3, testimonials)
│   ├── pgStorage.ts            # PostgreSQL storage layer
│   ├── db.ts                   # Drizzle + pg connection pool
│   ├── s3Client.ts             # AWS S3 client
│   ├── migrate.ts              # DB migration runner
│   └── logger.ts               # Shared logging utility
│
├── shared/
│   ├── schema.ts               # Drizzle table definitions + Zod insert schemas
│   └── types.ts                # Shared TypeScript types
│
├── attached_assets/            # Local static assets (team photos, logos, animations)
├── public/                     # Next.js static files (shield_animation.webm, robots.txt, sitemap.xml)
├── next.config.mjs             # Next.js configuration (@assets alias, image domains)
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

---

## Pages

| Route | Description | Rendering |
|-------|-------------|-----------|
| `/` | Homepage — hero, insurance types, testimonials, contact | SSG |
| `/about` | Team profiles, company story | SSG |
| `/plans` | Insurance plans detail | SSG |

---

## API Endpoints

All handled by Express, co-located with the Next.js server on port 5000.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit quote/contact form (supports multipart file upload) |
| `GET` | `/api/testimonials` | Fetch client testimonials |
| `POST` | `/api/objects/upload` | Get presigned S3 URL for client-side upload |
| `GET` | `/api/documents/:s3Key` | Download a document from S3 |
| `GET` | `/api/images/:imageName` | Serve placeholder images |
| `GET` | `/api/videos/herovid1.mp4` | Stream hero background video |

---

## Key Features

- **Bilingual (EN/ES):** Full translation via `client/src/lib/translations.ts`. Toggle in navbar with flag badge.
- **AI Chatbot "Liz":** Conversational insurance assistant that collects quote info and submits the contact form.
- **Quote Modal:** Multi-step form with document upload support (PDF, DOC, JPG, PNG — up to 10 MB each, max 5 files).
- **SSG/SSR:** Next.js App Router generates static HTML at build time. Google sees real content on first request.
- **Testimonials Carousel:** 2x2 grid, 12 testimonials across 3 pages, auto-cycles every 6 seconds with swipe support.
- **Glassmorphism Navbar:** Collapses to pill on scroll, expands on full view. Social icons stack when scrolled.

---

## Development

### Prerequisites
- Node.js 20+
- PostgreSQL 17 (or AWS RDS connection via `DATABASE_URL`)
- AWS access for S3 uploads and Lambda invocations (see "AWS Credentials" below)

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `S3_BUCKET_NAME` | Yes | S3 bucket name for document uploads (defaults to `insure-it`) |
| `LAMBDA_NOTIFICATION_FUNCTION` | Optional | Lambda function name for form notifications (defaults to `sendFormNotification`) |
| `OPENAI_API_KEY` | Optional | Powers the Liz chatbot AI responses |
| `AWS_ACCESS_KEY_ID` | Local dev only | See "AWS Credentials" below — **not used in production** |
| `AWS_SECRET_ACCESS_KEY` | Local dev only | See "AWS Credentials" below — **not used in production** |

### AWS Credentials

The S3 and Lambda clients (`server/s3Client.ts`, `server/lambdaClient.ts`) are initialized **without a hardcoded credentials block** and rely on the AWS SDK's default credential provider chain. Region is hardcoded to `us-east-1`.

- **Production (EC2):** The `insure-it-server-role` IAM role is attached to the EC2 instance. The SDK automatically retrieves rotating temporary credentials from the EC2 instance metadata service. **No static keys are needed or configured in production.**
- **Local development:** The credential chain falls back to `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` env vars if present. Without them, any code path that calls S3 or Lambda will throw a credential-provider error. The Lambda invoke is wrapped in a try/catch so contact form submissions still succeed even if the notification fails.

### Running Locally

```bash
# Install dependencies
npm install

# Start the development server (Next.js + Express on port 5000)
npm run dev
```

### Building for Production

```bash
# Build Next.js pages (static generation)
next build

# Start the production server
NODE_ENV=production tsx server/index.ts
```

---

## AWS Infrastructure Detail

### Report: April 1-2, 2026

**Status:** Optimized / Production-Ready
**Cost target:** Under $20/month

#### Executive Summary

Over 48 hours, the AWS infrastructure underwent a "Lean Migration" to eliminate idle high-cost resources while transitioning to a professional edge-cached delivery model.

**Total savings achieved: ~$55.00/month**

#### Architecture

| Layer | Service | Detail |
|-------|---------|--------|
| Global edge | Amazon CloudFront | Primary entry point (CDN, DDoS protection, SSL termination) |
| Web tier | EC2 t3.micro | Ubuntu + Nginx (reverse proxy to Node.js on port 5000) |
| Database | RDS db.t4g.micro | PostgreSQL 17 |
| Networking | Internet Gateway (IGW) | NAT Gateway removed — saving $32.40/month |

#### Changes Made (April 1-2, 2026)

**A. Cost Reduction**
- Deleted a NAT Gateway that was charging $32.40/month — traffic rerouted through IGW
- Terminated two redundant EC2 instances (`i-0d9fa255e69e26b39`, `i-0a9ff0e3029fd6052`)
- Result: Monthly burn rate reduced by over 60%

**B. CloudFront CDN Deployment**
- Configured CloudFront Distribution pointing to the EC2 origin
- Used `.nip.io` mapping (`18.205.63.184.nip.io`) as a temporary domain-based origin while the final TLD was being connected
- CloudFront now masks the EC2 IP, providing DDoS protection at the edge

**C. Server Fixes**
- Resolved `ENOENT` error by consolidating deployment to correct directory (`insure-it-site/`)
- Fixed Nginx 502 Bad Gateway by correcting the proxy config (`/etc/nginx/sites-available/default`)
- Added `proxy_set_header Host $host;` to the Nginx location block for valid CloudFront handshakes

#### Technical Specifications

| Component | Detail |
|-----------|--------|
| Origin hostname | `18.205.63.184.nip.io` |
| CloudFront distribution | `d3gkfgi9drj9kb.cloudfront.net` |
| Application port | `5000` (Node.js) |
| Database class | `db.t4g.micro` (PostgreSQL 17) |
| Active security group | `ec2-rds-1` (`sg-04eb78ded4248b3fb`) |

#### Monthly Cost Forecast

| Service | Cost | Status |
|---------|------|--------|
| EC2 t3.micro | ~$8.50 | Active |
| RDS db.t4g.micro | ~$14.01 | Optimized |
| CloudFront | ~$0.00 | Within free tier (1 TB/mo) |
| NAT Gateway | $0.00 | Deleted |
| **Total** | **~$22.51** | |

#### Next Steps to Reach Sub-$20/Month

1. **RDS Reserved Instance** — Purchase a 1-year reserved instance to drop DB cost from ~$14 to ~$9/month
2. **Snapshot cleanup** — Delete old EBS snapshots from the terminated instances
3. **Domain connection** — Finalize Route 53 CNAME record for the custom domain (`insureitgroup.net`)

---

## SEO

- **Metadata API:** Each page exports a `metadata` object (title, description, Open Graph, Twitter Card)
- **JSON-LD:** `LocalBusiness` / `InsuranceAgency` structured data in the root layout
- **Sitemap:** `/sitemap.xml` at `client/public/sitemap.xml`
- **Robots:** `/robots.txt` at `client/public/robots.txt`
- **Static generation:** Pages are pre-rendered at build time — Google reads real HTML on first crawl

---

## Design

See `design_guidelines.md` for full design specifications including color palette, typography (Inter), component specs, and animation guidelines.

**Key design decisions:**
- Slate/navy color scheme with green accent buttons
- Glassmorphism navbar that collapses to a pill on scroll
- Minimal scrolling philosophy — users know what they need, get them to quote fast
- Dark mode disabled (language toggle takes its slot)
- Mobile-first responsive with breakpoints at `sm` (640px), `lg` (1024px)

---

## Contact

- **Phone:** 904-909-0897
- **Email:** Info@insureitgroup.net
- **Address:** 11570 San Jose Blvd, Suite 11, Jacksonville, FL 32223
- **License:** Florida-licensed independent insurance agency

Team: Wilbert Hernandez (President), Elizabeth Hernandez (Agency Operations Manager), David Hernandez (Account Executive), Wilbert Hernandez Jr. (Automation Engineer)
