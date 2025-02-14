
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { useNavigate } from "react-router-dom";
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
          </div>

          <AIConversationStep onProfileComplete={handleProfileComplete} />
        </div>
      </div>
    </div>
  );
};

export default PatientOnboarding;
