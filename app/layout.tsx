import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../client/src/index.css";
import { Providers } from "./providers";

// Self-hosts the Inter font at build time. Eliminates the render-blocking
// CSS @import to fonts.googleapis.com that was costing ~480ms on the
// mobile Lighthouse run. The `--font-inter` CSS variable is wired into
// `--font-sans` in client/src/index.css so all existing styles still resolve.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "Insure IT Group Corp",
  description:
    "Family-owned independent insurance agency serving Jacksonville, FL since 2013.",
  url: "https://insureitgroup.net",
  logo: "https://insureitgroup.net/images/staticinsureitlogo_v2.webp",
  image: "https://insureitgroup.net/images/heroimage1.webp",
  telephone: "+19049090897",
  email: "Info@insureitgroup.net",
  foundingDate: "2013",
  address: {
    "@type": "PostalAddress",
    streetAddress: "11570 San Jose Blvd, Suite 11",
    addressLocality: "Jacksonville",
    addressRegion: "FL",
    postalCode: "32223",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.1588,
    longitude: -81.6426,
  },
  openingHours: "Mo-Fr 09:00-17:00",
  areaServed: "Florida",
  serviceType: [
    "Home Insurance",
    "Auto Insurance",
    "Flood Insurance",
    "Life Insurance",
    "Business Insurance",
  ],
  sameAs: [
    "https://www.facebook.com/profile.php?id=61573260677064",
    "https://www.instagram.com/insureitgroup/",
    "https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all",
  ],
};

// WebSite schema with potentialAction. This is the structured data Google
// uses to decide whether to render a "Sitelinks Searchbox" under the main
// search result. It costs nothing to include and is a prerequisite for
// that feature even being eligible.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Insure IT Group Corp",
  url: "https://insureitgroup.net",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://insureitgroup.net/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://insureitgroup.net"),
  title: "Insure-it | Life\u2019s Uncertain. Your Coverage Isn\u2019t.",
  description:
    "Family-owned independent insurance agency in Jacksonville, FL since 2013. Personalized home, auto, flood, life and business coverage from agents who truly care.",
  keywords: [
    "insurance agency Jacksonville FL",
    "home insurance Jacksonville",
    "auto insurance Florida",
    "flood insurance Jacksonville",
    "life insurance Florida",
    "business insurance Jacksonville",
    "independent insurance agent",
    "Insure IT Group",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://insureitgroup.net",
    siteName: "Insure IT Group Corp",
    title: "Insure-it | Life\u2019s Uncertain. Your Coverage Isn\u2019t.",
    description:
      "Family-owned independent insurance agency in Jacksonville, FL since 2013. Personalized home, auto, flood, life and business coverage from agents who truly care.",
    // OG image must be JPG/PNG at 1200×630 for maximum compatibility.
    // LinkedIn, iMessage and several other previewers silently fail on
    // WebP, which was the bug behind missing/broken social link previews.
    images: [
      {
        url: "/images/og_image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Insure IT Group Corp — Insurance Agency Jacksonville FL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insure-it | Life\u2019s Uncertain. Your Coverage Isn\u2019t.",
    description:
      "Family-owned independent insurance agency in Jacksonville, FL since 2013. Personalized home, auto, flood, life and business coverage from agents who truly care.",
    images: ["/images/og_image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://insureitgroup.net",
  },
  // Favicons MUST be PNG/ICO. WebP favicons are silently ignored by Safari
  // (iOS + macOS) and by Google Search's favicon crawler, so the previous
  // shield_icon.webp setup never produced a tab icon for Safari users or a
  // Google search-result icon. The file set below is generated from the
  // shield artwork at build time and lives at the public/ root so the
  // standard /favicon.ico fallback path also resolves.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#1e293b",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
    <meta name="google-site-verification" content="2i_f63ELXZtuiO7pOhBS9f3w79ANoA9NktjyoezNvxo" />
        <link
          rel="preload"
          as="image"
          href="https://d3gkfgi9drj9kb.cloudfront.net/image-assets/heroimage1.webp"
          type="image/webp"
          media="(min-width: 641px)"
        />
        {/* Mobile preload uses the v5 file — a still extracted from the
            mobile hero video at the 5.9s mark (720×1560, q=85). Iterated
            ~150ms later than _v4 (5.75s) for a slightly different
            composition. Visual continuity: phones see a frame the video
            naturally lands on, so dropping the video on mobile costs no
            visual context. Older variants remain on the CDN for OG/social
            previews. */}
        <link
          rel="preload"
          as="image"
          href="https://d3gkfgi9drj9kb.cloudfront.net/image-assets/heroimage_mobile_v5.webp"
          type="image/webp"
          media="(max-width: 640px)"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
