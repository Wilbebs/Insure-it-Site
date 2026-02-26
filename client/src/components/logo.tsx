import { useState, useEffect } from "react";
import logoImage from "@assets/Insure_it_logo._1764880597905.png";
import shieldVideo from "@assets/Ins_orginal_color_1765213135711.webm";

interface LogoProps {
  className?: string;
  variant?: "default" | "white";
  showTagline?: boolean;
  size?: "small" | "large";
}

export default function Logo({
  className = "",
  showTagline = false,
  size = "small",
}: LogoProps) {
  const [taglineText, setTaglineText] = useState("");
  const fullTagline = "Life's Uncertain. Your Coverage Isn't.";

  useEffect(() => {
    if (showTagline && size === "large") {
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

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Mobile: static PNG only — tagline is rendered in landing.tsx below the logo */}
        <div className="md:hidden flex flex-col items-center">
          <img
            src={logoImage}
            alt="Insure-it Group Corp"
            className="h-28 sm:h-32 w-auto object-contain"
            draggable={false}
          />
        </div>

        {/* Desktop: absolute + scale crops all 4 sides of transparent video padding */}
        <div className="hidden md:flex md:flex-col md:items-center w-full">
          <div className="relative h-[158px] w-full overflow-hidden mx-auto">
            <video
              autoPlay
              muted
              playsInline
              className="absolute left-1/2 w-[990px] h-auto pointer-events-none z-10"
              style={{
                top: "-67px",
                transform: "translateX(-50%) scale(1.35)",
                transformOrigin: "center center",
              }}
            >
              <source src={shieldVideo} type="video/webm" />
            </video>
          </div>
          {showTagline && (
            <p className="mt-[25px] text-xl md:text-2xl font-medium italic bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
              {taglineText}
            </p>
          )}
        </div>

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
