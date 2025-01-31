import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AccessibilityContextType {
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  voiceAssistEnabled: boolean;
  setVoiceAssistEnabled: (enabled: boolean) => void;
  speak: (text: string) => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [voiceAssistEnabled, setVoiceAssistEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const speak = (text: string) => {
    if (!voiceAssistEnabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language === 'en' ? 'en-US' : 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: "Voice Assistant Active",
        description: "Listening for commands...",
      });
    };

    recognition.onresult = (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      
      // Basic command handling
      if (command.includes('schedule') || command.includes('appointment')) {
        toast({
          title: "Command Recognized",
          description: "Opening appointment scheduler...",
        });
        // Add appointment scheduling logic here
      } else if (command.includes('emergency')) {
        toast({
          title: "Emergency Command Recognized",
          description: "Initiating emergency call...",
          variant: "destructive"
        });
        // Add emergency call logic here
      }
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.stop();
    }
  };

  // Apply font size changes globally
  useEffect(() => {
    document.documentElement.style.fontSize = 
      fontSize === 'normal' ? '16px' : 
      fontSize === 'large' ? '20px' : '24px';
  }, [fontSize]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        language,
        setLanguage,
        voiceAssistEnabled,
        setVoiceAssistEnabled,
        speak,
        isListening,
        startListening,
        stopListening,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};