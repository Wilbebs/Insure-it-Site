"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { useState, useEffect } from "react";
import Logo from "./logo";
import { useTranslation } from "./theme-provider";
const usaFlagIcon = "/images/usa_flag.png";
const spainFlagIcon = "/images/spain_flag.png";

export default function Navigation() {
  const location = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoHighlight, setLogoHighlight] = useState(false);
  const [socialHovered, setSocialHovered] = useState(false);
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
            ? 'top-4 rounded-full pl-4 pr-8 max-w-[calc(100vw-1rem)]' 
            : 'top-0 rounded-none w-full px-4 sm:px-8'
        }`}
        data-testid="main-navigation"
      >
        <div className={`flex items-center justify-between w-full transition-all duration-500 ${
          isScrolled ? 'gap-6' : 'gap-12'
        }`}>
          {/* Left side: Logo */}
          <Link href="/" onClick={handleNavClick} className="flex flex-col items-center group relative flex-shrink-0" data-testid="link-home">
            <Logo />
            <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
              logoHighlight ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100'
            }`}></div>
          </Link>

          {/* Center Nav Links */}
          <div className={`flex items-center justify-center flex-1 transition-all duration-500 ${
            isScrolled ? 'gap-3' : 'gap-6 xl:gap-8'
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
            <span className="text-slate-300 text-sm xl:text-base select-none" aria-hidden="true">|</span>
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
            <span className="text-slate-300 text-sm xl:text-base select-none" aria-hidden="true">|</span>
            <Link
              href="/client-center"
              onClick={handleNavClick}
              className={`transition-colors font-medium text-sm xl:text-base whitespace-nowrap ${
                location === "/client-center" ? "text-blue-600" : "text-slate-800 hover:text-black"
              }`}
              data-testid="nav-client-center"
            >
              {t.nav.clientCenter}
            </Link>
          </div>

          {/* Right side: Social Media Links + Theme Toggle */}
          <div
            className={`flex items-center flex-shrink-0 transition-all duration-500 ease-in-out ${
              isScrolled && !socialHovered ? '-space-x-6' : 'gap-2'
            }`}
            onMouseEnter={() => isScrolled && setSocialHovered(true)}
            onMouseLeave={() => setSocialHovered(false)}
          >
            <a 
              href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full bg-white/90 hover:bg-primary transition-all duration-300 group shadow-md hover:shadow-lg"
              data-testid="nav-social-linkedin"
              style={{ zIndex: 3 }}
            >
              <FaLinkedin className="w-5 h-5 text-primary group-hover:text-white transition-colors duration-300" />
            </a>
            
            <a 
              href="https://www.instagram.com/insureitgroup/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-white/90 hover:bg-pink-600 transition-all duration-300 group shadow-md hover:shadow-lg"
              data-testid="nav-social-instagram"
              style={{ zIndex: 2 }}
            >
              <FaInstagram className="w-5 h-5 text-pink-600 group-hover:text-white transition-colors duration-300" />
            </a>
            
            <a 
              href="https://www.facebook.com/profile.php?id=61573260677064"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full bg-white/90 hover:bg-blue-600 transition-all duration-300 group shadow-md hover:shadow-lg"
              data-testid="nav-social-facebook"
              style={{ zIndex: 1 }}
            >
              <FaFacebook className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </a>

            {/* Language Toggle - always rendered; opacity + max-width collapse it when scrolled+!hovered so the whole nav animates as a single 500ms motion */}
            <button
              onClick={toggleLanguage}
              className={`relative rounded-full bg-white/90 hover:bg-primary group shadow-md hover:shadow-lg transition-all duration-500 ease-in-out ${
                isScrolled
                  ? socialHovered
                    ? 'opacity-100 ml-1 px-3 py-1.5 max-w-[80px]'
                    : 'opacity-0 ml-0 px-0 py-0 max-w-0 pointer-events-none'
                  : 'opacity-100 ml-6 px-3 py-1.5 max-w-[80px]'
              }`}
              data-testid="language-toggle"
              aria-label={t.nav.switchLang}
              tabIndex={isScrolled && !socialHovered ? -1 : 0}
              aria-hidden={isScrolled && !socialHovered}
            >
              <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                {language === "en" ? "EN" : "ES"}
              </span>
              <img
                src={language === "en" ? usaFlagIcon : spainFlagIcon}
                alt=""
                aria-hidden="true"
                className="absolute -top-1 -left-1 w-5 h-5 object-contain rounded-full drop-shadow-sm"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav
        className={`fixed left-0 right-0 z-50 glass-nav lg:hidden transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'top-3 rounded-full mx-3 px-3 py-2'
            : 'top-0 rounded-none px-4 py-3'
        }`}
        data-testid="mobile-navigation"
      >
        <div className="flex items-center justify-between gap-1.5">
          {/* Logo */}
          <Link href="/" onClick={handleNavClick} className="flex flex-col items-center group relative flex-shrink-0" data-testid="link-home-mobile">
            <Logo imgClassName={isScrolled ? "h-6" : "h-9"} />
            <div className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
              logoHighlight ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}></div>
          </Link>

          {/* Inline nav links */}
          <div className={`flex items-center flex-1 justify-center ${isScrolled ? 'gap-2' : 'gap-3'}`}>
            <Link
              href="/"
              onClick={handleNavClick}
              className={`transition-colors font-medium whitespace-nowrap ${isScrolled ? 'text-[10px]' : 'text-xs'} ${
                location === "/" ? "text-blue-600" : "text-slate-800 hover:text-black"
              }`}
              data-testid="nav-home-mobile"
            >
              {t.nav.getQuoted}
            </Link>
            <span className={`text-slate-300 ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>|</span>
            <Link
              href="/about"
              onClick={handleNavClick}
              className={`transition-colors font-medium whitespace-nowrap ${isScrolled ? 'text-[10px]' : 'text-xs'} ${
                location === "/about" ? "text-blue-600" : "text-slate-800 hover:text-black"
              }`}
              data-testid="nav-about-mobile"
            >
              {t.nav.aboutUs}
            </Link>
            <span className={`text-slate-300 ${isScrolled ? 'text-[10px]' : 'text-xs'}`}>|</span>
            <Link
              href="/client-center"
              onClick={handleNavClick}
              className={`transition-colors font-medium whitespace-nowrap ${isScrolled ? 'text-[10px]' : 'text-xs'} ${
                location === "/client-center" ? "text-blue-600" : "text-slate-800 hover:text-black"
              }`}
              data-testid="nav-client-center-mobile"
            >
              {t.nav.clientCenterShort}
            </Link>
          </div>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="relative rounded-full bg-white/90 hover:bg-primary transition-all duration-300 group shadow-md hover:shadow-lg flex-shrink-0 w-9 h-9 flex items-center justify-center"
            data-testid="language-toggle-mobile"
            aria-label={t.nav.switchLang}
          >
            <span className="font-bold text-slate-700 group-hover:text-white transition-colors duration-300 text-xs">
              {language === "en" ? "EN" : "ES"}
            </span>
            <img
              src={language === "en" ? usaFlagIcon : spainFlagIcon}
              alt=""
              aria-hidden="true"
              className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 object-contain rounded-full drop-shadow-sm"
            />
          </button>
        </div>
      </nav>
    </>
  );
}
