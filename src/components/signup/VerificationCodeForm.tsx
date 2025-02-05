
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const verificationSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

interface VerificationCodeFormProps {
  onSubmit: (code: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export const VerificationCodeForm = ({ onSubmit, onBack, isLoading }: VerificationCodeFormProps) => {
  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof verificationSchema>) => {
    await onSubmit(data.code);
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
                  key="verification-code-input"
                  placeholder="Enter 6-digit code"
                  type="text"
                  maxLength={6}
                  disabled={isLoading}
                  {...field}
                  value={field.value || ""}
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
