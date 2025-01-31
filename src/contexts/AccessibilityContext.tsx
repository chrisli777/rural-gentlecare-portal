import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { translations } from "@/utils/translations";

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
  translate: (key: string) => string;
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

  const translate = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return translation;
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
      
      if (command.includes('profile')) {
        window.location.href = '/patient/profile';
      } else if (command.includes('dashboard')) {
        window.location.href = '/patient/dashboard';
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
    const fontSizes = {
      normal: '16px',
      large: '20px',
      'extra-large': '24px'
    };
    
    document.documentElement.style.fontSize = fontSizes[fontSize];
    document.documentElement.style.setProperty('--base-font-size', fontSizes[fontSize]);
    
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('text-normal', 'text-large', 'text-extra-large');
    htmlElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  // Apply language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
        translate,
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