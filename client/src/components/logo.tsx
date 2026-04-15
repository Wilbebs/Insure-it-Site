"use client";

import { useState, useEffect, useRef } from "react";
const logoImage   = "/images/insure_it_logo.webp";
const shieldVideo = "/shield_animation.webm";

// ─── Static logo crop (insure_it_logo.webp  4224×1444 px) ───────────────────
// Content y=170–1290 (height 1120), minimal horizontal margins.
// Approach: <img> with aspect-ratio:4224/1120 + object-fit:cover + objectPosition
//   so it NEVER needs position:absolute (avoids backdrop-blur stacking-context
//   bug that makes absolutely-positioned elements invisible on mobile/iOS).
//
// ─── Video overlay (shield_animation.webm  1920×1080 px) ────────────────────
// Logo in video: x=466–1423, y=367–499 (height 132 px).
// Crop via CSS transform inside an overflow:hidden wrapper (no position:abs):
//   width:    385.7% of container W  →  video logo height = container height
//   translateX(-37.04%)              →  −37.04% of videoW = −142.85%W  (center)
//   translateY(-33.95%)              →  −33.95% of videoH = −73.68%W   (top-crop)
//   transform moves PAINT only (layout stays at 0,0) — overflow:hidden clips
//   reliably, unlike negative-margin which puts layout above the container.
//
// Both elements live in the same CSS-Grid cell (gridArea:"1/1") — they overlap
// without any absolute positioning, so backdrop-blur stacking contexts can't
// hide them.
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
          CSS Grid with both children in cell 1/1 → they overlap without
          position:absolute (safe inside backdrop-blur stacking contexts).
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

          {/* ── Animated WebM — crop via transform + padding-bottom ratio trick ── */}
          {/*
           * height:0 + paddingBottom:26.52% → grid row sees a 26.52%W-tall item
           * (same as the <img>), so the cell never inflates to the video's natural
           * 217%W height.  overflow:hidden clips at the PADDING edge (26.52%W).
           * The video is then shifted with transform so only the logo row is visible.
           */}
          <div
            style={{
              gridArea: "1/1",
              width: "100%",
              height: "0",
              paddingBottom: "26.5152%",
              overflow: "hidden",
              opacity: videoReady ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                display: "block",
                width: "385.7%",
                height: "auto",
                /*
                 * transform % values are relative to the element's OWN dimensions:
                 *   translateX(-37.04%) = -37.04% × 385.7%W = -142.8%W  (center)
                 *   translateY(-33.95%) = -33.95% × 217.0%W = -73.68%W  (top-crop)
                 * Layout stays at (0,0); only paint shifts → overflow clips cleanly.
                 */
                transform: "translateX(-37.04%) translateY(-33.95%)",
                pointerEvents: "none",
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
