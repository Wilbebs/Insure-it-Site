import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
  showTagline?: boolean;
  size?: 'small' | 'large';
}

export default function Logo({ className = "", variant = 'default', showTagline = false, size = 'small' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-primary';
  const iconColor = variant === 'white' ? 'text-white' : 'text-primary';
  const taglineColor = variant === 'white' ? 'text-white/90' : 'text-muted-foreground';
  
  if (size === 'large') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="flex items-center space-x-4">
          <Shield className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${iconColor}`} />
          <span className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${textColor}`}>Insure-it</span>
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
    <div className={`flex items-center space-x-2 ${className}`}>
      <Shield className={`w-6 h-6 ${iconColor}`} />
      <span className={`font-bold text-xl ${textColor}`}>Insure-it</span>
    </div>
  );
}
