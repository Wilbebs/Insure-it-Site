"use client";

import { useState, useEffect, useRef } from "react";
const logoImage    = "/images/insure_it_logo.webp";
const shieldVideo  = "/shield_animation.webm";
const shieldStatic = "/shield_animation_static.webp";
const mobileStatic = "/shield_logo_static.webp";
// H.264 MP4: plays on every browser including iOS Safari
const mobileVideoSrc = "/insureit_logo_mobile_cropped.mp4";

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
  const [taglineText, setTaglineText]         = useState("");
  const fullTagline                           = "Life's Uncertain. Your Coverage Isn't.";
  const [desktopVideoReady, setDesktopVideoReady] = useState(false);
  const [canvasReady, setCanvasReady]         = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenVideoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const rafRef          = useRef<number>(0);

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

  // Mobile: canvas renderer — draws H.264 MP4 frames and removes dark pixels each frame.
  // Works on all browsers (iOS Safari doesn't support VP9 alpha or HEVC alpha via ffmpeg).
  // Canvas is half native res (496×140) for performance; CSS scales it back up.
  useEffect(() => {
    if (size !== "large") return;
    const video  = hiddenVideoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const W = 496, H = 140;
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const drawFrame = () => {
      if (video.readyState < 2) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(video, 0, 0, W, H);
      const imgData = ctx.getImageData(0, 0, W, H);
      const d = imgData.data;
      const threshold = 35;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] < threshold && d[i + 1] < threshold && d[i + 2] < threshold) {
          d[i + 3] = 0; // make dark pixels transparent
        }
      }
      ctx.putImageData(imgData, 0, 0);
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    const startPlayback = () => {
      video.src = mobileVideoSrc;
      video.load();
      video.play().then(() => {
        setCanvasReady(true);
        drawFrame();
      }).catch(() => {});
    };

    if (document.readyState === "complete") {
      startPlayback();
    } else {
      window.addEventListener("load", startPlayback);
    }

    return () => {
      window.removeEventListener("load", startPlayback);
      cancelAnimationFrame(rafRef.current);
      video.pause();
    };
  }, [size]);

  // Desktop: lazy-load WebM after window.onload
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

        {/* Mobile: static transparent placeholder → canvas-rendered animation (bg removed) */}
        <div className="md:hidden w-full" style={{ aspectRatio: "992/280" }}>
          <div className="relative w-full h-full">
            {/* Transparent static: visible until canvas animation starts */}
            <img
              src={mobileStatic}
              alt="Insure-it Group Corp"
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700 ${canvasReady ? "opacity-0" : "opacity-100"}`}
              width={450}
              height={121}
              fetchPriority="high"
              draggable={false}
            />
            {/* Hidden video drives the canvas */}
            <video
              ref={hiddenVideoRef}
              muted
              playsInline
              loop
              className="hidden"
              aria-hidden="true"
            />
            {/* Canvas renders each frame with dark pixels removed */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${canvasReady ? "opacity-100" : "opacity-0"}`}
              style={{ imageRendering: "auto" }}
            />
          </div>
        </div>

        {/* Desktop: static last-frame shows instantly, WebM fades in after page load */}
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
