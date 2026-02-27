import { useEffect, useRef } from "react";

const partners = [
  { name: "Progressive", logo: "Progressive" },
  { name: "Allstate", logo: "Allstate" },
  { name: "State Farm", logo: "State Farm" },
  { name: "Geico", logo: "GEICO" },
  { name: "Liberty Mutual", logo: "Liberty Mutual" },
  { name: "Nationwide", logo: "Nationwide" },
  { name: "Travelers", logo: "Travelers" },
  { name: "USAA", logo: "USAA" },
  { name: "Farmers", logo: "Farmers" },
  { name: "American Family", logo: "American Family" },
];

export default function PartnersCarousel({ className = "" }: { className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.165;

    const scroll = () => {
      scrollPos += speed;
      if (scrollPos >= scrollContainer.scrollWidth / 2) {
        scrollPos = 0;
      }
      scrollContainer.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className={`py-3 sm:py-4 border-t select-none ${className || "bg-background dark:bg-slate-900 border-border"}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Trusted By The Best</p>
          <h3 className="text-lg sm:text-xl font-semibold text-primary">
            Our Carrier Partners
          </h3>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-hidden gap-4 sm:gap-6 items-center"
          style={{ scrollBehavior: 'auto' }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0"
              data-testid={`partner-logo-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="inline-block px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm sm:text-base md:text-lg font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap tracking-tight border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary transition-all duration-300">
                {partner.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
