"use client";

import { useState, useEffect, useRef } from "react";

const logoNavbar    = "/images/insure_it_logo.webp";
const logoPlaceholder = "/images/logo_placeholder.webp";
const shieldVideo   = "/shield_animation.webm";

// ─── Video crop maths ────────────────────────────────────────────────────────
// Source video: 1920×1080, logo at x=463–1502, y=272–672 → 1039×400 px
//
// Container: aspect-ratio 1039/400 (matches logo bounds exactly), overflow:hidden
//
// Video scaled so logo fills container:
//   width = (1920/1039) × 100% = 184.8%   height = auto (16:9 maintained)
//   Video dims at container width W: 1.848W × 1.039W
//   Logo top-left in scaled video: (463/1039)×W = 0.446W, (272/1039)×W = 0.262W
//   translateX: -0.446W / 1.848W = -24.1% of own width
//   translateY: -0.262W / 1.039W = -25.2% of own height
//
// Result: logo exactly fills W×(400/1039)W, black bg clipped by overflow:hidden.
// No position:absolute (safe inside backdrop-blur stacking contexts on iOS/WebKit).
// ─────────────────────────────────────────────────────────────────────────────

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

  // Typewriter tagline
  useEffect(() => {
    if (showTagline && size === "large") {
      let index = 0;
      const id = setInterval(() => {
        if (index <= fullTagline.length) {
          setTaglineText(fullTagline.slice(0, index++));
        } else {
          clearInterval(id);
        }
      }, 50);
      return () => clearInterval(id);
    }
  }, [showTagline, size]);

  // Lazy-load video after page is fully loaded
  useEffect(() => {
    if (size !== "large") return;
    const video = videoRef.current;
    if (!video) return;

    const loadAndPlay = () => {
      video.src = shieldVideo;
      video.load();
      video.addEventListener(
        "canplay",
        () => { video.play().catch(() => {}); },
        { once: true }
      );
      video.addEventListener(
        "play",
        () => { setVideoReady(true); },
        { once: true }
      );
    };

    if (document.readyState === "complete") {
      loadAndPlay();
    } else {
      window.addEventListener("load", loadAndPlay, { once: true });
    }

    return () => {
      video.pause();
      video.src = "";
    };
  }, [size]);

  // ── Small variant (navbar) ──────────────────────────────────────────────
  if (size !== "large") {
    return (
      <div className={`flex items-center group cursor-pointer ${className}`}>
        <img
          src={logoNavbar}
          alt="Insure-it Group Corp"
          className={`${imgClassName ?? "h-10"} w-auto transition-transform duration-300 group-hover:scale-105`}
        />
      </div>
    );
  }

  // ── Large variant (hero card) ───────────────────────────────────────────
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/*
        Container: aspect-ratio matches logo crop (1039:400), overflow clips the
        black video background.  CSS Grid → static <img> and <video> share cell
        1/1 without position:absolute (safe inside backdrop-blur on iOS/WebKit).
      */}
      <div
        className="w-full sm:w-4/5 mx-auto"
        style={{
          display: "grid",
          aspectRatio: "1039 / 400",
          overflow: "hidden",
        }}
      >
        {/* Static last-frame placeholder — shown until video starts playing */}
        <img
          src={logoPlaceholder}
          alt="Insure-it Group Corp"
          fetchPriority="high"
          draggable={false}
          style={{
            gridArea: "1 / 1",
            width: "100%",
            height: "100%",
            display: "block",
            opacity: videoReady ? 0 : 1,
            transition: "opacity 0.6s",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/*
          Video: scaled to 184.8% width so the logo crop (1039×400 in 1920×1080)
          fills the container exactly.  translate(-24.1%, -25.2%) shifts the video
          so the logo top-left aligns with the container origin.
          justify/align-self:start prevents the grid from overriding the width.
        */}
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          style={{
            gridArea: "1 / 1",
            width: "184.8%",
            height: "auto",
            display: "block",
            transform: "translate(-24.1%, -25.2%)",
            justifySelf: "start",
            alignSelf: "start",
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.6s",
            pointerEvents: "none",
            userSelect: "none",
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
