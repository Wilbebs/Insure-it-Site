import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import PartnersCarousel from "@/components/partners-carousel";
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
import jacksonvilleSkyline from "@assets/stock_images/jacksonville_florida_13db0295.jpg";

const insuranceTypes = [
  {
    icon: <Car className="w-10 h-10" />,
    title: "Home / Auto",
    description: "Whether it's your home or your vehicle—personal, business, or specialty—we provide coverage you can trust.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  },
  {
    icon: <House className="w-10 h-10" />,
    title: "Flood",
    description: "Protect your home and peace of mind with reliable flood insurance coverage tailored to safeguard against the unexpected.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    icon: <Heart className="w-10 h-10" />,
    title: "Life",
    description: "We're here to help protect what matters most with coverage tailored to support your loved ones.",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    title: "Business",
    description: "Having insurance is a crucial part of running a business. We offer many coverage plans for your needs.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
  },
];

export default function Landing() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="h-[520px] flex flex-col justify-center items-center relative overflow-hidden py-10 px-5">
        {/* Jacksonville Skyline Background - Parallax with blur */}
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform blur-[2.5px] dark:brightness-75"
          style={{
            backgroundImage: `url(${jacksonvilleSkyline})`,
            backgroundPosition: "center 40%",
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />

        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glass Window Container */}
          <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl px-6 md:px-10 py-6 border border-white/30 shadow-2xl shadow-black/20 flex flex-col items-center text-center">
            {/* Subtle gradient glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

            {/* Logo */}
            <div className="relative mb-6">
              <Logo size="large" showTagline={true} variant="white" />
            </div>

            <p className="relative text-lg md:text-xl text-slate-700 max-w-2xl leading-relaxed mb-5 select-none">
              Your Trusted Partner for Home, Auto & Business Insurance
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all hover:scale-105 select-none"
                data-testid="button-get-quote"
              >
                Get Quoted Today
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="tel:+13059185339"
                className="bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 select-none"
                data-testid="button-call-us"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Bar - Glassmorphism */}
      <section className="py-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 select-none">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">14+</div>
              <div className="text-sm text-slate-400">Years Experience</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">2000+</div>
              <div className="text-sm text-slate-400">Families Protected</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">24hr</div>
              <div className="text-sm text-slate-400">Response Time</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">A+</div>
              <div className="text-sm text-slate-400">Customer Rating</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are Section - Asymmetric Layout */}
      <section className="py-20 bg-muted dark:bg-slate-800 relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-1 h-32 bg-gradient-to-b from-primary to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-1 h-32 bg-gradient-to-t from-primary to-transparent"></div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            {/* Left-aligned header with accent */}
            <div className="mb-10">
              <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3 select-none">Our Promise to Florida Families</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 select-none">
                More Than Insurance.<br className="hidden md:block" />
                <span className="text-primary">Peace of Mind.</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  We are a family-owned insurance agency based in sunny St. Johns, FL. Since 2011, 
                  we have been helping families all over Florida with their home, auto, and 
                  business insurance needs.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Our team takes pride in providing personalized service and finding the best 
                  coverage at competitive rates. When you call us, you talk to a real person 
                  who genuinely cares.
                </p>

                <button
                  onClick={() => window.location.href = '/about'}
                  className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 select-none"
                  data-testid="button-read-more"
                >
                  Meet Our Team
                  <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Feature highlights */}
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-background dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 select-none">Licensed & Trusted</h4>
                      <p className="text-sm text-muted-foreground">Fully licensed in Florida with a proven track record of protecting families.</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-background dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 select-none">Family Values</h4>
                      <p className="text-sm text-muted-foreground">We treat every client like family, because that's what community means to us.</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-background dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1 select-none">Always Available</h4>
                      <p className="text-sm text-muted-foreground">Real humans answer your calls—no automated systems or long hold times.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-20 bg-background dark:bg-slate-900 relative">
        {/* Decorative diagonal accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-500/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-6">
          {/* Creative section header */}
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3 select-none">Coverage Built Around You</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 select-none">
              Protection for Every Chapter of Life
            </h2>
            <p className="text-muted-foreground">From your first car to your dream home, we've got you covered at every turn.</p>
          </div>

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
                
                {/* Content - Moves up on hover to show full description */}
                <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-300 group-hover:-translate-y-4">
                  <div className="text-primary mb-2 transition-transform duration-300 group-hover:scale-110">
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {type.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                    {type.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pt-20 pb-[74px] bg-muted dark:bg-slate-800 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3 select-none">Client Experiences</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground select-none">
              What Our Clients Say
            </h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Contact Info Section - Centered */}
      <section className="py-20 bg-background dark:bg-slate-900 relative">
        {/* Decorative wave */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Section header */}
            <div className="mb-10">
              <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3 select-none">Connect with an Agent Now</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 select-none">
                Ready to Get Started?
              </h2>
            </div>

            {/* Get Quoted Today Button */}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all hover:scale-105 mb-12 select-none"
              data-testid="button-get-quote-contact"
            >
              Get Quoted Today
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <PartnersCarousel />

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
