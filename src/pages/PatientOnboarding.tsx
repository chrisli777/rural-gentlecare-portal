
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";

const PatientOnboarding = () => {
  const navigate = useNavigate();

  const handleProfileComplete = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* AI Assistant Section */}
        <div className="max-w-md mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Meet Lisa
            </h2>
            <p className="text-muted-foreground">
              Your friendly AI medical assistant who's here to help you get started. Just speak naturally, and Lisa will guide you through creating your health profile.
            </p>
          </div>

          <AIConversationStep onProfileComplete={handleProfileComplete} />
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Your privacy and security are our top priorities. All conversations are encrypted and protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
