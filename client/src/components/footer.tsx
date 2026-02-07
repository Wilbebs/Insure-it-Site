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
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Logo variant="white" />
            </div>
            <p className="opacity-90 leading-relaxed mb-4">
              {t.footer.description}
            </p>
            <div className="flex items-center space-x-3">
              <a 
                href="https://www.linkedin.com/company/insure-itgroupcorp./posts/?feedView=all" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-2 rounded transition-all hover:scale-110"
                data-testid="footer-linkedin"
              >
                <FaLinkedin className="w-6 h-6 text-blue-600" />
              </a>
              <a 
                href="https://www.instagram.com/insureitgroup/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-2 rounded transition-all hover:scale-110"
                data-testid="footer-instagram"
              >
                <FaInstagram className="w-6 h-6 text-pink-600" />
              </a>
              <a 
                href="https://www.facebook.com/insureitgroup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/90 hover:bg-white p-2 rounded transition-all hover:scale-110"
                data-testid="footer-facebook"
              >
                <FaFacebook className="w-6 h-6 text-blue-600" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2 opacity-90">
              <li>
                <Link 
                  href="/" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:opacity-100 transition-opacity" 
                  data-testid="footer-link-home"
                >
                  {t.footer.home}
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
            <h3 className="font-semibold text-lg mb-4">{t.footer.contactInfo}</h3>
            <div className="space-y-2 opacity-90">
              <div className="flex items-center" data-testid="contact-phone">
                <Phone className="w-4 h-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center" data-testid="contact-email">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@insureitgroup.com</span>
              </div>
              <div className="flex items-center" data-testid="contact-address">
                <MapPin className="w-4 h-4 mr-2" />
                <span>123 Insurance Ave, Suite 100</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center opacity-75">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
