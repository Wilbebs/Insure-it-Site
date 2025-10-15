import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <Logo variant="white" />
            </div>
            <p className="opacity-90 leading-relaxed mb-4">
              A proud family-owned business serving Florida for 14 years. From our roots in Miami to serving thousands of clients statewide, we're your trusted partner in comprehensive insurance solutions.
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
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 opacity-90">
              <li>
                <Link href="/" className="hover:opacity-100 transition-opacity" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-100 transition-opacity" data-testid="footer-link-about">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#connect" className="hover:opacity-100 transition-opacity" data-testid="footer-link-quote">
                  Get Quote
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition-opacity" data-testid="footer-link-claims">
                  Claims
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
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
        
        <div className="border-t border-blue-400 mt-8 pt-8 text-center opacity-75">
          <p>&copy; 2025 Insure-it Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
