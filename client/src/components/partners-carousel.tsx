const propertyCarriers = [
  "Progressive",
  "Geico",
  "Kemper Auto",
  "Security First",
  "Trident",
  "Monarch",
  "One Alliance",
  "American Integrity",
  "Selective",
  "Slide",
  "Southern Oak",
  "Praxis",
  "Patriot Select",
  "Florida Peninsula",
  "Edison",
  "Ovation",
  "Mangrove",
  "Manatee",
];

const healthCarriers = [
  "United Health",
  "Centene",
  "Aetna Health",
  "Cigna Health",
  "Oscar",
  "Sunshine State",
];

const chipBase =
  "flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-500 dark:text-slate-400 tracking-tight transition-all duration-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary whitespace-nowrap";

function CarrierGroup({ label, carriers, chipSize }: { label: string; carriers: string[]; chipSize: string }) {
  return (
    <div>
      <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5 text-center">
        {label}
      </p>
      <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5">
        {carriers.map((name) => (
          <div
            key={name}
            className={`${chipBase} ${chipSize}`}
            data-testid={`partner-logo-${name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PartnersCarousel({ className = "" }: { className?: string }) {
  return (
    <section
      className={`py-3 sm:py-4 border-t select-none ${className || "bg-background dark:bg-slate-900 border-border"}`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-3 sm:mb-4">
          <p className="text-[9px] sm:text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-0.5">
            Trusted By The Best
          </p>
          <h3 className="text-sm sm:text-xl font-semibold text-primary">Our Carrier Partners</h3>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <CarrierGroup
            label="Auto · Home · Flood · Life"
            carriers={propertyCarriers}
            chipSize="px-1.5 sm:px-2.5 py-1 text-[9px] sm:text-xs"
          />
          <div className="border-t border-slate-200 dark:border-slate-700 mx-8" />
          <CarrierGroup
            label="Health"
            carriers={healthCarriers}
            chipSize="px-1.5 sm:px-2.5 py-1 text-[9px] sm:text-xs"
          />
        </div>
      </div>
    </section>
  );
}
