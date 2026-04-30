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
- **QuoteModal**: Embeds the EZLynx Consumer Quoting iframe (`https://www.agentinsure.com/compare/auto-insurance-home-insurance/insure/quote.aspx`) inside the existing Dialog shell. Loading overlay (spinner + `t.quote.loadingQuote` text) shows until iframe `onLoad` fires, with an 8s fallback timer. Iframe sandbox: `allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox`. The chatbot listens for the `quote-modal-state` window event dispatched by this component and hides itself while the modal is open so it doesn't overlap the iframe. **Two completely separate layouts for desktop vs mobile:** Desktop scales the EZLynx page down to fit our modal width; mobile lets EZLynx render at its natural width and just hands the whole viewport over to it. **Desktop (`vw ≥ 640`)**: We render the EZLynx page at a fixed natural size (`DESKTOP_NATURAL_WIDTH = 1024 × DESKTOP_NATURAL_HEIGHT = 1500`) and apply `transform: scale(scale)` with `transform-origin: top left` to fit it inside the modal. `available` width = `min(vw, DESKTOP_MODAL_MAX=768) - DESKTOP_MODAL_PADDING=48` (modal `max-w-3xl` minus `p-6`). `scale = clamp(0.2, 1, available / 1024)`. Wrapper has `overflow-hidden` and a fixed `height = round(1500 * scale)` so the scaled iframe fills it exactly. `DialogContent` uses the default `grid` layout and `overflow-y-auto` so the user can scroll vertically through the scaled iframe height. The bilingual `DialogHeader` (title + subtitle) is shown above the iframe. **Measurement note:** scale is derived from `window.innerWidth` rather than `containerRef.clientWidth` because the fixed-pixel iframe inside Radix's CSS grid pushes its grid track wider than the modal, so `clientWidth` would lie and lock scale at 1.0. The wrapper still keeps `min-w-0` and `overflow-hidden` as defensive layout guards. **Mobile (`vw < 640`)**: We don't scale or crop EZLynx at all — we just give it the whole screen. `DialogContent` becomes a flex column (`max-sm:flex max-sm:flex-col`) that's edge-to-edge full-viewport (`w-screen max-w-[100vw] h-[100dvh] p-0 gap-0 border-0 rounded-none max-sm:overflow-hidden`). The `DialogHeader` is `sr-only` (retained in DOM for `aria-describedby`). A `shrink-0` branded header bar sits at the top (`<Logo imgClassName="h-9" />` on a white strip with `px-4 py-3` and a 1px slate-100 bottom border) — it's not sticky because the wrapper itself doesn't scroll, the iframe handles its own internal scrolling. The iframe wrapper takes the rest of the height (`flex-1 min-h-0`) and renders the iframe at `w-full h-full` with no transform, so EZLynx fills the entire space below the logo bar in its natural layout. A custom floating `DialogClose` X button (`fixed top-2 right-2 z-[60]`, white circle with shadow) sits over the logo bar to close the modal. State updates on `resize` and `orientationchange`, with initial value computed during the `useState` initializer to avoid a first-paint flash. Legacy form/schema/success state/`/api/contact` mutation removed from this component (chatbot still uses `/api/contact` independently).
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