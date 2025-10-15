import { motion } from "framer-motion";
import { House, ArrowRight } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import Logo from "./logo";

export default function Hero() {
  return (
    <section 
      className="min-h-screen flex items-center justify-center pt-20 relative" 
      data-testid="hero-section"
      style={{
        backgroundImage: 'url(/api/images/hero-bg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-8" data-testid="hero-title">
            <Logo size="large" showTagline={true} />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed px-4" data-testid="hero-description">
            A family-owned Florida insurance agency with 14 years of experience protecting thousands of clients statewide. 
            From Miami to Jacksonville, we provide comprehensive coverage tailored to your unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 mb-6">
            <motion.button 
              className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white px-10 sm:px-14 py-5 sm:py-6 rounded-full font-bold text-base sm:text-xl shadow-2xl w-full sm:w-auto group border-2 border-blue-300/50"
              onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-get-started"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 30px 60px -15px rgba(59, 130, 246, 0.7)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Animated shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              
              {/* Pulse ring animation */}
              <span className="absolute inset-0 rounded-full bg-blue-400/40 animate-ping opacity-0 group-hover:opacity-100"></span>
              
              {/* Gradient overlay on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
              
              {/* Button content */}
              <span className="relative flex items-center justify-center gap-3 font-extrabold tracking-wide">
                <House className="w-6 h-6" />
                GET PROTECTED NOW
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            <button 
              className="border-2 border-primary text-primary px-6 sm:px-8 py-4 sm:py-5 rounded-full font-semibold text-base sm:text-lg hover:bg-primary hover:text-primary-foreground transition-all w-full sm:w-auto hover:shadow-xl"
              onClick={() => document.querySelector('#insurance-sections')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-learn-more"
            >
              Learn More
            </button>
          </div>
          
          {/* Social Media Links */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-sm text-muted-foreground hidden sm:inline">Connect with us:</span>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/80 hover:bg-primary transition-all duration-300 group shadow-md hover:shadow-lg"
                data-testid="hero-social-linkedin"
              >
                <FaLinkedin className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
              </a>
              
              <a 
                href="https://www.instagram.com/insureitgroup/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/80 hover:bg-pink-600 transition-all duration-300 group shadow-md hover:shadow-lg"
                data-testid="hero-social-instagram"
              >
                <FaInstagram className="w-5 h-5 text-pink-600 group-hover:text-white transition-colors duration-300" />
              </a>
              
              <a 
                href="https://www.facebook.com/insureitgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/80 hover:bg-blue-600 transition-all duration-300 group shadow-md hover:shadow-lg"
                data-testid="hero-social-facebook"
              >
                <FaFacebook className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
