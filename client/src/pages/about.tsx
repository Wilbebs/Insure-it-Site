import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import QuoteModal from "@/components/quote-modal";
import { Shield, Users, Award, Clock } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import wilbertPhoto from "@assets/image_1764878413663.png";
import elizabethPhoto from "@assets/image_1764878433544.png";
import davidPhoto from "@assets/image_1765442735571.png";
import shieldIcon from "@assets/512x512_icon-01_1764880603281.png";

const floatingShields = [
  { top: "5%", left: "5%", size: 55, delay: 0, duration: 4 },
  { top: "10%", right: "8%", size: 40, delay: 0.5, duration: 3.5 },
  { top: "50%", left: "3%", size: 50, delay: 1, duration: 4.5 },
  { top: "75%", right: "5%", size: 45, delay: 1.5, duration: 3.8 },
  { top: "85%", left: "8%", size: 35, delay: 0.8, duration: 4.2 },
];

function SocialButton({ href, icon, label, colorClass, hoverColorClass, textHoverClass, testId }: {
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

  const dynamicGradientStyle = isHovered ? {
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.5) 0%, transparent 60%)`,
  } : {};

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
      data-testid={testId}
    >
      <div 
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden ${colorClass} p-6 rounded-2xl hover-lift transition-all duration-300 ${hoverColorClass}`}
      >
        {icon}
        {/* Mouse-following shimmer */}
        <div 
          className={`absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={dynamicGradientStyle}
        />
      </div>
      <p className={`mt-3 font-semibold text-muted-foreground ${textHoverClass} transition-colors`}>{label}</p>
    </a>
  );
}

function FloatingShield({ style, size, delay, duration }: { 
  style: React.CSSProperties, 
  size: number, 
  delay: number, 
  duration: number 
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

  const dynamicGradientStyle = isHovered ? {
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
  } : {};
  
  return (
    <div
      ref={shieldRef}
      className={`absolute z-50 transition-all duration-300 cursor-pointer ${
        isHovered ? 'opacity-100 scale-125' : 'opacity-[0.12] dark:opacity-[0.15]'
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
        className={`absolute inset-0 transition-opacity duration-300 pointer-events-none mix-blend-overlay ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        style={dynamicGradientStyle}
      />
    </div>
  );
}

export default function About() {
  const [titleText, setTitleText] = useState("");
  const [lastParagraphText, setLastParagraphText] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const fullTitle = "Our Story";
  const fullLastParagraph = "Today, 14 years later, we remain family-owned and family-focused. We've grown from that single office in Miami to serving thousands of clients statewide, but our mission has never changed: to treat every client like family and provide the kind of insurance coverage that brings true peace of mind.";
  const fullSignature = "From our family to yours—protecting Florida families, one policy at a time.";

  useEffect(() => {
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      if (titleIndex <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, titleIndex));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
        // Start typing the last paragraph after title is done
        let paragraphIndex = 0;
        const paragraphInterval = setInterval(() => {
          if (paragraphIndex <= fullLastParagraph.length) {
            setLastParagraphText(fullLastParagraph.slice(0, paragraphIndex));
            paragraphIndex++;
          } else {
            clearInterval(paragraphInterval);
            // Start typing the signature after paragraph is done
            let signatureIndex = 0;
            const signatureInterval = setInterval(() => {
              if (signatureIndex <= fullSignature.length) {
                setSignatureText(fullSignature.slice(0, signatureIndex));
                signatureIndex++;
              } else {
                clearInterval(signatureInterval);
                // Show blinking cursor when done
                setShowCursor(true);
              }
            }, 30);
          }
        }, 20);
      }
    }, 100);

    return () => clearInterval(titleInterval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section with Family Portrait Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-800/50 to-slate-900/60"></div>
        </div>

        {/* Floating Story Window */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-4xl mx-auto bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-white/30">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-white text-center">
              Our Story
            </h2>
            <div className="space-y-6 text-base sm:text-lg text-white leading-relaxed">
              <p>
                Our journey began in 2011 with a simple dream and a small office in the heart of Miami. 
                What started as a family vision to help our local community find quality insurance coverage 
                has grown into something we're incredibly proud of—a trusted partner to thousands of families 
                across the entire state of Florida.
              </p>
              <p>
                We remember those early days vividly—sitting down with families at their kitchen tables, 
                listening to their concerns, understanding their needs, and working tirelessly to find them 
                the right protection. That personal touch, that genuine care for each client as if they were 
                part of our own family, became the foundation of everything we do.
              </p>
              <p>
                As word spread about our commitment to putting people first, we began expanding throughout 
                South Florida. Then came Central Florida, the Space Coast, the Panhandle, and eventually 
                every corner of the Sunshine State. From Miami to Jacksonville, Tampa to Orlando, Pensacola 
                to the Keys—we've had the honor of protecting what matters most to Florida families.
              </p>
              <p className="font-semibold text-white min-h-[8rem]">
                {lastParagraphText}
                {lastParagraphText.length > 0 && lastParagraphText.length < fullLastParagraph.length && <span className="animate-pulse">|</span>}
              </p>
              <p className="text-center italic text-white pt-4 text-lg sm:text-xl font-semibold min-h-[2rem]">
                {signatureText.length > 0 && '"'}
                {signatureText}
                {signatureText.length > 0 && signatureText.length < fullSignature.length && <span className="animate-pulse">|</span>}
                {signatureText.length === fullSignature.length && '"'}
                {showCursor && <span className="typing-cursor">|</span>}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-muted dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6">

          {/* Meet the Team Section */}
          <div className="mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-center gradient-text">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* Wilbert Hernandez - President */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-wilbert-hernandez">
                <div className="aspect-square overflow-hidden relative group">
                  <img 
                    src={wilbertPhoto} 
                    alt="Wilbert Hernandez - President"
                    className="w-full h-full object-cover scale-[1.1]" style={{ objectPosition: 'center calc(50% + 8px)' }}
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
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Wilbert Hernandez</h3>
                  <p className="text-primary font-medium">President</p>
                </div>
              </div>

              {/* Elizabeth Hernandez - Operations Manager */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-elizabeth-hernandez">
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
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-elizabeth-hernandez"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Elizabeth Hernandez</h3>
                  <p className="text-primary font-medium">Operations Manager</p>
                </div>
              </div>

              {/* David Hernandez - Account Executive */}
              <div className="insurance-card rounded-2xl overflow-hidden hover-lift" data-testid="team-member-david-hernandez">
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
                    className="absolute top-3 right-3 bg-white group-hover:bg-white rounded-full p-2 shadow-lg hover:!bg-primary hover:scale-110 transition-all duration-300 z-10"
                    data-testid="linkedin-david-hernandez"
                  >
                    <FaLinkedin className="w-5 h-5 text-primary hover:text-white transition-colors duration-300" />
                  </a>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">David Hernandez</h3>
                  <p className="text-primary font-medium">Account Executive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connect With Us Section */}
          <div className="text-center mb-12 sm:mb-20 relative overflow-hidden py-8">
            {/* Floating shield background elements */}
            {floatingShields.map((shield, index) => (
              <FloatingShield
                key={index}
                style={{ top: shield.top, left: shield.left, right: shield.right }}
                size={shield.size}
                delay={shield.delay}
                duration={shield.duration}
              />
            ))}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 gradient-text relative z-10">Connect With Us</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto relative z-10">
              Follow us on social media for insurance tips, company updates, and Florida community news
            </p>
            <div className="flex justify-center gap-6 sm:gap-8 relative z-10">
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

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />

      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
