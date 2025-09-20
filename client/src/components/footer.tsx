import { Shield, Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="text-2xl" />
              <span className="font-bold text-xl">Insure-it Group</span>
            </div>
            <p className="opacity-90 leading-relaxed">
              Your trusted partner in comprehensive insurance solutions. 
              Protecting what matters most to you and your family.
            </p>
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
