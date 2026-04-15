"use client";

import { useState, useEffect, useRef } from "react";
const logoImage   = "/images/insure_it_logo.webp";
const shieldVideo = "/shield_animation.webm";

// ─── Static logo geometry (insure_it_logo.webp  4224×1444 px) ───────────────
// Content y=170–1290 (height 1120), x=86–4155 (width 4069).
// backgroundSize:"100% auto"  +  aspectRatio:"4224/1120"  +  bgPos:"center 52.5%"
// → full logo always visible, zero horizontal clipping, fully responsive.
// Desktop: sm:w-4/5 → 80% of card content width.
// ─────────────────────────────────────────────────────────────────────────────
// ─── Video overlay geometry (shield_animation.webm  1920×1080 px) ────────────
// Logo in video: x=466–1423, y=367–499 (height 132 px).
// To match static container height H = containerW × 1120/4224:
//   videoScale = H / 132  →  videoRenderedW = 1920 × H/132
//                         →  videoRenderedW = 1920 × containerW × (1120/4224/132)
//                         →  videoRenderedW = containerW × 3.857
//   videoRenderedH = containerW × 2.170
//   top  = –logoYstart / containerH × 100%
//        = –(367 × videoRenderedH/1080) / containerH × 100%
//        = –278%  of containerH    (independent of screen size)
//   left = 50%;  transform: translateX(–50%)  →  logo centered horizontally
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
          Outer: w-full on mobile, 80% (0.8×) on desktop (sm+).
          Inner: relative + overflow-hidden crop window.
        */}
        <div className="w-full sm:w-4/5 mx-auto">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4224 / 1120" }}
          >
            {/* Static background-image logo — works inside backdrop-blur stacking context */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                backgroundImage: `url(${logoImage})`,
                backgroundSize: "100% auto",
                backgroundPosition: "center 52.5%",
                backgroundRepeat: "no-repeat",
                opacity: videoReady ? 0 : 1,
              }}
            />

            {/* Animated WebM overlay — same crop geometry via %-based positioning */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: videoReady ? 1 : 0,
                width: "385.7%",
                height: "auto",
                left: "50%",
                top: "-278%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
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
