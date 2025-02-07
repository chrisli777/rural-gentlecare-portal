
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PhoneVerificationStep } from "@/components/signup/PhoneVerificationStep";
import { AIConversationStep } from "@/components/signup/AIConversationStep";
import { BasicMedicalForm } from "@/components/signup/BasicMedicalForm";
import { AudioWaveform, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/types/conversation";

type SignupStep = 'phone' | 'method' | 'ai' | 'form';

const PatientSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignupStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState<ProfileData>({});
  const [previousStep, setPreviousStep] = useState<SignupStep>('method');

  const handleVerificationComplete = (phone: string) => {
    setPreviousStep('phone');
    setPhoneNumber(phone);
    setStep('method');
  };

  const handleAIProfileUpdate = (data: ProfileData) => {
    setPreviousStep('ai');
    setFormData(prev => ({ ...prev, ...data }));
    setStep('form');
  };

  const handleMethodChoice = () => {
    setPreviousStep('method');
    setStep('ai');
  };

  const handleProfileComplete = () => {
    navigate("/patient/dashboard");
  };

  const handleBack = () => {
    switch (step) {
      case 'form':
        setStep(previousStep);
        break;
      case 'ai':
        setStep('method');
        break;
      case 'method':
        setStep('phone');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center relative">
          {step !== 'phone' && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'phone' && 'Patient Signup'}
            {step === 'method' && 'Choose Profile Setup Method'}
            {step === 'ai' && 'AI Assistant'}
            {step === 'form' && 'Complete Your Profile'}
          </h2>
          <p className="text-muted-foreground">
            {step === 'phone'
              ? 'Welcome to Adams County Rural Health Clinic'
              : step === 'method'
              ? 'Choose how you would like to set up your profile'
              : 'Please provide your medical information'}
          </p>
        </div>

        {step === 'phone' && (
          <PhoneVerificationStep onVerificationComplete={handleVerificationComplete} />
        )}

        {step === 'method' && (
          <div className="space-y-4">
            <Button
              className="w-full h-24 text-lg"
              onClick={handleMethodChoice}
            >
              Talk to AI Assistant
            </Button>
          </div>
        )}

        {step === 'ai' && (
          <AIConversationStep 
            onProfileComplete={handleProfileComplete}
            onProfileUpdate={handleAIProfileUpdate}
          />
        )}

        {step === 'form' && (
          <BasicMedicalForm
            initialData={formData}
            onComplete={handleProfileComplete}
          />
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
