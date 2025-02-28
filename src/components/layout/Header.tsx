
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { translations } from "@/utils/translations";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useAccessibility();
  const t = translations[language];
  
  // Add provider routes that should show only back button
  const showOnlyBackButton = location.pathname === '/provider/patients' || 
    location.pathname === '/provider/analytics' ||
    location.pathname === '/provider/total-appointments' ||
    location.pathname === '/provider/pending-reviews' ||
    location.pathname === '/provider/new-patients' ||
    location.pathname === '/provider/all-patients' ||
    location.pathname === '/provider/finished-appointments' ||
    location.pathname === '/provider/video-call' ||
    location.pathname === '/provider/past-reviews' ||
    location.pathname === '/patient/book-appointment' || 
    location.pathname === '/patient/messages' ||
    location.pathname === '/patient/onboarding' ||
    location.pathname === '/patient/records' ||
    location.pathname === '/patient/profile';
  
  // Check if current route is provider dashboard
  const isProviderDashboard = location.pathname === '/provider/dashboard';

  const handleBackNavigation = () => {
    if (location.pathname === '/provider/finished-appointments') {
      navigate('/provider/total-appointments');
    } else if (
      location.pathname === '/provider/total-appointments' ||
      location.pathname === '/provider/pending-reviews' ||
      location.pathname === '/provider/new-patients'
    ) {
      navigate('/provider/dashboard');
    } else if (location.pathname === '/provider/past-reviews') {
      navigate('/provider/pending-reviews');
    } else if (location.pathname === '/provider/all-patients') {
      navigate('/provider/new-patients');
    } else {
      navigate(-1);
    }
  };

  if (showOnlyBackButton) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={handleBackNavigation}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.common.back}
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
              <Heart className="w-6 h-6 text-[#9b87f5]" />
              <span className="text-xl font-semibold">Adams Rural Care</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
