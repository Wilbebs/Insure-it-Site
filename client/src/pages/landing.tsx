import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import PartnersCarousel from "@/components/partners-carousel";
import QuoteModal from "@/components/quote-modal";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate as animateValue,
} from "framer-motion";
import {
  Car,
  House,
  Heart,
  Building2,
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
  Minus,
  Waves,
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
import shieldIcon from "@assets/shield_icon.png";
import shieldGlassImg from "@/assets/shield-glass.png";
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
      ? "from-sky-600 to-sky-400"
      : type?.color === "blue"
        ? "from-blue-700 to-blue-500"
        : type?.color === "indigo"
          ? "from-indigo-700 to-indigo-500"
          : "from-violet-700 to-violet-500";

  const pillColor =
    type?.color === "sky"
      ? "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
      : type?.color === "blue"
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        : type?.color === "indigo"
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300";

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
    sky:   "from-sky-800 via-sky-800/70 to-sky-700/30",
    teal:  "from-teal-900 via-teal-900/70 to-teal-800/30",
    pink:  "from-pink-900 via-pink-900/70 to-pink-800/30",
    indigo:"from-indigo-900 via-indigo-900/70 to-indigo-800/30",
  };

  const iconAnimations = {
    sky:   "group-hover:animate-bounce-subtle",
    teal:  "group-hover:animate-ripple",
    pink:  "group-hover:animate-pulse-heart",
    indigo:"group-hover:animate-grow",
  };

  const gradientClass = colorClasses[type.color as keyof typeof colorClasses];
  const iconAnimation =
    iconAnimations[type.color as keyof typeof iconAnimations] || "";

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
      className="group relative rounded-xl overflow-hidden h-44 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 select-none"
      style={{
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px -5px ${
              type.color === "sky"   ? "rgba(56, 189, 248, 0.35)" :
              type.color === "teal"  ? "rgba(20, 184, 166, 0.35)" :
              type.color === "pink"  ? "rgba(236, 72, 153, 0.35)" :
                                       "rgba(99, 102, 241, 0.35)"
            }`
          : undefined,
      }}
      data-testid={`card-insurance-${type.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Glassmorphism border on hover */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent transition-all duration-300 group-hover:border-white/30 z-20 pointer-events-none" />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${type.image})` }}
      />

      {/* Base Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t transition-all duration-500 ${gradientClass}`}
      />

      {/* Dynamic mouse-following gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
        style={dynamicGradientStyle}
      />

      {/* Top gradient scrim for title legibility (default state only) */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />

      {/* Default state: icon + title at TOP */}
      <div className="absolute inset-x-0 top-0 p-3 sm:p-4 z-20 transition-opacity duration-200 group-hover:opacity-0 pointer-events-none">
        <div
          className={`text-white mb-1.5 scale-75 origin-top-left -ml-0.5 ${iconAnimation}`}
        >
          {type.icon}
        </div>
        <h3 className="text-base font-bold text-white leading-tight drop-shadow">
          {type.title}
        </h3>
      </div>

      {/* Hover state: full overlay with complete description */}
      <div className="absolute inset-0 bg-black/72 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 p-4 flex flex-col overflow-y-auto custom-scrollbar">
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
  const [isShieldHovered, setIsShieldHovered] = useState(false);
  const [shieldSweeping, setShieldSweeping] = useState(false);
  const highFiveRef = useRef<HTMLDivElement>(null);
  const [highFiveVisible, setHighFiveVisible] = useState(false);

  // Auto-cycle shield shimmer every 4 s
  useEffect(() => {
    const trigger = () => {
      setShieldSweeping(true);
      setTimeout(() => setShieldSweeping(false), 1100);
    };
    const id = setInterval(trigger, 4000);
    return () => clearInterval(id);
  }, []);

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
  const cardY = useMotionValue(30);
  const cardOpacity = useMotionValue(0);
  const cardScale = useMotionValue(1);

  // Shield drag motion values
  const shieldX = useMotionValue(0);
  const shieldY = useMotionValue(0);
  const shieldDragged = useRef(false);

  // Only allow window drag on desktop (≥1024px) — mobile drag confuses users
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024
  );
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
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
      icon: <Car className="w-10 h-10" />,
      title: t.insurance.homeAutoTitle,
      description: t.insurance.homeAutoDesc,
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      color: "sky",
    },
    {
      icon: <House className="w-10 h-10" />,
      title: t.insurance.floodTitle,
      description: t.insurance.floodDesc,
      image: floodImg,
      color: "teal",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: t.insurance.lifeTitle,
      description: t.insurance.lifeDesc,
      image:
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
      color: "pink",
    },
    {
      icon: <Building2 className="w-10 h-10" />,
      title: t.insurance.businessTitle,
      description: t.insurance.businessDesc,
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
      color: "indigo",
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
      await Promise.all([
        animateValue(cardX, cardX.get() + dx, {
          duration: 0.45,
          ease: [0.4, 0, 1, 1],
        }),
        animateValue(cardY, cardY.get() + dy, {
          duration: 0.45,
          ease: [0.4, 0, 1, 1],
        }),
        animateValue(cardOpacity, 0, { duration: 0.3, ease: [0.4, 0, 1, 1] }),
        animateValue(cardScale, 0.05, { duration: 0.45, ease: [0.4, 0, 1, 1] }),
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
    // Pre-set card to shield position before mounting
    cardX.set(restoreFrom.current.x);
    cardY.set(restoreFrom.current.y);
    cardOpacity.set(0);
    cardScale.set(0.05);
    isRestoring.current = true;
    sessionStorage.setItem("heroWindowMinimized", "false");
    setIsMinimized(false);
    // Animate to center after React renders the card
    requestAnimationFrame(() => {
      animateValue(cardX, 0, { duration: 0.55, ease: [0.22, 1.1, 0.36, 1] });
      animateValue(cardY, 0, { duration: 0.55, ease: [0.22, 1.1, 0.36, 1] });
      animateValue(cardOpacity, 1, { duration: 0.4, ease: "easeOut" });
      animateValue(cardScale, 1, {
        duration: 0.55,
        ease: [0.22, 1.1, 0.36, 1],
      });
    });
  };

  return (
    <div className="min-h-screen bg-background select-none">
      <Navigation />

      {/* Hero Section */}
      <section
        ref={heroRef as RefObject<HTMLElement>}
        className="flex items-center relative pt-20 sm:pt-24 pb-24"
        style={{ minHeight: "calc(100vh + 38px)" }}
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
        <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 md:px-16">
          <div className="w-full max-w-[933px] text-center">
            {!isMinimized && (
              <motion.div
                key="hero-card"
                drag={isDesktop}
                dragConstraints={heroRef as RefObject<Element>}
                dragElastic={0.05}
                dragMomentum={false}
                style={{
                  x: cardX,
                  y: cardY,
                  opacity: cardOpacity,
                  scale: cardScale,
                  cursor: isDesktop ? "grab" : "default",
                }}
                whileDrag={{ cursor: "grabbing" }}
              >
                {/* Wrapper: positions the border layer behind the card */}
                <div
                  className="relative"
                  onMouseEnter={() => {
                    setIsShieldHovered(true);
                    setShieldSweeping(false);
                    requestAnimationFrame(() => {
                      setShieldSweeping(true);
                      setTimeout(() => setShieldSweeping(false), 1100);
                    });
                  }}
                  onMouseLeave={() => {
                    setIsShieldHovered(false);
                    setShieldSweeping(false);
                    requestAnimationFrame(() => {
                      setShieldSweeping(true);
                      setTimeout(() => setShieldSweeping(false), 1100);
                    });
                  }}
                >
                  {/* Solid border layer — pulses brighter on hover */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      inset: "-5px",
                      WebkitMaskImage: `url(${shieldGlassImg})`,
                      maskImage: `url(${shieldGlassImg})`,
                      WebkitMaskSize: "100% 100%",
                      maskSize: "100% 100%",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      background: isShieldHovered
                        ? "rgba(255, 255, 255, 0.92)"
                        : "rgba(255, 255, 255, 0.65)",
                      filter: isShieldHovered ? "blur(6px)" : "blur(4px)",
                      transition: "background 0.35s ease, filter 0.35s ease",
                      zIndex: 0,
                    }}
                  />
                {/* Shield card — PNG mask defines the exact shape, CSS drives the frosted glass */}
                <div
                  ref={cardInnerRef}
                  className="relative z-10 flex flex-col backdrop-blur-[36px] bg-white/[0.14]"
                  style={{
                    WebkitMaskImage: `url(${shieldGlassImg})`,
                    maskImage: `url(${shieldGlassImg})`,
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    paddingTop: "22%",
                    paddingBottom: "28%",
                    paddingLeft: "8%",
                    paddingRight: "8%",
                  }}
                >
                  {/* Shimmer sweep — white light band sliding top→bottom, clipped by shield mask */}
                  <div
                    key={shieldSweeping ? "sweep-on" : "sweep-off"}
                    className={`absolute inset-0 pointer-events-none z-20 ${shieldSweeping ? "shield-sweep" : ""}`}
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0.26) 50%, rgba(255,255,255,0.12) 62%, transparent 100%)",
                    }}
                  />
                  {/* Minimize button */}
                  <button
                    onClick={handleMinimize}
                    className="absolute top-[18%] right-[12%] z-30 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center hover:bg-white/35 transition-all duration-200 group"
                    aria-label="Minimize"
                  >
                    <Minus className="w-4 h-4 text-white group-hover:text-blue-100 transition-colors" />
                  </button>

                  {/* Logo */}
                  <div className="relative mb-2 z-10">
                    <Logo size="large" showTagline={true} variant="white" />
                  </div>

                  {/* Mobile tagline — directly under logo */}
                  <p className="md:hidden text-base font-semibold italic tagline-shimmer select-none text-center mb-6">
                    Life&apos;s Uncertain. Your Coverage Isn&apos;t.
                  </p>

                  <div className="flex items-end justify-center gap-5 sm:gap-7 mt-6 md:mt-8 mb-[5px] md:mb-[18px]">
                    {[
                      { icon: <House className="w-5 h-5 sm:w-6 sm:h-6" />, label: t.hero.coverages[0], short: t.hero.coveragesShort[0], color: "text-sky-300" },
                      { icon: <Car className="w-5 h-5 sm:w-6 sm:h-6" />,   label: t.hero.coverages[1], short: t.hero.coveragesShort[1], color: "text-blue-300" },
                      { icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6" />, label: t.hero.coverages[2], short: t.hero.coveragesShort[2], color: "text-pink-300" },
                      { icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />, label: t.hero.coverages[3], short: t.hero.coveragesShort[3], color: "text-indigo-300" },
                      { icon: <Waves className="w-5 h-5 sm:w-6 sm:h-6" />, label: t.hero.coverages[4], short: t.hero.coveragesShort[4], color: "text-teal-300" },
                    ].map(({ icon, label, short, color }, i, arr) => (
                      <div key={label} className="flex items-end gap-5 sm:gap-7">
                        <div className="flex flex-col items-center gap-1 select-none">
                          <span className={`${color} drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]`}>{icon}</span>
                          <span className="text-white/80 text-[9px] sm:text-[11px] font-medium tracking-wide whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                            <span className="sm:hidden">{short}</span>
                            <span className="hidden sm:inline">{label}</span>
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <span className="self-stretch w-px bg-white/20 mb-1 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
                  >
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="animated-border-btn group relative overflow-hidden text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] select-none"
                      data-testid="button-get-quote"
                    >
                      <span className="relative z-10">
                        {t.hero.getQuoted}
                        <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                    </button>
                    <a
                      href="tel:+19049090897"
                      onClick={() => copyToClipboard("9049090897", "phone")}
                      className="bg-blue-400/30 backdrop-blur-sm border-2 border-blue-300/60 text-blue-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-500/50 hover:border-blue-300 hover:text-white transition-all flex items-center justify-center gap-3 select-none"
                      data-testid="button-call-us"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span className="flex flex-col items-start leading-none">
                        <span className="text-sm font-bold whitespace-nowrap">
                          {copiedContact === "phone"
                            ? "Copied!"
                            : "904-909-0897"}
                        </span>
                        <span className="text-[10px] font-medium opacity-75 whitespace-nowrap">
                          {t.hero.callUs}
                        </span>
                      </span>
                    </a>
                  </motion.div>
                </div>
                </div>{/* end drop-shadow wrapper */}
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
        style={{ marginTop: -62, zIndex: 5, height: 62 }}
      >
        <SectionDivider
          variant="wave-layered"
          position="bottom"
          wave1Color="hsla(205, 70%, 82%, 0.3)"
          wave2Color="hsla(205, 70%, 82%, 0.6)"
          wave3Color="#ffffff"
          height={62}
          noBgFill={false}
        />
      </div>

      {/* More than Insurace. Peace of Mind. */}
      <section
        className="py-10 bg-white dark:bg-slate-800 relative overflow-hidden dot-pattern"
        style={{
          marginTop: -18,
          position: "relative",
          zIndex: 30,
          paddingTop: 18,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4 select-none">
                  {t.whoWeAre.subtitle}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 select-none">
                  {t.whoWeAre.titleLine1}
                  <br />
                  <span className="text-primary">{t.whoWeAre.titleLine2}</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-6"></div>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6">
                  {t.whoWeAre.paragraph1}
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8">
                  {t.whoWeAre.paragraph2}
                </p>

                <button
                  onClick={() => (window.location.href = "/about")}
                  className="hidden md:block self-start group bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] select-none"
                  data-testid="button-read-more"
                >
                  {t.whoWeAre.meetTeam}
                  <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Insurance Types 2x2 Grid - aligned with button */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
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

        <div
          className="relative z-20"
          style={{ marginTop: 10, marginBottom: -40 }}
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
        className="pt-5 pb-0 bg-muted dark:bg-slate-800 relative overflow-hidden dot-pattern"
        style={{ marginTop: 0, zIndex: 10, position: "relative" }}
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Centered CTA block — Title → Map → Pills → Button */}
            <div className="flex flex-col items-center text-center gap-5 mb-8">

              {/* Title */}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3 select-none">
                  {t.contact.subtitle}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 select-none">
                  {t.contact.title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto" />
              </div>

              {/* Map — full width, original height */}
              <div className="relative h-[368px] sm:h-[428px] md:h-[488px] w-full">
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

              {/* Contact pills */}
              <div className="flex flex-nowrap gap-1.5 sm:gap-2 justify-center">
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

              {/* Get Quoted button */}
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

        {/* Wave divider — all-blue waves, no white bottom */}
        <div className="relative z-20" style={{ marginTop: 2, marginBottom: -2 }}>
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
        <section className="py-10 relative z-10">
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
                  {/* Arrow tail pointing down-right toward shield */}
                  <span className="absolute right-4 top-full border-[6px] border-transparent border-t-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={shieldIcon}
              alt="Restore"
              className="w-full h-full object-contain hover:scale-110 transition-transform duration-200 pointer-events-none"
            />
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
