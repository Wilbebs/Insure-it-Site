import type { Metadata } from "next";
import Plans from "@/pages/plans";

export const metadata: Metadata = {
  title: "Insurance Plans",
  description:
    "Explore our range of insurance plans including home, auto, flood, life, and business coverage. Get a personalized quote today.",
};

export default function PlansPage() {
  return <Plans />;
}
