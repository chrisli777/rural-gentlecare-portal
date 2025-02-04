import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/utils/translations";
import { processVoiceCommand } from "@/utils/aiService";

interface AccessibilityContextType {
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  translate: (key: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const translate = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key;
      }
    }
    
    return translation;
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice Recognition Not Available",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language === 'en' ? 'en-US' : 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event: any) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
      
      try {
        const response = await processVoiceCommand(command);
        
        if (command.includes('profile')) {
          window.location.href = '/patient/profile';
        } else if (command.includes('dashboard')) {
          window.location.href = '/patient/dashboard';
        } else if (command.includes('appointments')) {
          window.location.href = '/patient/appointment';
        } else if (command.includes('messages')) {
          window.location.href = '/patient/messages';
        }
      } catch (error) {
        console.error('Error processing voice command:', error);
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

  useEffect(() => {
    const fontSizes = {
      normal: '16px',
      large: '20px',
      'extra-large': '24px'
    };
    
    document.documentElement.style.fontSize = fontSizes[fontSize];
    document.body.style.fontSize = fontSizes[fontSize];
    
    const htmlElement = document.documentElement;
    htmlElement.classList.remove('text-normal', 'text-large', 'text-extra-large');
    htmlElement.classList.add(`text-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.body.setAttribute('data-language', language);
  }, [language]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        language,
        setLanguage,
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