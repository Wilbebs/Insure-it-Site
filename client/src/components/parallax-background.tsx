import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import shieldIcon from "@assets/512x512_icon-01_1764880603281.png";

interface ParallaxShield {
  x: string;
  y: string;
  size: number;
  speed: number;
  opacity: number;
  rotate: number;
  side: "left" | "right";
}

const defaultShields: ParallaxShield[] = [
  { x: "2%", y: "5%", size: 70, speed: 0.15, opacity: 0.07, rotate: -12, side: "left" },
  { x: "88%", y: "8%", size: 50, speed: -0.1, opacity: 0.06, rotate: 15, side: "right" },
  { x: "5%", y: "28%", size: 55, speed: 0.22, opacity: 0.05, rotate: 8, side: "left" },
  { x: "90%", y: "38%", size: 65, speed: -0.18, opacity: 0.07, rotate: -20, side: "right" },
  { x: "3%", y: "55%", size: 45, speed: 0.12, opacity: 0.06, rotate: 25, side: "left" },
  { x: "85%", y: "60%", size: 60, speed: -0.25, opacity: 0.05, rotate: -8, side: "right" },
  { x: "6%", y: "78%", size: 55, speed: 0.08, opacity: 0.06, rotate: 18, side: "left" },
  { x: "92%", y: "82%", size: 40, speed: -0.15, opacity: 0.07, rotate: -15, side: "right" },
];

function ParallaxShieldElement({ shield, disabled }: { shield: ParallaxShield; disabled: boolean }) {
  const { scrollYProgress } = useScroll();

  const yOffset = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? [0, 0] : [0, shield.speed * 600]
  );

  const xDrift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    disabled ? [0, 0, 0] : [0, shield.side === "left" ? -15 : 15, 0]
  );

  const rotation = useTransform(
    scrollYProgress,
    [0, 1],
    disabled ? [shield.rotate, shield.rotate] : [shield.rotate, shield.rotate + (shield.side === "left" ? 20 : -20)]
  );

  return (
    <motion.img
      src={shieldIcon}
      alt=""
      className="absolute pointer-events-none select-none"
      draggable={false}
      style={{
        left: shield.x,
        top: shield.y,
        width: shield.size,
        height: shield.size,
        opacity: shield.opacity,
        y: yOffset,
        x: xDrift,
        rotate: rotation,
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
  const shields = isMobile ? defaultShields.slice(0, 4) : defaultShields;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {shields.map((shield, i) => (
        <ParallaxShieldElement key={i} shield={shield} disabled={disabled} />
      ))}
    </div>
  );
}
