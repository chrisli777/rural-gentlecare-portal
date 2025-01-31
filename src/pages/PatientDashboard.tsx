import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Info, AlertCircle } from "lucide-react";

const PatientDashboard = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Alerts and Suggestions Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-500" />
          <AlertDescription className="ml-2">
            Your next appointment is scheduled for tomorrow at 10:00 AM with Dr. Smith.
          </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <Bell className="h-5 w-5 text-amber-500" />
          <AlertDescription className="ml-2">
            Remember to take your evening medication at 8:00 PM today.
          </AlertDescription>
        </Alert>
        
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertCircle className="h-5 w-5 text-green-500" />
          <AlertDescription className="ml-2">
            Your recent blood pressure readings show improvement. Keep up the good work!
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default PatientDashboard;