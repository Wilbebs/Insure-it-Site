import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface AlternatingParallaxSectionProps {
  contentSide: 'left' | 'right';
  title: string;
  description: string;
  features?: string[];
  icon?: ReactNode;
  backgroundImage: string;
  accentColor?: string;
  children?: ReactNode;
}

export default function AlternatingParallaxSection({
  contentSide,
  title,
  description,
  features = [],
  icon,
  backgroundImage,
  accentColor = 'from-blue-500 to-blue-600',
  children
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
          const parallaxSpeed = 0.55; // 55% speed
          const offset = (scrolled - sectionTop) * parallaxSpeed;
          setScrollOffset(offset);

          // Check visibility for fade-in animation
          const windowHeight = window.innerHeight;
          const isInView = rect.top < windowHeight * 0.8 && rect.bottom > 0;
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
    <div ref={sectionRef} className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Parallax Background Image (opposite side) */}
      <div 
        className={`absolute inset-y-0 w-1/2 ${contentSide === 'left' ? 'right-0' : 'left-0'}`}
        style={{
          transform: `translate3d(0, ${scrollOffset}px, 0)`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-${contentSide === 'left' ? 'l' : 'r'} from-background/90 via-background/50 to-transparent`} />
      </div>

      {/* Content Block */}
      <div className="container mx-auto px-6 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: contentSide === 'left' ? -80 : 80 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: contentSide === 'left' ? -80 : 80 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${contentSide === 'right' ? 'lg:col-start-2' : ''} max-w-xl ${contentSide === 'right' ? 'lg:ml-auto' : ''}`}
          >
            {icon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`mb-6 inline-block p-4 rounded-2xl bg-gradient-to-br ${accentColor} shadow-lg`}
              >
                {icon}
              </motion.div>
            )}
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text leading-tight"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              {description}
            </motion.p>

            {features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-4"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${accentColor}`} />
                    <span className="text-lg text-foreground/90">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-8"
              >
                {children}
              </motion.div>
            )}
          </motion.div>

          {/* Empty space for parallax image (mobile: hidden) */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
