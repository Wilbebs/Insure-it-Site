"use client";

import { useState, useEffect, useRef } from "react";
const logoImage = "/images/insure_it_logo.webp";

const shieldVideo = "/shield_animation.webm";
const shieldVideoMobile = "/shield_animation_mobile.mp4";

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
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    const video = videoRef.current;
    if (!video) return;
    const onCanPlay = () => setVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.src = shieldVideoMobile;
    video.load();
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [size]);

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Mobile: static logo (13KB) loads first as LCP, then MP4 (79KB) fades in */}
        <div className="md:hidden w-full flex flex-col items-center">
          <div className="relative w-full" style={{ aspectRatio: "600/162" }}>
            <img
              src="/shield_logo_static.webp"
              alt="Insure-it Group Corp"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${videoReady ? "opacity-0" : "opacity-100"}`}
              width={450}
              height={121}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
              style={{ mixBlendMode: "screen" }}
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
