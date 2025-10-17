import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import InsuranceCardsFlow from "@/components/insurance-cards-flow";
import Testimonials from "@/components/testimonials";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";
import ParallaxSection from "@/components/parallax-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <style>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <Navigation />
      
      {/* Hero Section with Parallax */}
      <ParallaxSection 
        backgroundImage="/api/images/hero-bg"
        className="min-h-screen"
      >
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
        <Hero />
      </ParallaxSection>

      {/* Insurance Cards Section with Parallax Background */}
      <ParallaxSection 
        backgroundGradient="linear-gradient(135deg, rgb(219, 234, 254) 0%, rgb(255, 255, 255) 50%, rgb(224, 231, 255) 100%)"
        className="min-h-screen"
      >
        <div id="insurance-sections">
          <InsuranceCardsFlow />
        </div>
      </ParallaxSection>

      {/* Testimonials Section with Parallax */}
      <ParallaxSection 
        backgroundGradient="linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(239, 246, 255) 50%, rgb(241, 245, 249) 100%)"
        className="min-h-[80vh]"
      >
        <Testimonials />
      </ParallaxSection>

      {/* Contact Form Section with Parallax */}
      <ParallaxSection 
        backgroundGradient="linear-gradient(135deg, rgb(239, 246, 255) 0%, rgb(238, 242, 255) 50%, rgb(255, 255, 255) 100%)"
        className="min-h-screen"
        id="connect"
      >
        <ContactForm />
      </ParallaxSection>

      <Footer />
    </div>
  );
}
