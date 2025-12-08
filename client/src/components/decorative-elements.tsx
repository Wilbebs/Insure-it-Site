import { motion } from "framer-motion";

export function FloatingShield({ 
  className = "", 
  size = 40,
  opacity = 0.08,
  delay = 0 
}: { 
  className?: string; 
  size?: number;
  opacity?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute pointer-events-none select-none ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: opacity, 
        y: [0, -10, 0],
      }}
      transition={{ 
        opacity: { duration: 1, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 512 512" 
        fill="none"
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path 
          d="M256 48C160 48 80 96 80 96V288C80 384 256 464 256 464C256 464 432 384 432 288V96C432 96 352 48 256 48Z" 
          fill="url(#shieldGradient)"
        />
        <text 
          x="256" 
          y="300" 
          textAnchor="middle" 
          fill="white" 
          fontSize="180" 
          fontWeight="bold" 
          fontFamily="sans-serif"
        >
          it
        </text>
      </svg>
    </motion.div>
  );
}

export function CornerBracket({ 
  position = "top-left",
  size = 30,
  className = ""
}: { 
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  className?: string;
}) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180"
  };

  return (
    <div className={`absolute ${positionClasses[position]} pointer-events-none ${className}`}>
      <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
        <path 
          d="M2 28V8C2 4.68629 4.68629 2 8 2H28" 
          stroke="url(#bracketGradient)" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          fill="none"
        />
        <defs>
          <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function CornerBrackets({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <>
      <CornerBracket position="top-left" size={size} className={className} />
      <CornerBracket position="top-right" size={size} className={className} />
      <CornerBracket position="bottom-left" size={size} className={className} />
      <CornerBracket position="bottom-right" size={size} className={className} />
    </>
  );
}

export function DecorativeShields() {
  return (
    <>
      <FloatingShield className="top-20 left-[5%]" size={60} opacity={0.06} delay={0} />
      <FloatingShield className="top-40 right-[8%]" size={45} opacity={0.05} delay={0.5} />
      <FloatingShield className="bottom-32 left-[12%]" size={35} opacity={0.04} delay={1} />
      <FloatingShield className="bottom-20 right-[15%]" size={50} opacity={0.05} delay={1.5} />
    </>
  );
}
