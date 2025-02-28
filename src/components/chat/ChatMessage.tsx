
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Volume } from "lucide-react";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
    options?: string[];
  };
  onOptionSelect: (option: string) => void;
  assistantAvatar?: string;
}

export const ChatMessage = ({ message, onOptionSelect, assistantAvatar }: ChatMessageProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('Female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Adjust speech parameters for elderly users
      utterance.rate = 0.9; // Slightly slower rate
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-start gap-3">
        {message.role === "assistant" && (
          <Avatar className="mt-1 h-10 w-10 border border-blue-100">
            <AvatarImage 
              src={assistantAvatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"} 
              alt="Clara AI Assistant" 
              className="object-cover object-center"
            />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              CA
            </AvatarFallback>
          </Avatar>
        )}
        <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
          <div
            className={`max-w-[80%] p-4 rounded-lg whitespace-pre-wrap text-base ${
              message.role === "user"
                ? "bg-[#1E5AAB] text-white ml-auto"
                : "bg-gray-100"
            }`}
          >
            {message.content}
            
            {/* Sound button for assistant messages */}
            {message.role === "assistant" && (
              <div className="flex justify-end mt-2">
                <button 
                  onClick={() => speakMessage(message.content)}
                  disabled={isSpeaking}
                  className={`p-1.5 rounded-full transition-colors ${
                    isSpeaking 
                      ? "bg-blue-200 text-blue-600 animate-pulse" 
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                  aria-label="Listen to this message"
                  title="Listen to this message"
                >
                  <Volume className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
        {message.role === "user" && (
          <Avatar className="mt-1 h-10 w-10 border border-blue-100">
            <AvatarFallback className="bg-[#1E5AAB] text-white">
              U
            </AvatarFallback>
          </Avatar>
        )}
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
              className="bg-white hover:bg-gray-50 text-base font-medium"
            >
              {option}
            </Button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
