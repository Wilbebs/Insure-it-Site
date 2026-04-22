"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
const logoImage = "/images/staticinsureitlogo.webp";

const shieldVideoMobileMp4 = "/shield_animation_mobile.mp4";
const shieldVideoDesktopMp4 = "/shield_animation.mp4";
const shieldVideoWebm = "/shield_animation.webm";
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
  const [isPhone, setIsPhone] = useState<boolean | null>(null);
  const fluidVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 639.98px)");
    const update = () => setIsPhone(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

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
    if (size !== "large" || isPhone !== false) return;
    const video = fluidVideoRef.current;
    if (!video) return;
    const onCanPlay = () => setFluidVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.load();
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [size, isPhone]);

  useEffect(() => {
    if (size !== "large" || isPhone !== true) return;
    const video = mobileVideoRef.current;
    if (!video) return;
    const onCanPlay = () => setMobileVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.load();
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [size, isPhone]);

  const mobileShieldCss = "absolute left-1/2 w-[990px] h-auto pointer-events-none";
  const mobileShieldStyle = {
    top: "-12px",
    transform: "translateX(-50%) scale(1.85)",
    transformOrigin: "center center",
  };

  // Fluid sizing for non-phone viewports (≥640px). Anything below 640px uses
  // the dedicated mobile branch since composition needs are different there.
  // Linearly interpolates between two anchor points:
  //   • 640px viewport → width 700px, scale 1.30, top -45px, container 145px tall
  //   • 1280px viewport → width 990px, scale 1.55, top -57px, container 155px tall
  // Above 1280px and below 640px, clamp() locks the values at the bounds.
  // Slopes derived from a 640px range: width 290/640=0.453, top -12/640=-0.01875,
  // scale 0.25/640=0.000391, height 10/640=0.01563.
  const fluidShieldCss = "absolute left-1/2 h-auto pointer-events-none";
  const fluidShieldStyle = {
    width: "clamp(700px, calc(700px + (100vw - 640px) * 0.453), 990px)",
    top: "clamp(-57px, calc(-45px + (100vw - 640px) * -0.01875), -45px)",
    transform:
      "translateX(-50%) scale(clamp(1.3, calc(1.3 + (100vw - 640px) * 0.000391 / 1px), 1.55))",
    transformOrigin: "center center",
  } as const;
  const fluidContainerStyle = {
    height: "clamp(145px, calc(145px + (100vw - 640px) * 0.01563), 155px)",
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
              className={`${mobileShieldCss} opacity-100`}
              style={mobileShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            {/* Mobile intentionally shows the static shield only — no video.
                Avoids the opaque-MP4 black-rectangle artifact on small viewports. */}
          </div>
        </div>

        {/* Tablet + Desktop (≥640px) — fluidly interpolated via clamp() */}
        <div className="hidden sm:flex sm:flex-col sm:items-center w-full">
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
            {isPhone === false && (
              <video
                ref={fluidVideoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                className={`${fluidShieldCss} z-10 transition-opacity duration-500 ${fluidVideoReady ? "opacity-100" : "opacity-0"}`}
                style={fluidShieldStyle}
              >
                <source src={shieldVideoWebm} type="video/webm" />
              </video>
            )}
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
      <Image
        src={logoImage}
        alt="Insure-it Group Corp"
        width={800}
        height={273}
        priority
        sizes="(max-width: 640px) 80px, 140px"
        className={`${imgClassName ?? "h-10"} w-auto transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
}
