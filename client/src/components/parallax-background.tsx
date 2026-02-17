import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface ParallaxShape {
  x: string;
  y: string;
  size: number;
  gradient: string;
  speed: number;
  blur: number;
  side: "left" | "right";
}

const defaultShapes: ParallaxShape[] = [
  { x: "-6%", y: "3%", size: 300, gradient: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(59,130,246,0.06) 60%, transparent 80%)", speed: 0.15, blur: 60, side: "left" },
  { x: "82%", y: "10%", size: 240, gradient: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, rgba(139,92,246,0.05) 60%, transparent 80%)", speed: -0.12, blur: 55, side: "right" },
  { x: "-4%", y: "35%", size: 260, gradient: "radial-gradient(circle, rgba(59,130,246,0.16) 0%, rgba(6,182,212,0.06) 60%, transparent 80%)", speed: 0.22, blur: 70, side: "left" },
  { x: "85%", y: "50%", size: 280, gradient: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(59,130,246,0.05) 60%, transparent 80%)", speed: -0.18, blur: 65, side: "right" },
  { x: "-8%", y: "65%", size: 220, gradient: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(56,189,248,0.05) 60%, transparent 80%)", speed: 0.1, blur: 50, side: "left" },
  { x: "88%", y: "78%", size: 200, gradient: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(99,102,241,0.04) 60%, transparent 80%)", speed: -0.25, blur: 55, side: "right" },
];

function ParallaxBlob({ shape, disabled }: { shape: ParallaxShape; disabled: boolean }) {
  const { scrollYProgress } = useScroll();

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? [0, 0] : [0, shape.speed * 500]
  );

  const xDrift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    disabled ? [0, 0, 0] : [0, shape.side === "left" ? -20 : 20, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    disabled ? [1, 1, 1] : [1, 1.1, 0.92]
  );

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.size,
        height: shape.size,
        background: shape.gradient,
        filter: `blur(${shape.blur}px)`,
        y: yOffset,
        x: xDrift,
        scale,
      }}
    />
  );
}

export default function ParallaxBackground() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const disabled = !!prefersReducedMotion || isMobile;

  const shapes = isMobile ? defaultShapes.slice(0, 3) : defaultShapes;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {shapes.map((shape, i) => (
        <ParallaxBlob key={i} shape={shape} disabled={disabled} />
      ))}
    </div>
  );
}
