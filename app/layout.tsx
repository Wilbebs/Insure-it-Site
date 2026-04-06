import type { Metadata } from "next";
import "../client/src/index.css";
import { Providers } from "./providers";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  name: "Insure IT Group Corp",
  description:
    "Family-owned independent insurance agency serving Jacksonville, FL since 2011.",
  url: "https://insureitgroup.net",
  telephone: "+19049090897",
  email: "Info@insureitgroup.net",
  foundingDate: "2011",
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
};

export const metadata: Metadata = {
  metadataBase: new URL("https://insureitgroup.net"),
  title: {
    default: "Insure IT Group Corp | Insurance Agency | Jacksonville, FL",
    template: "%s | Insure IT Group Corp",
  },
  description:
    "Family-owned independent insurance agency serving Jacksonville, FL since 2011. Personalized home, auto, flood, life, and business insurance coverage you can trust.",
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
    title: "Insure IT Group Corp | Insurance Agency | Jacksonville, FL",
    description:
      "Family-owned independent insurance agency serving Jacksonville, FL since 2011. Personalized home, auto, flood, life, and business insurance coverage.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insure IT Group Corp | Insurance Agency | Jacksonville, FL",
    description:
      "Family-owned independent insurance agency serving Jacksonville, FL since 2011.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://insureitgroup.net",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
