
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

const PatientOnboarding = () => {
  const navigate = useNavigate();

  const handleProfileComplete = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-900">
              Adams Rural Care
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your health companion in rural healthcare, bringing personalized medical assistance right to your home
          </p>
        </div>

        {/* AI Assistant Section */}
        <div className="max-w-md mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Meet Sarah
            </h2>
            <p className="text-muted-foreground">
              Your friendly AI medical assistant who's here to help you get started. Just speak naturally, and Sarah will guide you through creating your health profile.
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
