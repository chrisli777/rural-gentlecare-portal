
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { useNavigate } from "react-router-dom";

const PatientOnboarding = () => {
  const navigate = useNavigate();

  const handleProfileComplete = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Assistant
          </h2>
          <p className="text-muted-foreground">
            Talk to Sarah, your AI medical assistant
          </p>
        </div>

        <AIConversationStep onProfileComplete={handleProfileComplete} />
      </div>
    </div>
  );
};

export default PatientOnboarding;
