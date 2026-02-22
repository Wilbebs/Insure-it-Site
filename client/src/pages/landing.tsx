import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import TestimonialsCarousel from "@/components/testimonials-carousel";
import PartnersCarousel from "@/components/partners-carousel";
import QuoteModal from "@/components/quote-modal";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Logo from "@/components/logo";
import { useTranslation } from "@/components/theme-provider";
import { useEffect, useState, useRef } from "react";
import jacksonvilleSkyline from "@assets/stock_images/jacksonville_florida_13db0295.jpg";
import shieldIcon from "@assets/512x512_icon-01_1764880603281.png";
import SectionDivider from "@/components/section-divider";

const floatingShields = [
  { top: "8%", left: "5%", size: 60, delay: 0, duration: 4 },
  { top: "15%", right: "8%", size: 45, delay: 0.5, duration: 3.5 },
  { top: "45%", left: "3%", size: 55, delay: 1, duration: 4.5 },
  { top: "70%", right: "4%", size: 50, delay: 1.5, duration: 3.8 },
  { top: "85%", left: "10%", size: 40, delay: 0.8, duration: 4.2 },
  { top: "25%", right: "3%", size: 35, delay: 2, duration: 3.6 },
  { top: "60%", left: "8%", size: 48, delay: 0.3, duration: 4.1 },
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
          className={`text-white mb-1 transition-all duration-300 group-hover:scale-110 ${iconAnimation}`}
        >
          {type.icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-1">{type.title}</h3>
        <p className="text-slate-200 text-sm leading-relaxed max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
          {type.description}
        </p>
      </div>
    </div>
  );
}

export default function Landing() {
  const { t } = useTranslation();
  const [heroVisible, setHeroVisible] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
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

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center relative pt-24 pb-20">
        {/* Jacksonville Skyline Background - Parallax with blur */}
        <div
          className="absolute -inset-x-0 -top-20 -bottom-40 bg-cover bg-center will-change-transform blur-[2.5px] dark:brightness-75"
          style={{
            backgroundImage: `url(${jacksonvilleSkyline})`,
            backgroundPosition: "center 40%",
            transform: `translateY(${scrollY * 0.4}px) scale(1.02)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center px-6 md:px-16">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Glass Window Container - Everything inside */}
              <div className="relative bg-white/20 backdrop-blur-xl rounded-3xl pt-2 md:pt-4 pb-8 px-8 md:pb-12 md:px-12 border border-white/30 shadow-2xl shadow-black/20 h-[400px] md:h-[430px] overflow-hidden">
                {/* Subtle gradient glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

                {/* Logo */}
                <div className="relative mb-4 z-10">
                  <Logo size="large" showTagline={true} variant="white" />
                </div>

                <p className="relative text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed mb-8 select-none">
                  {t.hero.tagline}
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    heroVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <button
                    onClick={() => setQuoteModalOpen(true)}
                    className="animated-border-btn group relative overflow-hidden text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] select-none"
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
                    className="bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 select-none"
                    data-testid="button-call-us"
                  >
                    <Phone className="w-5 h-5" />
                    {t.hero.callUs}
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
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

        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4 select-none">
                  {t.whoWeAre.subtitle}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 select-none">
                  {t.whoWeAre.titleLine1}
                  <br className="hidden md:block" />
                  <span className="text-primary">{t.whoWeAre.titleLine2}</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-6"></div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {t.whoWeAre.paragraph1}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {t.whoWeAre.paragraph2}
                </p>

                <button
                  onClick={() => (window.location.href = "/about")}
                  className="self-start group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] select-none"
                  data-testid="button-read-more"
                >
                  {t.whoWeAre.meetTeam}
                  <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Insurance Types 2x2 Grid - aligned with button */}
              <div className="grid grid-cols-2 gap-4">
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

      {/* Contact Info + Testimonials Section - Merged */}
      <section
        className="pb-20 bg-muted dark:bg-slate-800 relative overflow-hidden"
        style={{ marginTop: -1, paddingTop: "20px" }}
      >
        {floatingShields.map((shield, index) => (
          <FloatingShield
            key={index}
            style={{ top: shield.top, left: shield.left, right: shield.right }}
            size={shield.size}
            delay={shield.delay}
            duration={shield.duration}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Section header */}
            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4 select-none">
                {t.contact.subtitle}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 select-none">
                {t.contact.title}
              </h2>
            </div>

            {/* Get Quoted Today Button */}
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="animated-border-btn group relative overflow-hidden text-primary-foreground px-10 py-4 rounded-lg font-semibold text-lg shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] mb-12 select-none"
              data-testid="button-get-quote-contact"
            >
              <span className="relative z-10">
                {t.contact.getQuoted}
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div
                className="flex flex-col items-center gap-3"
                data-testid="contact-phone"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <a
                  href="tel:+13059185339"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                  data-testid="link-phone"
                >
                  (305) 918-5339
                </a>
              </div>

              <div
                className="flex flex-col items-center gap-3"
                data-testid="contact-email"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <a
                  href="mailto:info@insure-itgroup.com"
                  className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                  data-testid="link-email"
                >
                  info@insure-itgroup.com
                </a>
              </div>

              <div
                className="flex flex-col items-center gap-3"
                data-testid="contact-location"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <span
                  className="text-foreground font-medium"
                  data-testid="text-location"
                >
                  {t.contact.location}
                </span>
              </div>

              <div
                className="flex flex-col items-center gap-3"
                data-testid="contact-license"
              >
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <span
                  className="text-foreground font-medium"
                  data-testid="text-license"
                >
                  {t.contact.licensed}
                </span>
              </div>
            </div>
          </div>

          {/* Testimonials - matching "More Than Insurance" layout */}
          <div className="mt-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4 select-none">
                    {t.testimonials.subtitle}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 select-none">
                    {t.testimonials.title}
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mb-4"></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.testimonials.description}
                  </p>
                </div>
                <TestimonialsCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <PartnersCarousel />

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />

      {/* Quote Modal */}
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
