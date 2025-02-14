
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
    options?: string[];
  };
  onOptionSelect: (option: string) => void;
}

export const ChatMessage = ({ message, onOptionSelect }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2"
    >
      <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] p-4 rounded-lg whitespace-pre-wrap ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {message.content}
        </div>
      </div>
      
      {message.options && message.role === "assistant" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 ml-4"
        >
          {message.options.map((option, optionIndex) => (
            <Button
              key={optionIndex}
              variant="outline"
              onClick={() => onOptionSelect(option)}
              className="bg-white hover:bg-gray-50"
            >
              {option}
            </Button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
