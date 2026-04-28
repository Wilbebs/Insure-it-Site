# Insurance Website Application

## Overview

This project is a professional insurance website built with React and Express, focusing on quote requests and showcasing insurance offerings. It aims for a clean, minimal design inspired by Ricci Insurance, emphasizing conversion. The business is a family-owned agency since 2013, serving Florida with personalized coverage.

## User Preferences

- Preferred communication style: Simple, everyday language.
- Design philosophy: Simple, minimal scrolling, easy form access
- Users likely already know what insurance they need - focus on quick quote access
- Dark mode: Disabled for the time being (may be re-enabled later)
- Language toggle: EN/ES button with flag emoji badges (🇺🇸/🇪🇸) replaces dark mode toggle
- Form fields: Select dropdowns and date inputs use direct form.setValue + form.watch() pattern (NOT FormField/Controller) to ensure immediate visual updates

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 (App Router) for SSG/SSR.
- **Styling**: TailwindCSS 3 + Shadcn/ui.
- **Animations**: Framer Motion.
- **State Management**: TanStack React Query v5 for server state.
- **Client/Server Components**: Uses Next.js App Router's "use client" boundary for interactivity.

### Backend Architecture
- **Server**: Express.js with TypeScript, running as a custom server alongside Next.js.
- **Database**: PostgreSQL 17 (AWS RDS).
- **File Storage**: AWS S3 for document uploads.
- **Static Media CDN**: AWS CloudFront for large/static media assets from S3.
- **Middleware**: Multer for file uploads, Zod for validation.

### Key Features
- **Homepage**: Hero section with CTAs, company overview, insurance types grid, testimonials, contact info.
- **About Us Page**: Company story and team.
- **Navigation**: Glass morphism navbar with logo (animated WebM shield with WebKit fallback for static image).
- **Hero Section**: Includes a draggable, frosted-glass "Window Card" and a device-responsive background video/image served via CDN.
- **QuoteModal**: Embeds the EZLynx Consumer Quoting iframe (`https://www.agentinsure.com/compare/auto-insurance-home-insurance/insure/quote.aspx`) inside the existing Dialog shell. Loading overlay (spinner + `t.quote.loadingQuote` text) shows until iframe `onLoad` fires, with an 8s fallback timer. Iframe sandbox: `allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox`. **Why scaling, not fluid width:** EZLynx's page is not responsive below ~768px — handing it any narrower viewport causes their own header/logo/footer to overlap. So the iframe is rendered at a fixed natural size of `768 × 1500` (`NATURAL_WIDTH`/`NATURAL_HEIGHT` constants) and CSS-scaled to fit the available container width via `transform: scale(scale)` with `transform-origin: top left`. A `ResizeObserver` on the wrapper computes `scale = min(1, containerWidth / 768)` and the wrapper's height is `NATURAL_HEIGHT * scale` so there is no empty space below. **Critical:** the wrapper has `min-w-0` to break out of Radix DialogContent's CSS grid intrinsic sizing — without it, the 768px iframe pushes its grid track to 768px and the measurement always reads 768, locking scale at 1.0. Desktop: `max-w-3xl max-h-[90vh]` with the bilingual header visible. Mobile (≤640px): edge-to-edge sheet — `w-screen max-w-[100vw] h-[100dvh] p-0 gap-0 border-0 rounded-none`, the DialogHeader is `sr-only` (retained in DOM for `aria-describedby`), and a custom floating `DialogClose` X button (`fixed top-2 right-2 z-[60]`, white circle with shadow) replaces the small built-in close so the scaled iframe gets every available pixel. Modal scrolls vertically through the scaled iframe height. Legacy form/schema/success state/`/api/contact` mutation removed from this component (chatbot still uses `/api/contact` independently).
- **TestimonialsCarousel**: Auto-cycling and swipe-supported carousel.
- **Parallax Backgrounds**: Implemented with transform-based CSS for cross-browser compatibility, including Safari/iOS.
- **CI/CD**: GitHub Action for Lighthouse mobile performance checks (score > 85).

### API Endpoints
- `POST /api/contact` - Contact form submission.
- `GET /api/testimonials` - Fetch testimonials.
- `POST /api/objects/upload` - Get presigned S3 URL.
- `GET /api/documents/:s3Key` - Download documents.
- `GET /api/images/:imageName` - Serve placeholder images.
- `GET /api/videos/herovid1.mp4` - Stream hero video.

### Mobile Performance / SEO Optimizations
- **Inter font** is self-hosted via `next/font/google` in `app/layout.tsx` (not loaded via CSS `@import`). The font's CSS variable (`--font-inter`) is wired to `--font-sans` in `client/src/index.css`. This eliminates the render-blocking external CSS request that previously cost ~480ms on mobile Lighthouse.
- **Hero video** is gated on `!isMobilePhone` in `landing.tsx` — phones (≤640px) never fetch or decode the hero video. Desktop/tablet still get it after `window.onload`.
- **Mobile hero image** uses `heroimage_mobile_v5.webp` (720×1560, q=85). It's a still extracted from the mobile hero video (`herovid_mobile.mp4`) at the 5.9s mark using ffmpeg, then downscaled from the video's native 1080×2340 to a retina-sweet-spot 720×1560. Frame timing was iterated through several attempts (_v3 at 8.5s, _v4 at 5.75s, _v5 at 5.9s) to find a composition that doesn't look cropped on mobile. Visual continuity: phones see a frame the video naturally lands on, so dropping the video on mobile costs no visual context. Older variants (`heroimage_mobile.webp`, `_v2`, `_v3`, `_v4`) remain on the CDN for OG/social previews. Both desktop and mobile preload tags in `app/layout.tsx` use conditional `media` queries so each device only fetches its variant.
- **Shield logo animation**: WebKit (iOS/macOS Safari) AND all phones (≤640px viewport) skip the WebM and show only `shield_lastframe_v2.webp` (lossless WebP, 36 KB, extracted directly from frame 127 of `shield_animation.webm`). Desktop non-WebKit clients lazy-load the WebM after `window.onload` and play it once (no loop). The navbar logo uses `staticinsureitlogo_v2.webp` (320×110, 8 KB) sized for its actual 105×36 display footprint.

### Build & Deployment
- **Development**: `npm run dev` starts Express + Next.js dev server on port 5000.
- **Production Build**: `npm run build` compiles Next.js and bundles Express server.
- **Production Start**: `npm start` runs the bundled Express server.
- **Deployment**: `git pull`, `npm run build`, `pm2 restart insure-it-prod`.

## External Dependencies

- **next**: Next.js 14 (SSG/SSR framework)
- **express**: Web server framework
- **multer**: File upload handling
- **@aws-sdk/client-s3**: AWS S3 integration
- **drizzle-orm**: PostgreSQL ORM
- **@radix-ui/***: UI primitives (via shadcn/ui)
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animations
- **react-hook-form**: Form handling
- **lucide-react**: Icons
- **react-icons**: Social media icons