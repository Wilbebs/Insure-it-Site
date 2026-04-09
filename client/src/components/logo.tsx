"use client";

import { useState, useEffect } from "react";
const logoImage = "/images/insure_it_logo.webp";

const shieldVideo = "/shield_animation.webm";

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
  const [animReady, setAnimReady] = useState(false);

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

  useEffect(() => {
    if (size !== "large") return;
    const img = new window.Image();
    img.onload = () => setAnimReady(true);
    img.src = "/shield_logo_mobile.webp";
  }, [size]);

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Mobile: static logo loads first (LCP), animated WebP fades in once downloaded */}
        <div className="md:hidden w-full flex flex-col items-center">
          <div className="relative w-full" style={{ aspectRatio: "360/123" }}>
            <img
              src="/shield_logo_static.webp"
              alt="Insure-it Group Corp"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${animReady ? "opacity-0" : "opacity-100"}`}
              width={360}
              height={123}
              fetchPriority="high"
              draggable={false}
            />
            <img
              src="/shield_logo_mobile.webp"
              alt="Insure-it Group Corp"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${animReady ? "opacity-100" : "opacity-0"}`}
              width={360}
              height={123}
              draggable={false}
              aria-hidden={!animReady}
            />
          </div>
        </div>

        {/* Desktop: absolute + scale crops all 4 sides of transparent video padding */}
        <div className="hidden md:flex md:flex-col md:items-center w-full">
          <div className="relative h-[155px] w-full overflow-hidden mx-auto" style={{ marginTop: '-5px' }}>
            <video
              autoPlay
              muted
              playsInline
              className="absolute left-1/2 w-[990px] h-auto pointer-events-none z-10"
              style={{
                top: "-57px",
                transform: "translateX(-50%) scale(1.55)",
                transformOrigin: "center center",
              }}
            >
              <source src={shieldVideo} type="video/webm" />
            </video>
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
