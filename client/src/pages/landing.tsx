///client/src/pages/home-alternating.tsx
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AlternatingParallaxSection from "@/components/alternating-parallax-section";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import QuoteModal from "@/components/quote-modal";
import { motion } from "framer-motion";
import { Car, House, Heart, Activity, Building2, ArrowRight, Shield } from "lucide-react";
import Logo from "@/components/logo";
import { useEffect, useState } from "react";
import teamPhotoPath from "@assets/teamportraitAI_1760737460273.jpg";

export default function Landing() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setHeroVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToQuotes = () => {
    const ctaSection = document.getElementById('cta-section');
    ctaSection?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const button = document.getElementById('quick-quote-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        setCursorPosition({ 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        });
        setShowCursor(true);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Full Screen Background */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        {/* Team Photo Background - Full Screen */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${teamPhotoPath})`,
            backgroundPosition: 'center 30%',
          }}
        />
        
        {/* Blue gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-500/85 to-blue-600/90" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        {/* Centered Content */}
        <div className="relative z-10 w-full flex items-center justify-center px-8 md:px-16 py-20">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Logo with Shield Pulse Animation */}
              <div className="mb-8">
                <Logo size="large" showTagline={true} variant="white" />
              </div>

              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                14 years protecting <span className="font-bold text-amber-300">thousands of Florida families</span> with personalized coverage and genuine care
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={scrollToQuotes}
                  className="group bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all hover:scale-105"
                  data-testid="button-get-quote"
                >
                  Jump to Quick Quotes
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('auto-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
                  data-testid="button-explore-coverage"
                >
                  Explore Coverage
                </button>
              </motion.div>

              {/* Trust indicators with Family-Owned badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={heroVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 1 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>A+ Rated</span>
                </div>
                <div className="inline-block">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                    Family-Owned Since 2011
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 1, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Auto Insurance - Content Left */}
      <div id="auto-section">
        <AlternatingParallaxSection
          contentSide="left"
          title="Auto Insurance"
          description="Drive with complete peace of mind. Our comprehensive auto insurance protects you, your passengers, and your vehicle on every Florida road."
          features={[
            'Collision & Comprehensive Coverage',
            'Liability Protection up to $1M',
            'Uninsured Motorist Coverage',
            '24/7 Roadside Assistance',
            'Rental Car Reimbursement'
          ]}
          icon={<Car className="w-12 h-12 text-white" />}
          backgroundImage="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80"
          accentColor="from-blue-500 to-blue-600"
        >
          <button 
            onClick={() => window.location.href = '/auto-insurance'}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-blue-500/50 transition-all hover:scale-105"
            data-testid="button-learn-auto"
          >
            Learn More About Auto Insurance
          </button>
        </AlternatingParallaxSection>
      </div>

      {/* Home Insurance - Content Right */}
      <AlternatingParallaxSection
        contentSide="right"
        title="Home Insurance"
        description="Your home is your sanctuary and your biggest investment. Protect it with comprehensive coverage designed for Florida's unique climate challenges."
        features={[
          'Hurricane & Wind Damage Coverage',
          'Dwelling & Structure Protection',
          'Personal Property Insurance',
          'Liability Coverage up to $500K',
          'Additional Living Expenses'
        ]}
        icon={<House className="w-12 h-12 text-white" />}
        backgroundImage="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920&q=80"
        accentColor="from-green-500 to-emerald-600"
      >
        <button 
          onClick={() => window.location.href = '/home-insurance'}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-green-500/50 transition-all hover:scale-105"
          data-testid="button-learn-home"
        >
          Learn More About Home Insurance
        </button>
      </AlternatingParallaxSection>

      {/* Life Insurance - Content Left */}
      <AlternatingParallaxSection
        contentSide="left"
        title="Life Insurance"
        description="Secure your family's financial future. Our life insurance policies provide the protection and peace of mind your loved ones deserve."
        features={[
          'Term Life Insurance (10-30 years)',
          'Whole Life Coverage',
          'Universal Life Options',
          'Flexible Premium Plans',
          'Living Benefits Riders'
        ]}
        icon={<Heart className="w-12 h-12 text-white" />}
        backgroundImage="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80"
        accentColor="from-red-500 to-pink-600"
      >
        <button 
          onClick={() => window.location.href = '/life-insurance'}
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-red-500/50 transition-all hover:scale-105"
          data-testid="button-learn-life"
        >
          Learn More About Life Insurance
        </button>
      </AlternatingParallaxSection>

      {/* Health Insurance - Content Right */}
      <AlternatingParallaxSection
        contentSide="right"
        title="Health Insurance"
        description="Access quality healthcare when you need it most. Our health insurance plans connect you with trusted providers across Florida."
        features={[
          'Individual & Family Plans',
          'Preventive Care Coverage',
          'Prescription Drug Benefits',
          'Emergency Services',
          'Mental Health Support'
        ]}
        icon={<Activity className="w-12 h-12 text-white" />}
        backgroundImage="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&q=80"
        accentColor="from-purple-500 to-violet-600"
      >
        <button 
          onClick={() => window.location.href = '/health-insurance'}
          className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105"
          data-testid="button-learn-health"
        >
          Learn More About Health Insurance
        </button>
      </AlternatingParallaxSection>

      {/* Commercial Insurance - Content Left */}
      <AlternatingParallaxSection
        contentSide="left"
        title="Commercial Insurance"
        description="Protect your business with comprehensive coverage tailored to your industry. We understand the unique risks Florida businesses face."
        features={[
          'General Liability Coverage',
          'Property & Equipment Insurance',
          'Workers\' Compensation',
          'Business Interruption Protection',
          'Professional Liability'
        ]}
        icon={<Building2 className="w-12 h-12 text-white" />}
        backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
        accentColor="from-orange-500 to-amber-600"
      >
        <button 
          onClick={() => window.location.href = '/commercial-insurance'}
          className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-orange-500/50 transition-all hover:scale-105"
          data-testid="button-learn-commercial"
        >
          Learn More About Commercial Insurance
        </button>
      </AlternatingParallaxSection>

      {/* CTA + Testimonials + Stats Combined Section */}
      <section id="cta-section" className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative overflow-hidden py-16 flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10 w-full">
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-white mx-auto mb-6" />
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
              Ready to Get Protected?
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied families and businesses across Florida. 
              Get your personalized insurance quote in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                id="quick-quote-button"
                onClick={() => setQuoteModalOpen(true)}
                className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all hover:scale-105"
                data-testid="button-get-started-cta"
              >
                Get your Quick Quote
              </button>
              <button
                onClick={() => window.location.href = '/about'}
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
                data-testid="button-learn-about"
              >
                Learn About Us
              </button>
            </div>
          </motion.div>

          {/* What Our Clients Say Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              What Our Clients Say
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              Trusted by thousands of Florida families and businesses
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="mb-12">
            <TestimonialsCarousel />
          </div>

          {/* Statistics Below Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { number: '14+', label: 'Years of Excellence' },
                { number: '50,000+', label: 'Families Protected' },
                { number: '98%', label: 'Client Satisfaction' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />

      {/* Animated Cursor Effect */}
      {showCursor && (
        <motion.div
          initial={{ 
            x: window.innerWidth + 100, 
            y: -100,
            opacity: 0,
            scale: 0
          }}
          animate={{ 
            x: cursorPosition.x - 15,
            y: cursorPosition.y - 15,
            opacity: [0, 1, 1, 1, 0],
            scale: [0, 1.2, 1, 1.1, 0.8, 0]
          }}
          transition={{ 
            duration: 2,
            times: [0, 0.3, 0.6, 0.7, 0.9, 1],
            ease: "easeInOut"
          }}
          onAnimationComplete={() => {
            setShowCursor(false);
            document.getElementById('quick-quote-button')?.click();
          }}
          className="fixed pointer-events-none z-[100]"
          style={{
            width: '50px',
            height: '50px',
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <circle cx="14" cy="10" r="1.5" fill="black" />
          </svg>
        </motion.div>
      )}
    </div>
  );
}
