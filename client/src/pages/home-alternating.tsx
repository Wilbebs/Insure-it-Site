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

export default function HomeAlternating() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setHeroVisible(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Split Screen Design */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <div className="w-full h-full grid md:grid-cols-2 min-h-screen">
          
          {/* Left Side - Professional Team Photo */}
          <motion.div 
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Team Photo - Static */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${teamPhotoPath})`,
              }}
            />
            
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/30" />
            
            {/* Small logo watermark in corner */}
            <div className="absolute bottom-8 left-8 z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <Logo size="small" variant="white" showTagline={false} />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center px-8 md:px-16 py-20"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {/* Small badge */}
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30">
                    Family-Owned Since 2011
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  insure<span className="text-amber-300">it</span>
                </h1>

                <p className="text-lg md:text-xl text-amber-300/90 mb-2 italic font-light">
                  Life's Uncertain. Your Coverage Isn't.
                </p>

                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                  14 years protecting <span className="font-bold text-amber-300">thousands of Florida families</span> with personalized coverage and genuine care
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="group bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all hover:scale-105"
                    data-testid="button-get-quote"
                  >
                    Get Free Quote
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

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={heroVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  className="mt-12 flex items-center gap-8 text-white/80 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span>A+ Rated</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 1, delay: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
              </div>
            </motion.div>
          </motion.div>
        </div>
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
          backgroundImage="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
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
        backgroundImage="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=80"
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
      <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative overflow-hidden py-20 pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Shield className="w-24 h-24 text-white mx-auto mb-10" />
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
              Ready to Get Protected?
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied families and businesses across Florida. 
              Get your personalized insurance quote in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-24">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="bg-white text-blue-600 px-14 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all hover:scale-105"
                data-testid="button-get-started-cta"
              >
                Get Your Free Quote
              </button>
              <button
                onClick={() => window.location.href = '/about'}
                className="bg-transparent border-2 border-white text-white px-14 py-6 rounded-full font-semibold text-xl hover:bg-white hover:text-blue-600 transition-all"
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
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-white/80 text-lg md:text-xl">
              Trusted by thousands of Florida families and businesses
            </p>
          </motion.div>

          {/* Testimonials Carousel */}
          <div className="mb-20">
            <TestimonialsCarousel />
          </div>

          {/* Statistics Below Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
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
                  <div className="text-6xl font-bold text-white mb-3">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-xl">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />
    </div>
  );
}
