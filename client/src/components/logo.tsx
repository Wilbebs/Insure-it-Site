"use client";

import { useState, useEffect, useRef } from "react";

const CDN = "https://d3gkfgi9drj9kb.cloudfront.net";
const CDN_IMG = `${CDN}/image-assets`;
const CDN_VID = `${CDN}/video-assets`;

const logoImage = `${CDN_IMG}/staticinsureitlogo.webp`;
// VP8+alpha WebM — 1.2 MB. Animates correctly on every browser engine that
// honours the alpha channel (Chrome, Firefox, Edge, Android WebView, etc).
// The WebKit family (iOS Safari + macOS Safari + every iOS browser, since they
// all use WebKit) decodes VP8 but ignores alpha, painting a black rectangle.
// For those browsers we never mount the <video> at all and let the static
// shield stay visible. See `useNoVideo()` below.
const shieldVideo = `${CDN_VID}/shield_animation.webm`;
const shieldStatic = `${CDN_IMG}/shield_lastframe.webp`;

interface LogoProps {
  className?: string;
  imgClassName?: string;
  variant?: "default" | "white";
  showTagline?: boolean;
  size?: "small" | "large";
}

// Returns true on browsers whose video decoder strips the alpha channel from
// VP8+alpha WebM (the WebKit family). On those, we never mount the <video>
// element at all and let the static placeholder stay visible. Defaults to
// `false` during SSR / first paint so non-Safari clients aren't penalised
// with a flash of static.
function useNoVideo(): boolean {
  const [noVideo, setNoVideo] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    const webkit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua);
    setNoVideo(webkit);
  }, []);
  return noVideo;
}

// Returns true once the page has finished loading. Used to defer mounting the
// video element until after `window.onload` — the page renders with just the
// static shield, then the animation downloads and plays in the background.
// Same pattern as the hero video lazy-load in `landing.tsx`.
function useAfterPageLoad(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.readyState === "complete") {
      setReady(true);
      return;
    }
    const onLoad = () => setReady(true);
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return ready;
}

export default function Logo({
  className = "",
  imgClassName,
  showTagline = false,
  size = "small",
}: LogoProps) {
  const [taglineText, setTaglineText] = useState("");
  const fullTagline = "Life's Uncertain. Your Coverage Isn't.";
  const [fluidShieldReady, setFluidShieldReady] = useState(false);
  const [mobileShieldReady, setMobileShieldReady] = useState(false);
  const fluidVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const noVideo = useNoVideo();
  const pageLoaded = useAfterPageLoad();
  // Mount the <video> only when (a) we know the browser can decode it and
  // (b) the rest of the page has finished loading. The animation plays once
  // (no `loop` attribute) and rests on its final frame, which matches the
  // static placeholder pixel-for-pixel — so the user never notices the seam.
  const showVideo = !noVideo && pageLoaded;

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

  const mobileShieldCss = "absolute left-1/2 w-[990px] h-auto pointer-events-none";
  const mobileShieldStyle = {
    top: "-12px",
    transform: "translateX(-50%) scale(1.85)",
    transformOrigin: "center center",
  };

  // Fluid sizing for non-phone viewports (≥640px). Anything below 640px uses
  // the dedicated mobile branch since composition needs are different there.
  // Linearly interpolates between two anchor points:
  //   • 640px viewport → width 700px, scale 1.30, top -45px, container 145px tall
  //   • 1280px viewport → width 990px, scale 1.55, top -57px, container 155px tall
  // Above 1280px and below 640px, clamp() locks the values at the bounds.
  // Slopes derived from a 640px range: width 290/640=0.453, top -12/640=-0.01875,
  // scale 0.25/640=0.000391, height 10/640=0.01563.
  const fluidShieldCss = "absolute left-1/2 h-auto pointer-events-none";
  const fluidShieldStyle = {
    width: "clamp(700px, calc(700px + (100vw - 640px) * 0.453), 990px)",
    top: "clamp(-57px, calc(-45px + (100vw - 640px) * -0.01875), -45px)",
    transform:
      "translateX(-50%) scale(clamp(1.3, calc(1.3 + (100vw - 640px) * 0.000391 / 1px), 1.55))",
    transformOrigin: "center center",
  } as const;
  const fluidContainerStyle = {
    height: "clamp(145px, calc(145px + (100vw - 640px) * 0.01563), 155px)",
  } as const;

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>

        {/* Phone / phablet (under 640px) — discrete sizing tuned for narrow viewports */}
        <div className="sm:hidden w-full flex flex-col items-center">
          <div className="relative h-[92px] w-full overflow-hidden">
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`${mobileShieldCss} transition-opacity duration-500 ${mobileShieldReady ? "opacity-0" : "opacity-100"}`}
              style={mobileShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            {showVideo && (
              <video
                ref={mobileVideoRef}
                src={shieldVideo}
                autoPlay
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setMobileShieldReady(true)}
                className={`${mobileShieldCss} z-10 transition-opacity duration-500 ${mobileShieldReady ? "opacity-100" : "opacity-0"}`}
                style={mobileShieldStyle}
              />
            )}
          </div>
        </div>

        {/* Tablet + Desktop (≥640px) — fluidly interpolated via clamp() */}
        <div className="hidden sm:flex sm:flex-col sm:items-center w-full">
          <div
            className="relative w-full overflow-hidden mx-auto"
            style={fluidContainerStyle}
          >
            <img
              src={shieldStatic}
              alt="Insure-it Group Corp"
              className={`${fluidShieldCss} transition-opacity duration-500 ${fluidShieldReady ? "opacity-0" : "opacity-100"}`}
              style={fluidShieldStyle}
              fetchPriority="high"
              draggable={false}
            />
            {showVideo && (
              <video
                ref={fluidVideoRef}
                src={shieldVideo}
                autoPlay
                muted
                playsInline
                preload="auto"
                onCanPlay={() => setFluidShieldReady(true)}
                className={`${fluidShieldCss} z-10 transition-opacity duration-500 ${fluidShieldReady ? "opacity-100" : "opacity-0"}`}
                style={fluidShieldStyle}
              />
            )}
          </div>
          {showTagline && (
            <p className="mt-2 text-xl lg:text-2xl font-semibold italic tagline-shimmer select-none">
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
