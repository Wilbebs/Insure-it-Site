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
  logo: "https://insureitgroup.net/images/staticinsureitlogo.webp",
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
    images: [
      {
        url: "/images/heroimage1.webp",
        width: 1920,
        height: 1080,
        alt: "Insure IT Group Corp — Insurance Agency Jacksonville FL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insure-it | Life\u2019s Uncertain. Your Coverage Isn\u2019t.",
    description:
      "Family-owned independent insurance agency in Jacksonville, FL since 2013. Personalized home, auto, flood, life and business coverage from agents who truly care.",
    images: ["/images/heroimage1.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://insureitgroup.net",
  },
  icons: {
    icon: [
      { url: "/images/shield_icon.webp", type: "image/webp" },
      { url: "/icon.png", type: "image/png", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/images/shield_icon.webp",
  },
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
        {/* Mobile preload uses the v2 file (84 KB, recompressed at q=70).
            The original heroimage_mobile.webp (173 KB) is still on the CDN
            for OG/social previews but isn't fetched by the page itself. */}
        <link
          rel="preload"
          as="image"
          href="https://d3gkfgi9drj9kb.cloudfront.net/image-assets/heroimage_mobile_v2.webp"
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
      </body>
    </html>
  );
}
