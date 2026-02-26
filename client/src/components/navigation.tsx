import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import Logo from "./logo";
import { useTranslation } from "./theme-provider";
import usaFlagIcon from "@assets/united_states_of_america_round_icon_64_(1)_1770501803978.png";
import spainFlagIcon from "@assets/spain_round_icon_64_1770501803977.png";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoHighlight, setLogoHighlight] = useState(false);
  const { t, language, toggleLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setLogoHighlight(true);
    setTimeout(() => setLogoHighlight(false), 800);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`fixed left-1/2 transform -translate-x-1/2 z-50 glass-nav py-4 hidden lg:block transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'top-4 rounded-full px-6' 
            : 'top-0 rounded-none w-full px-4 sm:px-8'
        }`}
        data-testid="main-navigation"
      >
        <div className="flex items-center justify-between w-full gap-12">
          {/* Left side: Logo */}
          <Link href="/" onClick={handleNavClick} className="flex flex-col items-center group relative flex-shrink-0" data-testid="link-home">
            <Logo />
            <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
              logoHighlight ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100'
            }`}></div>
          </Link>

          {/* Center Nav Links */}
          <div className={`flex items-center justify-center flex-1 transition-all duration-500 ${
            isScrolled ? 'space-x-8' : 'space-x-8 xl:space-x-10'
          }`}>
            <Link 
              href="/"
              onClick={handleNavClick}
              className={`transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                location === "/" ? "text-blue-600" : "text-slate-800 hover:text-black"
              }`}
              data-testid="nav-home"
            >
              {t.nav.getQuoted}
            </Link>
            <Link 
              href="/about"
              onClick={handleNavClick}
              className={`transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                location === "/about" ? "text-blue-600" : "text-slate-800 hover:text-black"
              }`}
              data-testid="nav-about"
            >
              {t.nav.aboutUs}
            </Link>
          </div>

          {/* Right side: Social Media Links + Theme Toggle */}
          <div className={`flex items-center flex-shrink-0 transition-all duration-500 ${isScrolled ? '-space-x-6' : 'gap-2'}`}>
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

            {/* Language Toggle - Far right, only visible when navbar is full-sized */}
            {!isScrolled && (
              <button
                onClick={toggleLanguage}
                className="relative px-3 py-1.5 rounded-full bg-white/90 hover:bg-primary transition-all duration-300 group shadow-md hover:shadow-lg ml-6"
                data-testid="language-toggle"
                aria-label={t.nav.switchLang}
              >
                <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors duration-300">
                  {language === "en" ? "EN" : "ES"}
                </span>
                <img
                  src={language === "en" ? usaFlagIcon : spainFlagIcon}
                  alt=""
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 w-5 h-5 object-contain rounded-full drop-shadow-sm"
                />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-full px-4 py-3 lg:hidden" data-testid="mobile-navigation">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={handleNavClick} className="flex flex-col items-center group relative" data-testid="link-home-mobile">
            <Logo />
            <div className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
              logoHighlight ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}></div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="relative px-3 py-2 rounded-full bg-white/90 hover:bg-primary transition-all duration-300 group shadow-md hover:shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              data-testid="language-toggle-mobile"
              aria-label={t.nav.switchLang}
            >
              <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors duration-300">
                {language === "en" ? "EN" : "ES"}
              </span>
              <img
                src={language === "en" ? usaFlagIcon : spainFlagIcon}
                alt=""
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 w-4 h-4 object-contain rounded-full drop-shadow-sm"
              />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-800 hover:text-black transition-colors"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-nav rounded-2xl p-3 border border-white/20">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`transition-colors font-medium text-center py-3 rounded-lg min-h-[44px] flex items-center justify-center ${
                  location === "/" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-slate-800 hover:text-black hover:bg-slate-50"
                }`}
                data-testid="nav-home-mobile"
                onClick={() => {
                  handleNavClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                {t.nav.getQuoted}
              </Link>
              <Link 
                href="/about" 
                className={`transition-colors font-medium text-center py-3 rounded-lg min-h-[44px] flex items-center justify-center ${
                  location === "/about" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-slate-800 hover:text-black hover:bg-slate-50"
                }`}
                data-testid="nav-about-mobile"
                onClick={() => {
                  handleNavClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                {t.nav.aboutUs}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
