import { Button } from "@/components/ui/button";
import { Heart, User, Menu } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">Adams Rural Care</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-primary transition-colors">
              Services
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
              About Us
            </a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
              Contact
            </a>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Button>
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
              <a href="#services" className="text-gray-600 hover:text-primary transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-600 hover:text-primary transition-colors">
                About Us
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </a>
              <Button variant="outline" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};