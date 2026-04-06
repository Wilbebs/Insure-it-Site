import type { Metadata } from "next";
import Landing from "@/pages/landing";

export const metadata: Metadata = {
  title: "Insure-it | Insurance Agency",
  description:
    "Family-owned independent insurance agency serving Jacksonville, FL since 2011. Get a free quote for home, auto, flood, life, or business insurance today.",
  alternates: {
    canonical: "https://insureitgroup.net",
  },
};

export default function Home() {
  return <Landing />;
}
