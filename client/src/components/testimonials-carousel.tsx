import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "./theme-provider";

export default function TestimonialsCarousel() {
  const { t } = useTranslation();

  const allTestimonials = [
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
  ];

  const CARDS_PER_PAGE_DESKTOP = 4;
  const CARDS_PER_PAGE_MOBILE = 2;
  const TOTAL_PAGES_DESKTOP = Math.ceil(allTestimonials.length / CARDS_PER_PAGE_DESKTOP);
  const TOTAL_PAGES_MOBILE = Math.ceil(allTestimonials.length / CARDS_PER_PAGE_MOBILE);

  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const totalPages = isMobile ? TOTAL_PAGES_MOBILE : TOTAL_PAGES_DESKTOP;
  const cardsPerPage = isMobile ? CARDS_PER_PAGE_MOBILE : CARDS_PER_PAGE_DESKTOP;

  const goTo = useCallback((page: number, dir: number) => {
    setDirection(dir);
    setCurrentPage(page);
  }, []);

  const next = useCallback(() => {
    goTo((currentPage + 1) % totalPages, 1);
  }, [currentPage, totalPages, goTo]);

  const prev = useCallback(() => {
    goTo((currentPage - 1 + totalPages) % totalPages, -1);
  }, [currentPage, totalPages, goTo]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 20000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 20000);
  }, [next]);

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };
  const handleDot = (i: number) => { goTo(i, i > currentPage ? 1 : -1); resetTimer(); };

  const pageTestimonials = allTestimonials.slice(
    currentPage * cardsPerPage,
    currentPage * cardsPerPage + cardsPerPage
  );

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Card grid with prev/next flanking */}
      <div className="relative">
        {/* Prev button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-5 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-full shadow-xl hover:scale-110 transition-transform z-10 min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/50 dark:border-slate-600/50"
          data-testid="carousel-prev"
          aria-label={t.testimonials.prevLabel}
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* Animated page of cards */}
        <div className="overflow-hidden px-6 sm:px-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`page-${currentPage}-${isMobile}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {pageTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/82 dark:bg-slate-800/82 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/60 dark:border-slate-700/60"
                  data-testid={`testimonial-carousel-${currentPage * cardsPerPage + index}`}
                >
                  <div className="mb-2">
                    <h3 className="font-bold text-foreground text-sm">{testimonial.name}</h3>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>

                  <div className="flex gap-0.5 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed mb-3 line-clamp-4">
                    "{testimonial.text}"
                  </p>

                  <div className="pt-2 border-t border-border">
                    <p className="text-[11px] text-primary font-semibold">
                      {testimonial.insurance}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-5 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-full shadow-xl hover:scale-110 transition-transform z-10 min-w-[44px] min-h-[44px] flex items-center justify-center border border-white/50 dark:border-slate-600/50"
          data-testid="carousel-next"
          aria-label={t.testimonials.nextLabel}
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={`h-2.5 rounded-full transition-all min-w-[10px] ${
              i === currentPage
                ? "w-8 bg-primary"
                : "w-2.5 bg-primary/40"
            }`}
            aria-label={`${t.testimonials.goToLabel} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
