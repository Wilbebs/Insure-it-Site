import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from "react";
import Autoplay from 'embla-carousel-autoplay';
import { useTranslation } from "./theme-provider";

export default function TestimonialsCarousel() {
  const { t } = useTranslation();
  
  const testimonials = [
    { name: "Maria Garcia", location: "Miami, FL", rating: 5, text: t.testimonials.t1, insurance: t.testimonials.t1type },
    { name: "James Thompson", location: "Orlando, FL", rating: 5, text: t.testimonials.t2, insurance: t.testimonials.t2type },
    { name: "Jennifer Lee", location: "Tampa, FL", rating: 5, text: t.testimonials.t3, insurance: t.testimonials.t3type },
    { name: "Robert Martinez", location: "Jacksonville, FL", rating: 5, text: t.testimonials.t4, insurance: t.testimonials.t4type },
    { name: "Sarah Williams", location: "Fort Lauderdale, FL", rating: 5, text: t.testimonials.t5, insurance: t.testimonials.t5type },
    { name: "David Chen", location: "Tallahassee, FL", rating: 5, text: t.testimonials.t6, insurance: t.testimonials.t6type },
    { name: "Carlos Rivera", location: "Hialeah, FL", rating: 5, text: t.testimonials.t7, insurance: t.testimonials.t7type },
    { name: "Emily Santos", location: "Naples, FL", rating: 5, text: t.testimonials.t8, insurance: t.testimonials.t8type },
    { name: "Michael Brown", location: "Boca Raton, FL", rating: 5, text: t.testimonials.t9, insurance: t.testimonials.t9type },
    { name: "Patricia Nguyen", location: "Gainesville, FL", rating: 5, text: t.testimonials.t10, insurance: t.testimonials.t10type },
    { name: "Anthony Russo", location: "Palm Beach, FL", rating: 5, text: t.testimonials.t11, insurance: t.testimonials.t11type },
    { name: "Linda Morales", location: "Coral Springs, FL", rating: 5, text: t.testimonials.t12, insurance: t.testimonials.t12type },
    { name: "Ryan Cooper", location: "Sarasota, FL", rating: 5, text: t.testimonials.t13, insurance: t.testimonials.t13type },
    { name: "Diana Perez", location: "Pembroke Pines, FL", rating: 5, text: t.testimonials.t14, insurance: t.testimonials.t14type },
    { name: "Marco Hernandez", location: "Kissimmee, FL", rating: 5, text: t.testimonials.t15, insurance: t.testimonials.t15type },
    { name: "Karen O'Brien", location: "Cape Coral, FL", rating: 5, text: t.testimonials.t16, insurance: t.testimonials.t16type },
    { name: "Tyler Jackson", location: "Daytona Beach, FL", rating: 5, text: t.testimonials.t17, insurance: t.testimonials.t17type },
    { name: "Sofia Alvarez", location: "Doral, FL", rating: 5, text: t.testimonials.t18, insurance: t.testimonials.t18type },
    { name: "George & Martha Klein", location: "The Villages, FL", rating: 5, text: t.testimonials.t19, insurance: t.testimonials.t19type },
    { name: "Ashley Patel", location: "Aventura, FL", rating: 5, text: t.testimonials.t20, insurance: t.testimonials.t20type },
    { name: "Ricardo Diaz", location: "Homestead, FL", rating: 5, text: t.testimonials.t21, insurance: t.testimonials.t21type },
    { name: "Stephanie Mitchell", location: "Winter Park, FL", rating: 5, text: t.testimonials.t22, insurance: t.testimonials.t22type },
    { name: "Frank & Teresa Vasquez", location: "St. Augustine, FL", rating: 5, text: t.testimonials.t23, insurance: t.testimonials.t23type },
    { name: "Christine Marks", location: "Clearwater, FL", rating: 5, text: t.testimonials.t24, insurance: t.testimonials.t24type },
  ];
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', containScroll: false },
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
    <div className="relative max-w-7xl mx-auto px-2">
      {/* Carousel Container */}
      <div className="overflow-hidden py-3 px-3" ref={emblaRef}>
        <div className="flex -mx-2">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_50%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0 px-2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card dark:bg-slate-800 rounded-xl p-3 shadow-md h-full"
                data-testid={`testimonial-carousel-${index}`}
              >
                <div className="mb-2">
                  <h3 className="font-bold text-foreground text-xs">{testimonial.name}</h3>
                  <p className="text-[10px] text-muted-foreground">{testimonial.location}</p>
                </div>
                
                <div className="flex gap-0.5 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground text-[11px] leading-relaxed mb-2 line-clamp-4">
                  "{testimonial.text}"
                </p>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] text-primary font-semibold">
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
        aria-label={t.testimonials.prevLabel}
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-card dark:bg-slate-700 rounded-full p-2 shadow-xl hover:scale-110 transition-transform z-10"
        data-testid="carousel-next"
        aria-label={t.testimonials.nextLabel}
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex 
                ? 'w-8 bg-primary' 
                : 'w-2 bg-primary/50'
            }`}
            aria-label={`${t.testimonials.goToLabel} ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
