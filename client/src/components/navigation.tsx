import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import Logo from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileInsuranceOpen, setIsMobileInsuranceOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const insuranceLinks = [
    { href: "/auto-insurance", label: "Auto", testId: "nav-auto" },
    { href: "/home-insurance", label: "Home", testId: "nav-home-insurance" },
    { href: "/life-insurance", label: "Life", testId: "nav-life" },
    { href: "/health-insurance", label: "Health", testId: "nav-health" },
    { href: "/commercial-insurance", label: "Commercial", testId: "nav-commercial" },
  ];

  const isInsurancePage = insuranceLinks.some(link => link.href === location);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`fixed left-1/2 transform -translate-x-1/2 z-50 glass-nav px-4 sm:px-8 py-4 hidden lg:block transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'top-4 rounded-full' 
            : 'top-0 rounded-none w-full'
        }`}
        data-testid="main-navigation"
      >
        <div className={`flex items-center justify-between transition-all duration-500`}>
          {/* Left side: Logo and Nav Links */}
          <div className={`flex items-center transition-all duration-500 ${
            isScrolled ? 'space-x-6 xl:space-x-10' : 'space-x-8 xl:space-x-12'
          }`}>
            <Link href="/" className="flex items-center" data-testid="link-home">
              <Logo />
            </Link>
            <div className={`flex items-center transition-all duration-500 ${
              isScrolled ? 'space-x-5 xl:space-x-8' : 'space-x-8 xl:space-x-10'
            }`}>
              <Link 
                href="/" 
                className={`transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                  location === "/" ? "text-primary" : "text-foreground hover:text-primary"
                }`}
                data-testid="nav-home"
              >
                Home
              </Link>

              {/* Conditional rendering based on scroll state */}
              {isScrolled ? (
                /* Collapsed: Insurance Dropdown */
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className={`transition-colors font-medium text-sm xl:text-base flex items-center gap-1 focus:outline-none whitespace-nowrap ${
                      isInsurancePage ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                    data-testid="nav-insurance-dropdown"
                  >
                    Insurance
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="glass-nav border-white/20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-xl" 
                    align="center"
                  >
                    {insuranceLinks.map(({ href, label, testId }) => (
                      <DropdownMenuItem key={href} asChild>
                        <Link 
                          href={href}
                          className={`cursor-pointer transition-colors hover:bg-primary/10 ${
                            location === href ? "text-primary bg-primary/5 font-medium" : "text-foreground"
                          }`}
                          data-testid={testId}
                        >
                          {label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* Expanded: All Insurance Links Visible */
                <>
                  {insuranceLinks.map(({ href, label, testId }) => (
                    <Link 
                      key={href}
                      href={href} 
                      className={`transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                        location === href ? "text-primary" : "text-foreground hover:text-primary"
                      }`}
                      data-testid={testId}
                    >
                      {label}
                    </Link>
                  ))}
                </>
              )}

              <Link 
                href="/about" 
                className={`transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                  location === "/about" ? "text-primary" : "text-foreground hover:text-primary"
                }`}
                data-testid="nav-about"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right side: Social Media Links */}
          <div className={`flex transition-all duration-500 ${isScrolled ? '-space-x-6 ml-8' : 'gap-2'}`}>
            <a 
              href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full bg-white/90 hover:bg-primary transition-all duration-300 group shadow-md hover:shadow-lg ${isScrolled ? 'hover:z-30 hover:scale-110' : ''}`}
              data-testid="nav-social-linkedin"
              style={{ zIndex: isScrolled ? 3 : 'auto' }}
            >
              <FaLinkedin className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
            </a>
            
            <a 
              href="https://www.instagram.com/insureitgroup/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full bg-white/90 hover:bg-pink-600 transition-all duration-300 group shadow-md hover:shadow-lg ${isScrolled ? 'hover:z-30 hover:scale-110' : ''}`}
              data-testid="nav-social-instagram"
              style={{ zIndex: isScrolled ? 2 : 'auto' }}
            >
              <FaInstagram className="w-5 h-5 text-pink-600 group-hover:text-white transition-colors duration-300" />
            </a>
            
            <a 
              href="https://www.facebook.com/insureitgroup"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full bg-white/90 hover:bg-blue-600 transition-all duration-300 group shadow-md hover:shadow-lg ${isScrolled ? 'hover:z-30 hover:scale-110' : ''}`}
              data-testid="nav-social-facebook"
              style={{ zIndex: isScrolled ? 1 : 'auto' }}
            >
              <FaFacebook className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-full px-4 py-3 lg:hidden" data-testid="mobile-navigation">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center" data-testid="link-home-mobile">
            <Logo />
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
              <Link 
                href="/" 
                className={`transition-colors font-medium text-center py-2 rounded-lg ${
                  location === "/" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
                data-testid="nav-home-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Insurance Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileInsuranceOpen(!isMobileInsuranceOpen)}
                  className={`w-full transition-colors font-medium text-center py-2 rounded-lg flex items-center justify-center gap-1 ${
                    isInsurancePage 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  data-testid="nav-insurance-mobile"
                >
                  Insurance
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMobileInsuranceOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMobileInsuranceOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {insuranceLinks.map(({ href, label, testId }) => (
                      <Link 
                        key={href}
                        href={href} 
                        className={`block transition-colors font-medium text-center py-2 rounded-lg ${
                          location === href 
                            ? "text-primary bg-primary/10" 
                            : "text-foreground hover:text-primary hover:bg-primary/5"
                        }`}
                        data-testid={`${testId}-mobile`}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsMobileInsuranceOpen(false);
                        }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/about" 
                className={`transition-colors font-medium text-center py-2 rounded-lg ${
                  location === "/about" 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
                data-testid="nav-about-mobile"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
