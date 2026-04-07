import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "./theme-provider";

const CARDS_PER_PAGE  = 4;
const TOTAL_PAGES     = 3;
const AUTO_CYCLE_MS   = 6000;
const SWIPE_THRESHOLD = 30;   // px to trigger page change
const TRANSITION_MS   = 300;  // must match CSS transition duration

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

  const [currentPage,    setCurrentPage]    = useState(0);
  const [dragOffset,     setDragOffset]     = useState(0);
  const [animated,       setAnimated]       = useState(true);  // enable CSS transition
  const [containerWidth, setContainerWidth] = useState(0);

  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef      = useRef(false);
  const animatingRef   = useRef(false);           // block new drags during commit animation
  const dragStartX     = useRef<number | null>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(currentPage);
  currentPageRef.current = currentPage;
  const containerWRef  = useRef(containerWidth);
  containerWRef.current = containerWidth;

  // Measure container width
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const pageSlice = (page: number) =>
    allTestimonials.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const prevPage = (currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES;
  const nextPage = (currentPage + 1) % TOTAL_PAGES;

  const startInterval = useCallback((customNext?: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current || animatingRef.current) return;
      if (customNext) customNext(); else {
        const cw = containerWRef.current;
        if (cw <= 0) return;
        animatingRef.current = true;
        setAnimated(true);
        setDragOffset(-(cw + 15));
        setTimeout(() => {
          setAnimated(false);
          setCurrentPage(p => (p + 1) % TOTAL_PAGES);
          setDragOffset(0);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            setAnimated(true);
            animatingRef.current = false;
          }));
        }, TRANSITION_MS);
      }
    }, AUTO_CYCLE_MS);
  }, []);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  // Commit to a direction: +1 = next, -1 = prev
  const commitPage = useCallback((dir: 1 | -1) => {
    const cw = containerWRef.current;
    if (cw <= 0 || animatingRef.current) return;
    animatingRef.current = true;
    pausedRef.current    = true;

    // 1. Animate slide to its final resting position (gap of 15px between slides)
    setAnimated(true);
    setDragOffset(dir === 1 ? -(cw + 15) : (cw + 15));

    // 2. After animation: silently swap page, reset position, re-enable transitions
    setTimeout(() => {
      setAnimated(false);
      setCurrentPage(p => dir === 1
        ? (p + 1) % TOTAL_PAGES
        : (p - 1 + TOTAL_PAGES) % TOTAL_PAGES
      );
      setDragOffset(0);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setAnimated(true);
        animatingRef.current = false;
        pausedRef.current    = false;
        startInterval();
      }));
    }, TRANSITION_MS);
  }, [startInterval]);

  const handlePrev = () => { if (!animatingRef.current) commitPage(-1); };
  const handleNext = () => { if (!animatingRef.current) commitPage(1); };
  const handleDot  = (i: number) => {
    if (animatingRef.current) return;
    commitPage(i > currentPageRef.current ? 1 : -1);
  };

  const onDragStart = useCallback((clientX: number) => {
    if (animatingRef.current) return;
    dragStartX.current = clientX;
    pausedRef.current  = true;
    setAnimated(false);  // disable transition during live drag
  }, []);

  const onDragMove = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    setDragOffset(clientX - dragStartX.current);
  }, []);

  const onDragEnd = useCallback((clientX: number) => {
    if (dragStartX.current === null) return;
    const delta = dragStartX.current - clientX;   // positive = dragged left = go next
    dragStartX.current = null;

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      // Let commitPage handle the rest from the current dragOffset position
      commitPage(delta > 0 ? 1 : -1);
    } else {
      // Snap back
      setAnimated(true);
      setDragOffset(0);
      pausedRef.current = false;
      startInterval();
    }
  }, [commitPage, startInterval]);

  const onMouseDown  = (e: React.MouseEvent) => { e.preventDefault(); onDragStart(e.clientX); };
  const onMouseMove  = (e: React.MouseEvent) => { if (dragStartX.current !== null) onDragMove(e.clientX); };
  const onMouseUp    = (e: React.MouseEvent) => { if (dragStartX.current !== null) onDragEnd(e.clientX); };
  const onMouseLeave = (e: React.MouseEvent) => { if (dragStartX.current !== null) onDragEnd(e.clientX); };

  const onTouchStart = (e: React.TouchEvent) => onDragStart(e.touches[0].clientX);
  const onTouchMove  = (e: React.TouchEvent) => { e.preventDefault(); onDragMove(e.touches[0].clientX); };
  const onTouchEnd   = (e: React.TouchEvent) => onDragEnd(e.changedTouches[0].clientX);

  const isDragging = dragStartX.current !== null;

  const transition = animated
    ? `transform ${TRANSITION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
    : "none";

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
            aria-label={t.testimonials.prevLabel}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>
          <button
            onClick={handleNext}
            className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] flex items-center justify-center border border-white/50"
            aria-label={t.testimonials.nextLabel}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/*
        Track: relative container clips overflowing adjacent slides.
        Three divs sit side-by-side:
          prev   at x = -(containerWidth - dragOffset) → starts fully off-screen left
          current at x = dragOffset
          next   at x = +(containerWidth + dragOffset) → starts fully off-screen right
        All share the same dragOffset, so they move together like a solid track.
      */}
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
        style={{ touchAction: "pan-y" }}
      >
        {/* Prev — off-screen left, moves right on drag */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateX(${-containerWidth - 15 + dragOffset}px)`,
            transition,
          }}
        >
          <PageGrid testimonials={pageSlice(prevPage)} />
        </div>

        {/* Current — in document flow (sets container height), follows drag */}
        <div
          style={{
            transform: `translateX(${dragOffset}px)`,
            transition,
            pointerEvents: isDragging ? "none" : "auto",
          }}
        >
          <PageGrid testimonials={pageSlice(currentPage)} />
        </div>

        {/* Next — off-screen right, moves left on drag */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translateX(${containerWidth + 15 + dragOffset}px)`,
            transition,
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
