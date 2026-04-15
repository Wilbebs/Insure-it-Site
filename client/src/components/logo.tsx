"use client";

import { useState, useEffect, useRef } from "react";
const logoImage    = "/images/insure_it_logo.webp";
const shieldVideo  = "/shield_animation.webm";
const shieldStatic = "/shield_animation_static.webp";
// Mobile: same shield_animation.webm, cropped via overflow:hidden to logo region only
const mobileStatic = "/shield_logo_static.webp";

// Logo content lives at x=463–1501, y=268–672 in the 1920×1080 frame.
// At video rendered width=600px:
//   - Logo x: 144.7–469.1px → fills exactly 320px container, no black on sides
//   - Logo y: 83.8–210px  → container h=126px, top=-84px clips top & bottom black
const MOBILE_VIDEO_W = 600;   // rendered video width (px)
const MOBILE_CROP_H  = 126;   // container height that shows only the logo strip
const MOBILE_TOP     = -84;   // negative top to skip the black above the logo

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
            Same shield_animation.webm as desktop. Container clips to the logo
            strip only (overflow:hidden), so the dark bg above/below/sides is
            never visible — exactly how the desktop crop works.             */}
        <div
          className="md:hidden relative w-full overflow-hidden"
          style={{ height: `${MOBILE_CROP_H}px` }}
        >
          {/* Transparent static placeholder — fades out when video is ready */}
          <img
            src={mobileStatic}
            alt="Insure-it Group Corp"
            className={`absolute left-1/2 -translate-x-1/2 h-full w-auto object-contain pointer-events-none transition-opacity duration-700 ${mobileVideoReady ? "opacity-0" : "opacity-100"}`}
            fetchPriority="high"
            draggable={false}
          />
          {/* Animated video — same file, cropped to logo region */}
          <video
            ref={mobileVideoRef}
            autoPlay
            muted
            playsInline
            loop
            className={`absolute left-1/2 pointer-events-none transition-opacity duration-700 ${mobileVideoReady ? "opacity-100" : "opacity-0"}`}
            style={{
              width:  `${MOBILE_VIDEO_W}px`,
              top:    `${MOBILE_TOP}px`,
              transform: "translateX(-50%)",
            }}
          />
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
