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
  const [fluidVideoReady, setFluidVideoReady] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);
  const fluidVideoRef = useRef<HTMLVideoElement>(null);
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
    const video = fluidVideoRef.current;
    if (!video) return;
    const onCanPlay = () => setFluidVideoReady(true);
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

  const mobileShieldCss = "absolute left-1/2 w-[990px] h-auto pointer-events-none";
  const mobileShieldStyle = {
    top: "-12px",
    transform: "translateX(-50%) scale(1.85)",
    transformOrigin: "center center",
  };

  // Fluid sizing for non-phone viewports (≥640px). Anything below 640px uses
  // the dedicated mobile branch since composition needs are different there.
  // Linearly interpolates between two anchor points:
  //   • 640px viewport → width 700px, scale 1.30, top -25px, container 125px tall
  //   • 1280px viewport → width 990px, scale 1.55, top -57px, container 155px tall
  // Above 1280px and below 640px, clamp() locks the values at the bounds.
  // Slopes derived from a 640px range: width 290/640=0.453, top -32/640=-0.05,
  // scale 0.25/640=0.000391, height 30/640=0.0469.
  const fluidShieldCss = "absolute left-1/2 h-auto pointer-events-none";
  const fluidShieldStyle = {
    width: "clamp(700px, calc(700px + (100vw - 640px) * 0.453), 990px)",
    top: "clamp(-57px, calc(-25px + (100vw - 640px) * -0.05), -25px)",
    transform:
      "translateX(-50%) scale(clamp(1.3, calc(1.3 + (100vw - 640px) * 0.000391 / 1px), 1.55))",
    transformOrigin: "center center",
  } as const;
  const fluidContainerStyle = {
    height: "clamp(125px, calc(125px + (100vw - 640px) * 0.0469), 155px)",
  } as const;

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Phone / phablet (under 640px) — discrete sizing tuned for narrow viewports */}
        <div className="sm:hidden w-full flex flex-col items-center">
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

        {/* Tablet + Desktop (≥768px) — fluidly interpolated via clamp() */}
        <div className="hidden md:flex md:flex-col md:items-center w-full">
          <div
            className="relative w-full overflow-hidden mx-auto"
            style={fluidContainerStyle}
          >
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`${fluidShieldCss} transition-opacity duration-500 ${fluidVideoReady ? "opacity-0" : "opacity-100"}`}
              style={fluidShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={fluidVideoRef}
              autoPlay
              muted
              playsInline
              className={`${fluidShieldCss} z-10 transition-opacity duration-500 ${fluidVideoReady ? "opacity-100" : "opacity-0"}`}
              style={fluidShieldStyle}
            />
          </div>
          {showTagline && (
            <p className="mt-2 text-xl lg:text-2xl font-semibold italic tagline-shimmer select-none">
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
