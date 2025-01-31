import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Type, 
  Languages, 
  Mic, 
  MicOff, 
  VolumeX, 
  Volume2,
  MessageSquare
} from "lucide-react";

export const AccessibilityControls = () => {
  const {
    fontSize,
    setFontSize,
    language,
    setLanguage,
    voiceAssistEnabled,
    setVoiceAssistEnabled,
    isListening,
    startListening,
    stopListening,
  } = useAccessibility();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFontSizeChange = () => {
    const sizes: ('normal' | 'large' | 'extra-large')[] = ['normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    const newSize = sizes[(currentIndex + 1) % sizes.length];
    setFontSize(newSize);
    toast({
      title: "Font Size Changed",
      description: `Font size set to ${newSize}`,
      duration: 2000,
    });
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    toast({
      title: "Language Changed",
      description: `Language set to ${newLanguage === 'en' ? 'English' : 'Spanish'}`,
      duration: 2000,
    });
  };

  const handleVoiceAssist = () => {
    setVoiceAssistEnabled(!voiceAssistEnabled);
    toast({
      title: "Voice Assist",
      description: voiceAssistEnabled ? "Voice assist disabled" : "Voice assist enabled",
      duration: 2000,
    });
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      toast({
        title: "Voice Commands",
        description: "Voice commands stopped",
        duration: 2000,
      });
    } else {
      startListening();
      toast({
        title: "Voice Commands",
        description: "Listening for voice commands...",
        duration: 2000,
      });
    }
  };

  const handleMessagesClick = () => {
    navigate('/patient/messages');
    toast({
      title: "Messages",
      description: "Navigating to messages page",
      duration: 2000,
    });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={handleFontSizeChange}
        className="hover:bg-primary/20"
        title="Change Font Size"
      >
        <Type className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleLanguageChange}
        className="hover:bg-primary/20"
        title={language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
      >
        <Languages className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleVoiceAssist}
        className="hover:bg-primary/20"
        title={voiceAssistEnabled ? 'Disable Voice Assist' : 'Enable Voice Assist'}
      >
        {voiceAssistEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={handleVoiceCommand}
        className={isListening ? "" : "hover:bg-primary/20"}
        title={isListening ? 'Stop Listening' : 'Start Voice Commands'}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleMessagesClick}
        className="hover:bg-primary/20"
        title="View Messages"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
};