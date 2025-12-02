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
import teamPhotoPath from "@assets/teamportraitAI_1760737460273.jpg";

const insuranceTypes = [
  {
    icon: <Car className="w-12 h-12" />,
    title: "Home / Auto",
    description: "Whether it's your home or your vehicle—personal, business, or specialty—we provide coverage you can trust, giving you peace of mind every step of the way.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: <House className="w-12 h-12" />,
    title: "Flood",
    description: "Protect your home and peace of mind with reliable flood insurance coverage tailored to safeguard against the unexpected.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: "Life",
    description: "We're here to help protect what matters most with coverage tailored to support your loved ones when they need it most.",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  {
    icon: <Building2 className="w-12 h-12" />,
    title: "Business",
    description: "Having insurance is a crucial part of running a business. We offer many coverage plans to make sure you get the options you need.",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
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
        {/* Team Photo Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${teamPhotoPath})`,
            backgroundPosition: "center 30%",
          }}
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/80 to-slate-900/85" />

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center px-6 md:px-16">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Badge */}
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20 mb-6">
                Independent Insurance Agency
              </span>

              {/* Logo */}
              <div className="mb-6">
                <Logo size="large" showTagline={true} variant="white" />
              </div>

              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
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
                  className="group bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-xl transition-all hover:scale-105"
                  data-testid="button-get-quote"
                >
                  Get A Quote
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <a
                  href="tel:+13059185339"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center gap-2"
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
              Who We Are
            </h2>
            <div className="w-16 h-1 bg-green-500 mx-auto mb-8"></div>
            
            <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-4">
              Dependable Home, Auto, and Business Insurance
            </h3>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              We are a family-owned insurance agency based in sunny Miami, FL. Since 2011, 
              we have been helping families all over Florida with their home, auto, and 
              business insurance needs. Our team takes pride in providing personalized 
              service and finding the best coverage at competitive rates.
            </p>

            <button
              onClick={() => window.location.href = '/about'}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              data-testid="button-read-more"
            >
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
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
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all text-center"
              >
                <div className={`${type.bgColor} ${type.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5`}>
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {type.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {type.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">
            Client Testimonials
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-green-600 mb-8">
            Contact Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl">
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-slate-600" />
              <div>
                <a href="tel:+13059185339" className="text-slate-800 hover:text-green-600 transition-colors font-medium">
                  (305) 918-5339
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-slate-600" />
              <div>
                <a href="mailto:info@insure-itgroup.com" className="text-slate-800 hover:text-green-600 transition-colors font-medium">
                  info@insure-itgroup.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-slate-600" />
              <div>
                <span className="text-slate-800 font-medium">
                  Miami, FL
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6 text-slate-600" />
              <div>
                <span className="text-slate-800 font-medium">
                  Licensed & Insured
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
