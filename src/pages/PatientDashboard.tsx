import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const PatientDashboard = () => {
  const { translate } = useAccessibility();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <Link to="/patient/appointment">
          <Button 
            className="flex items-center gap-2 w-full md:w-auto"
            variant="default"
          >
            <Calendar className="h-4 w-4" />
            {translate("appointment.bookAppointment")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;