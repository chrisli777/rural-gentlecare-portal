import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Type, 
  Languages, 
  Mic, 
  MicOff,
  HelpCircle
} from "lucide-react";

export const AccessibilityControls = () => {
  const {
    fontSize,
    setFontSize,
    language,
    setLanguage,
    isListening,
    startListening,
    stopListening,
  } = useAccessibility();
  
  const { toast } = useToast();

  const handleFontSizeChange = () => {
    const sizes: ('normal' | 'large' | 'extra-large')[] = ['normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(fontSize);
    const newSize = sizes[(currentIndex + 1) % sizes.length];
    setFontSize(newSize);
    toast({
      title: "Font Size Changed",
      description: `Font size set to ${newSize}`,
      duration: 2000,
      className: "left-0 right-auto",
    });
  };

  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    toast({
      title: "Language Changed",
      description: `Language set to ${newLanguage === 'en' ? 'English' : 'Spanish'}`,
      duration: 2000,
      className: "left-0 right-auto",
    });
  };

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      toast({
        title: "Voice Commands",
        description: "Voice commands stopped",
        duration: 2000,
        className: "left-0 right-auto",
      });
    } else {
      startListening();
      toast({
        title: "Voice Commands",
        description: "Listening for voice commands...",
        duration: 2000,
        className: "left-0 right-auto",
      });
    }
  };

  const handleRequestAssistance = () => {
    toast({
      title: "Assistance Requested",
      description: "A healthcare provider will assist you shortly",
      duration: 3000,
      className: "left-0 right-auto",
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
        onClick={handleRequestAssistance}
        className="hover:bg-primary/20"
        title="Request Assistance"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};