import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  showTagline?: boolean;
  size?: 'small' | 'large';
}

export default function Logo({ className = "", variant = 'default', showTagline = false, size = 'small' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-gray-800';
  const accentColor = variant === 'white' ? 'text-white' : 'text-primary';
  const taglineColor = variant === 'white' ? 'text-white/90' : 'text-muted-foreground';
  
  if (size === 'large') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="flex items-center relative">
          <span className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${textColor}`}>
            insure
          </span>
          <div className="relative flex items-center ml-1">
            <Shield className={`absolute w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 ${accentColor} -left-2 sm:-left-3 md:-left-4`} style={{ opacity: 0.15 }} />
            <span className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${accentColor} relative z-10`}>
              it
            </span>
          </div>
        </div>
        {showTagline && (
          <p className={`mt-4 text-lg sm:text-xl md:text-2xl font-medium italic ${taglineColor}`}>
            Life's Uncertain. Your Coverage Isn't.
          </p>
        )}
      </div>
    );
  }
  
  return (
    <div className={`flex items-center relative ${className}`}>
      <span className={`font-bold text-xl ${textColor}`}>insure</span>
      <div className="relative flex items-center">
        <Shield className={`absolute w-5 h-5 ${accentColor} -left-1`} style={{ opacity: 0.15 }} />
        <span className={`font-bold text-xl ${accentColor} relative z-10`}>it</span>
      </div>
    </div>
  );
}
