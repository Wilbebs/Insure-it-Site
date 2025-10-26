import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Award } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import QuoteModal from "./quote-modal";
import { useState } from "react";

export default function Hero() {
  const { ref, isVisible } = useScrollAnimation();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className="relative min-h-screen flex items-center justify-center overflow-hidden hero-section"
        data-testid="hero-section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-white"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight" data-testid="hero-title">
              insure it
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-yellow-300 font-semibold italic" data-testid="hero-tagline">
              Life's Uncertain. Your Coverage Isn't.
            </p>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto" data-testid="hero-description">
              14 years protecting <span className="text-yellow-300 font-semibold">thousands of Florida families</span> with personalized coverage and genuine care
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-full font-semibold shadow-xl hover-lift"
                onClick={() => setQuoteModalOpen(true)}
                data-testid="button-get-quote"
              >
                Get Quoted Now →
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6 rounded-full font-semibold"
                onClick={() => {
                  document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="button-explore-coverage"
              >
                Explore Coverage
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="text-lg">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6" />
                <span className="text-lg">A+ Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <span className="text-lg">Family-Owned Since 2011</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </>
  );
}