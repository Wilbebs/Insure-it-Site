import type { Metadata } from "next";
import About from "@/pages/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the Hernandez family team behind Insure-it Group Corp. Serving Jacksonville, FL since 2011 with personalized insurance coverage and genuine care.",
  alternates: {
    canonical: "https://insureitgroup.net/about",
  },
};

export default function AboutPage() {
  return <About />;
}
