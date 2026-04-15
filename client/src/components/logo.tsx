"use client";

import { useState, useEffect, useRef } from "react";
const logoImage = "/images/insure_it_logo.webp";

const shieldVideo        = "/shield_animation.webm";
const shieldStatic       = "/shield_animation_static.webp";
const mobileVideoWebm    = "/insureit_logo_mobile.webm";
const mobileVideoMp4     = "/insureit_animation.mp4";
const mobileStatic       = "/insureit_logo_mobile_static.webp";

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
  const [desktopVideoReady, setDesktopVideoReady] = useState(false);
  const [mobileVideoReady, setMobileVideoReady] = useState(false);
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

  // Mobile: lazy-load after window.onload (same timing as hero video)
  // Uses WebM (1.3MB, best quality) with MP4 fallback (123KB, Safari <14.1)
  useEffect(() => {
    if (size !== "large") return;
    const video = mobileVideoRef.current;
    if (!video) return;

    const loadVideo = () => {
      const onCanPlay = () => setMobileVideoReady(true);
      video.addEventListener("canplay", onCanPlay);

      // Dynamically add sources so nothing downloads until now
      const webmSrc = document.createElement("source");
      webmSrc.src  = mobileVideoWebm;
      webmSrc.type = "video/webm";
      const mp4Src = document.createElement("source");
      mp4Src.src   = mobileVideoMp4;
      mp4Src.type  = "video/mp4";
      video.appendChild(webmSrc);
      video.appendChild(mp4Src);
      video.load();

      return () => video.removeEventListener("canplay", onCanPlay);
    };

    if (document.readyState === "complete") {
      return loadVideo();
    }
    let cleanup: (() => void) | undefined;
    const onLoad = () => { cleanup = loadVideo(); };
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      cleanup?.();
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

    if (document.readyState === "complete") {
      return loadVideo();
    }
    let cleanup: (() => void) | undefined;
    const onLoad = () => { cleanup = loadVideo(); };
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, [size]);

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Mobile: static last-frame placeholder, video fades in after page load */}
        <div className="md:hidden w-full flex flex-col items-center">
          <div className="relative w-full" style={{ aspectRatio: "450/121" }}>
            <img
              src={mobileStatic}
              alt="Insure-it Group Corp"
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${mobileVideoReady ? "opacity-0" : "opacity-100"}`}
              width={450}
              height={121}
              fetchPriority="high"
              draggable={false}
            />
            <video
              ref={mobileVideoRef}
              autoPlay
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${mobileVideoReady ? "opacity-100" : "opacity-0"}`}
              aria-hidden={!mobileVideoReady}
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
