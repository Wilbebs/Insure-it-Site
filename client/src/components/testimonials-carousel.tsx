import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    name: "Maria Garcia",
    location: "Miami, FL",
    rating: 5,
    text: "Switching to Insure-it Group was the best decision for our family. They found us better coverage at a lower price, and the personal service is unmatched. Highly recommend!",
    insurance: "Auto & Home Insurance"
  },
  {
    name: "James Thompson",
    location: "Orlando, FL",
    rating: 5,
    text: "After my accident, Insure-it Group made the claims process so easy. They handled everything and kept me informed every step of the way. True professionals who actually care.",
    insurance: "Auto Insurance"
  },
  {
    name: "Jennifer Lee",
    location: "Tampa, FL",
    rating: 5,
    text: "As a small business owner, finding the right commercial insurance was challenging until I met the team at Insure-it. They took time to understand my needs and got me excellent coverage.",
    insurance: "Commercial Insurance"
  },
  {
    name: "Robert Martinez",
    location: "Jacksonville, FL",
    rating: 5,
    text: "I've been with Insure-it Group for 8 years now. They've always been there when I needed them, and their rates are incredibly competitive. A truly family-oriented company.",
    insurance: "Life & Health Insurance"
  },
  {
    name: "Sarah Williams",
    location: "Fort Lauderdale, FL",
    rating: 5,
    text: "When Hurricane season hit, Insure-it Group was proactive in reviewing my home coverage. Their attention to detail gave me peace of mind during a stressful time. Grateful for their service!",
    insurance: "Home Insurance"
  },
  {
    name: "David Chen",
    location: "Tallahassee, FL",
    rating: 5,
    text: "The team helped me understand all my life insurance options without any pressure. They made sure I got the right policy for my family's future. Can't thank them enough!",
    insurance: "Life Insurance"
  }
];

export default function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Carousel Container */}
      <div className="overflow-hidden pb-4" ref={emblaRef}>
        <div className="flex pb-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card dark:bg-slate-800 rounded-3xl p-6 shadow-xl h-full"
                data-testid={`testimonial-carousel-${index}`}
              >
                <div className="mb-4">
                  <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    {testimonial.insurance}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-card dark:bg-slate-700 rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
        data-testid="carousel-prev"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-card dark:bg-slate-700 rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
        data-testid="carousel-next"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-primary/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
