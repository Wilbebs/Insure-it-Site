interface LogoProps {
  className?: string;
  variant?: 'default' | 'white';
}

export default function Logo({ className = "", variant = 'default' }: LogoProps) {
  return (
    <img 
      src="/logo.jpg" 
      alt="Insure-it Group" 
      className={className}
      style={{ 
        objectFit: 'contain',
        filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
      }}
    />
  );
}
