import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AlternatingParallaxSection from "@/components/alternating-parallax-section";
import { motion } from "framer-motion";
import { Car, House, Heart, Activity, Building2, ArrowRight, Shield } from "lucide-react";
import Logo from "@/components/logo";
import { useEffect, useState } from "react";

export default function HomeAlternating() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - Blue Gradient */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Parallax Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/api/images/hero-bg)',
            transform: `translateY(${typeof window !== 'undefined' ? window.scrollY * 0.5 : 0}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700" />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1 }}
          >
            <div className="mb-12">
              <Logo size="large" showTagline={true} />
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
            >
              A family-owned Florida insurance agency with <span className="font-bold text-white">14 years of experience</span> protecting thousands of clients statewide
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button
                onClick={() => document.getElementById('auto-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-white/30 transition-all hover:scale-105"
                data-testid="button-explore-coverage"
              >
                Explore Coverage
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => window.location.href = '/#connect'}
                className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
                data-testid="button-get-quote"
              >
                Get Free Quote
              </button>
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

      {/* Final CTA Section - Blue Gradient */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 relative overflow-hidden py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
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

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <button
                onClick={() => window.location.href = '/#connect'}
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

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto"
            >
              {[
                { number: '14+', label: 'Years of Excellence' },
                { number: '50,000+', label: 'Families Protected' },
                { number: '98%', label: 'Client Satisfaction' }
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <div className="text-6xl font-bold text-white mb-3">{stat.number}</div>
                  <div className="text-white/80 text-xl">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
