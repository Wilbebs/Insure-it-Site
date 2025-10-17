import { ReactNode, useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundGradient?: string;
  className?: string;
  speed?: number; // 0.4 = 40% speed
  id?: string;
}

export default function ParallaxSection({ 
  children, 
  backgroundImage, 
  backgroundGradient,
  className = "",
  speed = 0.4,
  id
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      
      // Calculate parallax offset: distance from section top * speed
      const parallaxOffset = (scrolled - sectionTop) * speed;
      setOffset(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`} id={id}>
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: 'transform',
          ...(backgroundImage && {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }),
          ...(backgroundGradient && {
            background: backgroundGradient,
          }),
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
