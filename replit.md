# Insurance Website Application

## Overview

This is a modern, full-stack insurance website built with React and Express that provides information about various insurance products and allows visitors to submit contact forms with document attachments. The application features a professional marketing website with sections for auto, home, and life insurance, along with a contact form that supports file uploads.

**Business Credentials**: The site emphasizes being a proud family-owned business with 14 years of experience serving thousands of clients across Florida. The touching family story (from humble Miami beginnings in 2011 to statewide expansion) is featured prominently on the About page, creating an emotional connection with visitors.

**Strategic Vision**: The company aims to transform into an enterprise-grade platform supporting 500+ employees and hundreds of thousands of clients. A dedicated strategic planning page at `/plans` outlines the expansion roadmap with 12+ initiatives across 4 phases, including growth metrics dashboards, AI chatbot integration, interactive Florida expansion maps, video testimonials, and enterprise-level features. The page includes collaborative functionality for adding custom client suggestions during presentations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **Styling**: 
  - TailwindCSS for utility-first styling with custom CSS variables for theming
  - Shadcn/ui component library for consistent UI components
  - Framer Motion for smooth animations and scroll-triggered effects
- **State Management**: React Query (TanStack Query) for server state management and API caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **File Uploads**: React Dropzone for drag-and-drop file upload functionality

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Middleware Stack**:
  - JSON and URL-encoded body parsing
  - Multer for multipart form data handling with file type validation (PDF, DOC, DOCX, JPG, PNG up to 10MB)
  - Request logging with response time tracking
  - Error handling middleware
- **Storage System**: In-memory storage for all data with interface for easy migration to production database
- **File Upload Processing**: 
  - Server-side uploads to Replit Object Storage via ObjectStorageService
  - Unique UUID-based filenames to prevent collisions
  - Direct buffer upload using Google Cloud Storage SDK
- **Development Setup**: Vite integration for hot module replacement during development

### Data Storage Architecture
- **Database**: In-memory storage (contact submissions, policy applications, carousel images, strategic suggestions)
- **File Storage**: 
  - **Replit Object Storage** (Google Cloud Storage backend) for all uploaded documents
  - Contact form documents stored in `{PRIVATE_OBJECT_DIR}/contact-documents/`
  - Policy application documents in `{PRIVATE_OBJECT_DIR}/uploads/`
  - Server-to-storage uploads via ObjectStorageService.uploadObject()
  - Client-to-storage uploads via presigned URLs from /api/objects/upload
- **Schema Management**: 
  - TypeScript interfaces with Zod validation for type safety
  - Server-side storage interface for all data operations
- **Data Models**:
  - Contact submissions with comma-delimited document URLs (text field)
  - Policy applications with document URL arrays from Object Storage
  - Carousel images configuration stored in memory
  - Strategic suggestions for strategic planning page

### Component Architecture
- **Modular Design**: Reusable components organized by feature
- **UI System**: Comprehensive design system with shadcn/ui components
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Homepage Modern Parallax Layout (v2 - Refined)**:
  - **Premium Alternating Design**: Magazine-style layout with asymmetric floating cards inspired by Stripe Atlas
  - **5 Full-Screen Insurance Sections** with staggered content placement:
    - Section 1 (Auto): Content LEFT (offset -5%) → Parallax image RIGHT
    - Section 2 (Home): Content RIGHT (offset +5%) → Parallax image LEFT
    - Section 3 (Life): Content LEFT (offset -5%) → Parallax image RIGHT
    - Section 4 (Health): Content RIGHT (offset +5%) → Parallax image LEFT
    - Section 5 (Commercial): Content LEFT (offset -5%) → Parallax image RIGHT
  - **Parallax Background Images**: Bleeding effect (120% height, -10% top) scrolling at 55% speed for organic flow
  - **Floating Card Design**:
    - Soft rounded corners (2.5rem/40px radius) for contemporary feel
    - Glass morphism effect with backdrop-blur-xl and translucent backgrounds
    - Generous padding (p-10 md:p-14 lg:p-16) for breathing room
    - Elevated depth with shadow-2xl, subtle borders, gradient glow underneath
  - **Premium Animations**:
    - Smooth entrance: fade + scale + slide with custom easing [0.22, 1, 0.36, 1]
    - Icon spring animation with bounce effect (0.4)
    - Staggered feature reveals with 80ms delays
    - 75% viewport activation threshold for perfect timing
  - **Blue Color Scheme**: Hero and CTA sections use blue gradient (from-blue-600 via-blue-500 to-blue-700)
  - **GPU Optimization**: translate3d, willChange, backfaceVisibility for 60fps
  - **Responsive**: Stacks vertically on mobile/tablet with full-width cards
- **Animation System**: 
  - Scroll-triggered animations using Intersection Observer API
  - Auto insurance page: Car crash animation on load with cartoon particle burst effect
  - Life insurance page: Heartbeat animation on heart icon (continuous double-beat pattern)
  - Home insurance page: House icon sways gently (protection/shelter effect)
  - Health insurance page: Icon pulses like a health monitor
  - Commercial insurance page: Building rises and falls (construction/growth effect)
- **Interactive Logo**: InsureIT logo serves as homepage link with engaging hover animations (scale, rotate shield, color transitions)
  - **Hero Shield Pulse**: Shield in large logo pulses 3 times on first page load
  - **Tagline Typing**: "Life's Uncertain. Your Coverage Isn't." types in on page load without cursor
- **Team Section**: About page features 8 team members with professional headshots and corner-positioned LinkedIn icons (blue/white theme, hover effects)
- **Our Story Typing Animation**: On the About page, the "Our Story" title types in on load, followed by the final paragraph, then the signature "From our family..." with a blinking cursor at the end to create a storytelling effect
- **AI Assistant Chatbot "Liz"**: Interactive chatbot with:
  - **Insurance Type Selection First**: Shows clickable buttons (Auto/Home/Life) as first step, before collecting any personal data
  - **Page Navigation**: Clicking an insurance type navigates to that insurance page (e.g., /auto-insurance)
  - **Confirmation Before Data Collection**: Asks "Would you like to apply?" before collecting information
  - **Form-Like Chat Interface**: Input box always stays at bottom for familiar UX
  - **Multi-Step Application System**: Supports Auto, Home, and Life insurance applications
  - **Document Upload**: PDF/DOC/DOCX/JPG/PNG files up to 10MB via Replit Object Storage
  - **State Management**: Finite state machine (localStorage cleared on mount for fresh sessions)
  - **Smart Transitions**: Insurance selection → page navigation → confirmation → information collection → review → submit
  - **Audio Feedback**: Notification sounds (800Hz appearance, 600Hz responses)
  - **Visual Indicators**: Typing animations and smooth transitions
  - **Natural Language Support**: Can also detect insurance type from conversational input (e.g., "I need car insurance")

### API Design
- **RESTful Endpoints**: Clean API structure with proper HTTP methods
- **File Upload Support**: 
  - Contact forms: Firebase Storage with multi-file support
  - Policy applications: Replit Object Storage with presigned URLs for direct upload
  - Type validation (PDF, DOC, DOCX, JPG, PNG) with 10MB size limits
- **Object Storage Integration** (for policy documents):
  - POST `/api/objects/upload` - Get presigned URL for client-side direct upload
  - GET `/objects/:objectPath` - Serve uploaded documents
  - Privacy controls via Object ACL policies
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Request Validation**: Zod schema validation for all API inputs
- **Firebase Integration**:
  - Contact form data stored in Firestore with real-time capabilities
  - Image serving through Firebase Storage with public URLs
  - Server-side rendering support for dynamic image loading

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection (configured but not in use)
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools for PostgreSQL (configured but not in use)
- **express**: Web server framework with middleware support
- **multer**: File upload handling middleware
- **uuid**: Unique identifier generation for file uploads and storage

### Frontend UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessible component foundations
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for smooth user interactions
- **react-hook-form & @hookform/resolvers**: Form management with validation
- **react-dropzone**: File upload with drag-and-drop interface
- **wouter**: Lightweight client-side routing

### Development & Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Type safety across the entire application
- **tailwindcss**: Utility-first CSS framework
- **esbuild**: Fast JavaScript bundler for production builds

### Utility Libraries
- **zod**: Runtime type validation and schema definition
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight client-side routing