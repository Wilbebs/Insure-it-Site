import { useState } from "react";
import { ChevronDown, Car, Home, Droplets, Heart, Stethoscope } from "lucide-react";

const categories = [
  {
    id: "auto",
    label: "Auto",
    icon: Car,
    carriers: ["Progressive", "Geico", "Kemper Auto", "Selective", "Trident"],
  },
  {
    id: "home",
    label: "Home",
    icon: Home,
    carriers: [
      "Security First", "Monarch", "One Alliance", "American Integrity",
      "Slide", "Southern Oak", "Praxis", "Patriot Select",
      "Florida Peninsula", "Edison", "Ovation", "Mangrove",
      "Manatee", "Progressive", "Geico",
    ],
  },
  {
    id: "flood",
    label: "Flood",
    icon: Droplets,
    carriers: ["Security First", "American Integrity", "Florida Peninsula", "Mangrove", "Trident", "Slide"],
  },
  {
    id: "life",
    label: "Life",
    icon: Heart,
    carriers: ["Selective"],
  },
  {
    id: "health",
    label: "Health",
    icon: Stethoscope,
    carriers: ["United Health", "Centene", "Aetna Health", "Cigna Health", "Oscar", "Sunshine State"],
  },
];

const chipBase =
  "inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400 tracking-tight text-[9px] sm:text-[11px] px-2 sm:px-3 py-0.5 sm:py-1 whitespace-nowrap";

export default function PartnersCarousel({ className = "" }: { className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section
      className={`py-3 sm:py-4 border-t select-none ${className || "bg-background dark:bg-slate-900 border-border"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-3">
          <p className="text-[9px] sm:text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">
            Trusted By The Best
          </p>
          <h3 className="text-sm sm:text-xl font-semibold text-primary">Our Carrier Partners</h3>
        </div>

        {/* Accordion rows */}
        <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          {categories.map((cat) => {
            const isOpen = openId === cat.id;
            const Icon = cat.icon;
            return (
              <div key={cat.id}>
                <button
                  onClick={() => toggle(cat.id)}
                  className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-left transition-colors duration-150 ${
                    isOpen
                      ? "bg-primary/5 dark:bg-primary/10"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 transition-colors ${isOpen ? "text-primary" : "text-slate-400"}`}
                    />
                    <span className={`text-[11px] sm:text-sm font-semibold transition-colors ${isOpen ? "text-primary" : "text-slate-600 dark:text-slate-300"}`}>
                      {cat.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-normal">
                      {cat.carriers.length} carrier{cat.carriers.length !== 1 ? "s" : ""}
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>

                {/* Expandable carrier chips */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-1 sm:gap-1.5">
                    {cat.carriers.map((name) => (
                      <span key={name} className={chipBase}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
