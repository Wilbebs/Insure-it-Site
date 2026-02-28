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
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-4 sm:py-5" data-testid="footer">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <div className="mb-2">
              <Logo variant="white" />
            </div>
            <p className="opacity-90 leading-snug text-xs mb-2">
              {t.footer.description}
            </p>
            <div className="flex items-center space-x-2">
              <a
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-1.5 rounded transition-all hover:scale-110"
                data-testid="footer-linkedin"
              >
                <FaLinkedin className="w-4 h-4 text-blue-600" />
              </a>
              <a
                href="https://www.instagram.com/insureitgroup/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-1.5 rounded transition-all hover:scale-110"
                data-testid="footer-instagram"
              >
                <FaInstagram className="w-4 h-4 text-pink-600" />
              </a>
              <a
                href="https://www.facebook.com/insureitgroup"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-1.5 rounded transition-all hover:scale-110"
                data-testid="footer-facebook"
              >
                <FaFacebook className="w-4 h-4 text-blue-600" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">{t.footer.quickLinks}</h3>
            <ul className="space-y-1 opacity-90 text-sm">
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
            <h3 className="font-semibold text-sm mb-2">{t.footer.contactInfo}</h3>
            <div className="space-y-1 opacity-90 text-sm">
              <div className="flex items-center" data-testid="contact-phone">
                <Phone className="w-3.5 h-3.5 mr-2 shrink-0" />
                <span>786-237-4070</span>
              </div>
              <div className="flex items-center" data-testid="contact-email">
                <Mail className="w-3.5 h-3.5 mr-2 shrink-0" />
                <span>info@insureitgroup.com</span>
              </div>
              <div className="flex items-center" data-testid="contact-address">
                <MapPin className="w-3.5 h-3.5 mr-2 shrink-0" />
                <span>123 Insurance Ave, Suite 100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-3 pt-3 text-center opacity-75 text-xs">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
