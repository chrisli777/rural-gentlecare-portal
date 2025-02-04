import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhoneVerificationStep } from "@/components/signup/PhoneVerificationStep";
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { AudioWaveform } from "lucide-react";

const PatientSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'ai'>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleVerificationComplete = (phone: string) => {
    setPhoneNumber(phone);
    setStep('ai');
  };

  const handleProfileComplete = () => {
    navigate("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Patient Signup' : 'Complete Your Profile'}
          </h2>
          <p className="text-muted-foreground">
            {step === 'phone'
              ? 'Welcome to Adams County Rural Health Clinic'
              : 'Let our AI assistant help you complete your profile'}
          </p>
        </div>

        {step === 'phone' ? (
          <PhoneVerificationStep onVerificationComplete={handleVerificationComplete} />
        ) : (
          <AIConversationStep onProfileComplete={handleProfileComplete} />
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/patient/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <Link to="/" className="text-sm text-primary hover:underline block">
            Back to role selection
          </Link>
        </div>

        <button
          className="fixed top-4 right-4 p-2 text-primary hover:text-primary/80"
          onClick={() => {
            console.log("Text-to-speech activated");
          }}
          aria-label="Read page content"
        >
          <AudioWaveform className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default PatientSignup;