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
- **React with TypeScript**: Modern React application using functional components and hooks
- **Routing**: Client-side routing with Wouter (only 2 pages: / and /about)
- **Styling**: TailwindCSS + Shadcn/ui components
- **Animations**: Framer Motion for subtle entrance animations
- **State Management**: React Query for server state

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Database**: PostgreSQL (AWS RDS)
- **File Storage**: AWS S3 for document uploads
- **Middleware**: Multer for file uploads, Zod for validation

### Key Components
- **Navigation**: Glass morphism navbar with Home and About Us links
- **Logo**: InsureIT logo with animated shield and typing tagline
- **QuoteModal**: Contact form modal for quote requests
- **TestimonialsCarousel**: Client review carousel
- **Footer**: Site footer with company info
- **ChatBot**: AI assistant "Liz" for insurance inquiries

### API Endpoints
- `POST /api/contact` - Submit contact form with optional documents
- `GET /api/testimonials` - Fetch client testimonials
- `POST /api/objects/upload` - Get presigned URL for file uploads
- `GET /api/documents/:s3Key` - Download uploaded documents
- `GET /api/images/:imageName` - Serve placeholder images

## External Dependencies

### Core Dependencies
- **express**: Web server framework
- **multer**: File upload handling
- **@aws-sdk/client-s3**: AWS S3 integration
- **drizzle-orm**: Database ORM

### Frontend Dependencies
- **@radix-ui/***: UI primitives
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animations
- **react-hook-form**: Form handling
- **wouter**: Routing
- **lucide-react**: Icons

## Design Guidelines

See `design_guidelines.md` for detailed design specifications including:
- Color scheme (slate/navy with green accent buttons)
- Typography (Inter font family)
- Component specifications
- Animation guidelines
