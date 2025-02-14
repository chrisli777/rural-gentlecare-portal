
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
    options?: string[];
    isTranscript?: boolean;
  };
  onOptionSelect: (option: string) => void;
}

export const ChatMessage = ({ message, onOptionSelect }: ChatMessageProps) => {
  if (message.isTranscript) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-100 p-4 rounded-lg mb-4"
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      {message.content && (
        <div className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
          <span className="font-medium">{message.role === 'user' ? 'You' : 'AI'}: </span>
          {message.content}
        </div>
      )}
      
      {message.options && message.role === "assistant" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mt-2"
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
