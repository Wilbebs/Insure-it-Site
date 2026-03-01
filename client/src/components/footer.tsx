import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import Logo from "./logo";
import { useTranslation } from "./theme-provider";

interface FooterProps {
  onGetQuote?: () => void;
}

export default function Footer({ onGetQuote }: FooterProps) {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-2 sm:py-4" data-testid="footer">
      <div className="container mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-6">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-1">
              <Logo imgClassName="h-7 sm:h-10" />
            </div>
            <p className="opacity-90 leading-snug text-[10px] sm:text-xs mb-1.5 sm:mb-2">
              {t.footer.description}
            </p>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <a
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-1 sm:p-1.5 rounded transition-all hover:scale-110"
                data-testid="footer-linkedin"
              >
                <FaLinkedin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </a>
              <a
                href="https://www.instagram.com/insureitgroup/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-1 sm:p-1.5 rounded transition-all hover:scale-110"
                data-testid="footer-instagram"
              >
                <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4 text-pink-600" />
              </a>
              <a
                href="https://www.facebook.com/insureitgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-1 sm:p-1.5 rounded transition-all hover:scale-110"
                data-testid="footer-facebook"
              >
                <FaFacebook className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[10px] sm:text-sm mb-1 sm:mb-2">{t.footer.quickLinks}</h3>
            <ul className="space-y-0.5 sm:space-y-1 opacity-90 text-[10px] sm:text-sm">
              <li>
                <Link
                  href="/"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="footer-link-home"
                >
                  {t.footer.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="footer-link-about"
                >
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <button
                  onClick={onGetQuote}
                  className="hover:opacity-100 transition-opacity text-left"
                  data-testid="footer-link-quote"
                >
                  {t.footer.getQuote}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[10px] sm:text-sm mb-1 sm:mb-2">{t.footer.contactInfo}</h3>
            <div className="space-y-0.5 sm:space-y-1 opacity-90 text-[10px] sm:text-sm">
              <div className="flex items-center" data-testid="contact-phone">
                <Phone className="w-2.5 h-2.5 mr-1 sm:w-3.5 sm:h-3.5 sm:mr-2 shrink-0" />
                <span>904-909-0897</span>
              </div>
              <div className="flex items-center" data-testid="contact-email">
                <Mail className="w-2.5 h-2.5 mr-1 sm:w-3.5 sm:h-3.5 sm:mr-2 shrink-0" />
                <span className="break-all">Insureit@insureitgroup.net</span>
              </div>
              <div className="flex items-start" data-testid="contact-address">
                <MapPin className="w-2.5 h-2.5 mr-1 sm:w-3.5 sm:h-3.5 sm:mr-2 shrink-0 mt-0.5" />
                <span>11570 San Jose Blvd, Suite 11 · Jacksonville, FL 32223</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-2 pt-2 sm:mt-3 sm:pt-3 text-center opacity-75 text-[10px] sm:text-xs">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
