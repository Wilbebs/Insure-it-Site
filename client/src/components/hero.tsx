import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20" data-testid="hero-section">
      <div className="container mx-auto px-6 text-center">
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
            <button 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-all hover-lift"
              onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-get-started"
            >
              Get Started Today
            </button>
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
