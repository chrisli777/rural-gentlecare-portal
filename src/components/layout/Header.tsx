
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Add onboarding to the routes that should show only back button
  const showOnlyBackButton = location.pathname === '/provider/patients' || 
    location.pathname === '/provider/analytics' ||
    location.pathname === '/patient/appointment' || 
    location.pathname === '/patient/messages' ||
    location.pathname === '/patient/onboarding';
  
  if (showOnlyBackButton) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">Adams Rural Care</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
              About Us
            </Link>
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact Us
            </a>
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
              <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                About Us
              </Link>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact Us
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
