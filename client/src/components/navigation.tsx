import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./logo";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", testId: "nav-home" },
    { href: "/auto-insurance", label: "Auto", testId: "nav-auto" },
    { href: "/home-insurance", label: "Home", testId: "nav-home-insurance" },
    { href: "/life-insurance", label: "Life", testId: "nav-life" },
    { href: "/health-insurance", label: "Health", testId: "nav-health" },
    { href: "/commercial-insurance", label: "Commercial", testId: "nav-commercial" },
    { href: "/about", label: "About", testId: "nav-about" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass-nav rounded-full px-4 sm:px-8 py-3 hidden lg:block" data-testid="main-navigation">
        <div className="flex items-center space-x-4 xl:space-x-8">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <Logo className="h-12" />
          </Link>
          <div className="flex items-center space-x-3 xl:space-x-6">
            {navLinks.map(({ href, label, testId }) => (
              <Link 
                key={href}
                href={href} 
                className={`transition-colors font-medium text-sm xl:text-base ${
                  location === href ? "text-primary" : "text-foreground hover:text-primary"
                }`}
                data-testid={testId}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-full px-4 py-3 lg:hidden" data-testid="mobile-navigation">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center" data-testid="link-home-mobile">
            <Logo className="h-10" />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground hover:text-primary transition-colors"
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-nav rounded-2xl p-4 border border-white/20">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ href, label, testId }) => (
                <Link 
                  key={href}
                  href={href} 
                  className={`transition-colors font-medium text-center py-2 rounded-lg ${
                    location === href 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  data-testid={`${testId}-mobile`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
