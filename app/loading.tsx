"use client";

import { useState, useEffect } from "react";

const SHIELD_VIDEO = "https://d3gkfgi9drj9kb.cloudfront.net/video-assets/shield_animation.webm";
const SHIELD_STATIC = "https://d3gkfgi9drj9kb.cloudfront.net/image-assets/shield_lastframe.webp";

export default function Loading() {
  // Skip the video and show only the static shield when:
  //   • Browser is WebKit (iOS Safari + macOS Safari) — VP8+alpha decodes
  //     to a black rectangle there.
  //   • Viewport is mobile-sized (≤640px) — saves bandwidth on cellular and
  //     keeps Lighthouse mobile performance / SEO scores high.
  // Defaults to false during SSR/first paint so desktop clients aren't
  // penalised with a flash of static.
  const [noVideo, setNoVideo] = useState(false);
  const [videoFadedIn, setVideoFadedIn] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isWebKit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua);
    const isMobile = window.innerWidth <= 640;
    setNoVideo(isWebKit || isMobile);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundColor: "#dbeafe",
        backgroundImage:
          "radial-gradient(circle, rgba(99,130,220,0.28) 1.5px, transparent 1.5px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="relative w-44 h-44 overflow-hidden flex items-center justify-center">
        {/* Static shield is always present underneath. On WebKit it's the only
            thing rendered. On other browsers the video plays once and fades in
            on top of it, ending on its final frame which matches the static
            pixel-for-pixel — so the seam is invisible. */}
        <img
          src={SHIELD_STATIC}
          alt=""
          aria-hidden="true"
          className={`absolute w-[520px] h-auto pointer-events-none transition-opacity duration-500 ${videoFadedIn ? "opacity-0" : "opacity-100"}`}
          style={{ transform: "scale(1.55)", transformOrigin: "center center" }}
          draggable={false}
        />
        {!noVideo && (
          <video
            autoPlay
            muted
            playsInline
            preload="auto"
            onCanPlay={() => setVideoFadedIn(true)}
            className={`absolute w-[520px] h-auto pointer-events-none z-10 transition-opacity duration-500 ${videoFadedIn ? "opacity-100" : "opacity-0"}`}
            style={{ transform: "scale(1.55)", transformOrigin: "center center" }}
          >
            <source src={SHIELD_VIDEO} type="video/webm" />
          </video>
        )}
      </div>

      <p className="text-slate-500 text-xs font-semibold tracking-[0.25em] uppercase animate-pulse mt-1">
        Loading
      </p>
    </div>
  );
}
