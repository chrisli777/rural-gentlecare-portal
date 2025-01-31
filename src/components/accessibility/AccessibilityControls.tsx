import { Button } from "@/components/ui/button";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { 
  Type, 
  Languages, 
  Mic, 
  MicOff, 
  VolumeX, 
  Volume2 
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

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          const sizes: ('normal' | 'large' | 'extra-large')[] = ['normal', 'large', 'extra-large'];
          const currentIndex = sizes.indexOf(fontSize);
          setFontSize(sizes[(currentIndex + 1) % sizes.length]);
        }}
        title="Change Font Size"
      >
        <Type className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
        title={language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
      >
        <Languages className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setVoiceAssistEnabled(!voiceAssistEnabled)}
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
        onClick={() => isListening ? stopListening() : startListening()}
        title={isListening ? 'Stop Listening' : 'Start Voice Commands'}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};