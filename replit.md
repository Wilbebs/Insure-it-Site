# Insurance Website Application

## Overview

This is a simplified, professional insurance website built with React and Express. The site focuses on making it easy for visitors to request quotes and learn about insurance offerings. Design inspired by Ricci Insurance - clean, minimal scrolling, and conversion-focused.

**Business Credentials**: Family-owned business since 2011, serving thousands of clients across Florida with personalized coverage and genuine care.

## User Preferences

- Preferred communication style: Simple, everyday language.
- Design philosophy: Simple, minimal scrolling, easy form access
- Users likely already know what insurance they need - focus on quick quote access
- Dark mode: Disabled for the time being (may be re-enabled later)
- Language toggle: EN/ES button with flag emoji badges (🇺🇸/🇪🇸) replaces dark mode toggle
- Form fields: Select dropdowns and date inputs use direct form.setValue + form.watch() pattern (NOT FormField/Controller) to ensure immediate visual updates

## Site Structure

### Pages
- **Homepage (/)** - Main landing page with hero, services overview, testimonials, contact info
- **About Us (/about)** - Company story and team information

### Homepage Layout (Ricci-inspired, minimal scrolling)
1. **Hero Section** (85vh)
   - Full-screen team photo background with dark overlay
   - "Independent Insurance Agency" badge
   - Logo with animated tagline
   - "Your Trusted Partner for Home, Auto & Business Insurance"
   - Two CTAs: "Get A Quote" (green) and "Call Us Now" (outline)

2. **Who We Are Section**
   - Brief company description
   - "Read More" button linking to About page

3. **Insurance Types Grid**
   - 4 simple cards in a row (responsive grid)
   - Home/Auto, Flood, Life, Business
   - Each card: icon, title, short description
   - Clean white cards with subtle shadows

4. **Testimonials Section**
   - Carousel of client testimonials

5. **Contact Info Section**
   - Phone, Email, Location, License info
   - Simple inline layout

6. **Footer**

## System Architecture

### Frontend Architecture
- **Next.js 14 (App Router)**: Migrated from Vite SPA — enables SSG/SSR for SEO. Pages pre-rendered as static HTML.
- **Routing**: Next.js file-based App Router (`app/` directory). Navigation uses `next/link` and `usePathname`.
- **Styling**: TailwindCSS 3 + Shadcn/ui components
- **Animations**: Framer Motion for subtle entrance animations
- **State Management**: TanStack React Query v5 for server state
- **"use client" boundary**: Top-level page components (`landing.tsx`, `about.tsx`, `plans.tsx`) are marked "use client". Their entire import tree becomes client-side. `app/page.tsx` etc. are Server Components that export metadata and render the page.

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript — runs as custom server alongside Next.js
- **Next.js Custom Server**: `server/index.ts` initializes Next.js, prepares it, then delegates all non-API requests via `app.all('*', handle)`
- **Database**: PostgreSQL 17 (AWS RDS db.t4g.micro)
- **File Storage**: AWS S3 for document uploads
- **Middleware**: Multer for file uploads, Zod for validation

### Key Components
- **Navigation**: Glass morphism navbar with Next.js Link components, usePathname for active state
- **Logo**: InsureIT logo with WebM shield animation (served from `/public/shield_animation.webm`)
- **Hero Window Card**: Frosted-glass app-window card (macOS title bar aesthetic) in the hero — draggable on desktop, minimize/restore animated.
- **Hero Video**: Dual-source via CloudFront CDN. Mobile phones (≤640px) receive `herovid_mobile.mp4` (portrait 9:19.5); desktop/tablet receive `herovid1.mp4` (landscape). Both at `https://d3gkfgi9drj9kb.cloudfront.net/video-assets/`. Three-layer fallback: CSS bg → `<img>` (always in DOM for SEO) → `<video>` fades in on `canPlay`.
- **QuoteModal**: Contact form modal for quote requests with S3 document upload
- **TestimonialsCarousel**: 2x2 grid, 12 testimonials across 3 pages, auto-cycles every 6s with swipe support
- **Footer**: Site footer with company info — uses Next.js Link
- **ChatBot**: AI assistant "Liz" — uses useRouter from next/navigation for programmatic navigation
- **Team (About page)**: 4 members in 2x4 grid — Wilbert Hernandez (President), Elizabeth Hernandez (Agency Operations Manager), David Hernandez (Account Executive), Wilbert Hernandez Jr. (Automation Engineer). All photos compressed to JPEG in public/images/ — elizabeth_photo.jpg (~76KB), david_photo.jpg (~66KB), wilbert_photo.jpg (~133KB), whjr_photo.jpg (~277KB).

### API Endpoints
- `POST /api/contact` - Submit contact form with optional documents
- `GET /api/testimonials` - Fetch client testimonials
- `POST /api/objects/upload` - Get presigned URL for file uploads
- `GET /api/documents/:s3Key` - Download uploaded documents
- `GET /api/images/:imageName` - Serve placeholder images
- `GET /api/videos/herovid1.mp4` - Stream hero background video

### Build & Deployment
- **Dev**: `npm run dev` → `tsx server/index.ts` starts Express + Next.js dev server on port 5000
- **Build**: `next build` generates static pages in `.next/`
- **Start**: `NODE_ENV=production tsx server/index.ts` serves the built Next.js app via custom Express server

## External Dependencies

### Core Dependencies
- **next**: Next.js 14 — SSG/SSR framework
- **express**: Web server framework (custom Next.js server)
- **multer**: File upload handling
- **@aws-sdk/client-s3**: AWS S3 integration
- **drizzle-orm**: Database ORM

### Frontend Dependencies
- **@radix-ui/***: UI primitives (via shadcn/ui)
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animations
- **react-hook-form**: Form handling
- **lucide-react**: Icons
- **react-icons**: Social media icons (FaLinkedin, FaFacebook, FaInstagram)

## Design Guidelines

See `design_guidelines.md` for detailed design specifications including:
- Color scheme (slate/navy with green accent buttons)
- Typography (Inter font family)
- Component specifications
- Animation guidelines
