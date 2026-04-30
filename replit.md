# Insurance Website Application

## Overview

This project is a professional insurance website built with React and Express, offering quote requests and showcasing insurance offerings. The core purpose is to provide a clean, minimal, and conversion-focused platform for a family-owned insurance agency serving Florida, emphasizing personalized coverage. The business vision is to streamline the insurance quoting process and effectively present the agency's offerings online.

## User Preferences

- Preferred communication style: Simple, everyday language.
- Design philosophy: Simple, minimal scrolling, easy form access
- Users likely already know what insurance they need - focus on quick quote access
- Dark mode: Disabled for the time being (may be re-enabled later)
- Language toggle: EN/ES button with flag emoji badges (🇺🇸/🇪🇸) replaces dark mode toggle
- Form fields: Select dropdowns and date inputs use direct form.setValue + form.watch() pattern (NOT FormField/Controller) to ensure immediate visual updates

## System Architecture

### Frontend
- **Framework**: Next.js 14 (App Router) for SSG/SSR.
- **Styling**: TailwindCSS 3 + Shadcn/ui for a clean, minimal design inspired by Ricci Insurance.
- **Animations**: Framer Motion for dynamic UI elements.
- **State Management**: TanStack React Query v5 for efficient server state handling.
- **UI/UX Decisions**: Glass-morphism navigation, device-responsive hero section with a draggable "Window Card," and auto-cycling testimonials carousel.
- **QuoteModal**: Integrates the EZLynx Consumer Quoting iframe, optimized for responsiveness across devices with custom scaling and header cropping for improved user experience.
- **Client Center Page**: Embeds the EZLynx Customer Service portal within a custom layout featuring a full-bleed polka dot background and a floating "Not a client yet?" CTA.
- **Mobile Optimization**: Conditional rendering of hero video/image, optimized image formats (WebP), and client-side font loading for improved Lighthouse scores.

### Backend
- **Server**: Express.js with TypeScript, running as a custom server alongside Next.js.
- **Database**: PostgreSQL 17 (AWS RDS).
- **File Storage**: AWS S3 for document uploads and AWS CloudFront for static media CDN.
- **Middleware**: Multer for file uploads and Zod for validation.

### API Endpoints
- `POST /api/contact`: For contact form submissions.
- `GET /api/testimonials`: To retrieve testimonials.
- `POST /api/objects/upload`: For obtaining presigned S3 URLs.
- `GET /api/documents/:s3Key`: For document downloads.
- `GET /api/images/:imageName`: For serving placeholder images.
- `GET /api/videos/herovid1.mp4`: For streaming hero video.

## External Dependencies

- **next**: Next.js 14
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