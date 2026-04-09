"use client";

import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import PartnersCarousel from "@/components/partners-carousel";
import QuoteModal from "@/components/quote-modal";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useDragControls,
  animate as animateValue,
} from "framer-motion";
import {
  Car,
  HeartPulse,
  Waves,
  House,
  Heart,
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
  Minus,
  ChevronDown,
  Check,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Logo from "@/components/logo";
import { useTranslation } from "@/components/theme-provider";
import { useEffect, useState, useRef, useCallback, type RefObject } from "react";
import SectionDivider from "@/components/section-divider";

const heroVideoDesktop = "https://d3gkfgi9drj9kb.cloudfront.net/video-assets/herovid1.mp4";
const heroVideoMobile  = "https://d3gkfgi9drj9kb.cloudfront.net/video-assets/herovid_mobile.mp4";
const shieldIcon = "/images/shield_icon.webp";
const floodImg = "/images/flood_card.webp";
const highFiveImg = "/images/team_highfive.webp";

function InsuranceDetailModal({
  type,
  onClose,
  onGetQuote,
}: {
  type: {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
    color: string;
  } | null;
  onClose: () => void;
  onGetQuote: () => void;
}) {
  const { t } = useTranslation();
  const details = type
    ? t.insuranceModal.details[
        type.color as keyof typeof t.insuranceModal.details
      ]
    : null;

  const accentColor =
    type?.color === "sky"
      ? "from-black/35 to-black/10"
      : type?.color === "teal"
        ? "from-slate-900/55 to-blue-400/20"
        : type?.color === "blue"
          ? "from-sky-500/58 to-cyan-400/28"
          : type?.color === "indigo"
            ? "from-amber-500/58 to-yellow-400/28"
            : type?.color === "violet"
              ? "from-amber-500/60 to-orange-400/28"
              : type?.color === "red"
                ? "from-purple-500/58 to-fuchsia-400/28"
                : "from-slate-600/55 to-slate-400/25";

  const modalImageBlur = false;

  const pillColor =
    type?.color === "sky"
      ? "bg-orange-100 text-orange-800"
      : type?.color === "teal"
        ? "bg-slate-200 text-slate-800"
        : type?.color === "blue"
          ? "bg-sky-100 text-sky-800"
          : type?.color === "indigo"
            ? "bg-amber-100 text-amber-800"
            : type?.color === "violet"
              ? "bg-amber-100 text-amber-800"
              : type?.color === "red"
                ? "bg-purple-100 text-purple-800"
                : "bg-slate-100 text-slate-700";

  return (
    <AnimatePresence>
      {type && (
        <>
          {/* Backdrop */}
          <motion.div
            key="insurance-modal-backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="insurance-modal"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header image */}
              <div className="relative h-36 flex-shrink-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${type.image})`,
                    ...(modalImageBlur
                      ? { filter: "blur(2px)", transform: "scale(1.06)" }
                      : {}),
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accentColor}`}
                />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <div className="text-white opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{type.icon}</div>
                  <div>
                    <p className="text-white/80 text-[11px] uppercase tracking-widest font-medium [text-shadow:0_1px_6px_rgba(0,0,0,0.95),0_2px_10px_rgba(0,0,0,0.7)]">
                      {t.insuranceModal.coverageLabel}
                    </p>
                    <h2 className="text-white text-xl font-bold leading-tight [text-shadow:0_1px_8px_rgba(0,0,0,0.95),0_3px_16px_rgba(0,0,0,0.75)]">
                      {type.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto flex-1 p-5 space-y-5">
                {/* Tagline */}
                {details && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
                    "{details.tagline}"
                  </p>
                )}

                {/* What's covered */}
                {details && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {t.insuranceModal.whatsCovered}
                    </h3>
                    <ul className="grid grid-cols-1 gap-1.5">
                      {details.covers.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400"
                        >
                          <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key benefits */}
                {details && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {t.insuranceModal.keyBenefits}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.benefits.map((b, i) => (
                        <span
                          key={i}
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${pillColor}`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why us */}
                {details && (
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <h3 className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wide">
                      {t.insuranceModal.whyUsLabel}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {details.whyUs}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-4 border-t border-border bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    onGetQuote();
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {t.insuranceModal.getQuotePrefix} {type.title}
                  {t.insuranceModal.getQuoteSuffix}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InsuranceCard({
  type,
  index,
  onClick,
  carAnimationActive = false,
  isPulsing = false,
}: {
  type: {
    icon: React.ReactNode;
    title: string;
    description: string;
    shortDesc: string;
    image: string;
    color: string;
  };
  index: number;
  onClick: () => void;
  carAnimationActive?: boolean;
  isPulsing?: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Apply glow-pulse CSS class when isPulsing fires
  useEffect(() => {
    if (isPulsing && cardRef.current) {
      const el = cardRef.current;
      el.classList.remove("card-glow-pulse");
      void el.offsetWidth; // force reflow so animation restarts
      el.classList.add("card-glow-pulse");
      const t = setTimeout(() => el.classList.remove("card-glow-pulse"), 850);
      return () => clearTimeout(t);
    }
  }, [isPulsing]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const colorClasses = {
    sky:    "bg-gradient-to-t from-black/18 to-transparent",                           // clean — no tint
    teal:   "bg-gradient-to-t from-slate-900/50 via-blue-400/12 to-transparent",       // near-glass, dark base only
    blue:   "bg-gradient-to-t from-sky-500/42 via-cyan-300/16 to-transparent",         // bright ocean
    indigo: "bg-gradient-to-b from-amber-400/36 via-yellow-300/16 to-orange-200/10",    // warm golden sunlight
    violet: "bg-gradient-to-tl from-amber-500/38 via-orange-300/14 to-transparent",   // bright cognac diagonal
    green:  "bg-gradient-to-t from-emerald-500/40 via-emerald-300/16 to-transparent",
    red:    "bg-gradient-to-t from-purple-500/38 via-fuchsia-300/14 to-transparent",   // bright plum
  };

  const iconAnimations = {
    sky:    "group-hover:animate-bounce-subtle",
    teal:   "animate-car-crash-loop",
    blue:   "group-hover:animate-ripple",
    indigo: "animate-heartbeat",
    violet: "group-hover:animate-grow",
    green:  "group-hover:animate-pulse-heart",
    red:    "animate-health-pulse",
  };

  const gradientClass = colorClasses[type.color as keyof typeof colorClasses];
  const iconAnimation =
    type.color === "teal"
      ? (carAnimationActive ? "animate-car-crash-loop" : "")
      : iconAnimations[type.color as keyof typeof iconAnimations] || "";

  const scrimClass =
    type.color === "sky"    ? "from-black/48" :
    type.color === "teal"   ? "from-black/52" :
    type.color === "indigo" ? "from-black/45" :
    type.color === "violet" ? "from-black/48" :
    type.color === "red"    ? "from-black/48" :
                              "from-black/48";

  const dynamicGradientStyle = isHovered
    ? {
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
      }
    : {};

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl overflow-hidden isolate [clip-path:inset(0_round_0.75rem)] cursor-pointer transition-all duration-300 h-[72px] sm:h-44 sm:hover:-translate-y-2 sm:hover:shadow-2xl sm:hover:shadow-black/30 select-none active:scale-[0.98] transform-gpu will-change-transform"
      style={{
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px -5px ${
              type.color === "sky"    ? "rgba(249, 115, 22, 0.40)" :   // bright orange
              type.color === "teal"   ? "rgba(59, 130, 246, 0.35)" :  // bright blue glass
              type.color === "blue"   ? "rgba(14, 165, 233, 0.40)" :  // bright sky
              type.color === "indigo" ? "rgba(251, 191, 36, 0.42)" :   // warm amber/gold
              type.color === "violet" ? "rgba(245, 158, 11, 0.40)" :  // bright amber
              type.color === "red"    ? "rgba(168, 85, 247, 0.40)" :  // bright purple
                                        "rgba(100, 116, 139, 0.40)"
            }`
          : undefined,
      }}
      data-testid={`card-insurance-${type.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Glassmorphism border on hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-white/30 z-20 pointer-events-none" />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 sm:group-hover:scale-110"
        style={{ backgroundImage: `url(${type.image})` }}
      />

      {/* Base Gradient Overlay */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${gradientClass}`}
      />

      {/* Dynamic mouse-following gradient (desktop only) */}
      <div
        className="hidden sm:block absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={dynamicGradientStyle}
      />

      {/* Road overlay — mobile auto card, solid-car model */}
      {type.color === "teal" && (
        <div className="sm:hidden absolute inset-0 pointer-events-none" style={{ zIndex: 18 }}>
          {/* Road edge lines — solid behind car, fading in front of car (right→dim, car→bright) */}
          <div
            className="absolute left-0 h-[1.5px]"
            style={{
              top: "30%",
              width: "64px",
              background: "linear-gradient(to right, rgba(255,255,255,0.60) 69%, rgba(255,255,255,0) 100%)",
            }}
          />
          <div
            className="absolute left-0 h-[1.5px]"
            style={{
              bottom: "30%",
              width: "64px",
              background: "linear-gradient(to right, rgba(255,255,255,0.60) 69%, rgba(255,255,255,0) 100%)",
            }}
          />
          {/* BEHIND car — rear dashes, x=0→16px */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 overflow-hidden"
            style={{ width: "16px", height: "2px" }}
          >
            <div className="mobile-center-dash" />
          </div>
          {/* IN FRONT of car — ahead dashes, x=44→60px, fade: dim far-right → bright at hood */}
          <div
            className="absolute top-1/2 -translate-y-1/2 overflow-hidden"
            style={{
              left: "44px",
              width: "16px",
              height: "2px",
              WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 100%)",
              maskImage: "linear-gradient(to left, transparent 0%, black 100%)",
            }}
          >
            <div className="mobile-center-dash mobile-center-dash-front" />
          </div>
        </div>
      )}

      {/* ── MOBILE: horizontal list row ── */}
      {/* Left-side gradient scrim for text legibility */}
      <div className="sm:hidden absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent z-10 pointer-events-none rounded-[inherit]" />
      <div className="sm:hidden absolute inset-0 flex items-center gap-4 px-4 z-20">
        <div className={`shrink-0 text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.55)] [&_svg]:w-7 [&_svg]:h-7 ${type.color === "teal" ? "animate-car-drive-mobile" : iconAnimation}`}>
          {type.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-extrabold text-sm leading-tight [text-shadow:0_0_12px_rgba(255,255,255,0.45),0_1px_8px_rgba(0,0,0,1),0_2px_16px_rgba(0,0,0,0.85)]">
            {type.title}
          </h3>
          <p className="text-white/95 text-xs leading-snug mt-0.5 line-clamp-1 [text-shadow:0_0_8px_rgba(255,255,255,0.3),0_1px_6px_rgba(0,0,0,1),0_2px_12px_rgba(0,0,0,0.8)]">
            {type.shortDesc}
          </p>
        </div>
        <ArrowRight className="shrink-0 w-4 h-4 text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" />
      </div>

      {/* ── DESKTOP: tile layout ── */}
      {/* Top gradient scrim for title legibility */}
      <div className={`hidden sm:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${scrimClass} to-transparent z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none`} />

      {/* Default state: icon + title at TOP */}
      <div className="hidden sm:block absolute inset-x-0 top-0 p-4 z-20 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
        {(type.color === "indigo" || type.color === "red") ? (
          <div
            className={`text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.55)] mb-1.5 -ml-0.5 [&_svg]:w-[27px] [&_svg]:h-[27px] ${iconAnimation}`}
            style={{ transformOrigin: "13.5px 13.5px" }}
          >
            {type.icon}
          </div>
        ) : (
          <div className={`text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.55)] mb-1.5 scale-75 origin-top-left -ml-0.5 ${iconAnimation}`}>
            {type.icon}
          </div>
        )}
        <h3 className="text-base font-bold text-white leading-tight [text-shadow:0_1px_6px_rgba(0,0,0,0.95),0_2px_14px_rgba(0,0,0,0.7)]">
          {type.title}
        </h3>
      </div>

      {/* Auto card: crash particles (desktop only, hidden on hover, only when animation active) */}
      {type.color === "teal" && carAnimationActive && (
        <div className="hidden sm:block absolute top-5 left-[76px] z-30 pointer-events-none transition-opacity duration-200 group-hover:opacity-0">
          <div className="crash-particle crash-particle-loop-1" style={{ background: "rgba(255,255,255,0.85)" }} />
          <div className="crash-particle crash-particle-loop-2" style={{ background: "rgba(255,255,255,0.75)" }} />
          <div className="crash-particle crash-particle-loop-3" style={{ background: "rgba(255,255,255,0.7)" }} />
          <div className="crash-particle crash-particle-loop-4" style={{ background: "rgba(255,255,255,0.8)" }} />
          <div className="crash-particle crash-particle-loop-5" style={{ background: "rgba(255,255,255,0.65)" }} />
          <div className="crash-particle crash-particle-loop-6" style={{ background: "rgba(255,255,255,0.7)" }} />
        </div>
      )}

      {/* Blur layer — fades in on hover to soften image behind text */}
      <div className="hidden sm:block absolute inset-0 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[15] pointer-events-none" />

      {/* Hover state: full overlay with description */}
      <div className="hidden sm:flex absolute inset-0 bg-black/72 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex-col overflow-y-auto custom-scrollbar">
        <h3 className="text-white font-bold text-sm mb-2 leading-tight shrink-0 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
          {type.title}
        </h3>
        <p className="text-slate-100 text-xs leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]">
          {type.description}
        </p>
      </div>
    </div>
  );
}

// Renders children at a fixed desktop width then CSS-scales them to fit the
// available container width — giving mobile users a zoomed-out desktop view.
function ScaledContainer({
  children,
  desktopWidth = 640,
}: {
  children: React.ReactNode;
  desktopWidth?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const update = () => {
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) return;
      const w = wrapper.offsetWidth;
      if (w < desktopWidth) {
        const s = w / desktopWidth;
        setScale(s);
        setHeight(inner.scrollHeight * s);
      } else {
        setScale(1);
        setHeight("auto");
      }
    };
    update();
    const ro = new ResizeObserver(update);
    const els = [wrapperRef.current, innerRef.current].filter(Boolean) as Element[];
    els.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [desktopWidth]);

  return (
    <div
      ref={wrapperRef}
      style={{
        overflowX: scale !== 1 ? ("clip" as any) : "visible",
        overflowY: "visible",
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: scale !== 1 ? `${desktopWidth}px` : "100%",
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const [heroVisible, setHeroVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMobilePhone, setIsMobilePhone] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showShieldTooltip, setShowShieldTooltip] = useState(false);
  const isRestoring = useRef(false);
  const hasScrolledDown = useRef(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<
    (typeof insuranceTypes)[0] | null
  >(null);
  const [scrollY, setScrollY] = useState(0);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const [addressCopied, setAddressCopied] = useState(false);
  // const [shieldSweeping, setShieldSweeping] = useState(false); // SHIELD — uncomment to restore
  const highFiveRef = useRef<HTMLDivElement>(null);
  const [highFiveVisible, setHighFiveVisible] = useState(false);
  const insuranceSectionRef = useRef<HTMLElement>(null);
  const [carAnimActive, setCarAnimActive] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(-1);
  const pulseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulsedOnce = useRef(false);

  const triggerPulse = useCallback(() => {
    const TOTAL_CARDS = 6;
    const STAGGER_MS  = 230;
    for (let i = 0; i < TOTAL_CARDS; i++) {
      setTimeout(() => setPulseIndex(i), i * STAGGER_MS);
    }
    setTimeout(() => setPulseIndex(-1), (TOTAL_CARDS - 1) * STAGGER_MS + 900);
  }, []);

  useEffect(() => {
    const el = insuranceSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !pulsedOnce.current) {
          pulsedOnce.current = true;
          triggerPulse();
          pulseIntervalRef.current = setInterval(triggerPulse, 14000);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, [triggerPulse]);

  useEffect(() => {
    const el = highFiveRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHighFiveVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = insuranceSectionRef.current;
    if (!el || carAnimActive) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setCarAnimActive(true), 2300);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [carAnimActive]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activate = () => {
      setIsMobilePhone(window.innerWidth <= 640);
      setVideoReady(true);
    };
    if (document.readyState === "complete") {
      activate();
    } else {
      window.addEventListener("load", activate);
      return () => window.removeEventListener("load", activate);
    }
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedContact(key);
      setTimeout(() => setCopiedContact(null), 2000);
    });
  };

  // Drag & animation refs
  const heroRef = useRef<HTMLElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const restoreFrom = useRef({ x: 0, y: 0 });

  // Card motion values (fully imperative — avoids animate prop / drag conflict)
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const cardOpacity = useMotionValue(1);
  const cardScale = useMotionValue(1);
  const dragControls = useDragControls();

  // Shield drag motion values
  const shieldX = useMotionValue(0);
  const shieldY = useMotionValue(0);
  const shieldDragged = useRef(false);

  // Only allow window drag on desktop (≥1024px) — mobile drag confuses users
  const [isDesktop, setIsDesktop] = useState(false);

  // SHIELD DESIGN PRESERVED — graduated zoom for the shield shape (uncomment to restore)
  // const getShieldZoom = () => {
  //   if (typeof window === "undefined") return 0.52;
  //   const w = window.innerWidth;
  //   if (w >= 1024) return 0.52;
  //   if (w >= 640)  return 0.68;
  //   if (w >= 430)  return 0.78;
  //   if (w >= 390)  return 0.75;
  //   return 0.67;
  // };
  // const [shieldZoom, setShieldZoom] = useState(getShieldZoom);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // setShieldZoom(getShieldZoom()); // SHIELD — uncomment to restore
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Shield fixed-position constants — SSR-safe: start with mobile defaults, update after mount
  const [SHIELD_RIGHT, setSHIELD_RIGHT] = useState(16);
  const SHIELD_TOP = 110;
  const [SHIELD_SIZE, setSHIELD_SIZE] = useState(64);

  useEffect(() => {
    const update = () => {
      setSHIELD_RIGHT(window.innerWidth >= 640 ? 72 : 16);
      setSHIELD_SIZE(window.innerWidth >= 640 ? 80 : 64);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const openQuote = () => setQuoteModalOpen(true);
    window.addEventListener("open-quote-modal", openQuote);
    return () => window.removeEventListener("open-quote-modal", openQuote);
  }, []);

  const insuranceTypes = [
    {
      icon: <House className="w-10 h-10" />,
      title: t.insurance.homeTitle,
      description: t.insurance.homeDesc,
      shortDesc: t.insurance.homeShortDesc,
      image:
        "/images/home_card.webp",
      color: "sky",
    },
    {
      icon: <Car className="w-10 h-10" />,
      title: t.insurance.autoTitle,
      description: t.insurance.autoDesc,
      shortDesc: t.insurance.autoShortDesc,
      image:
        "/images/autocar.webp",
      color: "teal",
    },
    {
      icon: <Waves className="w-10 h-10" />,
      title: t.insurance.floodTitle,
      description: t.insurance.floodDesc,
      shortDesc: t.insurance.floodShortDesc,
      image: floodImg,
      color: "blue",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: t.insurance.lifeTitle,
      description: t.insurance.lifeDesc,
      shortDesc: t.insurance.lifeShortDesc,
      image:
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
      color: "indigo",
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: t.insurance.businessTitle,
      description: t.insurance.businessDesc,
      shortDesc: t.insurance.businessShortDesc,
      image:
        "/images/business_card.webp",
      color: "violet",
    },
    {
      icon: <HeartPulse className="w-10 h-10" />,
      title: t.insurance.healthTitle,
      description: t.insurance.healthDesc,
      shortDesc: t.insurance.healthShortDesc,
      image:
        "/images/health_card.webp",
      color: "red",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroVisible(true);

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 200) hasScrolledDown.current = true;
      setScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Show tooltip shortly after shield appears, then auto-hide
  useEffect(() => {
    if (isMinimized) {
      const showTimer = setTimeout(() => setShowShieldTooltip(true), 700);
      const hideTimer = setTimeout(() => setShowShieldTooltip(false), 5000);
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    } else {
      setShowShieldTooltip(false);
    }
  }, [isMinimized]);

  // Auto-restore window when user scrolls back to the hero section
  useEffect(() => {
    if (isMinimized && scrollY < 80 && hasScrolledDown.current) {
      hasScrolledDown.current = false;
      cardX.set(0);
      cardY.set(0);
      cardOpacity.set(0);
      cardScale.set(0.9);
      isRestoring.current = false;
      sessionStorage.setItem("heroWindowMinimized", "false");
      setIsMinimized(false);
      requestAnimationFrame(() => {
        animateValue(cardOpacity, 1, { duration: 0.5, ease: "easeOut" });
        animateValue(cardScale, 1, { duration: 0.5, ease: "easeOut" });
      });
    }
  }, [scrollY, isMinimized]);

  const handleMinimize = async () => {
    isRestoring.current = false;
    if (cardInnerRef.current) {
      const cardRect = cardInnerRef.current.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const shieldLeft =
        window.innerWidth - SHIELD_RIGHT - SHIELD_SIZE + shieldX.get();
      const shieldCenterX = shieldLeft + SHIELD_SIZE / 2;
      const shieldCenterY = SHIELD_TOP + shieldY.get() + SHIELD_SIZE / 2;
      const dx = shieldCenterX - cardCenterX;
      const dy = shieldCenterY - cardCenterY;
      // Stage 1 — brief compress (snap inward like a breath-in)
      await Promise.all([
        animateValue(cardScale, 0.88, { duration: 0.12, ease: [0.4, 0, 1, 1] }),
        animateValue(cardOpacity, 0.85, { duration: 0.12, ease: "easeOut" }),
      ]);
      // Stage 2 — implode: fly to "it" shield and vanish
      await Promise.all([
        animateValue(cardX, cardX.get() + dx, {
          duration: 0.38,
          ease: [0.55, 0, 1, 0.7],
        }),
        animateValue(cardY, cardY.get() + dy, {
          duration: 0.38,
          ease: [0.55, 0, 1, 0.7],
        }),
        animateValue(cardOpacity, 0, { duration: 0.22, ease: [0.6, 0, 1, 1] }),
        animateValue(cardScale, 0, { duration: 0.38, ease: [0.55, 0, 1, 0.7] }),
      ]);
    }
    hasScrolledDown.current = false;
    sessionStorage.setItem("heroWindowMinimized", "true");
    setIsMinimized(true);
    cardX.set(0);
    cardY.set(0);
    cardOpacity.set(0);
    cardScale.set(1);
  };

  const handleRestore = () => {
    if (heroRef.current) {
      const heroRect = heroRef.current.getBoundingClientRect();
      const cardNaturalCenterX = heroRect.left + heroRect.width / 2;
      const cardNaturalCenterY = heroRect.top + heroRect.height / 2;
      const shieldLeft =
        window.innerWidth - SHIELD_RIGHT - SHIELD_SIZE + shieldX.get();
      const shieldCenterX = shieldLeft + SHIELD_SIZE / 2;
      const shieldCenterY = SHIELD_TOP + shieldY.get() + SHIELD_SIZE / 2;
      restoreFrom.current = {
        x: shieldCenterX - cardNaturalCenterX,
        y: shieldCenterY - cardNaturalCenterY,
      };
    }
    // Pre-set card to shield position before mounting (scale 0, invisible)
    cardX.set(restoreFrom.current.x);
    cardY.set(restoreFrom.current.y);
    cardOpacity.set(0);
    cardScale.set(0);
    isRestoring.current = true;
    sessionStorage.setItem("heroWindowMinimized", "false");
    setIsMinimized(false);
    // Stage 1 — explode out from the "it" shield with spring overshoot
    requestAnimationFrame(() => {
      animateValue(cardX, 0, { duration: 0.6, ease: [0.22, 1.4, 0.36, 1] });
      animateValue(cardY, 0, { duration: 0.6, ease: [0.22, 1.4, 0.36, 1] });
      animateValue(cardOpacity, 1, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
      // Scale overshoots to 1.06 then settles — handled by the spring ease
      animateValue(cardScale, 1, {
        duration: 0.6,
        ease: [0.22, 1.4, 0.36, 1],
      });
    });
  };

  return (
    <div className="min-h-screen bg-background select-none">
      <Navigation />

      {/* Hero Section */}
      <section
        ref={heroRef as RefObject<HTMLElement>}
        className="flex items-start relative pt-16 sm:pt-[72px] pb-10"
        style={{ minHeight: "calc(100vh + 37px)" }}
      >
        {/* Hero Background — three layers of fallback:
            1. <picture> always in DOM for SEO + immediate static background.
               Browsers download only the matching source — phones never fetch
               the desktop image, desktop never fetches the mobile image.
            2. <video> lazy-loads after window.onload, fades in only when
               playable, stays invisible on error so the picture shows through.
               poster= matches the static image so the hero never flashes. */}
        <div
          className="absolute -inset-x-0 -top-20 -bottom-40 will-change-transform dark:brightness-75 overflow-hidden"
          style={{
            transform: `translateY(${scrollY * 0.4}px) scale(1.02)`,
          }}
        >
          {/* Layer 1 — <picture> for responsive static image (SEO + fallback).
              Mobile phones (≤640px) get heroimage_mobile.webp (portrait, 173KB).
              Desktop/tablet get heroimage1.webp (landscape). */}
          <picture className="w-full h-full">
            <source media="(max-width: 640px)" srcSet="/images/heroimage_mobile.webp" />
            <img
              src="/images/heroimage1.webp"
              alt="Insure IT Group Corp - Insurance Agency Jacksonville FL"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 40%" }}
              fetchPriority="high"
            />
          </picture>
          {/* Layer 2 — video lazy-loads after page load.
              isMobilePhone is set once on window.onload via window.innerWidth,
              selecting portrait clip for phones and landscape for desktop. */}
          {videoReady && (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={isMobilePhone ? "/images/heroimage_mobile.webp" : "/images/heroimage1.webp"}
              className="absolute inset-0"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
                backgroundColor: "transparent",
                opacity: 0,
                transition: "opacity 0.6s ease",
              }}
              onCanPlay={(e) => {
                (e.currentTarget as HTMLVideoElement).style.opacity = "1";
              }}
              onError={(e) => {
                (e.currentTarget as HTMLVideoElement).style.opacity = "0";
              }}
            >
              <source
                src={isMobilePhone ? heroVideoMobile : heroVideoDesktop}
                type="video/mp4"
                onError={(e) => {
                  const vid = (e.currentTarget as HTMLSourceElement)
                    .parentElement as HTMLVideoElement;
                  if (vid) vid.style.opacity = "0";
                }}
              />
            </video>
          )}
        </div>

        {/* Content */}
        {/* WINDOW CARD — replaces shield. Shield design preserved in comments above. */}
        <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 mt-[110px] sm:mt-[100px] md:mt-[100px]">
          <div className="w-full flex justify-center">
            {!isMinimized && (
              <motion.div
                key="hero-card"
                drag={isDesktop}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={heroRef as RefObject<Element>}
                dragElastic={0.05}
                dragMomentum={false}
                style={{
                  x: cardX,
                  y: cardY,
                  opacity: cardOpacity,
                  scale: cardScale,
                }}
                className="w-full max-w-[560px] sm:max-w-[640px]"
              >
                {/* App-window card */}
                <div
                  ref={cardInnerRef}
                  className="relative bg-white/30 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
                >
                  {/* Window title bar — macOS-style traffic lights; drag handle on desktop */}
                  <div
                    className={`relative flex items-center px-4 py-2.5 bg-white/10 border-b border-white/20 ${isDesktop ? "cursor-grab active:cursor-grabbing" : ""}`}
                    onPointerDown={(e) => { if (isDesktop) dragControls.start(e); }}
                  >
                    <button
                      onClick={handleMinimize}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 transition-colors shrink-0 flex items-center justify-center"
                      aria-label="Minimize window"
                    >
                      <span className="block w-2.5 h-px bg-white/70 rounded-full" />
                    </button>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[11px] font-medium text-white/55 select-none tracking-wide">
                        Insure-it Group Corp
                      </span>
                    </div>
                  </div>

                  {/* Window body */}
                  <div className="px-6 sm:px-10 py-4 sm:py-5 flex flex-col items-center gap-3 sm:gap-3.5">
                    {/* Logo — animated video on desktop, static PNG on mobile */}
                    <Logo size="large" showTagline={false} className="w-full" />

                    {/* Tagline */}
                    <p className="text-sm sm:text-base font-semibold italic tagline-shimmer select-none text-center -mt-1">
                      Life&apos;s Uncertain. Your Coverage Isn&apos;t.
                    </p>

                    {/* CTAs — side by side */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="relative flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3 w-full"
                    >
                      <button
                        onClick={() => setQuoteModalOpen(true)}
                        className="animated-border-btn group relative overflow-hidden text-primary-foreground flex-1 py-3 sm:py-3.5 rounded-xl font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 transition-all duration-300 sm:hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] select-none"
                        data-testid="button-get-quote"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {t.hero.getQuoted}
                          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                      </button>

                      <a
                        href="tel:+19049090897"
                        onClick={() => copyToClipboard("9049090897", "phone")}
                        className="bg-blue-400/30 backdrop-blur-sm border-2 border-blue-300/60 text-blue-800 flex-1 py-3 sm:py-3.5 rounded-xl hover:bg-blue-500/50 hover:border-blue-300 hover:text-white transition-all flex items-center justify-center gap-2 select-none"
                        data-testid="button-call-us"
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="flex flex-col items-start leading-tight">
                          <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                            {copiedContact === "phone" ? "Copied!" : "904-909-0897"}
                          </span>
                          <span className="text-[10px] sm:text-xs font-medium opacity-75 whitespace-nowrap">
                            {t.hero.callUs}
                          </span>
                        </span>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll indicator arrow — fades out as user scrolls */}
        <div
          className="absolute z-30 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500"
          style={{ bottom: 78, opacity: Math.max(0, 1 - scrollY / 80) }}
        >
          <ChevronDown className="w-9 h-9 text-white/90 animate-bounce drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
        </div>
      </section>

      {/* Interstitial wave — lower z (5) than dot-section (30) so the dot-section
          paints over the wave's flat bottom, leaving only the curves visible */}
      <div
        className="relative pointer-events-none"
        style={{ marginTop: -80, zIndex: 5, height: 80 }}
      >
        <SectionDivider
          variant="wave-layered"
          position="bottom"
          wave1Color="hsla(205, 70%, 82%, 0.3)"
          wave2Color="hsla(205, 70%, 82%, 0.6)"
          wave3Color="#ffffff"
          height={80}
          noBgFill={false}
        />
      </div>

      {/* More than Insurace. Peace of Mind. */}
      <section
        ref={insuranceSectionRef}
        className="py-10 bg-white dark:bg-slate-800 relative overflow-hidden dot-pattern"
        style={{
          marginTop: -40,
          position: "relative",
          zIndex: 30,
          paddingTop: 27,
          paddingBottom: 40,
        }}
      >
        <ScaledContainer desktopWidth={640}>
          <div className="px-4 sm:px-6 pb-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 gap-8 items-start">
                {/* Left column: title + paragraphs, top-aligned with first card */}
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-4 select-none">
                    {t.whoWeAre.subtitle}
                  </p>
                  <h2 className="text-2xl font-bold text-foreground mb-4 select-none">
                    {t.whoWeAre.titleLine1}
                    <br />
                    <span className="text-primary">{t.whoWeAre.titleLine2}</span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-6"></div>
                  <p className="text-base text-muted-foreground leading-snug mb-4">
                    {t.whoWeAre.paragraph1}
                  </p>
                  <p className="text-base text-muted-foreground leading-snug">
                    {t.whoWeAre.paragraph2}
                  </p>
                </div>

                {/* Right column: insurance cards, top-aligned with title */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                  {insuranceTypes.map((type, index) => (
                    <InsuranceCard
                      key={type.title}
                      type={type}
                      index={index}
                      onClick={() => setSelectedInsurance(type)}
                      carAnimationActive={carAnimActive}
                      isPulsing={pulseIndex === index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScaledContainer>

        <div
          className="relative z-20"
          style={{ marginTop: 20, marginBottom: -40 }}
        >
          <SectionDivider
            variant="wave-layered"
            position="bottom"
            toColor="transparent"
            wave1Color="hsla(205, 70%, 72%, 0.40)"
            wave2Color="hsla(205, 70%, 72%, 0.70)"
            wave3Color="hsla(205, 68%, 70%, 0.90)"
            height={22}
          />
        </div>
      </section>

      {/* Ready to Get Started + Map Section */}
      <section
        className="pt-6 pb-0 bg-muted dark:bg-slate-800 relative overflow-hidden dot-pattern"
        style={{ marginTop: 0, zIndex: 10, position: "relative", paddingBottom: 34 }}
      >
        <ScaledContainer desktopWidth={640}>
          <div className="px-4 sm:px-6 pb-3 relative z-10">
            <div className="max-w-5xl mx-auto">
              {/* Two-column layout: Map left, Content right */}
              <div className="grid grid-cols-2 gap-8 items-center">

                {/* Left column: Map */}
                <div className="relative h-[380px]">
                <div className="animated-border-panel rounded-2xl shadow-xl overflow-hidden w-full h-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!4v1772407358800!6m8!1m7!1sduMvKfdLYRewb8CVXg-ybA!2m2!1d30.1626398364991!2d-81.63340592784719!3f271.0787535168472!4f2.850590466226677!5f0.4000000000000002"
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Insure IT Group Office - Street View"
                  />
                </div>
                {/* Address badge */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "11570 San Jose Blvd, Suite 11, Jacksonville, FL 32223",
                    );
                    setAddressCopied(true);
                    setTimeout(() => setAddressCopied(false), 7000);
                  }}
                  onDoubleClick={() => {
                    window.open(
                      "https://maps.google.com/?daddr=11570+San+Jose+Blvd+Suite+11+Jacksonville+FL+32223",
                      "_blank",
                    );
                  }}
                  title="Tap to copy · Double-tap for directions"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-start gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-slate-200/80 transition-colors hover:bg-white active:bg-slate-50 cursor-pointer"
                >
                  {addressCopied ? (
                    <>
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-green-600 whitespace-nowrap">Copied!</p>
                        <p className="text-[11px] text-green-500 whitespace-nowrap">Tap again to open in Maps</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div className="leading-tight text-left">
                        <p className="text-xs font-bold text-slate-800 whitespace-nowrap">11570 San Jose Blvd, Suite 11</p>
                        <p className="text-[11px] text-slate-500 whitespace-nowrap">Jacksonville, FL 32223</p>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Right column: title + bullets only */}
              <div className="flex flex-col">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3 select-none">
                  {t.contact.subtitle}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 select-none">
                  {t.contact.title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-5" />
                <ul className="text-left space-y-2 w-full">
                  {t.contact.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-3 h-3 text-primary" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="text-base text-muted-foreground leading-snug">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action row — centered across the full section */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="animated-border-btn group relative overflow-hidden text-primary-foreground min-w-[280px] px-10 py-3 sm:py-4 rounded-lg font-semibold text-lg sm:text-xl shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] select-none"
                data-testid="button-get-quote-contact"
              >
                <span className="relative z-10">
                  {t.contact.getQuoted}
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
              </button>
              <div className="flex flex-nowrap gap-1.5 justify-center">
                <a
                  href="tel:+19049090897"
                  onClick={() => copyToClipboard("9049090897", "phone")}
                  data-testid="link-phone-desktop"
                  className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[9px] sm:text-[10px] font-medium px-2 sm:px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  style={{ color: copiedContact === "phone" ? "var(--primary)" : undefined }}
                >
                  {copiedContact === "phone" ? <Check className="w-2.5 h-2.5" /> : <Phone className="w-2.5 h-2.5" />}
                  {copiedContact === "phone" ? "Copied!" : "904-909-0897"}
                </a>
                <a
                  href="mailto:Info@insureitgroup.net"
                  onClick={() => copyToClipboard("Info@insureitgroup.net", "email")}
                  data-testid="link-email-desktop"
                  className="flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[9px] sm:text-[10px] font-medium px-2 sm:px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  style={{ color: copiedContact === "email" ? "var(--primary)" : undefined }}
                >
                  {copiedContact === "email" ? <Check className="w-2.5 h-2.5" /> : <Mail className="w-2.5 h-2.5" />}
                  {copiedContact === "email" ? "Copied!" : "Info@insureitgroup.net"}
                </a>
              </div>
            </div>
          </div>
        </div>
        </ScaledContainer>

      </section>

      {/* Wave divider — sits over the section boundary, above both sections */}
      <div className="relative z-30" style={{ marginTop: -22 }}>
        <SectionDivider
          variant="wave-layered"
          position="bottom"
          toColor="transparent"
          wave1Color="hsla(205, 70%, 72%, 0.40)"
          wave2Color="hsla(205, 70%, 72%, 0.70)"
          wave3Color="hsla(205, 68%, 70%, 0.90)"
          height={22}
        />
      </div>

      {/* Testimonials Section — team high-five parallax background */}
      <div
        ref={highFiveRef}
        className="relative overflow-hidden"
        style={{
          backgroundImage: highFiveVisible ? `url(${highFiveImg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-900/50" />
        <section className="pt-[20px] pb-6 relative z-10">
          <ScaledContainer desktopWidth={640}>
            <div className="px-4 sm:px-6">
              <TestimonialsCarousel />
            </div>
          </ScaledContainer>
        </section>

        {/* Partners — sits inside the high-five container, light frosted glass over the image */}
        <div className="relative z-10 backdrop-blur-md bg-white/80 border-t border-white/40">
          <PartnersCarousel className="bg-transparent border-none" />
        </div>
      </div>

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />

      {/* Shield restore button — only visible while user is within the hero section */}
      <AnimatePresence>
        {isMinimized && scrollY < window.innerHeight * 0.82 && (
          <motion.button
            key="shield-restore"
            drag
            dragMomentum={false}
            dragElastic={0.05}
            dragConstraints={{
              left: -(window.innerWidth - SHIELD_RIGHT - SHIELD_SIZE),
              right: SHIELD_RIGHT,
              top: -30,
              bottom: window.innerHeight * 0.85 - SHIELD_TOP - SHIELD_SIZE,
            }}
            style={{ x: shieldX, y: shieldY }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
            }}
            transition={{
              duration: 0.4,
              delay: 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            onDrag={(_e, info) => {
              if (Math.abs(info.offset.x) > 6 || Math.abs(info.offset.y) > 6) {
                shieldDragged.current = true;
              }
            }}
            onDragEnd={() => {
              setTimeout(() => {
                shieldDragged.current = false;
              }, 0);
            }}
            onClick={() => {
              if (!shieldDragged.current) handleRestore();
            }}
            className="fixed top-[110px] right-4 sm:right-[72px] z-[200] w-16 h-16 sm:w-20 sm:h-20 drop-shadow-2xl cursor-grab active:cursor-grabbing"
            aria-label="Restore window"
          >
            {/* Speech bubble tooltip */}
            <AnimatePresence>
              {showShieldTooltip && (
                <motion.div
                  key="shield-tooltip"
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute bottom-full mb-2 right-10 pointer-events-none"
                >
                  {/* Gradient ring wrapper */}
                  <div
                    className="rounded-xl p-[2px] shadow-xl"
                    style={{
                      background:
                        "conic-gradient(from var(--border-angle), #38bdf8, #2563eb, #818cf8, #a78bfa, #38bdf8)",
                      animation: "border-rotate-slow 4s linear infinite",
                    }}
                  >
                    <div className="relative bg-white text-slate-700 text-[11px] font-semibold px-3 py-2 rounded-[10px] whitespace-nowrap">
                      Tap to reopen the Insure-it window!
                    </div>
                  </div>
                  {/* Arrow tail pointing down-right toward window */}
                  <span className="absolute right-4 top-full border-[6px] border-transparent border-t-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform duration-200 pointer-events-none">
              <img src={shieldIcon} alt="Restore window" className="w-full h-full object-contain drop-shadow-2xl" draggable={false} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Insurance Detail Modal */}
      <InsuranceDetailModal
        type={selectedInsurance}
        onClose={() => setSelectedInsurance(null)}
        onGetQuote={() => {
          setSelectedInsurance(null);
          setQuoteModalOpen(true);
        }}
      />

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
