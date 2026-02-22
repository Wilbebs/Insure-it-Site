import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
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
    { name: "Angela Rivera", location: "Naples, FL", rating: 5, text: t.testimonials.t7, insurance: t.testimonials.t7type },
    { name: "Michael Brooks", location: "Gainesville, FL", rating: 5, text: t.testimonials.t8, insurance: t.testimonials.t8type },
    { name: "Patricia Nguyen", location: "Sarasota, FL", rating: 5, text: t.testimonials.t9, insurance: t.testimonials.t9type },
    { name: "Carlos Mendez", location: "Kissimmee, FL", rating: 5, text: t.testimonials.t10, insurance: t.testimonials.t10type },
    { name: "Lisa Patterson", location: "Boca Raton, FL", rating: 5, text: t.testimonials.t11, insurance: t.testimonials.t11type },
    { name: "Thomas Wright", location: "St. Augustine, FL", rating: 5, text: t.testimonials.t12, insurance: t.testimonials.t12type },
  ];

  const totalPages = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const getCurrentCards = useCallback(() => {
    const start = currentPage * 4;
    return testimonials.slice(start, start + 4);
  }, [currentPage, testimonials]);

  const goToPage = useCallback((page: number) => {
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  }, [currentPage]);

  const scrollPrev = useCallback(() => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, []);

  const scrollNext = useCallback(() => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  const avatarColors = [
    "from-sky-400 to-blue-500",
    "from-blue-500 to-indigo-500",
    "from-indigo-400 to-violet-500",
    "from-violet-400 to-purple-500",
  ];

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {getCurrentCards().map((testimonial, index) => (
              <motion.div
                key={`${currentPage}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group relative bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                data-testid={`testimonial-card-${currentPage * 4 + index}`}
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/8 group-hover:text-primary/15 transition-colors" />

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % 4]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {getInitials(testimonial.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-primary/70">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex gap-0.5 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-3">
                  "{testimonial.text}"
                </p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-primary">{testimonial.insurance}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? "w-8 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`${t.testimonials.goToLabel} ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            data-testid="carousel-prev"
            aria-label={t.testimonials.prevLabel}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollNext}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            data-testid="carousel-next"
            aria-label={t.testimonials.nextLabel}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
