
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
}

export const ChatInput = ({
  message,
  setMessage,
  isLoading,
  onSendMessage,
}: ChatInputProps) => {
  const { language } = useAccessibility();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <motion.div
      className={`p-4 border-t ${isFocused ? "border-blue-400" : "border-gray-200"}`}
      animate={{ y: 0 }}
      initial={{ y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={language === 'en' ? "Type your message here..." : "Escribe tu mensaje aquí..."}
          className="flex-1 text-lg py-6 px-4 focus:ring-2 focus:ring-blue-400"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white h-12 w-12 rounded-full flex items-center justify-center"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
        </Button>
      </form>
    </motion.div>
  );
};
