
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  onSendMessage: () => void;
  onToggleRecording: () => void;
}

export const ChatInput = ({
  message,
  setMessage,
  isLoading,
  onSendMessage,
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          disabled={isLoading}
          className="flex-1"
        />
        
        <Button 
          onClick={onSendMessage}
          disabled={isLoading || !message.trim()}
          className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
