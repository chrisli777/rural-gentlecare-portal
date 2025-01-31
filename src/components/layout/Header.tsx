import { Button } from "@/components/ui/button";
import { Heart, User, Menu, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isPatientRoute = location.pathname.startsWith('/patient');
  const showBackButton = location.pathname !== '/patient/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Adams Rural Care</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!isPatientRoute ? (
              <>
                <a href="#services" className="text-gray-600 hover:text-primary transition-colors">
                  Services
                </a>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
                <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </a>
                <Button variant="outline" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/patient/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/patient/profile" className="text-gray-600 hover:text-primary transition-colors">
                  Profile
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {!isPatientRoute ? (
                <>
                  <a href="#services" className="text-gray-600 hover:text-primary transition-colors">
                    Services
                  </a>
                  <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                    About Us
                  </Link>
                  <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                    Contact
                  </a>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/patient/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/patient/profile" className="text-gray-600 hover:text-primary transition-colors">
                    Profile
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};