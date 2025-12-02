# Insurance Agency Website Design Guidelines

## Design Approach
Reference-based design inspired by Ricci's Insurance aesthetic: professional, trust-building, conversion-focused. Clean, modern insurance industry standards with emphasis on simplicity and rapid user action.

## Typography System
**Primary Font**: Inter or similar modern sans-serif via Google Fonts
- Hero Headline: text-5xl md:text-6xl, font-bold, leading-tight
- Section Headers: text-3xl md:text-4xl, font-bold
- Subheadings: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, regular weight, leading-relaxed
- Card Titles: text-lg md:text-xl, font-semibold
- CTA Text: text-base md:text-lg, font-medium

## Layout System
**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24
**Container**: max-w-7xl mx-auto with px-4 md:px-8
**Section Padding**: py-12 md:py-16 (compact for single-page feel)
**Grid System**: 2-column layouts on desktop (md:grid-cols-2), 4-column for insurance cards (grid-cols-2 md:grid-cols-4)

## Component Architecture

### 1. Header/Navigation (Fixed)
- Transparent overlay on hero, solid white on scroll
- Logo left, navigation center (Services, About, Contact anchors), phone number + CTA button right
- Height: h-20, backdrop-blur when scrolled
- Mobile: Hamburger menu with slide-out drawer

### 2. Hero Section (60vh)
- Full-width background image with dark overlay (opacity-40)
- Content: max-w-4xl, left-aligned or centered
- Company logo/badge at top
- Headline + subheadline + dual CTA buttons (primary "Get a Quote" with blur bg, secondary "Call Us" outline style)
- Include trust indicator text below CTAs ("Licensed & Insured Since [Year]" or "Serving [Area] for X Years")

### 3. Who We Are Section
- Single column, centered content, max-w-3xl
- Brief 2-3 paragraph introduction
- Include small stat badges inline (e.g., "25+ Years Experience", "5,000+ Policies", "24/7 Support")
- Photo: Small team photo or office image, rounded corners

### 4. Insurance Services Grid
- 4 cards in 2x2 grid (responsive: 1 column mobile, 2 on tablet, 4 on desktop)
- Each card: White background, rounded-lg, shadow-sm, hover:shadow-md transition, p-6
- Icon at top (80x80, use Heroicons outlined style)
- Service name (font-semibold, text-xl)
- 1-2 line description
- "Learn More" link with arrow (→)
- Cards: Home/Auto, Flood, Life Insurance, Business Insurance

### 5. Testimonials Section
- Background: Light gray (bg-gray-50)
- 3 testimonial cards in row (stack on mobile)
- Each card: White bg, rounded, p-6, shadow-sm
- Quote text in italics
- Customer name + location below
- 5-star rating display (use star icons from Heroicons)

### 6. Contact/CTA Section (Dual Column)
- Left: Contact form (Name, Email, Phone, Insurance Type dropdown, Message textarea, Submit button)
- Right: Contact information card with office address, phone, email, hours
- Include small map placeholder or location icon
- Form fields: Rounded borders, focus states with ring
- Submit button: Full-width on mobile, auto-width on desktop

### 7. Footer
- Single row: Logo left, quick links center, social icons right
- Copyright + license information
- Background: Dark (bg-gray-900), light text
- Compact: py-8

## Images Specification

**Hero Image**: 
- Professional insurance agent at desk or friendly team in office setting
- High-quality, horizontal orientation
- Warm, welcoming atmosphere
- Size: 1920x800px minimum
- Dark overlay will be applied for text contrast

**Who We Are Image**:
- Team photo or modern office exterior
- 600x400px
- Placed inline with text or as accent

**Icon Graphics**:
- Use Heroicons outlined set via CDN
- Insurance type icons: home, document-text, user-group, briefcase
- Consistent 80x80 sizing in cards

## Animation & Interactions
- Minimal: Smooth scroll to anchor links
- Card hover: Subtle shadow increase
- Button hover: Slight scale (scale-105)
- No parallax or complex scroll animations
- Form field focus: Ring effect only

## Accessibility
- ARIA labels on all interactive elements
- Form validation states (error/success)
- Keyboard navigation throughout
- Min contrast ratios maintained
- Focus indicators on all interactive elements

**Key Design Principle**: Every element serves conversion - clean, trustworthy, action-oriented. No decorative elements that don't build credibility or drive quote requests.