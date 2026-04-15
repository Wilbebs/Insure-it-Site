"use client";

import { useState, useEffect, useRef } from "react";

const logoImage   = "/images/insure_it_logo.webp";
const shieldVideo = "/shield_animation.webm";

// ─── Size reference ──────────────────────────────────────────────────────────
// Static WebP: 4224×1444 px — content at x=77,y=168 w=4147 h=1123 (aspect 3.693:1)
// Container aspect: 4224/1120 = 3.771:1  (aspect-ratio used in <img> style)
// With objectFit:cover + objectPosition:center 52.5% the static img shows:
//   full width, content y=168–1291 fills container height (0.266W ≈ containerH).
//
// Video (1920×1080): logo at x=463–1502, y=272–672 → 1039×400 px (aspect 2.598:1)
//   At objectFit:cover on 3.771:1 container → logo only 78% of container height.
//
// Canvas fix: draw video logo cropped to its bounds, fit-height into a canvas
//   that matches the static container (3.771:1).  Per-pixel black removal replaces
//   the black background with transparency — no blend-mode hue issues.
//   Logo renders at 68.9% of container width, centered, with transparent sides.
// ─────────────────────────────────────────────────────────────────────────────

// Canvas internal dimensions matching the 3.771:1 logo container
const CANVAS_W = 640;
const CANVAS_H = Math.round(CANVAS_W * (1120 / 4224)); // 170 px

// Video source crop (logo bounds in 1920×1080 frame)
const SRC_X = 463, SRC_Y = 272, SRC_W = 1039, SRC_H = 400;

// Destination: fit logo HEIGHT to canvas, center horizontally
const DEST_H = CANVAS_H;
const DEST_W = Math.round(DEST_H * (SRC_W / SRC_H)); // ≈ 441 px
const DEST_X = Math.round((CANVAS_W - DEST_W) / 2);  // ≈  99 px

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
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);

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

  // Canvas render loop — runs once per video frame
  useEffect(() => {
    if (size !== "large") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create video element programmatically — keeps it out of the DOM entirely,
    // avoiding any stacking-context conflicts with backdrop-blur.
    const video = document.createElement("video");
    video.autoplay  = true;
    video.muted     = true;
    video.loop      = true;
    video.playsInline = true;

    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let running = false;

    const drawFrame = () => {
      if (!running) return;

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      // Draw only the logo crop from the video frame
      ctx.drawImage(video, SRC_X, SRC_Y, SRC_W, SRC_H, DEST_X, 0, DEST_W, DEST_H);

      // Per-pixel: remove near-black (background) pixels
      const img  = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Squared magnitude from black — logo blue ≈ (7,84,167) → mag² ≈ 34 994
        const mag2 = r * r + g * g + b * b;
        if (mag2 < 600) {
          // Pure background: fully transparent
          data[i + 3] = 0;
        } else if (mag2 < 2400) {
          // Soft edge: partial transparency
          data[i + 3] = Math.round(255 * (mag2 - 600) / 1800);
        }
        // else: logo pixel — keep fully opaque (alpha unchanged from drawImage)
      }
      ctx.putImageData(img, 0, 0);

      rafRef.current = requestAnimationFrame(drawFrame);
    };

    const onPlay = () => {
      running = true;
      setVideoReady(true);
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    video.addEventListener("play", onPlay);

    // Defer video load until page is fully loaded for LCP optimisation
    const startLoad = () => {
      video.src = shieldVideo;
      video.load();
    };
    if (document.readyState === "complete") {
      startLoad();
    } else {
      window.addEventListener("load", startLoad, { once: true });
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("play", onPlay);
      video.pause();
      video.src = "";
    };
  }, [size]);

  // ── Small variant (navbar) ──────────────────────────────────────────────
  if (size !== "large") {
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

  // ── Large variant (hero card) ───────────────────────────────────────────
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/*
        Outer wrapper: full-width on mobile, 80 % centred on sm+.
        CSS Grid → static <img> and <canvas> share the same grid cell (1/1).
        No position:absolute needed — safe inside backdrop-blur stacking contexts.
      */}
      <div
        className="w-full sm:w-4/5 mx-auto"
        style={{ display: "grid" }}
      >
        {/* Static logo — shown until animation is ready, then faded out */}
        <img
          src={logoImage}
          alt="Insure-it Group Corp"
          fetchPriority="high"
          draggable={false}
          style={{
            gridArea: "1 / 1",
            width: "100%",
            aspectRatio: "4224 / 1120",
            objectFit: "cover",
            objectPosition: "center 52.5%",
            display: "block",
            opacity: videoReady ? 0 : 1,
            transition: "opacity 0.6s",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/*
          Canvas overlay — draws each video frame with the black background
          removed per-pixel.  Fades in once the video starts playing.
          Same container dimensions (3.771:1) as the static <img>.
        */}
        <canvas
          ref={canvasRef}
          style={{
            gridArea: "1 / 1",
            width: "100%",
            aspectRatio: "4224 / 1120",
            display: "block",
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
