import type { Metadata } from "next";
import About from "@/pages/about";

export const metadata: Metadata = {
  title: "About Us | Insure-it",
  description:
    "Meet the Hernandez family team behind Insure-it Group Corp. Serving Jacksonville, FL since 2013 with personalized insurance coverage and genuine care.",
  alternates: {
    canonical: "https://www.insureitgroup.net/about",
  },
  openGraph: {
    title: "About Us | Insure-it",
    description:
      "Meet the Hernandez family team behind Insure-it Group Corp. Serving Jacksonville, FL since 2013 with personalized insurance coverage and genuine care.",
    url: "https://www.insureitgroup.net/about",
    images: [
      {
        url: "/images/jax_beach_pier.webp",
        width: 1280,
        height: 854,
        alt: "Insure IT Group Corp team — Jacksonville FL",
      },
    ],
  },
};

export default function AboutPage() {
  return <About />;
}
