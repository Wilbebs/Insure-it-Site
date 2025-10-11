interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

export default function Logo({ className = "", variant = 'default' }: LogoProps) {
  const primaryColor = variant === 'white' ? '#ffffff' : '#1e3a8a';
  const accentColor = variant === 'white' ? '#60a5fa' : '#3b82f6';
  const lightAccent = variant === 'white' ? '#93c5fd' : '#60a5fa';
  
  return (
    <svg 
      viewBox="0 0 200 60" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stylized "I" with protective arc - represents insurance/protection */}
      <g>
        {/* Protective arc over "I" */}
        <path 
          d="M 8 25 Q 18 10, 28 25" 
          fill="none" 
          stroke={accentColor} 
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Vertical line of "I" */}
        <rect 
          x="16" 
          y="20" 
          width="4" 
          height="25" 
          fill={accentColor}
          rx="2"
        />
        {/* Base of "I" */}
        <rect 
          x="10" 
          y="45" 
          width="16" 
          height="3" 
          fill={accentColor}
          rx="1.5"
        />
      </g>

      {/* "NSURE-IT" text */}
      <text 
        x="38" 
        y="38" 
        fontSize="28" 
        fontWeight="700" 
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-0.5"
      >
        NSURE-IT
      </text>
      
      {/* "GROUP" text */}
      <text 
        x="38" 
        y="52" 
        fontSize="11" 
        fontWeight="500" 
        fill={primaryColor}
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2"
      >
        GROUP
      </text>

      {/* Subtle accent dots - representing coverage points */}
      <circle cx="185" cy="25" r="2.5" fill={lightAccent} opacity="0.6"/>
      <circle cx="192" cy="25" r="2.5" fill={accentColor} opacity="0.8"/>
      <circle cx="185" cy="33" r="2.5" fill={accentColor} opacity="0.8"/>
      <circle cx="192" cy="33" r="2.5" fill={lightAccent} opacity="0.6"/>
    </svg>
  );
}
