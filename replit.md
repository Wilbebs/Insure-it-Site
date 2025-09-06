# Insurance Website Application

## Overview

This is a modern, full-stack insurance website built with React and Express that provides information about various insurance products and allows visitors to submit contact forms with document attachments. The application features a professional marketing website with sections for auto, home, and life insurance, along with a contact form that supports file uploads.

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
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: 
  - Drizzle Kit for database migrations
  - Type-safe schema definitions with Zod validation
- **Storage Abstraction**: Interface-based storage layer supporting both in-memory (development) and database (production) implementations
- **Data Models**:
  - Users table with username/password authentication
  - Contact submissions with file attachment support

### Component Architecture
- **Modular Design**: Reusable components organized by feature
- **UI System**: Comprehensive design system with shadcn/ui components
- **Responsive Design**: Mobile-first approach with Tailwind responsive utilities
- **Animation System**: Scroll-triggered animations using Intersection Observer API

### API Design
- **RESTful Endpoints**: Clean API structure with proper HTTP methods
- **File Upload Support**: Multi-file upload with type validation (PDF, DOC, DOCX, JPG, PNG)
- **Error Handling**: Consistent error responses with proper HTTP status codes
- **Request Validation**: Zod schema validation for all API inputs

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection for production
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration tools for PostgreSQL
- **express**: Web server framework with middleware support
- **multer**: File upload handling middleware

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