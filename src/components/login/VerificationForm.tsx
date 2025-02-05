
import { useForm } from "react-hook-form";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

interface VerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  onBack: () => void;
  onResend: () => Promise<void>;
  isLoading: boolean;
}

export const VerificationForm = ({ 
  onSubmit, 
  onBack, 
  onResend,
  isLoading 
}: VerificationFormProps) => {
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimeout, setResendTimeout] = useState(false);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof verificationSchema>) => {
    await onSubmit(data.code);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
      setResendTimeout(true);
      // Disable resend button for 60 seconds
      setTimeout(() => {
        setResendTimeout(false);
      }, 60000);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isLoading || resendLoading || resendTimeout}
          >
            {resendLoading ? "Sending..." : resendTimeout ? "Wait 60s to resend" : "Resend Code"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onBack}
            disabled={isLoading}
          >
            Back to phone number
          </Button>
        </div>
      </form>
    </Form>
  );
};
