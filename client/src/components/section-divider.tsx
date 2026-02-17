import { motion } from "framer-motion";
import { useId } from "react";

type DividerVariant = "wave" | "wave-layered" | "diagonal" | "curve";
type DividerPosition = "top" | "bottom";

interface SectionDividerProps {
  variant?: DividerVariant;
  position?: DividerPosition;
  fromColor?: string;
  toColor?: string;
  height?: number;
  animated?: boolean;
  className?: string;
}

function WaveSVG({ fromColor, toColor, height, animated }: { fromColor: string; toColor: string; height: number; animated: boolean }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full block" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      {animated ? (
        <motion.path
          fill={`url(#${gradId})`}
          initial={{ d: "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" }}
          animate={{
            d: [
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
              "M0,80 C240,20 480,100 720,40 C960,80 1200,20 1440,80 L1440,120 L0,120 Z",
              "M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" fill={`url(#${gradId})`} />
      )}
    </svg>
  );
}

function WaveLayeredSVG({ fromColor, toColor, height, animated }: { fromColor: string; toColor: string; height: number; animated: boolean }) {
  return (
    <div className="relative" style={{ height }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect x="0" y="50" width="1440" height="30" fill={toColor} />
        {animated ? (
          <>
            <motion.path
              fill={toColor}
              opacity={0.3}
              initial={{ d: "M0,30 C360,65 720,5 1080,30 C1260,50 1380,10 1440,30 L1440,80 L0,80 Z" }}
              animate={{
                d: [
                  "M0,30 C360,65 720,5 1080,30 C1260,50 1380,10 1440,30 L1440,80 L0,80 Z",
                  "M0,18 C360,0 720,55 1080,18 C1260,0 1380,40 1440,18 L1440,80 L0,80 Z",
                  "M0,30 C360,65 720,5 1080,30 C1260,50 1380,10 1440,30 L1440,80 L0,80 Z",
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              fill={toColor}
              opacity={0.5}
              initial={{ d: "M0,40 C480,12 960,60 1440,28 L1440,80 L0,80 Z" }}
              animate={{
                d: [
                  "M0,40 C480,12 960,60 1440,28 L1440,80 L0,80 Z",
                  "M0,28 C480,60 960,12 1440,40 L1440,80 L0,80 Z",
                  "M0,40 C480,12 960,60 1440,28 L1440,80 L0,80 Z",
                ],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.path
              fill={toColor}
              initial={{ d: "M0,55 C320,40 640,62 960,48 C1200,35 1360,58 1440,50 L1440,80 L0,80 Z" }}
              animate={{
                d: [
                  "M0,55 C320,40 640,62 960,48 C1200,35 1360,58 1440,50 L1440,80 L0,80 Z",
                  "M0,50 C320,62 640,38 960,52 C1200,62 1360,42 1440,55 L1440,80 L0,80 Z",
                  "M0,55 C320,40 640,62 960,48 C1200,35 1360,58 1440,50 L1440,80 L0,80 Z",
                ],
              }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </>
        ) : (
          <>
            <path d="M0,30 C360,65 720,5 1080,30 C1260,50 1380,10 1440,30 L1440,80 L0,80 Z" fill={toColor} opacity={0.3} />
            <path d="M0,40 C480,12 960,60 1440,28 L1440,80 L0,80 Z" fill={toColor} opacity={0.5} />
            <path d="M0,55 C320,40 640,62 960,48 C1200,35 1360,58 1440,50 L1440,80 L0,80 Z" fill={toColor} />
          </>
        )}
      </svg>
    </div>
  );
}

function DiagonalSVG({ fromColor, toColor, height }: { fromColor: string; toColor: string; height: number }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full block" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <polygon points="0,0 1440,80 1440,80 0,80" fill={`url(#${gradId})`} />
    </svg>
  );
}

function CurveSVG({ fromColor, toColor, height, animated }: { fromColor: string; toColor: string; height: number; animated: boolean }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full block" style={{ height }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="50%" stopColor={toColor} />
          <stop offset="100%" stopColor={fromColor} />
        </linearGradient>
      </defs>
      {animated ? (
        <motion.path
          fill={`url(#${gradId})`}
          initial={{ d: "M0,40 Q360,100 720,40 Q1080,-20 1440,40 L1440,100 L0,100 Z" }}
          animate={{
            d: [
              "M0,40 Q360,100 720,40 Q1080,-20 1440,40 L1440,100 L0,100 Z",
              "M0,50 Q360,-10 720,50 Q1080,110 1440,50 L1440,100 L0,100 Z",
              "M0,40 Q360,100 720,40 Q1080,-20 1440,40 L1440,100 L0,100 Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <path d="M0,40 Q360,100 720,40 Q1080,-20 1440,40 L1440,100 L0,100 Z" fill={`url(#${gradId})`} />
      )}
    </svg>
  );
}

export default function SectionDivider({
  variant = "wave-layered",
  position = "bottom",
  fromColor = "rgba(56,189,248,0.15)",
  toColor = "hsl(210, 40%, 94%)",
  height = 80,
  animated = true,
  className = "",
}: SectionDividerProps) {
  const flipClass = position === "top" ? "rotate-180" : "";

  return (
    <div
      className={`relative w-full overflow-hidden select-none ${flipClass} ${className}`}
      style={{ marginTop: position === "bottom" ? -1 : 0, marginBottom: position === "top" ? -1 : 0 }}
      aria-hidden="true"
    >
      {variant === "wave" && <WaveSVG fromColor={fromColor} toColor={toColor} height={height} animated={animated} />}
      {variant === "wave-layered" && <WaveLayeredSVG fromColor={fromColor} toColor={toColor} height={height} animated={animated} />}
      {variant === "diagonal" && <DiagonalSVG fromColor={fromColor} toColor={toColor} height={height} />}
      {variant === "curve" && <CurveSVG fromColor={fromColor} toColor={toColor} height={height} animated={animated} />}
    </div>
  );
}
