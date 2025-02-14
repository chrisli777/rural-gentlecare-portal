
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-6">
        <h1 className="text-3xl font-bold mb-8">Voice Assistant Onboarding</h1>
        
        <div className="max-w-md mx-auto space-y-8 bg-white p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Meet Lisa
            </h2>
          </div>

          <AIConversationStep onProfileComplete={handleProfileComplete} />
        </div>
      </main>
    </div>
  );
};

export default PatientOnboarding;
