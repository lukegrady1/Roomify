import { Link } from 'react-router-dom';
import { Home, User, Menu } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-brand-500" />
          <span className="font-bold text-xl">Roomify</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-brand-500 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/search"
            className="text-sm font-medium hover:text-brand-500 transition-colors"
          >
            Search
          </Link>
          <Link
            to="/list-your-place"
            className="text-sm font-medium hover:text-brand-500 transition-colors"
          >
            List your place
          </Link>
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/list-your-place">
            <Button variant="ghost" size="sm">
              Become a host
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Sign in
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}