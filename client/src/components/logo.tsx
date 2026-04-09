"use client";

import { useState, useEffect } from "react";
const logoImage = "/images/insure_it_logo.webp";

const shieldVideoWebm = "/shield_animation.webm";
const shieldVideoMp4 = "/shield_animation.mp4";

interface LogoProps {
  className?: string;
  imgClassName?: string;
  variant?: "default" | "white";
  showTagline?: boolean;
  size?: "small" | "large";
}

export default function Logo({
  className = "",
  imgClassName,
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

        {/* Shield animation — all screen sizes. Container clips the video vertically;
            overflow-hidden clips it horizontally on narrow mobile screens. */}
        <div className="flex flex-col items-center w-full">
          <div
            className="relative h-[130px] md:h-[155px] w-full overflow-hidden mx-auto"
            style={{ marginTop: "-5px" }}
          >
            <video
              autoPlay
              muted
              playsInline
              className="absolute left-1/2 w-[990px] h-auto pointer-events-none z-10"
              style={{
                top: "-57px",
                transform: "translateX(-50%) scale(1.55)",
                transformOrigin: "center center",
                mixBlendMode: "screen",
              }}
            >
              <source src={shieldVideoMp4} type="video/mp4" />
              <source src={shieldVideoWebm} type="video/webm" />
            </video>

            {/* Static PNG fallback — shown only when video cannot play (e.g. older browsers) */}
            <img
              src={logoImage}
              alt="Insure-it Group Corp"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-auto object-contain"
              draggable={false}
              aria-hidden="true"
            />
          </div>

          {showTagline && (
            <p className="mt-2 text-xl md:text-2xl font-semibold italic tagline-shimmer select-none">
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
        className={`${imgClassName ?? "h-10"} w-auto transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
}
