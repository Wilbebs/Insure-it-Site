import { useRef, useEffect } from "react";

const allCarriers = [
  "Progressive", "Geico", "Kemper Auto", "Security First",
  "Trident", "Monarch", "One Alliance", "American Integrity",
  "Selective", "Slide", "Southern Oak", "Praxis",
  "Patriot Select", "Florida Peninsula", "Edison", "Ovation",
  "Mangrove", "Manatee", "United Health", "Centene",
  "Aetna Health", "Cigna Health", "Oscar", "Sunshine State",
];

const chipBase =
  "flex-shrink-0 inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400 tracking-tight text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-1.5 mx-1 sm:mx-1.5 whitespace-nowrap shadow-sm cursor-grab active:cursor-grabbing";

const AUTO_SPEED = 0.5;
const FRICTION = 0.94;

export default function PartnersCarousel({ className = "" }: { className?: string }) {
  const doubled = [...allCarriers, ...allCarriers];

  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const track = trackRef.current;
      if (!track) { rafRef.current = requestAnimationFrame(tick); return; }

      const halfWidth = track.scrollWidth / 2;
      if (halfWidth === 0) { rafRef.current = requestAnimationFrame(tick); return; }

      if (!isDragging.current) {
        velocity.current *= FRICTION;
        posRef.current += AUTO_SPEED + velocity.current;
      }

      // Seamless wrap
      if (posRef.current >= halfWidth) posRef.current -= halfWidth;
      if (posRef.current < 0) posRef.current += halfWidth;

      track.style.transform = `translateX(-${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = lastX.current - e.clientX;
    velocity.current = dx;
    const track = trackRef.current;
    if (track) {
      const halfWidth = track.scrollWidth / 2;
      posRef.current += dx;
      if (posRef.current >= halfWidth) posRef.current -= halfWidth;
      if (posRef.current < 0) posRef.current += halfWidth;
    }
    lastX.current = e.clientX;
  };

  const onPointerUp = () => { isDragging.current = false; };

  return (
    <section
      className={`py-3 sm:py-4 border-t select-none ${className || "bg-background dark:bg-slate-900 border-border"}`}
    >
      {/* Header */}
      <div className="text-center mb-2.5 sm:mb-3 px-4">
        <p className="text-[9px] sm:text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">
          Trusted By The Best
        </p>
        <h3 className="text-sm sm:text-xl font-semibold text-primary">Our Carrier Partners</h3>
      </div>

      {/* Track wrapper — edge-fade mask */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div ref={trackRef} className="flex items-center will-change-transform">
          {doubled.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className={chipBase}
              data-testid={i < allCarriers.length ? `partner-logo-${name.toLowerCase().replace(/\s+/g, "-")}` : undefined}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
