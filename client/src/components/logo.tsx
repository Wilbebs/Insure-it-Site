import { Shield } from "lucide-react";
import { useState, useEffect } from "react";

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  showTagline?: boolean;
  size?: 'small' | 'large';
}

export default function Logo({ className = "", variant = 'default', showTagline = false, size = 'small' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-gray-800';
  const accentColor = variant === 'white' ? 'text-white' : 'text-primary';
  const taglineColor = variant === 'white' ? 'text-white/90' : 'text-muted-foreground';
  
  const [taglineText, setTaglineText] = useState("");
  const fullTagline = "Life's Uncertain. Your Coverage Isn't.";

  useEffect(() => {
    if (showTagline && size === 'large') {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullTagline.length) {
          setTaglineText(fullTagline.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [showTagline, size]);
  
  if (size === 'large') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="flex items-center relative">
          <span className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${textColor}`}>
            insure
          </span>
          <div className="relative flex items-center justify-center ml-1">
            <Shield className={`absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 ${accentColor} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-shield-pulse`} style={{ opacity: 0.15 }} />
            <span className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${accentColor} relative z-10 px-2`}>
              it
            </span>
          </div>
        </div>
        {showTagline && (
          <p className={`mt-4 text-lg sm:text-xl md:text-2xl font-medium italic ${taglineColor}`}>
            {taglineText}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center relative group cursor-pointer ${className}`}>
      <span className={`font-bold text-xl ${textColor} transition-all duration-300 group-hover:scale-110 group-hover:text-primary`}>insure</span>
      <div className="relative flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-125">
        <Shield className={`absolute w-7 h-7 ${accentColor} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group-hover:opacity-40`} style={{ opacity: 0.15 }} />
        <span className={`font-bold text-xl ${accentColor} relative z-10 px-1 transition-all duration-300 group-hover:scale-110`}>it</span>
      </div>
    </div>
  );
}
