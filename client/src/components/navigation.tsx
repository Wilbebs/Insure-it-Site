import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass-nav rounded-full px-8 py-3" data-testid="main-navigation">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
          <Shield className="text-primary text-xl" />
          <span className="font-bold text-lg gradient-text">Insure-it Group</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className={`transition-colors font-medium ${
              location === "/" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-home"
          >
            Home
          </Link>
          <Link 
            href="/auto-insurance" 
            className={`transition-colors font-medium ${
              location === "/auto-insurance" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-auto"
          >
            Auto
          </Link>
          <Link 
            href="/home-insurance" 
            className={`transition-colors font-medium ${
              location === "/home-insurance" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-home-insurance"
          >
            Home
          </Link>
          <Link 
            href="/life-insurance" 
            className={`transition-colors font-medium ${
              location === "/life-insurance" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-life"
          >
            Life
          </Link>
          <Link 
            href="/health-insurance" 
            className={`transition-colors font-medium ${
              location === "/health-insurance" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-health"
          >
            Health
          </Link>
          <Link 
            href="/commercial-insurance" 
            className={`transition-colors font-medium ${
              location === "/commercial-insurance" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-commercial"
          >
            Commercial
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors font-medium ${
              location === "/about" ? "text-primary" : "text-foreground hover:text-primary"
            }`}
            data-testid="nav-about"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
