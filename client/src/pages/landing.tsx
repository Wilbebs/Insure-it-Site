import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import QuoteModal from "@/components/quote-modal";
import { motion } from "framer-motion";
import {
  Car,
  House,
  Heart,
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
} from "lucide-react";
import Logo from "@/components/logo";
import { useEffect, useState } from "react";
import jacksonvilleSkyline from "@assets/stock_images/downtown_jacksonvill_8488fc38.jpg";

const insuranceTypes = [
  {
    icon: <Car className="w-10 h-10" />,
    title: "Home / Auto",
    description: "Whether it's your home or your vehicle—personal, business, or specialty—we provide coverage you can trust.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
  },
  {
    icon: <House className="w-10 h-10" />,
    title: "Flood",
    description: "Protect your home and peace of mind with reliable flood insurance coverage tailored to safeguard against the unexpected.",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80",
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Life",
    description: "We're here to help protect what matters most with coverage tailored to support your loved ones.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "Business",
    description: "Having insurance is a crucial part of running a business. We offer many coverage plans for your needs.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  },
];

export default function Landing() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center relative overflow-hidden pt-20">
        {/* Jacksonville Skyline Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${jacksonvilleSkyline})`,
            backgroundPosition: "center 40%",
          }}
        />

        {/* Overlay - adapts to theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/90 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/90" />

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center px-6 md:px-16">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <span className="inline-block px-4 py-2 bg-sky-500/20 backdrop-blur-sm rounded-full text-sky-300 text-sm font-medium border border-sky-400/30 mb-6">
                Independent Insurance Agency
              </span>

              {/* Logo */}
              <div className="mb-6">
                <Logo size="large" showTagline={true} variant="white" />
              </div>

              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Your Trusted Partner for Home, Auto & Business Insurance
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all hover:scale-105"
                  data-testid="button-get-quote"
                >
                  Get Quoted Today
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="tel:+13059185339"
                  className="bg-transparent border-2 border-sky-400 text-sky-300 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2"
                  data-testid="button-call-us"
                >
                  <Phone className="w-5 h-5" />
                  Call Us Now
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 bg-muted dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Who We Are
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
            
            <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">
              Dependable Home, Auto, and Business Insurance
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We are a family-owned insurance agency based in sunny Miami, FL. Since 2011, 
              we have been helping families all over Florida with their home, auto, and 
              business insurance needs. Our team takes pride in providing personalized 
              service and finding the best coverage at competitive rates.
            </p>

            <button
              onClick={() => window.location.href = '/about'}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              data-testid="button-read-more"
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-16 bg-background dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            A Wide Variety of Insurance Needs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {insuranceTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative rounded-xl overflow-hidden h-72 cursor-pointer"
                data-testid={`card-insurance-${type.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${type.image})` }}
                />
                
                {/* Gradient Overlay - stronger on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent transition-all duration-300 group-hover:from-blue-900 group-hover:via-blue-900/80 group-hover:to-blue-900/40" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="text-primary mb-3 transition-transform duration-300 group-hover:scale-110">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {type.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {type.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted dark:bg-slate-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Client Testimonials
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Contact Info Section - Centered */}
      <section className="py-16 bg-background dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10">
              Contact Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="flex flex-col items-center gap-3" data-testid="contact-phone">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <a href="tel:+13059185339" className="text-foreground hover:text-primary transition-colors font-medium" data-testid="link-phone">
                  (305) 918-5339
                </a>
              </div>
              
              <div className="flex flex-col items-center gap-3" data-testid="contact-email">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <a href="mailto:info@insure-itgroup.com" className="text-foreground hover:text-primary transition-colors font-medium text-sm" data-testid="link-email">
                  info@insure-itgroup.com
                </a>
              </div>

              <div className="flex flex-col items-center gap-3" data-testid="contact-location">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <span className="text-foreground font-medium" data-testid="text-location">
                  St. Johns, FL
                </span>
              </div>

              <div className="flex flex-col items-center gap-3" data-testid="contact-license">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span className="text-foreground font-medium" data-testid="text-license">
                  Licensed & Insured
                </span>
              </div>
            </div>

            {/* Get Quoted Today Button */}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all hover:scale-105"
              data-testid="button-get-quote-contact"
            >
              Get Quoted Today
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
