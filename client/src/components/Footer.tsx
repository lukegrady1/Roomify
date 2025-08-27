import { Link } from 'react-router-dom';
import { Home, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-brand-500" />
              <span className="font-bold text-xl">Roomify</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Find the perfect student housing near your campus. Sublets made simple.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-brand-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-500">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-brand-500">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Students */}
          <div>
            <h3 className="font-semibold mb-4">For Students</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-foreground">
                  Find Housing
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground">
                  How it Works
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-muted-foreground hover:text-foreground">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Hosts */}
          <div>
            <h3 className="font-semibold mb-4">For Hosts</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/list-your-place" className="text-muted-foreground hover:text-foreground">
                  List your place
                </Link>
              </li>
              <li>
                <Link to="/host-guide" className="text-muted-foreground hover:text-foreground">
                  Host Guide
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-foreground">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-muted-foreground hover:text-foreground">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Roomify. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-muted-foreground mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
