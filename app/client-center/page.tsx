import type { Metadata } from "next";
import ClientCenter from "@/pages/client-center";

export const metadata: Metadata = {
  title: "Client Center | Insure-it",
  description:
    "Existing Insure-it Group customers: log in to view your policies, request changes, and manage your account through our secure customer service portal.",
  alternates: {
    canonical: "https://www.insureitgroup.net/client-center",
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Client Center | Insure-it",
    description:
      "Log in to manage your Insure-it Group policies through our secure customer service portal.",
    url: "https://www.insureitgroup.net/client-center",
  },
};

export default function ClientCenterPage() {
  return <ClientCenter />;
}
