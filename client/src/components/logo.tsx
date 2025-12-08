import { useState, useEffect } from "react";
import logoImage from "@assets/Insure_it_logo._1764880597905.png";
import shieldVideo from "@assets/Shield-popin_1765209929149.webm";

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  showTagline?: boolean;
  size?: 'small' | 'large';
}

export default function Logo({ className = "", showTagline = false, size = 'small' }: LogoProps) {
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
        <div className="relative flex items-center justify-center h-[180px] md:h-[200px]">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[500px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[750px] w-full h-auto pointer-events-none"
          >
            <source src={shieldVideo} type="video/webm" />
          </video>
        </div>
        {showTagline && (
          <p className="mt-4 text-lg sm:text-xl md:text-2xl font-medium italic bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
            {taglineText}
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center group cursor-pointer ${className}`}>
      <img 
        src={logoImage} 
        alt="Insure-it Group Corp" 
        className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
