
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PhoneInputForm } from "./PhoneInputForm";
import { VerificationCodeForm } from "./VerificationCodeForm";

interface PhoneVerificationStepProps {
  onVerificationComplete: (phoneNumber: string) => void;
}

export const PhoneVerificationStep = ({ onVerificationComplete }: PhoneVerificationStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
  };

  const handlePhoneSubmit = async (phone: string) => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      console.log("Sending verification code to:", formattedPhone);
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setPhoneNumber(formattedPhone);
      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    setIsLoading(true);
    try {
      console.log("Verifying code for phone:", phoneNumber);
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: code,
        type: 'sms',
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Phone number verified successfully",
      });
      onVerificationComplete(phoneNumber);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowVerification(false);
  };

  return (
    <div className="space-y-6">
      {!showVerification ? (
        <PhoneInputForm
          onSubmit={handlePhoneSubmit}
          isLoading={isLoading}
        />
      ) : (
        <VerificationCodeForm
          onSubmit={handleVerificationSubmit}
          onBack={handleBack}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
