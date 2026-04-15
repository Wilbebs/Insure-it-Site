"use client";

import { useState, useEffect, useRef } from "react";
const logoImage    = "/images/insure_it_logo.webp";
const shieldVideo  = "/shield_animation.webm";
const shieldStatic = "/shield_animation_static.webp";
// Mobile: same shield_animation.webm, cropped via overflow:hidden to logo region only
const mobileStatic = "/shield_logo_static.webp";

// Logo content lives at x=463–1501, y=325–575 in the 1920×1080 frame (verified by sampling).
// At video rendered width=600px (height=337.5px):
//   - Logo x: 144.7–469.1px → fills ~324px (slightly wider than 320px mobile container)
//   - Logo y: 101.6–179.7px → 78px tall; container 90px, top=-96 centers it
const MOBILE_VIDEO_W = 600;   // rendered video width (px)
const MOBILE_CROP_H  = 90;    // container height ≈ same aspect as original 992/280 animation
const MOBILE_TOP     = -96;   // centers logo (y≈140.5) in the 90px container

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
  const [taglineText, setTaglineText]             = useState("");
  const fullTagline                               = "Life's Uncertain. Your Coverage Isn't.";
  const [desktopVideoReady, setDesktopVideoReady] = useState(false);
  const [mobileVideoReady,  setMobileVideoReady]  = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef  = useRef<HTMLVideoElement>(null);

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

  // Mobile: lazy-load the shared shield animation after page load
  useEffect(() => {
    if (size !== "large") return;
    const video = mobileVideoRef.current;
    if (!video) return;

    const loadVideo = () => {
      const onCanPlay = () => setMobileVideoReady(true);
      video.addEventListener("canplay", onCanPlay);
      video.src = shieldVideo;
      video.load();
      return () => video.removeEventListener("canplay", onCanPlay);
    };

    if (document.readyState === "complete") return loadVideo();
    let cleanup: (() => void) | undefined;
    const onLoad = () => { cleanup = loadVideo(); };
    window.addEventListener("load", onLoad);
    return () => { window.removeEventListener("load", onLoad); cleanup?.(); };
  }, [size]);

  // Desktop: lazy-load WebM shield animation after window.onload
  useEffect(() => {
    if (size !== "large") return;
    const video = desktopVideoRef.current;
    if (!video) return;

    const loadVideo = () => {
      const onCanPlay = () => setDesktopVideoReady(true);
      video.addEventListener("canplay", onCanPlay);
      video.src = shieldVideo;
      video.load();
      return () => video.removeEventListener("canplay", onCanPlay);
    };

    if (document.readyState === "complete") return loadVideo();
    let cleanup: (() => void) | undefined;
    const onLoad = () => { cleanup = loadVideo(); };
    window.addEventListener("load", onLoad);
    return () => { window.removeEventListener("load", onLoad); cleanup?.(); };
  }, [size]);

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* ── Mobile logo ──────────────────────────────────────────────────────
            Static img is in normal flow (defines container height).
            Video is absolute-overlaid inside an overflow:hidden crop layer.  */}
        <div className="md:hidden relative w-full flex justify-center">
          {/* Static transparent logo — always visible until video ready */}
          <img
            src={mobileStatic}
            alt="Insure-it Group Corp"
            className={`relative block pointer-events-none transition-opacity duration-700 ${mobileVideoReady ? "opacity-0" : "opacity-100"}`}
            style={{ height: "100px", width: "auto" }}
            fetchPriority="high"
            draggable={false}
          />
          {/* Animated video in an overflow:hidden crop window, same footprint */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              playsInline
              loop
              className={`absolute left-1/2 transition-opacity duration-700 ${mobileVideoReady ? "opacity-100" : "opacity-0"}`}
              style={{
                width:     `${MOBILE_VIDEO_W}px`,
                top:       `${MOBILE_TOP}px`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
        </div>

        {/* ── Desktop logo ─────────────────────────────────────────────────── */}
        <div className="hidden md:flex md:flex-col md:items-center w-full">
          <div className="relative h-[155px] w-full overflow-hidden mx-auto" style={{ marginTop: '-5px' }}>
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`absolute left-1/2 w-[990px] h-auto pointer-events-none transition-opacity duration-500 ${desktopVideoReady ? "opacity-0" : "opacity-100"}`}
              style={{
                top: "-57px",
                transform: "translateX(-50%) scale(1.55)",
                transformOrigin: "center center",
              }}
              width={1920}
              height={1080}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={desktopVideoRef}
              autoPlay
              muted
              playsInline
              className={`absolute left-1/2 w-[990px] h-auto pointer-events-none z-10 transition-opacity duration-500 ${desktopVideoReady ? "opacity-100" : "opacity-0"}`}
              style={{
                top: "-57px",
                transform: "translateX(-50%) scale(1.55)",
                transformOrigin: "center center",
              }}
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
