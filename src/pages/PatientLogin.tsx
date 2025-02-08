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
      console.log("Attempting to send verification code to:", formattedPhone);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'send',
            phone: formattedPhone,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setPhoneNumber(formattedPhone);
      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("Send code error:", error);
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
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'verify',
            phone: phoneNumber,
            code,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      if (data.status === 'approved') {
        // Sign in with phone number using Supabase phone auth
        const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
        });

        if (signInError) throw signInError;

        toast({
          title: "Login Successful",
          description: "Starting conversation with Sarah, your medical assistant",
          variant: "default",
        });
        
        navigate("/patient/signup/ai-conversation");
      } else {
        throw new Error('Verification failed');
      }
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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-phone`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            action: 'send',
            phone: phoneNumber,
          }),
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

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
    navigate("/patient/signup/ai-conversation");
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
