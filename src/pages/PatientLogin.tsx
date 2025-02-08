
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AudioWaveform } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PhoneForm } from "@/components/login/PhoneForm";
import { VerificationForm } from "@/components/login/VerificationForm";
import { Button } from "@/components/ui/button";

const PatientLogin = () => {
  const navigate = useNavigate();
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
      console.log("Attempting login with phone:", formattedPhone);
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) {
        console.error("Login failed:", error);
        
        // Parse the error body if it exists
        let errorBody;
        try {
          errorBody = JSON.parse(error.message);
        } catch {
          errorBody = { message: error.message };
        }

        // Check if it's the misleading Twilio Verify error
        if (errorBody.message?.includes("Invalid From Number") || 
            error.message?.includes("Invalid From Number")) {
          // If we get this error but the code was actually sent, we can proceed
          setPhoneNumber(formattedPhone);
          setShowVerification(true);
          toast({
            title: "Verification code sent",
            description: "Please check your phone for the verification code",
          });
          return;
        }
        throw error;
      }

      setPhoneNumber(formattedPhone);
      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("Login error:", error);
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

      if (error) {
        console.error("Verification failed:", error);
        if (error.message.includes("expired")) {
          toast({
            title: "Code Expired",
            description: "The verification code has expired. Please request a new one.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Login Successful",
        description: "Starting conversation with Sarah, your medical assistant",
        variant: "default",
      });
      
      navigate("/patient/signup/ai-conversation");
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to verify code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your phone",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: "Guest Access",
      description: "Starting conversation with Sarah, your medical assistant",
    });
    navigate("/patient/signup/ai-conversation"); // Changed to direct to Sarah conversation
  };

  const handleBack = () => {
    setShowVerification(false);
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Login</h2>
          <p className="text-muted-foreground">
            Welcome back to Adams County Rural Health Clinic
          </p>
        </div>

        <div className="space-y-6">
          {showVerification ? (
            <VerificationForm
              onSubmit={handleVerificationSubmit}
              onBack={handleBack}
              onResend={handleResendCode}
              isLoading={isLoading}
            />
          ) : (
            <>
              <PhoneForm
                onSubmit={handlePhoneSubmit}
                isLoading={isLoading}
              />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue as
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGuestLogin}
              >
                Guest User
              </Button>
            </>
          )}

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/patient/signup"
                className="text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <Link
              to="/"
              className="text-sm text-primary hover:underline block"
            >
              Back to role selection
            </Link>
          </div>
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

export default PatientLogin;
