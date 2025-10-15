import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import InsuranceCardsFlow from "@/components/insurance-cards-flow";
import Testimonials from "@/components/testimonials";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <InsuranceCardsFlow />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
}
