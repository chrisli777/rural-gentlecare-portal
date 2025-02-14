
import { Bot } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface ChatHeaderProps {
  onVoiceInputReceived: (text: string) => void;
}

export const ChatHeader = ({ onVoiceInputReceived }: ChatHeaderProps) => {
  const { toast } = useToast();
  const { language } = useAccessibility();
  const [isConnected, setIsConnected] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    if (event.type === 'transcript' || event.type === 'message') {
      onVoiceInputReceived(event.content);
    }
  };

  const handleVoiceModeToggle = async (checked: boolean) => {
    if (checked) {
      try {
        chatRef.current = new RealtimeChat(handleMessage);
        await chatRef.current.init(language);
        setIsConnected(true);
        
        toast({
          title: language === 'es' ? "Conectado" : "Connected",
          description: language === 'es' ? "Modo de voz está activo" : "Voice mode is active",
        });
      } catch (error) {
        console.error('Error starting conversation:', error);
        toast({
          title: language === 'es' ? "Error" : "Error",
          description: error instanceof Error ? error.message : 'Failed to start conversation',
          variant: "destructive",
        });
      }
    } else {
      chatRef.current?.disconnect();
      setIsConnected(false);
    }
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  // Reconnect when language changes if already connected
  useEffect(() => {
    if (isConnected) {
      chatRef.current?.disconnect();
      handleVoiceModeToggle(true);
    }
  }, [language]);

  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5" style={{ color: "#1E5AAB" }} />
        <h2 className="text-lg font-semibold">
          {language === 'es' ? 'Asistente de Salud IA' : 'AI Health Assistant'}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {language === 'es' ? 'Modo de Voz' : 'Voice Mode'}
        </span>
        <Switch
          checked={isConnected}
          onCheckedChange={handleVoiceModeToggle}
        />
      </div>
    </div>
  );
};
