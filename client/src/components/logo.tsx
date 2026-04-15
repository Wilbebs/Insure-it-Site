"use client";

import { useState, useEffect, useRef } from "react";
const logoImage    = "/images/insure_it_logo.webp";
const shieldVideo  = "/shield_animation.webm";

// insure_it_logo.webp is 4224×1444px.
// At RENDER_W=1100px: scale=0.2604, imgH=376px.
// Logo content occupies y=26–316px (height≈290px) and x=22–1082px (width≈1060px).
// Container height=290px with top=-26px reveals the full logo, nothing more.
// The card's overflow-hidden clips the ±270px horizontal bleed on each side cleanly.
const RENDER_W   = 1100;   // rendered image width (px)
const LOGO_TOP   = 26;     // rendered y where logo content starts (px) — clip above this
const LOGO_H     = 290;    // rendered logo content height (px)

// shield_animation.webm is 1920×1080px.
// Logo lives at x=466-1423, y=367-499 (132px tall).
// At VID_W=4218px: scale=2.197, logo renders 290px tall starting at vidY=806px.
const VID_W      = 4218;
const VID_TOP    = 806;    // rendered y where video logo starts (px)

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

    const loadVideo = () => {
      const onCanPlay = () => setVideoReady(true);
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
        {/* Overflow-hidden crop window — reveals only the logo content area */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: `${LOGO_H}px` }}
        >
          {/* Static logo: rendered at RENDER_W wide, shifted up so content starts at y=0 */}
          <img
            src={logoImage}
            alt="Insure-it Group Corp"
            fetchPriority="high"
            draggable={false}
            className={`absolute pointer-events-none select-none transition-opacity duration-500 ${videoReady ? "opacity-0" : "opacity-100"}`}
            style={{
              width:     `${RENDER_W}px`,
              left:      "50%",
              top:       `-${LOGO_TOP}px`,
              transform: "translateX(-50%)",
            }}
          />

          {/* Animated WebM — same crop window, lazy-loads after window.onload */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute pointer-events-none transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
            style={{
              width:     `${VID_W}px`,
              left:      "50%",
              top:       `-${VID_TOP}px`,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {showTagline && (
          <p className="mt-2 text-xl md:text-2xl font-semibold italic tagline-shimmer select-none">
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
        className={`${imgClassName ?? "h-10"} w-auto transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
}
