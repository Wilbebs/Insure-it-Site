import { ReactNode, useEffect, useRef, useState } from "react";

interface Layer {
  id: string;
  speed: number; // 0.2 = 20% speed, 0.3 = 30% speed
  zIndex: number;
  content?: ReactNode;
  backgroundImage?: string;
  backgroundGradient?: string;
  clipPath?: string;
}

interface AdvancedParallaxContainerProps {
  layers: Layer[];
  children?: ReactNode;
  height?: string;
}

export default function AdvancedParallaxContainer({ 
  layers, 
  children,
  height = "100vh" 
}: AdvancedParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking && containerRef.current) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current!.getBoundingClientRect();
          const containerTop = containerRef.current!.offsetTop;
          const windowHeight = window.innerHeight;
          const scrolled = window.scrollY;
          
          // Calculate progress: 0 when entering viewport, 1 when exiting
          const progress = Math.max(0, Math.min(1, 
            (scrolled - containerTop + windowHeight) / (windowHeight + rect.height)
          ));
          
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* Background Layers with Different Speeds */}
      {layers.map((layer) => {
        const offset = scrollProgress * 1000 * layer.speed;
        
        return (
          <div
            key={layer.id}
            className="absolute inset-0"
            style={{
              zIndex: layer.zIndex,
              transform: `translate3d(0, ${-offset}px, 0)`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              ...(layer.backgroundImage && {
                backgroundImage: `url(${layer.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }),
              ...(layer.backgroundGradient && {
                background: layer.backgroundGradient,
              }),
              ...(layer.clipPath && {
                clipPath: layer.clipPath,
              }),
            }}
          >
            {layer.content}
          </div>
        );
      })}
      
      {/* Foreground Content */}
      {children && (
        <div className="relative z-50">
          {children}
        </div>
      )}
    </div>
  );
}
