import type { Metadata } from "next";
import Landing from "@/pages/landing";

// The home page inherits all metadata from app/layout.tsx (title, description,
// canonical, openGraph, twitter, icons, etc.). The previous duplicated
// openGraph block here was overriding the layout's image with the old WebP
// hero, which meant social previews never picked up the JPG OG card. Leaving
// the export empty keeps a single source of truth in the layout.
export const metadata: Metadata = {};

export default function Home() {
  return <Landing />;
}
