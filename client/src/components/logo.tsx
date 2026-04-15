"use client";

import { useState, useEffect, useRef } from "react";

const logoNavbar      = "/images/insure_it_logo.webp";
const logoPlaceholder = "/images/logo_placeholder.webp"; // transparent WebP, 1039×400 crop
const shieldVideo     = "/shield_animation.webm";

// ─── Layout ──────────────────────────────────────────────────────────────────
// Container aspect-ratio: 1039/400 (exact logo-crop dimensions from the video).
// Both the static <img> and the canvas fill this container identically.
//
// Video: 1920×1080, logo at x=463–1502, y=272–672 (1039×400 px)
// Canvas internal size: 520×200 (1039/2 : 400/2, same aspect).
// drawImage crops SRC_X/Y/W/H → fills the full canvas at DEST 0,0,520,200.
// Per-pixel black removal makes the background transparent — same as the
// transparent static placeholder. No blend-mode, no position:absolute.
// ─────────────────────────────────────────────────────────────────────────────

const CANVAS_W = 520;
const CANVAS_H = 200; // 520 × (400/1039) ≈ 200

const SRC_X = 463, SRC_Y = 272, SRC_W = 1039, SRC_H = 400;

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

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

  // Canvas render loop — draws the logo crop with transparent black background
  useEffect(() => {
    if (size !== "large") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const video = document.createElement("video");
    video.muted       = true;
    video.loop        = true;
    video.playsInline = true;

    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let running = false;

    const drawFrame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      // Crop logo area from video, stretch to fill entire canvas
      ctx.drawImage(video, SRC_X, SRC_Y, SRC_W, SRC_H, 0, 0, CANVAS_W, CANVAS_H);

      // Per-pixel: remove near-black (background) — same threshold as static WebP fuzz 12%
      const img  = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const mag2 = r * r + g * g + b * b;
        if (mag2 < 600) {
          data[i + 3] = 0;
        } else if (mag2 < 2400) {
          data[i + 3] = Math.round(255 * (mag2 - 600) / 1800);
        }
      }
      ctx.putImageData(img, 0, 0);
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    const onPlay = () => {
      running = true;
      setVideoReady(true);
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    const onCanPlay = () => {
      video.play().catch(() => {});
    };

    video.addEventListener("play",    onPlay);
    video.addEventListener("canplay", onCanPlay);

    // Defer video load until page is fully loaded (LCP optimisation)
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
      video.removeEventListener("play",    onPlay);
      video.removeEventListener("canplay", onCanPlay);
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
        Container: aspect-ratio matches logo crop (1039:400).
        CSS Grid → static <img> and <canvas> share cell 1/1.
        No position:absolute — safe inside backdrop-blur on iOS/WebKit.
      */}
      <div
        className="w-full sm:w-4/5 mx-auto"
        style={{ display: "grid", aspectRatio: "1039 / 400" }}
      >
        {/* Static transparent placeholder — fades out once animation starts */}
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

        {/* Canvas: same crop region, per-pixel black removed → transparent bg */}
        <canvas
          ref={canvasRef}
          style={{
            gridArea: "1 / 1",
            width: "100%",
            aspectRatio: "1039 / 400",
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
