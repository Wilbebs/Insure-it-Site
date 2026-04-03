const partners = [
  { name: "Progressive",    logo: "Progressive"    },
  { name: "Allstate",       logo: "Allstate"       },
  { name: "State Farm",     logo: "State Farm"     },
  { name: "Geico",          logo: "GEICO"          },
  { name: "Liberty Mutual", logo: "Liberty Mutual" },
  { name: "Nationwide",     logo: "Nationwide"     },
  { name: "Travelers",      logo: "Travelers"      },
  { name: "USAA",           logo: "USAA"           },
  { name: "Farmers",        logo: "Farmers"        },
  { name: "American Family",logo: "American Family"},
];

const chipBase = "flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400 tracking-tight transition-all duration-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary";

export default function PartnersCarousel({ className = "" }: { className?: string }) {
  return (
    <section className={`py-3 sm:py-4 border-t select-none ${className || "bg-background dark:bg-slate-900 border-border"}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-2 sm:mb-4">
          <p className="text-[9px] sm:text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">Trusted By The Best</p>
          <h3 className="text-sm sm:text-xl font-semibold text-primary">Our Carrier Partners</h3>
        </div>

        {/* Mobile: 3×3 grid (first 9) */}
        <div className="sm:hidden grid grid-cols-3 gap-1.5">
          {partners.slice(0, 9).map((p) => (
            <div
              key={p.name}
              className={`${chipBase} px-1 py-1 text-[10px]`}
              data-testid={`partner-logo-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {p.logo}
            </div>
          ))}
        </div>

        {/* Desktop: single centered row that wraps */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2.5">
          {partners.map((p) => (
            <div
              key={p.name}
              className={`${chipBase} px-5 py-2.5 text-base`}
              data-testid={`partner-logo-${p.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {p.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
