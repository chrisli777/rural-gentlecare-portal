
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AudioWaveform } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const phoneSchema = z.object({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .refine((val) => /^\+?[1-9]\d{1,14}$/.test(val.replace(/\D/g, '')), {
      message: "Please enter a valid phone number",
    }),
  code: z.string().length(6, "Verification code must be 6 digits").optional(),
});

const PatientLogin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
      code: "",
    },
  });

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
  };

  const onPhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(data.phone);
      console.log("Attempting login with phone:", formattedPhone);
      
      if (data.code) {
        // Verify the code
        const { error } = await supabase.auth.verifyOtp({
          phone: formattedPhone,
          token: data.code,
          type: 'sms',
        });

        if (error) {
          console.error("Verification failed:", error);
          throw error;
        }

        toast({
          title: "Success",
          description: "Successfully logged in",
        });
        navigate("/patient/dashboard");
      } else {
        // Send verification code
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        if (error) {
          console.error("Login failed:", error);
          throw error;
        }

        setPhoneNumber(formattedPhone);
        form.setValue("code", ""); // Clear verification code field
        toast({
          title: "Verification code sent",
          description: "Please check your phone for the verification code",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onPhoneSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number"
                      type="tel"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter 6-digit code"
                      type="text"
                      maxLength={6}
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        field.onChange(value);
                      }}
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
                {isLoading ? "Processing..." : form.getValues("code") ? "Verify and Login" : "Send verification code"}
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
