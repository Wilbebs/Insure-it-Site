import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";
import Autoplay from 'embla-carousel-autoplay';

const testimonials = [
  {
    name: "Maria Garcia",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "Switching to Insure-it Group was the best decision for our family. They found us better coverage at a lower price, and the personal service is unmatched. Highly recommend!",
    insurance: "Auto & Home Insurance"
  },
  {
    name: "James Thompson",
    location: "Orlando, FL",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "After my accident, Insure-it Group made the claims process so easy. They handled everything and kept me informed every step of the way. True professionals who actually care.",
    insurance: "Auto Insurance"
  },
  {
    name: "Jennifer Lee",
    location: "Tampa, FL",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "As a small business owner, finding the right commercial insurance was challenging until I met the team at Insure-it. They took time to understand my needs and got me excellent coverage.",
    insurance: "Commercial Insurance"
  },
  {
    name: "Robert Martinez",
    location: "Jacksonville, FL",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "I've been with Insure-it Group for 8 years now. They've always been there when I needed them, and their rates are incredibly competitive. A truly family-oriented company.",
    insurance: "Life & Health Insurance"
  },
  {
    name: "Sarah Williams",
    location: "Fort Lauderdale, FL",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    rating: 5,
    text: "When Hurricane season hit, Insure-it Group was proactive in reviewing my home coverage. Their attention to detail gave me peace of mind during a stressful time. Grateful for their service!",
    insurance: "Home Insurance"
  },
  {
    name: "David Chen",
    location: "Tallahassee, FL",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
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
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
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
                className="bg-white rounded-3xl p-6 shadow-xl h-full"
                data-testid={`testimonial-carousel-${index}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-xs text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-blue-600 font-semibold">
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
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
        data-testid="carousel-prev"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
        data-testid="carousel-next"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex 
                ? 'w-8 bg-white' 
                : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
