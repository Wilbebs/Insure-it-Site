import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section 
      className="min-h-screen flex items-center justify-center pt-20 relative" 
      data-testid="hero-section"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&h=1080)',
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
          <h1 className="text-6xl font-bold mb-6 gradient-text leading-tight" data-testid="hero-title">
            Professional Insurance<br />Solutions You Can Trust
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
            Protecting what matters most to you and your family with comprehensive coverage options 
            tailored to your unique needs. Experience peace of mind with Insure-it Group.
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button 
              className="bg-gradient-to-r from-blue-800 to-blue-500 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-get-started"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px -10px rgba(30, 64, 175, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                ✨ Get Insured Today ✨
              </span>
            </motion.button>
            <button 
              className="border border-primary text-primary px-8 py-4 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
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
