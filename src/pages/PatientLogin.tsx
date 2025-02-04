
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AudioWaveform } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { supabase } from "@/lib/supabase";

interface LoginFormData {
  phoneNumber: string;
}

const PatientLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const form = useForm<LoginFormData>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Format phone number to include country code if not provided
      const phoneNumber = data.phoneNumber.startsWith('+') 
        ? data.phoneNumber 
        : `+1${data.phoneNumber}`; // Assuming US numbers

      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) throw error;

      setShowOTP(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send verification code. Please try again.",
      });
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: form.getValues("phoneNumber"),
        token: otp,
        type: "sms",
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
      navigate("/patient/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid verification code. Please try again.",
      });
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
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

        {!showOTP ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(555) 555-5555"
                        type="tel"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending code..." : "Send verification code"}
                </Button>

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
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Enter verification code</FormLabel>
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, idx) => (
                      <InputOTPSlot key={idx} {...slot} index={idx} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>

            <div className="space-y-4">
              <Button
                onClick={verifyOTP}
                className="w-full"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify code"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowOTP(false)}
                disabled={isLoading}
              >
                Back to phone number
              </Button>
            </div>
          </div>
        )}

        <button
          className="fixed top-4 right-4 p-2 text-primary hover:text-primary/80"
          onClick={() => {
            // TODO: Implement text-to-speech functionality
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
