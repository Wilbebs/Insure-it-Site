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
  - Request logging with response time tracking
  - Error handling middleware
- **File Upload Processing**: Multer for handling multipart form data with file type validation
- **Development Setup**: Vite integration for hot module replacement during development

### Data Storage Architecture
- **Database**: Firebase Firestore NoSQL database for scalable data storage (contact forms, carousel config)
- **File Storage**: 
  - Replit Object Storage (similar to AWS S3) for policy application documents
  - Firebase Storage for contact form attachments and images
- **Authentication**: Firebase Authentication (configured for future admin features)
- **Schema Management**: 
  - TypeScript interfaces with Zod validation for type safety
  - Firestore collections for contact submissions and site configuration
  - Server-side image management through Firebase Admin SDK
- **Data Models**:
  - Contact submissions with file attachment URLs from Firebase Storage
  - Policy applications with document URLs from Object Storage
  - Carousel images configuration stored in Firestore
  - Site configuration and uploaded media tracking

### Component Architecture
- **Modular Design**: Reusable components organized by feature
- **UI System**: Comprehensive design system with shadcn/ui components
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Animation System**: 
  - Scroll-triggered animations using Intersection Observer API
  - Auto insurance page: Car crash animation on load with cartoon particle burst effect
  - Life insurance page: Heartbeat animation on heart icon (continuous double-beat pattern)
  - Home insurance page: House icon sways gently (protection/shelter effect)
  - Health insurance page: Icon pulses like a health monitor
  - Commercial insurance page: Building rises and falls (construction/growth effect)
- **Interactive Logo**: InsureIT logo serves as homepage link with engaging hover animations (scale, rotate shield, color transitions)
- **Team Section**: About page features 8 team members with professional headshots and corner-positioned LinkedIn icons (blue/white theme, hover effects)
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
- **firebase & firebase-admin**: Firebase SDK for client and server-side operations with Firestore database and Storage
- **@neondatabase/serverless**: Serverless PostgreSQL database connection for production (legacy - replaced by Firebase)
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools for PostgreSQL (legacy - replaced by Firebase)
- **express**: Web server framework with middleware support
- **multer**: File upload handling middleware
- **uuid**: Unique identifier generation for file uploads

### Frontend UI Dependencies
- **@radix-ui/***: Headless UI primitives for accessible component foundations
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation library for smooth user interactions
- **react-hook-form & @hookform/resolvers**: Form management with validation
- **react-dropzone**: File upload with drag-and-drop interface

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