
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

const PatientOnboarding = () => {
  const navigate = useNavigate();
  const { translate } = useAccessibility();

  const handleProfileComplete = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Provider Portal Button */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => navigate("/provider/dashboard")}
            variant="outline"
            className="flex items-center gap-2 bg-white hover:bg-gray-50"
          >
            <UserCog className="h-4 w-4" />
            Provider Portal
          </Button>
        </div>

        {/* AI Assistant Section */}
        <div className="max-w-md mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              {translate('aiAssistant.title')}
            </h2>
          </div>

          <AIConversationStep onProfileComplete={handleProfileComplete} />
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
