"use client";

import { useState, useEffect, useRef } from "react";
const logoImage    = "/images/insure_it_logo.webp";
const shieldVideo  = "/shield_animation.webm";

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

  // Lazy-load WebM shield animation after window.onload
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
        <div className="relative w-full">
          {/* Static logo — always present, fades out when animation ready */}
          <img
            src={logoImage}
            alt="Insure-it Group Corp"
            className={`w-full sm:max-w-[380px] sm:mx-auto h-auto block pointer-events-none select-none transition-opacity duration-500 ${videoReady ? "opacity-0" : "opacity-100"}`}
            fetchPriority="high"
            draggable={false}
          />
          {/* Animated overlay — fades in once the WebM can play */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 w-full sm:max-w-[380px] sm:mx-auto h-full object-contain pointer-events-none transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
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
