import { ReactNode, useEffect, useRef, useState } from "react";

interface CutoutWindowProps {
  children: ReactNode;
  backgroundLayer?: ReactNode;
  shape?: 'circle' | 'rectangle' | 'polygon' | 'custom';
  customClipPath?: string;
  animateOnScroll?: boolean;
  className?: string;
}

export default function CutoutWindow({ 
  children, 
  backgroundLayer,
  shape = 'rectangle',
  customClipPath,
  animateOnScroll = true,
  className = ""
}: CutoutWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!animateOnScroll) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking && windowRef.current) {
        window.requestAnimationFrame(() => {
          const rect = windowRef.current!.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Progress from 0 (entering) to 1 (center) to 0 (leaving)
          const center = rect.top + rect.height / 2;
          const progress = 1 - Math.abs(center - windowHeight / 2) / (windowHeight / 2);
          const clampedProgress = Math.max(0, Math.min(1, progress));
          
          setScrollProgress(clampedProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animateOnScroll]);

  const getClipPath = () => {
    if (customClipPath) return customClipPath;
    
    const progress = scrollProgress;
    
    switch (shape) {
      case 'circle':
        const radius = 30 + (progress * 20); // 30% to 50%
        return `circle(${radius}% at 50% 50%)`;
      
      case 'polygon':
        const inset = 20 - (progress * 15); // 20% to 5%
        return `polygon(
          ${inset}% 0%, 
          ${100 - inset}% 0%, 
          100% ${inset}%, 
          100% ${100 - inset}%, 
          ${100 - inset}% 100%, 
          ${inset}% 100%, 
          0% ${100 - inset}%, 
          0% ${inset}%
        )`;
      
      case 'rectangle':
      default:
        const margin = 10 - (progress * 10); // 10% to 0%
        return `inset(${margin}% ${margin}%)`;
    }
  };

  return (
    <div ref={windowRef} className={`relative ${className}`}>
      {/* Background Layer (visible through cutout) */}
      {backgroundLayer && (
        <div className="absolute inset-0 z-0">
          {backgroundLayer}
        </div>
      )}
      
      {/* Foreground Content with Cutout */}
      <div 
        className="relative z-10"
        style={{
          clipPath: getClipPath(),
          transition: animateOnScroll ? 'none' : 'clip-path 0.3s ease-out',
          willChange: 'clip-path',
        }}
      >
        {children}
      </div>
    </div>
  );
}
