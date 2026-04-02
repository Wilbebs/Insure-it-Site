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
import { useEffect, useState, useRef, type RefObject } from "react";
const heroVideo = "/api/videos/herovid1.mp4";
// SHIELD DESIGN PRESERVED — uncomment these to restore the shield look:
import shieldIcon from "@assets/shield_icon.png";
// import shieldGlassImg from "@/assets/shield-glass.png";
import logoImage from "@assets/insure_it_logo.png";
import floodImg from "@assets/flood_insurance.jpg";
import highFiveImg from "@assets/team_highfive.jpg";

import heroPoster from "@/assets/heroimage1.jpg";
import SectionDivider from "@/components/section-divider";

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
      ? "from-amber-600 to-amber-400"
      : type?.color === "teal"
        ? "from-teal-600 to-teal-400"
        : type?.color === "blue"
          ? "from-blue-700 to-blue-500"
          : type?.color === "indigo"
            ? "from-rose-600 to-purple-500"
            : type?.color === "red"
              ? "from-red-600 to-red-400"
              : "from-slate-600 to-slate-400";

  const pillColor =
    type?.color === "sky"
      ? "bg-amber-100 text-amber-700"
      : type?.color === "teal"
        ? "bg-teal-100 text-teal-700"
        : type?.color === "blue"
          ? "bg-blue-100 text-blue-700"
          : type?.color === "indigo"
            ? "bg-rose-100 text-rose-700"
            : type?.color === "red"
              ? "bg-red-100 text-red-700"
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
                  style={{ backgroundImage: `url(${type.image})` }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-80`}
                />
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-5 flex items-center gap-3">
                  <div className="text-white opacity-90">{type.icon}</div>
                  <div>
                    <p className="text-white/70 text-[11px] uppercase tracking-widest font-medium">
                      {t.insuranceModal.coverageLabel}
                    </p>
                    <h2 className="text-white text-xl font-bold leading-tight">
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
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${accentColor} hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md`}
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
}: {
  type: {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
    color: string;
  };
  index: number;
  onClick: () => void;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const colorClasses = {
    sky:    "from-amber-700/80 via-amber-600/70 to-amber-500/50",
    teal:   "from-teal-700/80 via-teal-600/65 to-teal-500/25",
    blue:   "from-blue-800/80 via-blue-700/65 to-blue-600/25",
    indigo: "from-rose-700/80 via-purple-700/65 to-purple-600/25",
    violet: "from-slate-700/80 via-slate-600/65 to-slate-500/25",
    green:  "from-emerald-700/80 via-emerald-600/65 to-emerald-500/25",
    red:    "from-red-700/80 via-red-600/65 to-red-500/25",
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
    iconAnimations[type.color as keyof typeof iconAnimations] || "";

  const scrimClass =
    type.color === "sky"    ? "from-amber-800/50" :
    type.color === "teal"   ? "from-teal-900/55" :
    type.color === "indigo" ? "from-rose-900/55" :
    type.color === "violet" ? "from-slate-900/55" :
    type.color === "red"    ? "from-red-900/55" :
                              "from-black/55";

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
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 h-[72px] sm:h-44 sm:hover:-translate-y-2 sm:hover:shadow-2xl sm:hover:shadow-black/30 select-none active:scale-[0.98]"
      style={{
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px -5px ${
              type.color === "sky"    ? "rgba(217, 119, 6, 0.45)" :
              type.color === "teal"   ? "rgba(13, 148, 136, 0.45)" :
              type.color === "blue"   ? "rgba(37, 99, 235, 0.45)" :
              type.color === "indigo" ? "rgba(225, 29, 72, 0.45)" :
              type.color === "red"    ? "rgba(220, 38, 38, 0.45)" :
                                        "rgba(100, 116, 139, 0.45)"
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
        className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${gradientClass}`}
      />

      {/* Dynamic mouse-following gradient (desktop only) */}
      <div
        className="hidden sm:block absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={dynamicGradientStyle}
      />

      {/* ── MOBILE: horizontal list row ── */}
      <div className="sm:hidden absolute inset-0 flex items-center gap-4 px-4 z-20">
        <div className={`shrink-0 text-white [&_svg]:w-7 [&_svg]:h-7 ${iconAnimation}`}>
          {type.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm leading-tight drop-shadow">
            {type.title}
          </h3>
          <p className="text-white/80 text-xs leading-snug mt-0.5 line-clamp-2">
            {type.description}
          </p>
        </div>
        <ArrowRight className="shrink-0 w-4 h-4 text-white/70" />
      </div>

      {/* ── DESKTOP: tile layout ── */}
      {/* Top gradient scrim for title legibility */}
      <div className={`hidden sm:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${scrimClass} to-transparent z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none`} />

      {/* Default state: icon + title at TOP */}
      <div className="hidden sm:block absolute inset-x-0 top-0 p-4 z-20 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
        <div className={`text-white mb-1.5 scale-75 origin-top-left -ml-0.5 ${(type.color === "indigo" || type.color === "red") ? "" : iconAnimation}`}>
          {(type.color === "indigo" || type.color === "red") ? (
            <div className={`origin-center ${iconAnimation}`}>
              {type.icon}
            </div>
          ) : type.icon}
        </div>
        <h3 className="text-base font-bold text-white leading-tight drop-shadow">
          {type.title}
        </h3>
      </div>

      {/* Auto card: crash particles (desktop only, hidden on hover) */}
      {type.color === "teal" && (
        <div className="hidden sm:block absolute top-5 left-[76px] z-30 pointer-events-none transition-opacity duration-200 group-hover:opacity-0">
          <div className="crash-particle crash-particle-loop-1" style={{ background: "rgba(255,255,255,0.85)" }} />
          <div className="crash-particle crash-particle-loop-2" style={{ background: "rgba(255,255,255,0.75)" }} />
          <div className="crash-particle crash-particle-loop-3" style={{ background: "rgba(255,255,255,0.7)" }} />
          <div className="crash-particle crash-particle-loop-4" style={{ background: "rgba(255,255,255,0.8)" }} />
          <div className="crash-particle crash-particle-loop-5" style={{ background: "rgba(255,255,255,0.65)" }} />
          <div className="crash-particle crash-particle-loop-6" style={{ background: "rgba(255,255,255,0.7)" }} />
        </div>
      )}

      {/* Hover state: full overlay with description */}
      <div className="hidden sm:flex absolute inset-0 bg-black/72 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex-col overflow-y-auto custom-scrollbar">
        <h3 className="text-white font-bold text-sm mb-2 leading-tight shrink-0">
          {type.title}
        </h3>
        <p className="text-slate-200 text-xs leading-relaxed">
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
  const cardOpacity = useMotionValue(0);
  const cardScale = useMotionValue(1);
  const dragControls = useDragControls();

  // Shield drag motion values
  const shieldX = useMotionValue(0);
  const shieldY = useMotionValue(0);
  const shieldDragged = useRef(false);

  // Only allow window drag on desktop (≥1024px) — mobile drag confuses users
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024
  );

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
    const onResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // setShieldZoom(getShieldZoom()); // SHIELD — uncomment to restore
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Shield fixed-position constants (responsive: sm = 640px)
  const SHIELD_RIGHT =
    typeof window !== "undefined" && window.innerWidth >= 640 ? 72 : 16;
  const SHIELD_TOP = 110;
  const SHIELD_SIZE =
    typeof window !== "undefined" && window.innerWidth >= 640 ? 80 : 64;

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
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      color: "sky",
    },
    {
      icon: <Car className="w-10 h-10" />,
      title: t.insurance.autoTitle,
      description: t.insurance.autoDesc,
      image:
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
      color: "teal",
    },
    {
      icon: <Waves className="w-10 h-10" />,
      title: t.insurance.floodTitle,
      description: t.insurance.floodDesc,
      image: floodImg,
      color: "blue",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: t.insurance.lifeTitle,
      description: t.insurance.lifeDesc,
      image:
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
      color: "indigo",
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: t.insurance.businessTitle,
      description: t.insurance.businessDesc,
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
      color: "violet",
    },
    {
      icon: <HeartPulse className="w-10 h-10" />,
      title: t.insurance.healthTitle,
      description: t.insurance.healthDesc,
      image:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
      color: "red",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroVisible(true);

    // First-load card entrance
    cardY.set(30);
    cardOpacity.set(0);
    const t1 = setTimeout(() => {
      animateValue(cardY, 0, { duration: 0.8, ease: "easeOut" });
      animateValue(cardOpacity, 1, { duration: 0.8, ease: "easeOut" });
    }, 200);

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 200) hasScrolledDown.current = true;
      setScrollY(y);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(t1);
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
        {/* Hero Video Background - Parallax with blur */}
        <div
          className="absolute -inset-x-0 -top-20 -bottom-40 will-change-transform dark:brightness-75 overflow-hidden bg-slate-900"
          style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.02)` }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroPoster}
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center 40%",
              aspectRatio: "16 / 9",
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
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
                    className={`flex items-center gap-1.5 px-4 py-2.5 bg-white/10 border-b border-white/20 ${isDesktop ? "cursor-grab active:cursor-grabbing" : ""}`}
                    onPointerDown={(e) => { if (isDesktop) dragControls.start(e); }}
                  >
                    <button
                      onClick={handleMinimize}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors"
                      aria-label="Minimize window"
                    />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                    <div className="w-3 h-3 rounded-full bg-green-400/60" />
                    <div className="flex-1 text-center text-[11px] font-medium text-white/55 select-none tracking-wide">
                      Insure-it Group Corp
                    </div>
                  </div>

                  {/* Window body */}
                  <div className="px-6 sm:px-10 py-4 sm:py-5 flex flex-col items-center gap-3 sm:gap-3.5">
                    {/* Logo — PNG fills the full content width, no clipping */}
                    <img
                      src={logoImage}
                      alt="Insure-it Group Corp"
                      className="w-full h-auto object-contain"
                      draggable={false}
                    />

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

                {/* Insurance Types: list on mobile, 3×2 grid on desktop */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                  {insuranceTypes.map((type, index) => (
                    <InsuranceCard
                      key={type.title}
                      type={type}
                      index={index}
                      onClick={() => setSelectedInsurance(type)}
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
        className="pt-8 pb-0 bg-muted dark:bg-slate-800 relative overflow-hidden dot-pattern"
        style={{ marginTop: 0, zIndex: 10, position: "relative", paddingBottom: 40 }}
      >
        <ScaledContainer desktopWidth={640}>
          <div className="px-4 sm:px-6 pb-4 relative z-10">
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
                    setTimeout(() => setAddressCopied(false), 2000);
                  }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-start gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-slate-200/80 transition-colors hover:bg-white active:bg-slate-50 cursor-pointer"
                >
                  {addressCopied ? (
                    <>
                      <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-green-600 whitespace-nowrap">Copied!</p>
                        <p className="text-[11px] text-green-500 whitespace-nowrap">Address copied to clipboard</p>
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

              {/* Right column: same height as map, content top + pills+button pinned to bottom */}
              <div className="flex flex-col h-[380px]">

                {/* Top: Title + bullets */}
                <div className="flex flex-col items-start text-left">
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

                {/* Bottom: pills + button pinned to bottom */}
                <div className="mt-auto flex flex-col items-start gap-3">
                  <div className="flex flex-nowrap gap-1.5 sm:gap-2">
                    <a
                      href="tel:+19049090897"
                      onClick={() => copyToClipboard("9049090897", "phone")}
                      data-testid="link-phone"
                      className="flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary cursor-pointer"
                      style={{ color: copiedContact === "phone" ? "var(--primary)" : undefined }}
                    >
                      {copiedContact === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                      {copiedContact === "phone" ? "Copied!" : "904-909-0897"}
                    </a>
                    <a
                      href="mailto:Insureit@insureitgroup.net"
                      onClick={() => copyToClipboard("Insureit@insureitgroup.net", "email")}
                      data-testid="link-email"
                      className="flex items-center gap-1 sm:gap-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary cursor-pointer"
                      style={{ color: copiedContact === "email" ? "var(--primary)" : undefined }}
                    >
                      {copiedContact === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                      {copiedContact === "email" ? "Copied!" : "Insureit@insureitgroup.net"}
                    </a>
                  </div>

                  <div className="relative">
                    <div className="absolute -inset-[5px] bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 rounded-xl opacity-40 blur-md animate-pulse pointer-events-none" />
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="animated-border-btn group relative overflow-hidden text-primary-foreground px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] select-none"
                      data-testid="button-get-quote-contact"
                    >
                      <span className="relative z-10">
                        {t.contact.getQuoted}
                        <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        </ScaledContainer>

        {/* Wave divider — all-blue waves, no white bottom */}
        <div className="relative z-20" style={{ marginTop: 20, marginBottom: -40 }}>
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
        <section className="py-6 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <TestimonialsCarousel />
          </div>
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
