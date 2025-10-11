import { motion } from "framer-motion";

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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text leading-tight" data-testid="hero-title">
            Professional Insurance<br className="hidden sm:inline" />
            <span className="sm:hidden">Solutions </span>
            <span className="hidden sm:inline">Solutions </span>You Can Trust
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed px-4" data-testid="hero-description">
            A family-owned Florida insurance agency with 14 years of experience protecting thousands of clients statewide. 
            From Miami to Jacksonville, we provide comprehensive coverage tailored to your unique needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <motion.button 
              className="relative overflow-hidden bg-gradient-to-r from-blue-800 to-blue-500 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg shadow-xl transition-all duration-300 w-full sm:w-auto group"
              onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-get-started"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ 
                scale: 1.08,
                boxShadow: "0 25px 50px -12px rgba(30, 64, 175, 0.5)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center justify-center gap-2">
                ✨ Get Insured Today ✨
              </span>
            </motion.button>
            <button 
              className="border border-primary text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all w-full sm:w-auto"
              onClick={() => document.querySelector('#insurance-sections')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-learn-more"
            >
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
