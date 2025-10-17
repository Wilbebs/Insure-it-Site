import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AdvancedParallaxContainer from "@/components/advanced-parallax-container";
import CutoutWindow from "@/components/cutout-window";
import { motion } from "framer-motion";
import { Shield, Car, House, Heart, TrendingUp, Check } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Logo from "@/components/logo";

export default function HomeAdvanced() {
  const { ref: section1Ref, isVisible: section1Visible } = useScrollAnimation();
  const { ref: section2Ref, isVisible: section2Visible } = useScrollAnimation();
  const { ref: section3Ref, isVisible: section3Visible } = useScrollAnimation();
  const { ref: section4Ref, isVisible: section4Visible } = useScrollAnimation();
  const { ref: section5Ref, isVisible: section5Visible } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Section 1: Hero with Layered Parallax */}
      <AdvancedParallaxContainer
        height="100vh"
        layers={[
          {
            id: 'hero-bg-deep',
            speed: 0.2,
            zIndex: 1,
            backgroundGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
          },
          {
            id: 'hero-bg-mid',
            speed: 0.3,
            zIndex: 2,
            backgroundImage: '/api/images/hero-bg',
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 90%)',
          },
        ]}
      >
        <div ref={section1Ref as any} className="relative z-50 flex items-center justify-center h-screen">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={section1Visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="mb-8">
                <Logo size="large" showTagline={true} />
              </div>
              <motion.p 
                className="text-xl sm:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={section1Visible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Experience protection reimagined with cutting-edge insurance solutions
              </motion.p>
              <motion.button
                className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all"
                onClick={() => document.getElementById('section-2')?.scrollIntoView({ behavior: 'smooth' })}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={section1Visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                data-testid="button-explore"
              >
                Explore Coverage
              </motion.button>
            </motion.div>
          </div>
        </div>
      </AdvancedParallaxContainer>

      {/* Section 2: Auto Insurance with Cutout Window */}
      <div id="section-2">
        <AdvancedParallaxContainer
          height="100vh"
          layers={[
            {
              id: 'auto-bg',
              speed: 0.25,
              zIndex: 1,
              backgroundImage: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920',
            },
          ]}
        >
          <CutoutWindow
            shape="polygon"
            animateOnScroll={true}
            backgroundLayer={
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-blue-900/80" />
            }
            className="h-screen flex items-center justify-center"
          >
            <div ref={section2Ref as any} className="container mx-auto px-6 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={section2Visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8 }}
              >
                <Car className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-2xl" />
                <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
                  Auto Insurance
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95">
                  Drive with confidence. Comprehensive coverage that moves with you.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {['Collision Coverage', 'Liability Protection', 'Roadside Assistance', 'Uninsured Motorist'].map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={section2Visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                      className="bg-white/20 backdrop-blur-md rounded-xl p-4"
                    >
                      <Check className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </CutoutWindow>
        </AdvancedParallaxContainer>
      </div>

      {/* Section 3: Home Insurance with Circle Reveal */}
      <AdvancedParallaxContainer
        height="100vh"
        layers={[
          {
            id: 'home-bg',
            speed: 0.3,
            zIndex: 1,
            backgroundImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1920',
          },
          {
            id: 'home-overlay',
            speed: 0.2,
            zIndex: 2,
            backgroundGradient: 'radial-gradient(circle at center, transparent 30%, rgba(16, 185, 129, 0.7) 100%)',
          },
        ]}
      >
        <CutoutWindow
          shape="circle"
          animateOnScroll={true}
          className="h-screen flex items-center justify-center"
        >
          <div ref={section3Ref as any} className="container mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={section3Visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 1 }}
            >
              <House className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-2xl" />
              <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
                Home Insurance
              </h2>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95">
                Your sanctuary deserves uncompromising protection
              </p>
            </motion.div>
          </div>
        </CutoutWindow>
      </AdvancedParallaxContainer>

      {/* Section 4: Life Insurance with Diagonal Cutout */}
      <AdvancedParallaxContainer
        height="100vh"
        layers={[
          {
            id: 'life-bg',
            speed: 0.25,
            zIndex: 1,
            backgroundImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920',
          },
        ]}
      >
        <CutoutWindow
          customClipPath="polygon(0 0, 100% 0, 100% 85%, 0 100%)"
          animateOnScroll={false}
          backgroundLayer={
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-pink-600/80" />
          }
          className="h-screen flex items-center justify-center"
        >
          <div ref={section4Ref as any} className="container mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={section4Visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
            >
              <Heart className="w-24 h-24 mx-auto mb-6 text-white drop-shadow-2xl" />
              <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
                Life Insurance
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95">
                Secure your family's future with comprehensive life coverage
              </p>
            </motion.div>
          </div>
        </CutoutWindow>
      </AdvancedParallaxContainer>

      {/* Section 5: Multi-Layer Stats Section */}
      <AdvancedParallaxContainer
        height="100vh"
        layers={[
          {
            id: 'stats-bg-1',
            speed: 0.2,
            zIndex: 1,
            backgroundGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          },
          {
            id: 'stats-bg-2',
            speed: 0.3,
            zIndex: 2,
            backgroundGradient: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
          },
          {
            id: 'stats-bg-3',
            speed: 0.25,
            zIndex: 3,
            backgroundGradient: 'radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
          },
        ]}
      >
        <div ref={section5Ref as any} className="relative z-50 h-screen flex items-center justify-center">
          <div className="container mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={section5Visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
            >
              <Shield className="w-24 h-24 mx-auto mb-6 text-blue-400" />
              <h2 className="text-5xl md:text-7xl font-bold mb-12">
                Trusted by Thousands
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                {[
                  { number: '14+', label: 'Years of Excellence' },
                  { number: '50K+', label: 'Families Protected' },
                  { number: '98%', label: 'Client Satisfaction' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={section5Visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
                  >
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                    <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                    <div className="text-xl text-white/80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </AdvancedParallaxContainer>

      {/* Section 6: Contact CTA */}
      <AdvancedParallaxContainer
        height="100vh"
        layers={[
          {
            id: 'cta-bg',
            speed: 0.3,
            zIndex: 1,
            backgroundGradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
          },
        ]}
      >
        <div className="relative z-50 h-screen flex items-center justify-center">
          <div className="container mx-auto px-6 text-center text-white">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
            >
              <h2 className="text-5xl md:text-7xl font-bold mb-8">
                Ready to Get Protected?
              </h2>
              <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90">
                Join thousands of satisfied families across Florida
              </p>
              <button
                className="bg-white text-blue-600 px-16 py-6 rounded-full font-bold text-2xl shadow-2xl hover:shadow-white/50 transition-all hover:scale-105"
                onClick={() => window.location.href = '/#connect'}
                data-testid="button-get-quote"
              >
                Get Your Free Quote
              </button>
            </motion.div>
          </div>
        </div>
      </AdvancedParallaxContainer>

      <Footer />
    </div>
  );
}
