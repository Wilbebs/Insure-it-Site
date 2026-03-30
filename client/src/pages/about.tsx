import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import QuoteModal from "@/components/quote-modal";
import SectionDivider from "@/components/section-divider";
import { Shield, Users, Award, Clock } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useTranslation } from "@/components/theme-provider";
import wilbertPhoto from "@assets/wilbert_photo.png";
import elizabethPhoto from "@assets/elizabeth_photo.png";
import davidPhoto from "@assets/david_photo.png";
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
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-center"
      data-testid={testId}
    >
      <div
        className={`${colorClass} p-3 sm:p-6 rounded-2xl hover-lift transition-all duration-300 ${hoverColorClass} flex items-center justify-center`}
      >
        {icon}
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

      {/* Hero Section*/}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "calc(100vh + 43px)" }}
      >
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${familyRiverImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        ></div>

        {/* Floating Story Window */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-[65px] sm:pt-[50px] pb-16 sm:pb-6">
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
        {/* Fill strip: bridges the gap between wave bottom and hero section end */}
        <div
          className="absolute left-0 right-0 bg-muted dark:bg-slate-900"
          style={{ bottom: 0, height: 50, zIndex: 19 }}
        />
        {/* Wave divider — container clips flat SVG fill, keeping only the curves */}
        <div
          className="absolute left-0 right-0 z-20 overflow-hidden"
          style={{ height: 30, bottom: 43 }}
        >
          <SectionDivider
            variant="wave-layered"
            position="bottom"
            fromColor="hsl(210, 40%, 94%)"
            toColor="hsl(210, 40%, 94%)"
            wave1Color="hsla(205, 70%, 82%, 0.3)"
            wave2Color="hsla(205, 70%, 82%, 0.6)"
            wave3Color="hsl(210, 40%, 94%)"
            height={55}
          />
        </div>
      </section>

      <section
        className="pb-1 sm:pb-2 bg-muted dark:bg-slate-900 dot-pattern"
        style={{
          marginTop: -40,
          paddingTop: "5px",
          position: "relative",
          zIndex: 30,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">

          {/* Timeline — Our Journey */}
          {(() => {
            const milestones = [
              {
                year: "2011",
                icon: <Shield className="w-5 h-5 text-white" />,
                en: { title: "Founded in Miami", desc: "Insure IT Group Corp was born from a family dream — a small office in Miami dedicated to helping neighbors find honest, affordable coverage." },
                es: { title: "Fundados en Miami", desc: "Insure IT Group Corp nació de un sueño familiar — una pequeña oficina en Miami dedicada a ayudar a los vecinos a encontrar cobertura honesta y asequible." },
              },
              {
                year: "2014",
                icon: <Users className="w-5 h-5 text-white" />,
                en: { title: "Expanding Across South Florida", desc: "Word spread fast. We grew beyond Miami into Broward and Palm Beach, bringing the same personal touch to new communities." },
                es: { title: "Expansión por el Sur de Florida", desc: "La noticia corrió rápido. Nos expandimos más allá de Miami hacia Broward y Palm Beach, llevando el mismo trato personal a nuevas comunidades." },
              },
              {
                year: "2017",
                icon: <Award className="w-5 h-5 text-white" />,
                en: { title: "Central Florida & The Space Coast", desc: "We planted roots in Tampa, Orlando, and the Space Coast — earning trust with thousands of new families through competitive rates and real relationships." },
                es: { title: "Florida Central y la Costa Espacial", desc: "Echamos raíces en Tampa, Orlando y la Costa Espacial, ganándonos la confianza de miles de nuevas familias con tarifas competitivas y relaciones genuinas." },
              },
              {
                year: "2021",
                icon: <Clock className="w-5 h-5 text-white" />,
                en: { title: "Calling Jacksonville Home", desc: "We relocated our headquarters to Jacksonville, setting up in San Jose Blvd to better serve North Florida and build deeper community ties." },
                es: { title: "Jacksonville, Nuestro Hogar", desc: "Trasladamos nuestra sede a Jacksonville, estableciéndonos en San Jose Blvd para servir mejor al Norte de Florida y fortalecer los lazos comunitarios." },
              },
              {
                year: "2025",
                icon: <Shield className="w-5 h-5 text-white" />,
                en: { title: "Statewide & Still Growing", desc: "Today we proudly protect thousands of families across every corner of Florida — still family-owned, still answering every call ourselves." },
                es: { title: "En Todo el Estado y Seguimos Creciendo", desc: "Hoy protegemos con orgullo a miles de familias en cada rincón de Florida — seguimos siendo de familia y contestando cada llamada personalmente." },
              },
            ];
            const lang = t.about.timelineSubtitle === "Our Journey" ? "en" : "es";
            return (
              <div className="pt-6 sm:pt-10 pb-8 sm:pb-12">
                <div className="text-center mb-8 sm:mb-12">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-2 select-none">
                    {t.about.timelineSubtitle}
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground select-none">
                    {t.about.timelineTitle}
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-blue-500 rounded-full mx-auto mt-3" />
                </div>

                {/* Timeline */}
                <div className="relative max-w-3xl mx-auto">
                  {/* Vertical line */}
                  <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-sky-400/60 via-blue-400/40 to-transparent sm:-translate-x-px" />

                  <div className="space-y-6 sm:space-y-0">
                    {milestones.map((m, i) => {
                      const isLeft = i % 2 === 0;
                      const copy = m[lang];
                      return (
                        <div
                          key={m.year}
                          className={`relative flex items-start gap-4 sm:gap-0 sm:mb-10 ${isLeft ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                        >
                          {/* Card */}
                          <div className={`flex-1 ml-14 sm:ml-0 ${isLeft ? "sm:pr-10 sm:text-right" : "sm:pl-10 sm:text-left"}`}>
                            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-md border border-white/60 dark:border-slate-700/60 hover-lift transition-all duration-300">
                              <span className="inline-block text-xs font-bold text-primary/70 tracking-widest uppercase mb-1 select-none">{m.year}</span>
                              <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight mb-1.5 select-none">{copy.title}</h3>
                              <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed select-none">{copy.desc}</p>
                            </div>
                          </div>

                          {/* Icon node — mobile: left edge, desktop: center */}
                          <div className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 top-4 w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-slate-900 shrink-0 z-10">
                            {m.icon}
                          </div>

                          {/* Spacer for opposite side on desktop */}
                          <div className="hidden sm:block flex-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-slate-600/60 to-transparent mt-10 sm:mt-14" />
              </div>
            );
          })()}

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
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">
                    Wilbert Hernandez
                  </h3>
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
                  <h3 className="text-sm sm:text-xl font-bold mb-1 sm:mb-2">
                    David Hernandez
                  </h3>
                  <p className="text-primary font-medium text-xs sm:text-base">
                    {t.about.accountExecutive}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-base text-muted-foreground mt-4 mb-4 mx-auto text-center relative z-10 sm:whitespace-nowrap">
              {t.about.connectDesc}
            </p>
            <div className="flex justify-center gap-3 sm:gap-6 lg:gap-8 relative z-10">
              <SocialButton
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                icon={
                  <FaLinkedin className="w-8 h-8 sm:w-12 sm:h-12 text-primary group-hover:text-white transition-colors duration-300 relative z-10" />
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
                  <FaInstagram className="w-8 h-8 sm:w-12 sm:h-12 text-pink-600 dark:text-pink-400 group-hover:text-white transition-colors duration-300 relative z-10" />
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
                  <FaFacebook className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300 relative z-10" />
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
