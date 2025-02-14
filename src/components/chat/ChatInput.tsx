
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Mic, MicOff } from "lucide-react";

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
  isRecording,
  onSendMessage,
  onToggleRecording,
}: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={onToggleRecording}
          className={isRecording ? 'animate-pulse' : ''}
          disabled={isLoading}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isRecording ? "Recording..." : "Type your message here..."}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          disabled={isLoading || isRecording}
          className="flex-1"
        />
        
        <Button 
          onClick={onSendMessage}
          disabled={isLoading || (!message.trim() && !isRecording)}
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
