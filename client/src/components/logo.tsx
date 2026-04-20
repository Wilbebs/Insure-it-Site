"use client";

import { useState, useEffect, useRef } from "react";
const logoImage = "/images/staticinsureitlogo.webp";

const shieldVideo = "/shield_animation.webm";
const shieldStatic = "/images/shield_lastframe.webp";

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
  const [desktopVideoReady, setDesktopVideoReady] = useState(false);
  const [tabletVideoReady, setTabletVideoReady] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const tabletVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

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
    const video = desktopVideoRef.current;
    if (!video) return;
    const onCanPlay = () => setDesktopVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.src = shieldVideo;
    video.load();
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [size]);

  useEffect(() => {
    if (size !== "large") return;
    const video = tabletVideoRef.current;
    if (!video) return;
    const onCanPlay = () => setTabletVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.src = shieldVideo;
    video.load();
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [size]);

  useEffect(() => {
    if (size !== "large") return;
    const video = mobileVideoRef.current;
    if (!video) return;
    const onCanPlay = () => setMobileVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.src = shieldVideo;
    video.load();
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [size]);

  const desktopShieldCss = "absolute left-1/2 w-[990px] h-auto pointer-events-none";
  const tabletShieldCss = "absolute left-1/2 w-[700px] h-auto pointer-events-none";
  const mobileShieldCss = "absolute left-1/2 w-[990px] h-auto pointer-events-none";
  const desktopShieldStyle = {
    top: "-57px",
    transform: "translateX(-50%) scale(1.55)",
    transformOrigin: "center center",
  };
  const tabletShieldStyle = {
    top: "-40px",
    transform: "translateX(-50%) scale(1.3)",
    transformOrigin: "center center",
  };
  const mobileShieldStyle = {
    top: "-12px",
    transform: "translateX(-50%) scale(1.85)",
    transformOrigin: "center center",
  };

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Mobile (under 768px) */}
        <div className="md:hidden w-full flex flex-col items-center">
          <div className="relative h-[92px] w-full overflow-hidden">
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`${mobileShieldCss} transition-opacity duration-500 ${mobileVideoReady ? "opacity-0" : "opacity-100"}`}
              style={mobileShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              playsInline
              className={`${mobileShieldCss} z-10 transition-opacity duration-500 ${mobileVideoReady ? "opacity-100" : "opacity-0"}`}
              style={mobileShieldStyle}
            />
          </div>
        </div>

        {/* Tablet (768px – 1023px) */}
        <div className="hidden md:flex lg:hidden md:flex-col md:items-center w-full">
          <div className="relative h-[125px] w-full overflow-hidden mx-auto">
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`${tabletShieldCss} transition-opacity duration-500 ${tabletVideoReady ? "opacity-0" : "opacity-100"}`}
              style={tabletShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={tabletVideoRef}
              autoPlay
              muted
              playsInline
              className={`${tabletShieldCss} z-10 transition-opacity duration-500 ${tabletVideoReady ? "opacity-100" : "opacity-0"}`}
              style={tabletShieldStyle}
            />
          </div>
          {showTagline && (
            <p className="mt-2 text-xl font-semibold italic tagline-shimmer select-none">
              {taglineText}
            </p>
          )}
        </div>

        {/* Desktop (1024px+) */}
        <div className="hidden lg:flex lg:flex-col lg:items-center w-full">
          <div className="relative h-[155px] w-full overflow-hidden mx-auto" style={{ marginTop: '-5px' }}>
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`${desktopShieldCss} transition-opacity duration-500 ${desktopVideoReady ? "opacity-0" : "opacity-100"}`}
              style={desktopShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={desktopVideoRef}
              autoPlay
              muted
              playsInline
              className={`${desktopShieldCss} z-10 transition-opacity duration-500 ${desktopVideoReady ? "opacity-100" : "opacity-0"}`}
              style={desktopShieldStyle}
            />
          </div>
          {showTagline && (
            <p className="mt-2 text-2xl font-semibold italic tagline-shimmer select-none">
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
