import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import QuoteModal from "@/components/quote-modal";
import SectionDivider from "@/components/section-divider";
import { Shield, Users, Award, Clock, ArrowRight } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/components/theme-provider";
import wilbertPhoto from "@assets/image_1764878413663.png";
import elizabethPhoto from "@assets/image_1764878433544.png";
import davidPhoto from "@assets/image_1765442735571.png";
import shieldIcon from "@assets/512x512_icon-01_1764880603281.png";
import familyRiverImg from "@assets/jax_beach_pier.jpg";

const floatingShields = [
  { top: "5%", left: "5%", size: 55, delay: 0, duration: 4 },
  { top: "10%", right: "8%", size: 40, delay: 0.5, duration: 3.5 },
  { top: "50%", left: "3%", size: 50, delay: 1, duration: 4.5 },
  { top: "75%", right: "5%", size: 45, delay: 1.5, duration: 3.8 },
  { top: "85%", left: "8%", size: 35, delay: 0.8, duration: 4.2 },
];

const stats = [
  { value: "2011", label: "Founded" },
  { value: "14+", label: "Years Serving Florida" },
  { value: "1000s", label: "Clients Protected" },
  { value: "FL", label: "Statewide Coverage" },
];

const commitments = [
  {
    icon: Shield,
    title: "Your Protection First",
    desc: "We put coverage quality above commission. Independent means we work for you, not the carrier.",
    color: "text-sky-500",
    bg: "bg-sky-50 dark:bg-sky-900/20",
  },
  {
    icon: Award,
    title: "Top-Rated Carriers",
    desc: "We partner exclusively with A-rated insurance companies so your policy is backed by financial strength.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Clock,
    title: "Fast, Same-Day Quotes",
    desc: "We respect your time. Most quotes are ready the same day — often within the hour.",
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    icon: Users,
    title: "Family-Owned Values",
    desc: "Since 2011 the Hernandez family has treated every client like a neighbor. That never changes.",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
];

function SocialButton({
  href,
  icon,
  label,
  colorClass,
  hoverColorClass,
  textHoverClass,
  testId,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  hoverColorClass: string;
  textHoverClass: string;
  testId: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const dynamicGradientStyle = isHovered
    ? {
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.5) 0%, transparent 60%)`,
      }
    : {};

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-center"
      data-testid={testId}
    >
      <div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden ${colorClass} p-6 rounded-2xl hover-lift transition-all duration-300 ${hoverColorClass} flex items-center justify-center`}
      >
        {icon}
        <div
          className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? "opacity-100" : "opacity-0"}`}
          style={dynamicGradientStyle}
        />
      </div>
      <p
        className={`mt-3 font-semibold text-muted-foreground ${textHoverClass} transition-colors`}
      >
        {label}
      </p>
    </a>
  );
}

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
        isHovered ? "opacity-100 scale-125" : "opacity-[0.12] dark:opacity-[0.15]"
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
      <div
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none mix-blend-overlay ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={dynamicGradientStyle}
      />
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const [lastParagraphText, setLastParagraphText] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    const openQuote = () => setQuoteModalOpen(true);
    window.addEventListener("open-quote-modal", openQuote);
    return () => window.removeEventListener("open-quote-modal", openQuote);
  }, []);

  const fullLastParagraph = t.about.storyP4;
  const fullSignature = t.about.signature;

  useEffect(() => {
    setLastParagraphText("");
    setSignatureText("");
    setShowCursor(false);

    const intervals: ReturnType<typeof setInterval>[] = [];

    let paragraphIndex = 0;
    const paragraphInterval = setInterval(() => {
      if (paragraphIndex <= fullLastParagraph.length) {
        setLastParagraphText(fullLastParagraph.slice(0, paragraphIndex));
        paragraphIndex++;
      } else {
        clearInterval(paragraphInterval);
        let signatureIndex = 0;
        const signatureInterval = setInterval(() => {
          if (signatureIndex <= fullSignature.length) {
            setSignatureText(fullSignature.slice(0, signatureIndex));
            signatureIndex++;
          } else {
            clearInterval(signatureInterval);
            setShowCursor(true);
          }
        }, 30);
        intervals.push(signatureInterval);
      }
    }, 20);
    intervals.push(paragraphInterval);

    return () => intervals.forEach((id) => clearInterval(id));
  }, [fullLastParagraph, fullSignature]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero — Story Window */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${familyRiverImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-slate-900/60" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-4xl mx-auto bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-2xl border border-white/30">
            {/* Section heading — matches landing page pattern */}
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300 font-semibold mb-3 text-center select-none">
              WHO WE ARE
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white text-center">
              {t.about.ourStory}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-400 to-blue-400 rounded-full mx-auto mb-8" />

            <div className="space-y-6 text-base sm:text-lg text-white leading-relaxed">
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
              <p>{t.about.storyP3}</p>
              <p className="font-semibold text-white min-h-[8rem]">
                {lastParagraphText}
                {lastParagraphText.length > 0 &&
                  lastParagraphText.length < fullLastParagraph.length && (
                    <span className="animate-pulse">|</span>
                  )}
              </p>
              <p className="text-center italic text-white pt-4 text-lg sm:text-xl font-semibold min-h-[2rem]">
                {signatureText.length > 0 && '"'}
                {signatureText}
                {signatureText.length > 0 &&
                  signatureText.length < fullSignature.length && (
                    <span className="animate-pulse">|</span>
                  )}
                {signatureText.length === fullSignature.length && '"'}
                {showCursor && <span className="typing-cursor">|</span>}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <SectionDivider
            variant="wave-layered"
            position="bottom"
            fromColor="hsl(210, 40%, 94%)"
            toColor="hsl(210, 40%, 94%)"
            wave1Color="hsla(205, 70%, 82%, 0.3)"
            wave2Color="hsla(205, 70%, 82%, 0.6)"
            wave3Color="hsl(210, 40%, 94%)"
            height={70}
          />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary py-6" style={{ marginTop: -1 }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs sm:text-sm text-white/70 font-medium uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="py-12 bg-muted dark:bg-slate-900 relative overflow-hidden">
        <div className="hidden lg:contents">
          {floatingShields.slice(0, 3).map((shield, index) => (
            <FloatingShield
              key={index}
              style={{ top: shield.top, left: shield.left, right: shield.right }}
              size={shield.size}
              delay={shield.delay}
              duration={shield.duration}
            />
          ))}
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2 select-none">
              HOW WE WORK
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Our Commitments to You
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {commitments.map((c) => (
              <div
                key={c.title}
                className={`${c.bg} rounded-2xl p-5 border border-white/60 dark:border-slate-700/60 shadow-sm`}
              >
                <c.icon className={`w-7 h-7 ${c.color} mb-3`} />
                <h3 className="font-bold text-foreground text-sm mb-1.5">{c.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team + Social */}
      <section className="pb-10 pt-12 bg-muted dark:bg-slate-900 relative overflow-hidden border-t border-border">
        <div className="hidden lg:contents">
          {floatingShields.slice(2).map((shield, index) => (
            <FloatingShield
              key={index}
              style={{ top: shield.top, left: shield.left, right: shield.right }}
              size={shield.size}
              delay={shield.delay}
              duration={shield.duration}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section heading — matches landing page pattern */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2 select-none">
              OUR PEOPLE
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {t.about.meetTeam}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto" />
          </div>

          {/* Team cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Wilbert Hernandez */}
            <div
              className="insurance-card rounded-2xl overflow-hidden hover-lift"
              data-testid="team-member-wilbert-hernandez"
            >
              <div className="aspect-square overflow-hidden relative group">
                <img
                  src={wilbertPhoto}
                  alt="Wilbert Hernandez - President"
                  className="w-full h-full object-cover scale-[1.1]"
                  style={{ objectPosition: "center calc(50% + 8px)" }}
                />
                <a
                  href="https://www.linkedin.com/in/hernandez-wilbert/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-primary hover:scale-110 transition-all duration-300 z-10 group/li"
                  data-testid="linkedin-wilbert-hernandez"
                >
                  <FaLinkedin className="w-5 h-5 text-primary group-hover/li:text-white transition-colors duration-300" />
                </a>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold mb-0.5">Wilbert Hernandez</h3>
                <p className="text-primary font-semibold text-sm mb-1">{t.about.president}</p>
                <p className="text-xs text-muted-foreground">Co-founder & visionary behind Insure-it Group's growth across Florida.</p>
              </div>
            </div>

            {/* Elizabeth Hernandez */}
            <div
              className="insurance-card rounded-2xl overflow-hidden hover-lift"
              data-testid="team-member-elizabeth-hernandez"
            >
              <div className="aspect-square overflow-hidden relative group">
                <img
                  src={elizabethPhoto}
                  alt="Elizabeth Hernandez - Operations Manager"
                  className="w-full h-full object-cover object-top"
                />
                <a
                  href="https://www.linkedin.com/in/hernandez-wilbert/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-primary hover:scale-110 transition-all duration-300 z-10 group/li"
                  data-testid="linkedin-elizabeth-hernandez"
                >
                  <FaLinkedin className="w-5 h-5 text-primary group-hover/li:text-white transition-colors duration-300" />
                </a>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold mb-0.5">Elizabeth Hernandez</h3>
                <p className="text-primary font-semibold text-sm mb-1">{t.about.operationsManager}</p>
                <p className="text-xs text-muted-foreground">Keeps the agency running smoothly so clients always get fast, reliable service.</p>
              </div>
            </div>

            {/* David Hernandez */}
            <div
              className="insurance-card rounded-2xl overflow-hidden hover-lift"
              data-testid="team-member-david-hernandez"
            >
              <div className="aspect-square overflow-hidden relative group">
                <img
                  src={davidPhoto}
                  alt="David Hernandez - Account Executive"
                  className="w-full h-full object-cover scale-[1.15] object-top"
                />
                <a
                  href="https://www.linkedin.com/in/hernandez-wilbert/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-primary hover:scale-110 transition-all duration-300 z-10 group/li"
                  data-testid="linkedin-david-hernandez"
                >
                  <FaLinkedin className="w-5 h-5 text-primary group-hover/li:text-white transition-colors duration-300" />
                </a>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold mb-0.5">David Hernandez</h3>
                <p className="text-primary font-semibold text-sm mb-1">{t.about.accountExecutive}</p>
                <p className="text-xs text-muted-foreground">Your go-to for personalized policy advice and finding the best fit for your needs.</p>
              </div>
            </div>
          </div>

          {/* Social section */}
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-6 max-w-xl mx-auto">
              {t.about.connectDesc}
            </p>
            <div className="flex justify-center gap-6 sm:gap-8">
              <SocialButton
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                icon={<FaLinkedin className="w-12 h-12 sm:w-16 sm:h-16 text-primary group-hover:text-white transition-colors duration-300 relative z-10" />}
                label="LinkedIn"
                colorClass="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
                hoverColorClass="group-hover:from-blue-500 group-hover:to-blue-600"
                textHoverClass="group-hover:text-primary"
                testId="social-linkedin"
              />
              <SocialButton
                href="https://www.instagram.com/insureitgroup/"
                icon={<FaInstagram className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600 dark:text-pink-400 group-hover:text-white transition-colors duration-300 relative z-10" />}
                label="Instagram"
                colorClass="bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50"
                hoverColorClass="group-hover:from-pink-500 group-hover:to-purple-600"
                textHoverClass="group-hover:text-pink-600"
                testId="social-instagram"
              />
              <SocialButton
                href="https://www.facebook.com/insureitgroup"
                icon={<FaFacebook className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300 relative z-10" />}
                label="Facebook"
                colorClass="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
                hoverColorClass="group-hover:from-blue-600 group-hover:to-blue-700"
                textHoverClass="group-hover:text-blue-600"
                testId="social-facebook"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-10 bg-gradient-to-r from-blue-700 to-sky-600">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Ready to Protect What Matters?</h2>
          <p className="text-white/80 text-sm mb-5">Get a free, no-pressure quote from our team — usually ready the same day.</p>
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-2.5 rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg text-sm"
          >
            Get a Free Quote
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
