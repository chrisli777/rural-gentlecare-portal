
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

const phoneSchema = z.object({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .refine((val) => /^\+?[1-9]\d{1,14}$/.test(val.replace(/\D/g, '')), {
      message: "Please enter a valid phone number",
    }),
});

interface PhoneInputFormProps {
  onSubmit: (phone: string) => Promise<void>;
  isLoading: boolean;
}

export const PhoneInputForm = ({ onSubmit, isLoading }: PhoneInputFormProps) => {
  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof phoneSchema>) => {
    await onSubmit(data.phone);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Sending code..." : "Send verification code"}
        </Button>
      </form>
    </Form>
  );
};
