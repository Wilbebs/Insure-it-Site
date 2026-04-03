import { useState } from "react";

const tabs = [
  {
    id: "property",
    label: "Auto & Home",
    carriers: [
      "Progressive", "Geico", "Kemper Auto", "Security First",
      "Trident", "Monarch", "One Alliance", "American Integrity",
      "Selective", "Slide", "Southern Oak", "Praxis",
      "Patriot Select", "Florida Peninsula", "Edison", "Ovation",
      "Mangrove", "Manatee",
    ],
  },
  {
    id: "health",
    label: "Health",
    carriers: [
      "United Health", "Centene", "Aetna Health",
      "Cigna Health", "Oscar", "Sunshine State",
    ],
  },
];

const chipBase =
  "flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400 tracking-tight transition-all duration-200 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary whitespace-nowrap px-2 sm:px-3 py-1 text-[9px] sm:text-[11px]";

export default function PartnersCarousel({ className = "" }: { className?: string }) {
  const [activeTab, setActiveTab] = useState("property");
  const current = tabs.find((t) => t.id === activeTab)!;

  return (
    <section
      className={`py-3 sm:py-4 border-t select-none ${className || "bg-background dark:bg-slate-900 border-border"}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-2.5 sm:mb-3">
          <p className="text-[9px] sm:text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">
            Trusted By The Best
          </p>
          <h3 className="text-sm sm:text-xl font-semibold text-primary">Our Carrier Partners</h3>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Carrier chips */}
        <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 min-h-[52px] sm:min-h-[60px]">
          {current.carriers.map((name) => (
            <div
              key={name}
              className={chipBase}
              data-testid={`partner-logo-${name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
