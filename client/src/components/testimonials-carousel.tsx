import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "./theme-provider";

const CARDS_PER_PAGE  = 4;
const TOTAL_PAGES     = 3;
const AUTO_CYCLE_MS   = 6000;
const SWIPE_THRESHOLD = 50;

export default function TestimonialsCarousel() {
  const { t } = useTranslation();

  const allTestimonials = [
    { name: "Maria Rodriguez",    location: "Jacksonville, FL",    rating: 5, text: t.testimonials.t1,  insurance: t.testimonials.t1type  },
    { name: "Carlos Perez",       location: "Miami, FL",           rating: 5, text: t.testimonials.t2,  insurance: t.testimonials.t2type  },
    { name: "Ana Gomez",          location: "Tampa, FL",           rating: 5, text: t.testimonials.t3,  insurance: t.testimonials.t3type  },
    { name: "Luis Castillo",      location: "Orlando, FL",         rating: 5, text: t.testimonials.t4,  insurance: t.testimonials.t4type  },
    { name: "Rosa Martins",       location: "Hialeah, FL",         rating: 5, text: t.testimonials.t5,  insurance: t.testimonials.t5type  },
    { name: "Jorge Ramirez",      location: "Fort Lauderdale, FL", rating: 5, text: t.testimonials.t6,  insurance: t.testimonials.t6type  },
    { name: "Sofia Morales",      location: "Coral Springs, FL",   rating: 5, text: t.testimonials.t7,  insurance: t.testimonials.t7type  },
    { name: "Andres Vargas",      location: "Naples, FL",          rating: 5, text: t.testimonials.t8,  insurance: t.testimonials.t8type  },
    { name: "Carmen Lopez",       location: "Jacksonville, FL",    rating: 5, text: t.testimonials.t9,  insurance: t.testimonials.t9type  },
    { name: "Marc Jean-Baptiste", location: "Miami, FL",           rating: 5, text: t.testimonials.t10, insurance: t.testimonials.t10type },
    { name: "Sophia Pierre",      location: "Palm Beach, FL",      rating: 5, text: t.testimonials.t11, insurance: t.testimonials.t11type },
    { name: "David Hayes",        location: "St. Johns, FL",       rating: 5, text: t.testimonials.t12, insurance: t.testimonials.t12type },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [direction,   setDirection]   = useState(1);
  const [isDragging,  setIsDragging]  = useState(false);
  const [dragOffset,  setDragOffset]  = useState(0);

  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef      = useRef(false);
  const dragStartX     = useRef<number | null>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;

  const pageSlice = (page: number) =>
    allTestimonials.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const prevPage = (currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES;
  const nextPage = (currentPage + 1) % TOTAL_PAGES;

  const goTo = useCallback((page: number, dir: number) => {
    setDirection(dir);
    setCurrentPage(page);
  }, []);

  const next = useCallback(() => goTo((currentPageRef.current + 1) % TOTAL_PAGES, 1),  [goTo]);
  const prev = useCallback(() => goTo((currentPageRef.current - 1 + TOTAL_PAGES) % TOTAL_PAGES, -1), [goTo]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => { if (!pausedRef.current) next(); }, AUTO_CYCLE_MS);
  }, [next]);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  const handlePrev = () => { prev(); startInterval(); };
  const handleNext = () => { next(); startInterval(); };
  const handleDot  = (i: number) => { goTo(i, i > currentPageRef.current ? 1 : -1); startInterval(); };

  const onDragStart = useCallback((clientX: number) => {
    dragStartX.current = clientX;
    pausedRef.current  = true;
    setIsDragging(true);
    setDragOffset(0);
  }, []);

  const onDragMove = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    setDragOffset(clientX - dragStartX.current);
  }, []);

  const onDragEnd = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - clientX;
    dragStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      delta > 0 ? next() : prev();
    }
    pausedRef.current = false;
    startInterval();
  }, [next, prev, startInterval]);

  const onMouseDown  = (e: React.MouseEvent) => { e.preventDefault(); onDragStart(e.clientX); };
  const onMouseMove  = (e: React.MouseEvent) => onDragMove(e.clientX);
  const onMouseUp    = (e: React.MouseEvent) => onDragEnd(e.clientX);
  const onMouseLeave = (e: React.MouseEvent) => { if (dragStartX.current !== null) onDragEnd(e.clientX); };

  const onTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientX);
  const onTouchMove  = (e: React.TouchEvent) => { e.preventDefault(); onDragMove(e.touches[0].clientX); };
  const onTouchEnd   = (e: React.TouchEvent) => onDragEnd(e.changedTouches[0].clientX);

  const containerW  = containerRef.current?.offsetWidth ?? 600;
  const dragRatio   = Math.min(1, Math.abs(dragOffset) / (containerW * 0.5));
  const adjacentOpacity = isDragging ? dragRatio * 0.85 : 0;

  const variants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ?  60 : -60 }),
    center:              () => ({ opacity: 1, x: 0 }),
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 :  60 }),
  };

  const PageGrid = ({ testimonials }: { testimonials: typeof allTestimonials }) => (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-lg border border-white/80 flex flex-col"
        >
          <div className="mb-1.5 sm:mb-2">
            <h3 className="font-bold text-slate-800 text-[11px] sm:text-sm leading-tight">
              {testimonial.name}
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-500">{testimonial.location}</p>
          </div>
          <div className="flex gap-0.5 mb-1.5 sm:mb-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p
            className="text-slate-600 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-3 flex-1"
            style={{ userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }}
          >
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <div className="pt-1.5 sm:pt-2 border-t border-slate-200">
            <p className="text-[9px] sm:text-[11px] text-primary font-semibold">
              {testimonial.insurance}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="max-w-5xl mx-auto"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Header row */}
      <div className="flex items-end justify-between mb-3 px-1">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold mb-1">
            {t.testimonials.subtitle}
          </p>
          <h2 className="text-xl font-bold text-white">{t.testimonials.title}</h2>
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

      {/* Clip container */}
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Adjacent slide: PREV — peeks in from the left when dragging right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateX(calc(-100% + ${dragOffset}px))`,
            opacity: dragOffset > 0 ? adjacentOpacity : 0,
            transition: isDragging ? "none" : "opacity 0.25s ease, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <PageGrid testimonials={pageSlice(prevPage)} />
        </div>

        {/* Current page — follows the drag */}
        <div
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
            pointerEvents: isDragging ? "none" : "auto",
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
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              <PageGrid testimonials={pageSlice(currentPage)} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Adjacent slide: NEXT — peeks in from the right when dragging left */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateX(calc(100% + ${dragOffset}px))`,
            opacity: dragOffset < 0 ? adjacentOpacity : 0,
            transition: isDragging ? "none" : "opacity 0.25s ease, transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <PageGrid testimonials={pageSlice(nextPage)} />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            className={`h-2 rounded-full transition-all duration-300 min-w-[8px] ${
              i === currentPage
                ? "w-6 sm:w-7 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`${t.testimonials.goToLabel} ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
