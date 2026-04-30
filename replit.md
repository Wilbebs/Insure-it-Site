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
- **Client Center Page** (`/client-center`): Embed of the EZLynx Customer Service portal (`https://customerservice.agentinsure.com/EzlynxCustomerService/insure/Account/LogIn`) for existing customers. Layout: page wrapper uses the site-wide `dot-pattern` over `bg-muted` so the polka dot texture shows around the iframe card (matches About page aesthetic). The standard glass-morphism `Navigation` is fixed at top. The EZLynx iframe sits in a constrained polka wrapper (`relative w-full max-w-[988px] mx-auto bg-muted dot-pattern px-4 sm:px-6 py-6 sm:py-8`) — the wrapper is centered with a `max-w-[988px]` cap (940 iframe + 48 horizontal padding) so the polka pattern only appears as a thin frame around the iframe (a wider full-bleed polka background was visually too noisy on the sides). The outer `min-h-screen` div is plain `bg-muted` (no polka) so beyond the wrapper there's just the muted page color, and the wrapper's own padding creates the polka frame on all four sides of the iframe. The iframe is opaque (`bg-white rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-slate-200`), `max-w-[940px] mx-auto` so it hugs EZLynx's actual content width (welcome panel + sign-in form) without leaving dead white margins inside the iframe — and reads as a clean white card on the polka-dotted page — the polka dots do NOT bleed through the EZLynx page itself (an earlier `bg-transparent` attempt caused the dots to show through EZLynx's whitespace, which looked wrong). Iframe height is fixed at `1240px` mobile / `600px` desktop — sized to EZLynx's actual content height in each layout (mobile stacks the welcome and sign-in panels vertically, desktop puts them side-by-side). Auto-resize was considered but rejected: EZLynx is on a different origin (`agentinsure.com`) and does not send a `postMessage` height event, so the browser's same-origin policy blocks us from reading their actual content height — fixed heights tuned per breakpoint are the only option. Main wrapper padding is `pt-12 sm:pt-16 pb-24 sm:pb-24` so the iframe clears the navbar at top (tightened from a previous `pt-24 sm:pt-28` per design feedback that the top gap was about 2x larger than desired) and the floating CTA pill at bottom. The "Not a client yet?" CTA is rendered as a floating frosted-glass pill (`fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40`, `bg-white/95 backdrop-blur-md`, `rounded-full`) overlapping the bottom of the iframe card — shield icon + headline + Get a Quote button in one row. The outer wrapper is `pointer-events-none` and the inner pill `pointer-events-auto` so empty space around the pill doesn't block clicks on the iframe. No site footer (would push the iframe out of the viewport). A `<noscript>` fallback link is layered inside the iframe wrapper for users with JS disabled. Page is `noindex` (in metadata robots) since it's a portal landing, not SEO content. Discoverable via navbar (desktop label "Client Center", mobile short label "Clients" / "Clientes") and footer Quick Links on every other page.
- **Navigation**: Glass morphism navbar with logo (animated WebM shield with WebKit fallback for static image). The desktop navbar (`lg:`) is `fixed left-1/2 -translate-x-1/2`, sized to its content when scrolled (rounded pill) and full-width when at the top of the page. The pill mode also has `max-w-[calc(100vw-1rem)]` as a defensive cap so the pill can never extend past the viewport edges. To accommodate the Client Center nav link without the language toggle being pushed off-screen on hover, the scrolled pill uses tighter spacing throughout: `pl-4 pr-6` padding (was `pl-6 pr-8`), `gap-3` between the three main groups (was `gap-12`), and `space-x-5` between center nav links (was `space-x-8`). The hovered state uses `paddingRight: 6rem` to give the appearing language toggle a visible breathing buffer to the pill's right rounded edge. When scrolled and not hovered the social icons stack with `-space-x-6` and the language toggle is hidden; on hover, the icons spread (`gap-2`), the language toggle appears with `ml-1`, and the pill grows to fit. Iterated multiple times: the original `gap-12 / pl-6 pr-8 / paddingRight 4rem` worked before Client Center was added, but the new nav link pushed total content width past viewport on smaller desktop screens (1024-1100px); the tighter scrolled-state spacing brings the expanded width back inside the viewport on those displays.
- **Hero Section**: Includes a draggable, frosted-glass "Window Card" and a device-responsive background video/image served via CDN.
- **QuoteModal**: Embeds the EZLynx Consumer Quoting iframe (`https://www.agentinsure.com/compare/auto-insurance-home-insurance/insure/quote.aspx`) inside the existing Dialog shell. Loading overlay (spinner + `t.quote.loadingQuote` text) shows until iframe `onLoad` fires, with an 8s fallback timer. Iframe sandbox: `allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox`. The chatbot listens for the `quote-modal-state` window event dispatched by this component and hides itself while the modal is open so it doesn't overlap the iframe. **Why scaling with two natural widths and a mobile header crop:** EZLynx's page is not responsive in the conventional sense — at narrow viewports their logo block and agent-info block collide because their header has no real mobile layout, just a shrunk-down desktop version. To get bigger, more readable text on phones we render the iframe at a smaller natural width on mobile to push EZLynx into its "narrow" presentation, AND we crop off the top portion of their page where the broken header lives so the form starts at the top of our modal. Constants: `DESKTOP_NATURAL_WIDTH = 1024` (clean desktop layout), `MOBILE_NATURAL_WIDTH = 720` (gives EZLynx's secondary popups, like "Have an Agent Call Me", enough horizontal room to render without clipping their left edge; trade-off is slightly smaller form text than the prior 480px setting), `NATURAL_HEIGHT = 1500`, `MOBILE_HEADER_CROP = 0` (EZLynx-page pixels of header to hide on mobile; disabled because at 720px natural width EZLynx's own header renders well enough, and any positive value clips the top of EZLynx's secondary popups like "Have an Agent Call Me", which sit at the top of their page). The `computeLayout()` helper picks the natural width and crop by viewport: mobile (`vw < 640`) uses 720 + crop 0, desktop uses 1024 + crop 0. It also computes `available` width — mobile = `vw` (modal is flush), desktop = `min(vw, 768) - 48` (modal `max-w-3xl` minus `p-6`). Scale = `clamp(0.2, 1, available / naturalWidth)`. The iframe is sized to `naturalWidth × NATURAL_HEIGHT` and transformed via `transform: scale(scale) translateY(-headerCrop px)` with `transform-origin: top left` — read right-to-left, EZLynx's content shifts up by `headerCrop` page-pixels first, then the whole thing scales. Wrapper height = `(NATURAL_HEIGHT - headerCrop) * scale` so the visible content fills the wrapper exactly with no empty space; `overflow-hidden` on the wrapper clips the cropped header above and any content below. **Measurement note:** scale is derived from `window.innerWidth` rather than `containerRef.clientWidth` because the fixed-pixel iframe inside Radix's CSS grid pushes its grid track wider than the modal, so `clientWidth` would lie and lock scale at 1.0. The wrapper still keeps `min-w-0` and `overflow-hidden` as defensive layout guards. State updates on `resize` and `orientationchange`, with initial value computed during the `useState` initializer to avoid a first-paint flash at scale=1. Desktop: `max-w-3xl max-h-[90vh]` with the bilingual header visible. Mobile (≤640px): edge-to-edge sheet — `w-screen max-w-[100vw] h-[100dvh] p-0 gap-0 border-0 rounded-none`, the DialogHeader is `sr-only` (retained in DOM for `aria-describedby`), and a custom floating `DialogClose` X button (`fixed top-2 right-2 z-[60]`, white circle with shadow) replaces the small built-in close so the scaled iframe gets every available pixel. A small mobile-only branded header bar sits above the iframe (`<Logo imgClassName="h-9" />` on a white strip with `px-4 py-3` and a 1px slate-100 bottom border) so the user always sees Insure-IT branding above the cropped EZLynx form. Modal scrolls vertically through the scaled iframe height. Legacy form/schema/success state/`/api/contact` mutation removed from this component (chatbot still uses `/api/contact` independently).
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