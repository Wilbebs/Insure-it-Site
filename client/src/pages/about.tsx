import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import QuoteModal from "@/components/quote-modal";
import SectionDivider from "@/components/section-divider";
import { Shield, Users, Award, Clock } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/components/theme-provider";
import wilbertPhoto from "@assets/image_1764878413663.png";
import elizabethPhoto from "@assets/image_1764878433544.png";
import davidPhoto from "@assets/image_1765442735571.png";
import familyRiverImg from "@assets/jax_beach_pier.jpg";


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


export default function About() {
  const { t } = useTranslation();
  const [titleText, setTitleText] = useState("");
  const [lastParagraphText, setLastParagraphText] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    const openQuote = () => setQuoteModalOpen(true);
    window.addEventListener("open-quote-modal", openQuote);
    return () => window.removeEventListener("open-quote-modal", openQuote);
  }, []);

  const fullTitle = t.about.ourStory;
  const fullLastParagraph = t.about.storyP4;
  const fullSignature = t.about.signature;

  useEffect(() => {
    setTitleText("");
    setLastParagraphText("");
    setSignatureText("");
    setShowCursor(false);

    const intervals: ReturnType<typeof setInterval>[] = [];
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      if (titleIndex <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, titleIndex));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
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
      }
    }, 100);
    intervals.push(titleInterval);

    return () => intervals.forEach((id) => clearInterval(id));
  }, [fullTitle, fullLastParagraph, fullSignature]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section with Family Portrait Background */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: 'calc(100vh + 43px)' }}>
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              `url(${familyRiverImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
        </div>

        {/* Floating Story Window */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-6">
          <div className="max-w-3xl mx-auto bg-white/40 dark:bg-slate-900/50 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 shadow-2xl border border-white/40">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-slate-800 text-center">
              {t.about.ourStory}
            </h2>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-base text-slate-700 leading-relaxed">
              <p>{t.about.storyP1}</p>
              <p>{t.about.storyP2}</p>
              <p>{t.about.storyP3}</p>
              <p className="font-semibold text-slate-800 min-h-[3rem] sm:min-h-[4.5rem]">
                {lastParagraphText}
                {lastParagraphText.length > 0 &&
                  lastParagraphText.length < fullLastParagraph.length && (
                    <span className="animate-pulse">|</span>
                  )}
              </p>
              <p className="text-center italic text-slate-600 pt-1 text-xs sm:text-base font-semibold min-h-[1.25rem] sm:min-h-[1.5rem]">
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
        {/* Wave divider at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <SectionDivider
            variant="wave-layered"
            position="bottom"
            fromColor="hsl(210, 40%, 94%)"
            toColor="hsl(210, 40%, 94%)"
            wave1Color="hsla(205, 70%, 82%, 0.3)"
            wave2Color="hsla(205, 70%, 82%, 0.6)"
            wave3Color="hsl(210, 40%, 94%)"
            height={81}
          />
        </div>
      </section>

      <section
        className="pb-1 sm:pb-2 bg-muted dark:bg-slate-900 dot-pattern"
        style={{ marginTop: -1, paddingTop: "0px" }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Connect With Us Section - Team + Social */}
          <div className="mb-6 sm:mb-10 relative overflow-hidden">
            <div className="text-center mb-6 sm:mb-10 relative z-10">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3 select-none">
                {t.about.ourPeople}
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 select-none">
                {t.about.meetTeam}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 sm:gap-8 max-w-4xl mx-auto relative z-10">
              {/* Wilbert Hernandez - President */}
              <div
                className="insurance-card rounded-2xl overflow-hidden hover-lift"
                data-testid="team-member-wilbert-hernandez"
              >
                <div className="aspect-[3/4] overflow-hidden relative group">
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
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-wilbert-hernandez"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-3 sm:p-6 text-center">
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">Wilbert Hernandez</h3>
                  <p className="text-primary font-medium text-xs sm:text-base">
                    {t.about.president}
                  </p>
                </div>
              </div>

              {/* Elizabeth Hernandez - Operations Manager */}
              <div
                className="insurance-card rounded-2xl overflow-hidden hover-lift"
                data-testid="team-member-elizabeth-hernandez"
              >
                <div className="aspect-[3/4] overflow-hidden relative group">
                  <img
                    src={elizabethPhoto}
                    alt="Elizabeth Hernandez - Operations Manager"
                    className="w-full h-full object-cover object-top"
                  />
                  <a
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-elizabeth-hernandez"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-3 sm:p-6 text-center">
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">
                    Elizabeth Hernandez
                  </h3>
                  <p className="text-primary font-medium text-xs sm:text-base">
                    {t.about.operationsManager}
                  </p>
                </div>
              </div>

              {/* David Hernandez - Account Executive */}
              <div
                className="insurance-card rounded-2xl overflow-hidden hover-lift col-span-2 max-w-[50%] mx-auto w-full lg:col-span-1 lg:max-w-none"
                data-testid="team-member-david-hernandez"
              >
                <div className="aspect-[3/4] overflow-hidden relative group">
                  <img
                    src={davidPhoto}
                    alt="David Hernandez - Account Executive"
                    className="w-full h-full object-cover scale-[1.15] object-top"
                  />
                  <a
                    href="https://www.linkedin.com/in/hernandez-wilbert/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-david-hernandez"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-3 sm:p-6 text-center">
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">David Hernandez</h3>
                  <p className="text-primary font-medium text-xs sm:text-base">
                    {t.about.accountExecutive}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-base text-muted-foreground mt-4 mb-4 mx-auto text-center relative z-10 sm:whitespace-nowrap">
              {t.about.connectDesc}
            </p>
            <div className="flex justify-center gap-6 sm:gap-8 relative z-10">
              <SocialButton
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                icon={
                  <FaLinkedin className="w-12 h-12 sm:w-16 sm:h-16 text-primary group-hover:text-white transition-colors duration-300 relative z-10" />
                }
                label="LinkedIn"
                colorClass="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50"
                hoverColorClass="group-hover:from-blue-500 group-hover:to-blue-600"
                textHoverClass="group-hover:text-primary"
                testId="social-linkedin"
              />

              <SocialButton
                href="https://www.instagram.com/insureitgroup/"
                icon={
                  <FaInstagram className="w-12 h-12 sm:w-16 sm:h-16 text-pink-600 dark:text-pink-400 group-hover:text-white transition-colors duration-300 relative z-10" />
                }
                label="Instagram"
                colorClass="bg-gradient-to-br from-pink-50 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50"
                hoverColorClass="group-hover:from-pink-500 group-hover:to-purple-600"
                textHoverClass="group-hover:text-pink-600"
                testId="social-instagram"
              />

              <SocialButton
                href="https://www.facebook.com/insureitgroup"
                icon={
                  <FaFacebook className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300 relative z-10" />
                }
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

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />

      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
