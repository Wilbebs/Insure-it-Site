import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import InsuranceSection from "@/components/insurance-section";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";
import { Car, House, Heart, UserCheck, Building } from "lucide-react";

const insuranceTypes = [
  {
    icon: Car,
    title: "Auto Insurance",
    description: "Comprehensive auto coverage that protects you on every journey. From liability to comprehensive coverage, we ensure you're protected against the unexpected while keeping your premiums affordable.",
    features: [
      "Collision & Comprehensive Coverage",
      "Liability Protection",
      "Uninsured Motorist Coverage",
      "Roadside Assistance"
    ],
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    imageAlt: "Auto insurance consultation",
    reversed: false
  },
  {
    icon: House,
    title: "Home Insurance",
    description: "Your home is your sanctuary. Our comprehensive home insurance policies protect your property, belongings, and provide liability coverage for complete peace of mind.",
    features: [
      "Dwelling & Structure Coverage",
      "Personal Property Protection",
      "Liability Coverage",
      "Additional Living Expenses"
    ],
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    imageAlt: "Modern home exterior",
    reversed: true
  },
  {
    icon: Heart,
    title: "Life Insurance",
    description: "Secure your family's financial future with our flexible life insurance options. From term to whole life policies, we help you choose the right coverage for your life stage.",
    features: [
      "Term Life Insurance",
      "Whole Life Coverage",
      "Universal Life Options",
      "Flexible Premium Plans"
    ],
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    imageAlt: "Family protection and security",
    reversed: false
  },
  {
    icon: UserCheck,
    title: "Health Insurance",
    description: "Comprehensive health coverage that keeps you and your family protected. Access quality healthcare with our network of trusted providers and flexible plan options.",
    features: [
      "Individual & Family Plans",
      "Preventive Care Coverage",
      "Prescription Drug Benefits",
      "Emergency Services"
    ],
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    imageAlt: "Healthcare consultation",
    reversed: true
  },
  {
    icon: Building,
    title: "Commercial Insurance",
    description: "Protect your business with comprehensive commercial coverage. From liability to property protection, we understand the unique risks your business faces and provide tailored solutions.",
    features: [
      "General Liability Coverage",
      "Property Insurance",
      "Workers' Compensation",
      "Business Interruption"
    ],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    imageAlt: "Modern commercial office building",
    reversed: false
  }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {insuranceTypes.map((insurance, index) => (
        <InsuranceSection
          key={insurance.title}
          {...insurance}
          index={index}
        />
      ))}
      
      <ContactForm />
      <Footer />
    </div>
  );
}
