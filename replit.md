# Insurance Website Application

## Overview

This is a simplified, professional insurance website built with React and Express. The site focuses on making it easy for visitors to request quotes and learn about insurance offerings. Design inspired by Ricci Insurance - clean, minimal scrolling, and conversion-focused.

**Business Credentials**: Family-owned business since 2013, serving thousands of clients across Florida with personalized coverage and genuine care.

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
- **"use client" boundary**: Top-level page components (`landing.tsx`, `about.tsx`) are marked "use client". Their entire import tree becomes client-side. `app/page.tsx` etc. are Server Components that export metadata and render the page.

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript — runs as custom server alongside Next.js
- **Next.js Custom Server**: `server/index.ts` initializes Next.js, prepares it, then delegates all non-API requests via `app.all('*', handle)`
- **Database**: PostgreSQL 17 (AWS RDS db.t4g.micro)
- **File Storage**: AWS S3 for document uploads (bucket `insure-it`, prefix `documents/`)
- **Static Media CDN**: AWS CloudFront distribution `d3gkfgi9drj9kb.cloudfront.net` fronts the same `insure-it` S3 bucket. All large/static media (hero images, logo, shield video, hero videos, testimonial parallax bg) is served from the CDN, not the EC2 origin. See **CDN Asset Strategy** below.
- **Middleware**: Multer for file uploads, Zod for validation

### Key Components
- **Navigation**: Glass morphism navbar with Next.js Link components, usePathname for active state
- **Logo**: InsureIT logo with WebM shield animation. Source files live in `public/` for local dev fallback but in production are served from CloudFront: `https://d3gkfgi9drj9kb.cloudfront.net/video-assets/shield_animation.webm` (1.2 MB, VP8+alpha) and the static last-frame placeholder `https://d3gkfgi9drj9kb.cloudfront.net/image-assets/shield_lastframe.webp` (80 KB). When extracting frames from the VP8+alpha WebM you **must** use `-c:v libvpx` — the default decoder silently drops the alpha channel. Both static and video use identical CSS: `w-[990px] scale(1.55) top:-57px translateX(-50%)`. The same CDN URL for `staticinsureitlogo.webp` powers the navbar wordmark via `next/image` (CloudFront hostname is whitelisted in `next.config.mjs` `remotePatterns`).
- **Hero Window Card**: Frosted-glass app-window card (macOS title bar aesthetic) in the hero — draggable on desktop, minimize/restore animated.
- **Hero Video**: Dual-source via CloudFront CDN. Mobile phones (≤640px) receive `herovid_mobile.mp4` (portrait 9:19.5, 17.7 MB); desktop/tablet receive `herovid1.mp4` (landscape, 21.8 MB). Both at `https://d3gkfgi9drj9kb.cloudfront.net/video-assets/`. Source selected via JS (`isMobilePhone` state, set once on `window.onload` by checking `window.innerWidth <= 640`) — NOT via `media` attribute which is unsupported for `<video><source>`.
- **Hero Static Image**: Uses `<picture>` element with two CDN sources — `<source media="(max-width: 640px)" srcSet="https://d3gkfgi9drj9kb.cloudfront.net/image-assets/heroimage_mobile.webp">` (645×1412px, 172KB portrait Jacksonville bridge) and the desktop/tablet `heroimage1.webp` (1920×1080, 286KB). Phones download only the mobile variant; desktop downloads only the landscape. `<picture>` loads eagerly (SEO, `fetchPriority="high"`); video lazy-loads after `window.onload`. Video `poster=` also switches per device. `app/layout.tsx` ships two media-gated `<link rel="preload" as="image">` tags pointing at the same CDN URLs so the correct hero image starts downloading during HTML parse.
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
- **Dev**: `npm run dev` → `cross-env NODE_ENV=development tsx server/index.ts` starts Express + Next.js dev server on port 5000
- **Build**: `npm run build` → `next build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` — builds Next.js static pages into `.next/` and bundles the Express server into `dist/index.js`. The `--format=esm` flag is **required** because `package.json` has `"type": "module"`.
- **Start**: `npm start` → `NODE_ENV=production node dist/index.js` — serves the built Next.js app via the bundled Express server

### Production (EC2) Notes
- **Port**: Server reads `process.env.PORT`, defaulting to `5000` if unset. Nginx reverse-proxies to port 5000 — if the server listens elsewhere, Nginx returns 502.
- **Static assets**: `app.all('*', handle)` delegates to Next.js's request handler, which automatically serves `.next/static/` files. No extra Express static middleware needed.
- **Deploy steps**: `git pull` → `npm run build` → `pm2 restart insure-it-prod`

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

## Safari / iOS Compatibility Notes

### Parallax Backgrounds (Safari-safe)
`background-attachment: fixed` is **broken on Safari/iOS** — the background image simply doesn't render when used inside an `overflow: hidden` container. This affects both the testimonials high-five image (landing page) and the About page hero background.

**Fix:** Replaced CSS `background-image` + `background-attachment: fixed` with an actual `<img>` element using transform-based parallax:
- Image is **130% tall** with `top: -15%`, giving 30% extra vertical room to shift
- On scroll, `translateY()` moves the image based on scroll position relative to the section
- `will-change-transform` enables GPU acceleration for smooth performance
- Parallax strength: landing testimonials = 80px max shift, about hero = 100px max shift
- Formula: `translateY(((scrollY - (sectionOffsetTop - viewportHeight)) / (sectionHeight + viewportHeight)) * strength)`

This approach works on all browsers including Safari, Chrome, Firefox, and all iOS/Android devices.

### VP8 Alpha WebM (Shield Animation)
The shield animation WebM uses VP8 with a secondary alpha stream. When extracting frames with ffmpeg, you **must** use `-c:v libvpx` — the default decoder silently drops the alpha channel, producing opaque black backgrounds. See Logo section above for details.

## CDN Asset Strategy

All large/static media is served from CloudFront (`d3gkfgi9drj9kb.cloudfront.net`) backed by the S3 bucket `insure-it`. The EC2 origin no longer streams these files, dramatically reducing origin bandwidth and improving global TTFB.

### S3 layout
```
s3://insure-it/
  image-assets/   ← public, cacheable forever (immutable assets)
    heroimage1.webp           1920×1080  286 KB   landscape hero (desktop/tablet)
    heroimage_mobile.webp      645×1412  172 KB   portrait hero (phones ≤640px)
    shield_lastframe.webp     1920×1080   80 KB   logo static placeholder
    staticinsureitlogo.webp   4224×1444   96 KB   InsureIT wordmark
    team_highfive.webp        4700×3133  220 KB   testimonials parallax bg
  video-assets/   ← public, cacheable forever
    herovid1.mp4                          21.8 MB  desktop hero loop
    herovid_mobile.mp4                    17.7 MB  mobile hero loop
    shield_animation.webm                  1.2 MB  VP8+alpha logo animation
  documents/      ← private, presigned-URL access only (quote uploads)
```

### Cache headers
All CDN-served media is uploaded with `Cache-Control: public, max-age=31536000, immutable`. Filenames are the version contract — to change a file's contents, either upload under a new filename **or** issue a CloudFront invalidation for that path. CloudFront's first 1,000 invalidation paths/month are free.

### Where the URLs live in code
- `client/src/components/logo.tsx` — `staticinsureitlogo.webp`, `shield_lastframe.webp`, `shield_animation.webm`
- `client/src/pages/landing.tsx` — `heroimage1.webp`, `heroimage_mobile.webp`, `herovid1.mp4`, `herovid_mobile.mp4`, `team_highfive.webp`
- `app/layout.tsx` — two media-gated `<link rel="preload">` tags for the hero images
- `app/loading.tsx` — `shield_animation.webm`
- `next.config.mjs` — `d3gkfgi9drj9kb.cloudfront.net` whitelisted under `images.remotePatterns` so `next/image` can optimize CDN-hosted images (currently used by the navbar logo).

### What stays on the EC2 origin
- HTML, JS, CSS, fonts, `.next/static/*` chunks
- Smaller team headshots in `public/images/` (elizabeth_photo.jpg, david_photo.jpg, wilbert_photo.jpg, whjr_photo.jpg) — these load on the About page and aren't large enough to warrant CDN
- SEO/Open Graph/JSON-LD `image` URLs deliberately reference `https://insureitgroup.net/images/...` (canonical domain) rather than the CDN — keep it that way for crawler stability

### Operations
- **Add or replace a CDN asset**: upload to the matching S3 prefix with `Content-Type` and `Cache-Control: public, max-age=31536000, immutable`. If the filename already existed, run a CloudFront invalidation on `/image-assets/<filename>` (or `/video-assets/<filename>`) so edges drop the stale copy.
- **Local source of truth**: the originals also live in `public/images/` and `public/` for dev fallback. If you swap one, re-upload to S3 to keep them in sync.

## Design Guidelines

See `design_guidelines.md` for detailed design specifications including:
- Color scheme (slate/navy with green accent buttons)
- Typography (Inter font family)
- Component specifications
- Animation guidelines

## CI: Mobile Lighthouse Performance Check

A GitHub Action (`.github/workflows/lighthouse.yml`) runs on every push to `main` and on pull requests. It:
1. Builds the app (`npm run build`) and starts it (`npm run start`).
2. Runs Lighthouse CI (`@lhci/cli`) 3 times against `http://localhost:5000/` using a mobile emulation profile (Moto G Power, slow 4G throttling).
3. Fails the build with a clear error message if the **mobile performance score drops below 0.85 (85)**.
4. Uploads the full Lighthouse HTML/JSON report as the `lighthouse-mobile-report` artifact (30-day retention) so it can be downloaded and inspected from the CI run.

Configuration lives in `.lighthouserc.json` (threshold, throttling, device emulation). Bump `minScore` there if the team agrees to a stricter floor.
