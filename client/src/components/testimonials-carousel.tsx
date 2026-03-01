import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "./theme-provider";

const CARDS_PER_PAGE = 4;
const TOTAL_PAGES = 3;
const AUTO_CYCLE_MS = 6000;

export default function TestimonialsCarousel() {
  const { t } = useTranslation();

  const allTestimonials = [
    { name: "Maria Garcia",    location: "Miami, FL",           rating: 5, text: t.testimonials.t1,  insurance: t.testimonials.t1type  },
    { name: "James Thompson",  location: "Orlando, FL",          rating: 5, text: t.testimonials.t2,  insurance: t.testimonials.t2type  },
    { name: "Jennifer Lee",    location: "Tampa, FL",            rating: 5, text: t.testimonials.t3,  insurance: t.testimonials.t3type  },
    { name: "Robert Martinez", location: "Jacksonville, FL",     rating: 5, text: t.testimonials.t4,  insurance: t.testimonials.t4type  },
    { name: "Sarah Williams",  location: "Fort Lauderdale, FL",  rating: 5, text: t.testimonials.t5,  insurance: t.testimonials.t5type  },
    { name: "David Chen",      location: "Tallahassee, FL",      rating: 5, text: t.testimonials.t6,  insurance: t.testimonials.t6type  },
    { name: "Carlos Rivera",   location: "Hialeah, FL",          rating: 5, text: t.testimonials.t7,  insurance: t.testimonials.t7type  },
    { name: "Emily Santos",    location: "Naples, FL",           rating: 5, text: t.testimonials.t8,  insurance: t.testimonials.t8type  },
    { name: "Michael Brown",   location: "Boca Raton, FL",       rating: 5, text: t.testimonials.t9,  insurance: t.testimonials.t9type  },
    { name: "Patricia Nguyen", location: "Gainesville, FL",      rating: 5, text: t.testimonials.t10, insurance: t.testimonials.t10type },
    { name: "Anthony Russo",   location: "Palm Beach, FL",       rating: 5, text: t.testimonials.t11, insurance: t.testimonials.t11type },
    { name: "Linda Morales",   location: "Coral Springs, FL",    rating: 5, text: t.testimonials.t12, insurance: t.testimonials.t12type },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goTo = useCallback((page: number, dir: number) => {
    setDirection(dir);
    setCurrentPage(page);
  }, []);

  const next = useCallback(() => {
    goTo((currentPage + 1) % TOTAL_PAGES, 1);
  }, [currentPage, goTo]);

  const prev = useCallback(() => {
    goTo((currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES, -1);
  }, [currentPage, goTo]);

  useEffect(() => {
    intervalRef.current = setInterval(next, AUTO_CYCLE_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [next]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, AUTO_CYCLE_MS);
  }, [next]);

  const handlePrev = () => { prev(); resetTimer(); };
  const handleNext = () => { next(); resetTimer(); };
  const handleDot = (i: number) => { goTo(i, i > currentPage ? 1 : -1); resetTimer(); };

  const pageTestimonials = allTestimonials.slice(
    currentPage * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE
  );

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -50 : 50 }),
  };

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header row: title top-left, nav arrows top-right */}
      <div className="flex items-end justify-between mb-4 sm:mb-5 px-1">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1 select-none">
            {t.testimonials.subtitle}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow select-none">
            {t.testimonials.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 pb-1">
          <button
            onClick={handlePrev}
            className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center border border-white/50"
            data-testid="carousel-prev"
            aria-label={t.testimonials.prevLabel}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>
          <button
            onClick={handleNext}
            className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center border border-white/50"
            data-testid="carousel-next"
            aria-label={t.testimonials.nextLabel}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* 2×2 grid — always 2 columns, 2 rows */}
      <div
        className="overflow-hidden"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchEndX.current = null; }}
        onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
        onTouchEnd={() => {
          if (touchStartX.current === null || touchEndX.current === null) return;
          const delta = touchStartX.current - touchEndX.current;
          if (Math.abs(delta) > 40) { delta > 0 ? handleNext() : handlePrev(); }
          touchStartX.current = null;
          touchEndX.current = null;
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`page-${currentPage}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: "easeInOut" }}
            className="grid grid-cols-2 gap-2.5 sm:gap-4"
          >
            {pageTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-lg border border-white/80 flex flex-col"
                data-testid={`testimonial-carousel-${currentPage * CARDS_PER_PAGE + index}`}
              >
                {/* Name + location */}
                <div className="mb-1.5 sm:mb-2">
                  <h3 className="font-bold text-slate-800 text-[11px] sm:text-sm leading-tight">
                    {testimonial.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">{testimonial.location}</p>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-1.5 sm:mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-600 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-4 flex-1">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Insurance type tag */}
                <div className="pt-1.5 sm:pt-2 border-t border-slate-200">
                  <p className="text-[9px] sm:text-[11px] text-primary font-semibold">
                    {testimonial.insurance}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4 sm:mt-5">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={`h-2 rounded-full transition-all duration-300 min-w-[8px] ${
              i === currentPage ? "w-6 sm:w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`${t.testimonials.goToLabel} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
