import { Shield } from "lucide-react";

interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

export default function Logo({ className = "", variant = 'default' }: LogoProps) {
  const textColor = variant === 'white' ? 'text-white' : 'text-foreground';
  const iconColor = variant === 'white' ? 'text-white' : 'text-primary';
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Shield className={`w-6 h-6 ${iconColor}`} />
      <span className={`font-bold text-xl ${textColor}`}>Insure-it</span>
    </div>
  );
}
