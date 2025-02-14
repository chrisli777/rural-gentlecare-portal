
import { Bot, Mic, MicOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";

interface ChatHeaderProps {
  onVoiceInputReceived: (text: string) => void;
}

export const ChatHeader = ({ onVoiceInputReceived }: ChatHeaderProps) => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const { isRecording, toggleRecording } = useVoiceRecording(onVoiceInputReceived);

  const handleVoiceModeToggle = (checked: boolean) => {
    setIsVoiceMode(checked);
    if (!checked && isRecording) {
      toggleRecording();
    }
  };

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" style={{ color: "#1E5AAB" }} />
        <h2 className="text-lg font-semibold">AI Health Assistant</h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Voice Mode</span>
        <Switch
          checked={isVoiceMode}
          onCheckedChange={handleVoiceModeToggle}
        />
        {isVoiceMode && (
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-full transition-colors ${
              isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
