import type { Metadata } from "next";
import Landing from "@/pages/landing";

export const metadata: Metadata = {
  title: "Home | Insure-it",
  description:
    "Family-owned independent insurance agency serving Jacksonville, FL since 2011. Get a free quote for home, auto, flood, life, or business insurance today.",
  alternates: {
    canonical: "https://insureitgroup.net",
  },
  openGraph: {
    title: "Home | Insure-it",
    description:
      "Family-owned independent insurance agency serving Jacksonville, FL since 2011. Get a free quote for home, auto, flood, life, or business insurance today.",
    url: "https://insureitgroup.net",
    images: [
      {
        url: "/images/heroimage1.webp",
        width: 1920,
        height: 1080,
        alt: "Insure IT Group Corp — Insurance Agency Jacksonville FL",
      },
    ],
  },
};

export default function Home() {
  return <Landing />;
}
