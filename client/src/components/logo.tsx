"use client";

import { useState, useEffect, useRef } from "react";
const logoImage    = "/images/insure_it_logo.webp";
const shieldVideo  = "/shield_animation.webm";
const shieldStatic = "/shield_animation_static.webp";

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
  const desktopVideoRef = useRef<HTMLVideoElement>(null);

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

  // Lazy-load WebM shield animation after window.onload
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
    /*
      Logo crop strategy — pixel-exact measurements:
      - shield_animation_static.webp is 1920×1080 ARGB (transparent background).
      - Opaque logo content: x=466–1439 (width≈974px), y=367–499 (height=132px), center-x≈934.
      - background-size=1000px (scale=0.521x):
          bg height = 562.5px
          logo top  = 367 × (562.5/1080) = 191px
          logo bottom = 499 × (562.5/1080) = 260px  →  logo height ≈ 69px
          logo width = 974 × 0.521 = 508px  (fits desktop card ~520px content area)
      - background-position: center -191px → shows bg rows 191–261, covers full logo.
      - Fixed px values → identical crop on every screen width.
    */
    return (
      <div className={`flex flex-col items-center ${className}`}>

        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "70px",
            marginTop: "-5px",
          }}
        >
          {/* Static placeholder — shown until the video is ready */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${desktopVideoReady ? "opacity-0" : "opacity-100"}`}
            style={{
              backgroundImage: `url(${shieldStatic})`,
              backgroundSize: "1000px auto",
              backgroundPosition: "center -191px",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Animated video — fades in once it can play */}
          <video
            ref={desktopVideoRef}
            autoPlay
            muted
            playsInline
            className={`absolute left-1/2 pointer-events-none z-10 transition-opacity duration-500 ${desktopVideoReady ? "opacity-100" : "opacity-0"}`}
            style={{
              width: "1000px",
              top: "-191px",
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
