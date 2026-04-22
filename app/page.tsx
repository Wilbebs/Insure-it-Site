import type { Metadata } from "next";
import Landing from "@/pages/landing";

export const metadata: Metadata = {
  title: "Insure-it | Life\u2019s Uncertain. Your Coverage Isn\u2019t.",
  description:
    "Family-owned independent insurance agency in Jacksonville, FL since 2013. Personalized home, auto, flood, life and business coverage from agents who truly care.",
  alternates: {
    canonical: "https://insureitgroup.net",
  },
  openGraph: {
    title: "Insure-it | Life\u2019s Uncertain. Your Coverage Isn\u2019t.",
    description:
      "Family-owned independent insurance agency in Jacksonville, FL since 2013. Personalized home, auto, flood, life and business coverage from agents who truly care.",
    url: "https://insureitgroup.net",
    images: [
      {
        url: "/images/heroimage1.webp",
        width: 1920,
        height: 1080,
        alt: "Insure IT Group Corp \u2014 Insurance Agency Jacksonville FL",
      },
    ],
  },
};

export default function Home() {
  return <Landing />;
}
