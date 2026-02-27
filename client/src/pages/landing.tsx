import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import PartnersCarousel from "@/components/partners-carousel";
import QuoteModal from "@/components/quote-modal";
import { motion, AnimatePresence, useMotionValue, animate as animateValue } from "framer-motion";
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
} from "lucide-react";
import Logo from "@/components/logo";
import { useTranslation } from "@/components/theme-provider";
import { useEffect, useState, useRef, type RefObject } from "react";
import heroVideo from "@assets/stock_images/herovid1.mp4";
import shieldIcon from "@assets/512x512_icon-01_1764880603281.png";
import floodImg from "@assets/flood_insurance.jpg";
import highFiveImg from "@assets/man-woman-business-workers-high-five-with-hands-raised-up-offi_1772211518867.jpg";
import SectionDivider from "@/components/section-divider";

const floatingShields = [
  { top: "5%", left: "3%", size: 50, delay: 0, duration: 4 },
  { top: "12%", left: "8%", size: 35, delay: 0.5, duration: 3.5 },
  { top: "5%", right: "4%", size: 45, delay: 1, duration: 4.5 },
  { top: "14%", right: "9%", size: 30, delay: 1.5, duration: 3.8 },
];

function FloatingShield({
  style,
  size,
  delay,
  duration,
}: {
  style: React.CSSProperties;
  size: number;
  delay: number;
  duration: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const shieldRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!shieldRef.current) return;
    const rect = shieldRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const dynamicGradientStyle = isHovered
    ? {
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
      }
    : {};

  return (
    <div
      ref={shieldRef}
      className={`absolute z-50 transition-all duration-300 cursor-pointer ${
        isHovered
          ? "opacity-100 scale-125"
          : "opacity-[0.12] dark:opacity-[0.15]"
      }`}
      style={{
        ...style,
        width: size,
        height: size,
        animation: `float-bob ${duration}s ease-in-out ${delay}s infinite`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={shieldIcon}
        alt=""
        className="w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
      />
      {/* Dynamic mouse-following shimmer - on top of image */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none mix-blend-overlay ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={dynamicGradientStyle}
      />
    </div>
  );
}

function InsuranceCard({
  type,
  index,
}: {
  type: {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
    color: string;
  };
  index: number;
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
    sky: "from-sky-800 via-sky-800/70 to-sky-700/30",
    blue: "from-blue-900 via-blue-900/70 to-blue-800/30",
    indigo: "from-indigo-900 via-indigo-900/70 to-indigo-800/30",
    violet: "from-violet-900 via-violet-900/70 to-violet-800/30",
  };

  const iconAnimations = {
    sky: "group-hover:animate-bounce-subtle",
    blue: "group-hover:animate-ripple",
    indigo: "group-hover:animate-pulse-heart",
    violet: "group-hover:animate-grow",
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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl overflow-hidden h-44 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30"
      style={{
        boxShadow: isHovered
          ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px -5px ${type.color === "sky" ? "rgba(56, 189, 248, 0.3)" : type.color === "blue" ? "rgba(59, 130, 246, 0.3)" : type.color === "indigo" ? "rgba(99, 102, 241, 0.3)" : "rgba(139, 92, 246, 0.3)"}`
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

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-300 group-hover:-translate-y-2 z-10">
        <div
          className={`text-white mb-1 transition-all duration-300 max-h-10 overflow-hidden group-hover:max-h-0 group-hover:opacity-0 group-hover:mb-0 ${iconAnimation}`}
        >
          {type.icon}39
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{type.title}</h3>
        <p className="text-slate-200 text-xs leading-relaxed max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-32 group-hover:opacity-100">
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
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

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

  // Shield fixed-position constants (responsive: sm = 640px)
  const SHIELD_RIGHT = typeof window !== "undefined" && window.innerWidth >= 640 ? 72 : 16;
  const SHIELD_TOP = 110;
  const SHIELD_SIZE = typeof window !== "undefined" && window.innerWidth >= 640 ? 80 : 64;

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

    const handleScroll = () => setScrollY(window.scrollY);
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

  const handleMinimize = async () => {
    isRestoring.current = false;
    if (cardInnerRef.current) {
      const cardRect = cardInnerRef.current.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const shieldLeft = window.innerWidth - SHIELD_RIGHT - SHIELD_SIZE + shieldX.get();
      const shieldCenterX = shieldLeft + SHIELD_SIZE / 2;
      const shieldCenterY = SHIELD_TOP + shieldY.get() + SHIELD_SIZE / 2;
      const dx = shieldCenterX - cardCenterX;
      const dy = shieldCenterY - cardCenterY;
      await Promise.all([
        animateValue(cardX, cardX.get() + dx, { duration: 0.45, ease: [0.4, 0, 1, 1] }),
        animateValue(cardY, cardY.get() + dy, { duration: 0.45, ease: [0.4, 0, 1, 1] }),
        animateValue(cardOpacity, 0, { duration: 0.3, ease: [0.4, 0, 1, 1] }),
        animateValue(cardScale, 0.05, { duration: 0.45, ease: [0.4, 0, 1, 1] }),
      ]);
    }
    setIsMinimized(true);
    cardX.set(0); cardY.set(0); cardOpacity.set(0); cardScale.set(1);
  };

  const handleRestore = () => {
    if (heroRef.current) {
      const heroRect = heroRef.current.getBoundingClientRect();
      const cardNaturalCenterX = heroRect.left + heroRect.width / 2;
      const cardNaturalCenterY = heroRect.top + heroRect.height / 2;
      const shieldLeft = window.innerWidth - SHIELD_RIGHT - SHIELD_SIZE + shieldX.get();
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
    setIsMinimized(false);
    // Animate to center after React renders the card
    requestAnimationFrame(() => {
      animateValue(cardX, 0, { duration: 0.55, ease: [0.22, 1.1, 0.36, 1] });
      animateValue(cardY, 0, { duration: 0.55, ease: [0.22, 1.1, 0.36, 1] });
      animateValue(cardOpacity, 1, { duration: 0.4, ease: "easeOut" });
      animateValue(cardScale, 1, { duration: 0.55, ease: [0.22, 1.1, 0.36, 1] });
    });
  };

  return (
    <div className="min-h-screen bg-background select-none">
      <Navigation />

      {/* Hero Section */}
      <section ref={heroRef as RefObject<HTMLElement>} className="min-h-screen flex items-center relative pt-20 sm:pt-24 pb-24">
        {/* Hero Video Background - Parallax with blur */}
        <div
          className="absolute -inset-x-0 -top-20 -bottom-40 will-change-transform dark:brightness-75 overflow-hidden"
          style={{ transform: `translateY(${scrollY * 0.4}px) scale(1.02)` }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 40%" }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center px-4 sm:px-6 md:px-16">
          <div className="w-full max-w-[575px] text-center">
            {!isMinimized && (
              <motion.div
                key="hero-card"
                drag
                dragConstraints={heroRef as RefObject<Element>}
                dragElastic={0.05}
                dragMomentum={false}
                style={{ x: cardX, y: cardY, opacity: cardOpacity, scale: cardScale, cursor: "grab" }}
                whileDrag={{ cursor: "grabbing" }}
              >
              {/* Glass Window Container - Everything inside */}
              <div ref={cardInnerRef} className="relative flex flex-col md:block bg-white/20 backdrop-blur-xl rounded-3xl pt-4 pb-[10px] px-4 sm:px-8 md:pb-[12px] md:px-12 border border-white/30 shadow-2xl shadow-black/20 h-[380px] sm:h-[390px] md:h-auto overflow-hidden">
                {/* Minimize button */}
                <button
                  onClick={handleMinimize}
                  className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-blue-400/30 backdrop-blur-sm border border-blue-300/50 flex items-center justify-center hover:bg-blue-500/50 hover:border-blue-300 transition-all duration-200 group"
                  aria-label="Minimize"
                >
                  <Minus className="w-4 h-4 text-blue-700 group-hover:text-white transition-colors" />
                </button>

                {/* Subtle gradient glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

                {/* Logo */}
                <div className="relative mt-[19px] md:mt-[37px] mb-auto md:mb-[7px] z-10 md:-mx-12">
                  <Logo size="large" showTagline={true} variant="white" />
                </div>

                {/* Mobile tagline — sits right above paragraph */}
                <p className="md:hidden text-base font-semibold italic tagline-shimmer select-none text-center mb-1">
                  Life&apos;s Uncertain. Your Coverage Isn&apos;t.
                </p>

                <div className="flex flex-nowrap gap-1 sm:gap-1.5 justify-center mb-[5px] md:mb-[18px]">
                  {[
                    { icon: <House className="w-3 h-3" />, label: t.hero.coverages[0] },
                    { icon: <Car className="w-3 h-3" />, label: t.hero.coverages[1] },
                    { icon: <Heart className="w-3 h-3" />, label: t.hero.coverages[2] },
                    { icon: <Building2 className="w-3 h-3" />, label: t.hero.coverages[3] },
                    { icon: <Waves className="w-3 h-3" />, label: t.hero.coverages[4] },
                  ].map(({ icon, label }) => (
                    <span key={label} className="flex items-center gap-1 bg-white/25 backdrop-blur-sm border border-white/50 text-slate-700 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm whitespace-nowrap">
                      {icon}
                      {label}
                    </span>
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
                    href="tel:+13059185339"
                    className="bg-blue-400/30 backdrop-blur-sm border-2 border-blue-300/60 text-blue-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-500/50 hover:border-blue-300 hover:text-white transition-all flex items-center justify-center gap-2 select-none"
                    data-testid="button-call-us"
                  >
                    <Phone className="w-5 h-5" />
                    {t.hero.callUs}
                  </a>
                </motion.div>
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

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <SectionDivider
            variant="wave-layered"
            position="bottom"
            fromColor="#ffffff"
            toColor="#ffffff"
            wave1Color="hsla(205, 70%, 82%, 0.3)"
            wave2Color="hsla(205, 70%, 82%, 0.6)"
            wave3Color="#ffffff"
            height={70}
            noBgFill={false}
          />
        </div>
      </section>

      {/* Who We Are Section */}
      <section
        className="py-10 bg-white dark:bg-slate-800 relative overflow-hidden"
        style={{ marginTop: -40 }}
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
                  <InsuranceCard key={type.title} type={type} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative z-20"
          style={{ marginTop: 10, marginBottom: -55 }}
        >
          <SectionDivider
            variant="wave-layered"
            position="bottom"
            toColor="hsl(210, 40%, 94%)"
            wave1Color="hsla(205, 70%, 82%, 0.3)"
            wave2Color="hsla(205, 70%, 82%, 0.6)"
            wave3Color="hsl(210, 40%, 94%)"
            height={60}
          />
        </div>
      </section>

      {/* Contact + Map Section */}
      <section
        className="pt-5 pb-0 bg-muted dark:bg-slate-800 relative overflow-hidden"
        style={{ marginTop: -1, zIndex: 10, position: "relative" }}
      >
        <div className="hidden lg:contents">
          {floatingShields.map((shield, index) => (
            <FloatingShield
              key={index}
              style={{
                top: shield.top,
                left: shield.left,
                right: shield.right,
              }}
              size={shield.size}
              delay={shield.delay}
              duration={shield.duration}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">

            {/* Centered CTA block */}
            <div className="flex flex-col items-center text-center gap-5 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3 select-none">
                  {t.contact.subtitle}
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 select-none">
                  {t.contact.title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto" />
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

              {/* Contact pills */}
              <div className="flex flex-wrap gap-2 justify-center">
                <a
                  href="tel:+13059185339"
                  onClick={() => copyToClipboard("3059185339", "phone")}
                  data-testid="link-phone"
                  className="flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  style={{ color: copiedContact === "phone" ? "var(--primary)" : undefined }}
                >
                  {copiedContact === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                  {copiedContact === "phone" ? "Copied!" : "(305) 918-5339"}
                </a>
                <a
                  href="mailto:info@insure-itgroup.com"
                  onClick={() => copyToClipboard("info@insure-itgroup.com", "email")}
                  data-testid="link-email"
                  className="flex items-center gap-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm whitespace-nowrap transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  style={{ color: copiedContact === "email" ? "var(--primary)" : undefined }}
                >
                  {copiedContact === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                  {copiedContact === "email" ? "Copied!" : "info@insure-itgroup.com"}
                </a>
              </div>
            </div>

            {/* Full-width Map */}
            {(() => {
              const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
              const src = apiKey
                ? `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=30.1540,-81.6549&heading=90&pitch=0&fov=75`
                : null;
              return (
                <div className="animated-border-panel rounded-2xl shadow-xl overflow-hidden h-[180px] sm:h-[220px] md:h-[260px] w-full">
                  {src ? (
                    <iframe
                      src={src}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: "block" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Insure IT Group Office - Street View"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-700 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                      <MapPin className="w-8 h-8" />
                      <p className="text-sm font-medium">Street View</p>
                      <p className="text-xs">11570 San Jose Blvd, Suite 11</p>
                      <p className="text-xs">Jacksonville, FL 32223</p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Address below map */}
            <div className="flex items-center justify-center gap-1.5 mt-3 mb-6 text-xs text-muted-foreground select-none">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>11570 San Jose Blvd, Suite 11 · Jacksonville, FL 32223</span>
            </div>

          </div>
        </div>

        {/* Wave divider — all-blue waves, no white bottom */}
        <div className="relative z-20" style={{ marginBottom: -2 }}>
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

      {/* Testimonials + Partners — shared parallax background, flush against wave */}
      <div
        className="relative"
        style={{
          marginTop: -65,
          backgroundImage: `url(${highFiveImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Very light overlay — image shows through, cards carry readability */}
        <div className="absolute inset-0 bg-white/25 dark:bg-slate-900/55" />

        {/* Testimonials — top padding accounts for wave overlap */}
        <div className="relative z-10 pb-2" style={{ paddingTop: 92 }}>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <TestimonialsCarousel />
            </div>
          </div>
        </div>

        {/* Partners Carousel — frosted glass panel, ~10px below testimonials */}
        <div className="relative z-10" style={{ marginTop: 10 }}>
          <div className="backdrop-blur-md bg-white/65 dark:bg-slate-900/75 border-t border-white/40 dark:border-slate-700/60">
            <PartnersCarousel className="bg-transparent border-none" />
          </div>
        </div>
      </div>

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />

      {/* Shield restore button — lives at root level so no stacking context can trap it */}
      <AnimatePresence>
        {isMinimized && (
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
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            onDrag={(_e, info) => {
              if (Math.abs(info.offset.x) > 6 || Math.abs(info.offset.y) > 6) {
                shieldDragged.current = true;
              }
            }}
            onDragEnd={() => { setTimeout(() => { shieldDragged.current = false; }, 0); }}
            onClick={() => { if (!shieldDragged.current) handleRestore(); }}
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
                      background: 'conic-gradient(from var(--border-angle), #38bdf8, #2563eb, #818cf8, #a78bfa, #38bdf8)',
                      animation: 'border-rotate-slow 4s linear infinite',
                    }}
                  >
                    <div className="relative bg-white text-slate-700 text-[11px] font-semibold px-3 py-2 rounded-[10px] whitespace-nowrap">
                      Tap to reopen the Insure IT window!
                    </div>
                  </div>
                  {/* Arrow tail pointing down-right toward shield */}
                  <span className="absolute right-4 top-full border-[6px] border-transparent border-t-blue-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <img src={shieldIcon} alt="Restore" className="w-full h-full object-contain hover:scale-110 transition-transform duration-200 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
