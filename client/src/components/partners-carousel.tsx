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

export default function PartnersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

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
    <section className="py-12 bg-background dark:bg-slate-900 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-primary">
            Our Partners
          </h3>
        </div>

        <div 
          ref={scrollRef}
          className="flex overflow-hidden gap-12 items-center"
          style={{ scrollBehavior: 'auto' }}
        >
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 px-6"
              data-testid={`partner-logo-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="text-2xl md:text-3xl font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap tracking-tight opacity-70 hover:opacity-100 transition-opacity">
                {partner.logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
