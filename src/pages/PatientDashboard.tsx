import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const PatientDashboard = () => {
  // Verify that the context is available
  useAccessibility(); // This will throw the error if context is not available

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
    </div>
  );
};

export default PatientDashboard;