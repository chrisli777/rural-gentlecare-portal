
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Mic, MicOff } from "lucide-react";

interface MessageInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  isLoading: boolean;
  isRecording: boolean;
  handleSendMessage: () => void;
  toggleVoiceRecording: () => void;
}

export const MessageInput = ({
  currentMessage,
  setCurrentMessage,
  isLoading,
  isRecording,
  handleSendMessage,
  toggleVoiceRecording,
}: MessageInputProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="icon"
        onClick={toggleVoiceRecording}
        className={isRecording ? 'animate-pulse' : ''}
      >
        {isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      <Input
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        placeholder={isRecording ? "Recording..." : "Type your response..."}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        disabled={isLoading || isRecording}
      />
      <Button onClick={handleSendMessage} disabled={isLoading || isRecording}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
