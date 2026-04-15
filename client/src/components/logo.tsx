"use client";

import { useState, useEffect, useRef } from "react";
const logoImage   = "/images/insure_it_logo.webp";
const shieldVideo = "/shield_animation.webm";

// ─── Video frame analysis (shield_animation.webm  1920×1080 px) ────────────
// ImageMagick trim on frame 30: logo bounds x=463–1502, y=272–672 (1039×400 px).
// Background: solid black (VP8, no alpha).
//
// Approach: CSS "mix-blend-mode: screen" makes black pixels transparent,
// so the card frosted-glass shows through wherever there is no logo.
// The video is sized with the same aspect-ratio & object-fit as the static img:
//   • width: 100%  →  container fills card content width
//   • aspectRatio: 4224/1120  →  same height as static logo box
//   • objectFit: cover  →  video scaled so width = container width
//     (container is 3.77:1, video is 16:9; width is always the binding dimension)
//   • objectPosition: center 38.1%  →  vertically centers the logo row
//     Calculation:
//       rendered video h = W × 1080/1920 = 0.5625W
//       logo y-start  = 272/1080 × 0.5625W = 0.1416W
//       logo y-end    = 672/1080 × 0.5625W = 0.3500W  (height 0.2084W)
//       container h   = W × 1120/4224 = 0.2652W
//       top-pad for centered logo = (0.2652 − 0.2084)/2 = 0.0284W
//       video top offset needed   = −(0.1416 − 0.0284) = −0.1132W
//       overflow = 0.5625W − 0.2652W = 0.2973W
//       Y%  = 0.1132 / 0.2973 = 38.1%
//
// Both elements share gridArea:"1/1" → overlap without position:absolute
// (safe inside backdrop-blur stacking contexts).
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
        {/*
          Outer wrapper: w-full on mobile, 80% centred on desktop (sm+).
          CSS Grid → both children in cell 1/1, overlap without position:absolute.
        */}
        <div
          className="w-full sm:w-4/5 mx-auto"
          style={{ display: "grid" }}
        >
          {/* ── Static logo ── */}
          <img
            src={logoImage}
            alt="Insure-it Group Corp"
            fetchPriority="high"
            draggable={false}
            style={{
              gridArea: "1/1",
              width: "100%",
              aspectRatio: "4224 / 1120",
              objectFit: "cover",
              objectPosition: "center 52.5%",
              display: "block",
              opacity: videoReady ? 0 : 1,
              transition: "opacity 0.5s",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />

          {/*
           * ── Animated WebM overlay ──
           * mix-blend-mode:screen → black background becomes transparent,
           *   logo colors render on top of the frosted-glass card.
           * object-fit:cover + objectPosition:center 38.1% → centers the logo
           *   row vertically in the same box as the static <img>.
           * No position:absolute needed — safe inside backdrop-blur stacking ctx.
           */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              gridArea: "1/1",
              width: "100%",
              aspectRatio: "4224 / 1120",
              objectFit: "cover",
              objectPosition: "center 38.1%",
              display: "block",
              mixBlendMode: "screen",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 0.5s",
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
