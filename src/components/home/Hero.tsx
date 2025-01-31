import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Calendar, MessageSquare, User, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { translate } = useAccessibility();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Appointment Booking */}
          <Link to="/patient/appointment" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
              <p className="text-gray-600">Schedule your next visit with our healthcare providers.</p>
            </div>
          </Link>

          {/* Messages & Notifications */}
          <Link to="/patient/messages" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <MessageSquare className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Messages & Notifications</h3>
              <p className="text-gray-600">View your messages and important notifications.</p>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/patient/profile" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <User className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">My Profile</h3>
              <p className="text-gray-600">Manage your personal information and preferences.</p>
            </div>
          </Link>

          {/* AI Health Assistant */}
          <Link to="/patient/ai-assistant" className="group">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Bot className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Health Assistant</h3>
              <p className="text-gray-600">Get personalized health guidance and support.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};