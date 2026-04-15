"use client";

import { useState, useEffect } from "react";
const logoImage = "/images/insure_it_logo.webp";

// ─── insure_it_logo.webp: 4224 × 1444 px ───────────────────────────────────
// Logo content spans y=170–1290 (height 1120px) and x=86–4155 (width 4069px).
//
// Display strategy (background-image — avoids backdrop-blur stacking-context
// bug that makes absolutely-positioned <img> invisible on mobile):
//   backgroundSize: "100% auto"  → scales image to container width (no h-clip)
//   aspect-ratio: 4224/1120      → container height = content height at 100% w
//   backgroundPosition: "center 52.5%" → skips the 11.8% transparent top margin
//
// Result: full logo always visible, zero horizontal clipping, fully responsive.
// ────────────────────────────────────────────────────────────────────────────

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

  if (size === "large") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div
          className="w-full"
          style={{
            aspectRatio: "4224 / 1120",
            backgroundImage: `url(${logoImage})`,
            backgroundSize: "100% auto",
            backgroundPosition: "center 52.5%",
            backgroundRepeat: "no-repeat",
          }}
        />

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
