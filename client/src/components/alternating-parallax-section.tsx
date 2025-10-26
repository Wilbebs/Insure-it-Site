import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AlternatingParallaxSectionProps {
  contentSide: 'left' | 'right';
  title: string;
  description: string;
  features?: string[];
  icon?: ReactNode;
  backgroundImage: string;
  accentColor?: string;
  children?: ReactNode;
  nextSectionId?: string;
}

export default function AlternatingParallaxSection({
  contentSide,
  title,
  description,
  features = [],
  icon,
  backgroundImage,
  accentColor = 'from-blue-500 to-blue-600',
  children,
  nextSectionId
}: AlternatingParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking && sectionRef.current) {
        window.requestAnimationFrame(() => {
          const rect = sectionRef.current!.getBoundingClientRect();
          const scrolled = window.scrollY;
          const sectionTop = sectionRef.current!.offsetTop;
          
          // Parallax offset at 50-60% speed
          const parallaxSpeed = 0.55;
          const offset = (scrolled - sectionTop) * parallaxSpeed;
          setScrollOffset(offset);

          // Check visibility for fade-in animation
          const windowHeight = window.innerHeight;
          const isInView = rect.top < windowHeight * 0.75 && rect.bottom > 0;
          setIsVisible(isInView);
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen flex items-center py-32 md:py-40 overflow-hidden">
      {/* Parallax Background Image - Bleeds beyond section */}
      <div 
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          transform: `translate3d(0, ${scrollOffset}px, 0)`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/70" />
      </div>

      {/* Content Container - Asymmetric Layout */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex items-center justify-center lg:justify-start">
          {/* Floating Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95, x: 0 }}
            animate={isVisible 
              ? { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  x: contentSide === 'left' ? '-5%' : '5%'
                } 
              : { 
                  opacity: 0, 
                  y: 60, 
                  scale: 0.95,
                  x: 0
                }
            }
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`
              relative max-w-2xl lg:max-w-3xl
              ${contentSide === 'left' ? 'lg:mr-auto' : 'lg:ml-auto'}
              bg-background/60 backdrop-blur-xl
              rounded-[2.5rem] p-10 md:p-14 lg:p-16
              shadow-2xl shadow-black/20
              border border-white/10
            `}
          >
            {/* Subtle gradient glow behind card */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${accentColor} opacity-10 blur-3xl rounded-[2.5rem] -z-10`} />

            {icon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={isVisible ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.5, rotate: -10 }}
                transition={{ duration: 0.7, delay: 0.15, type: "spring", bounce: 0.4 }}
                className={`mb-8 inline-block p-5 rounded-3xl bg-gradient-to-br ${accentColor} shadow-xl`}
              >
                {icon}
              </motion.div>
            )}
            
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 gradient-text leading-tight"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-xl md:text-2xl text-muted-foreground/90 mb-10 leading-relaxed"
            >
              {description}
            </motion.p>

            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="space-y-5 mb-10"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -30 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${accentColor} shadow-lg`} />
                    <span className="text-lg md:text-xl text-foreground/90">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.65 }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrow to Next Section */}
      {nextSectionId && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{
            duration: 1,
            delay: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          onClick={() => {
            document.getElementById(nextSectionId)?.scrollIntoView({ 
              behavior: "smooth", 
              block: "center" 
            });
          }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 
                     bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md
                     border border-white/30 rounded-full p-3
                     hover:from-white/30 hover:to-white/20 transition-all
                     hover:scale-110 cursor-pointer shadow-lg"
          data-testid="button-next-section"
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.button>
      )}
    </div>
  );
}
