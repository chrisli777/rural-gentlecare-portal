
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { translations } from "@/utils/translations";
import { useConversation } from "@11labs/react";
import { ProfileData } from "@/types/conversation";

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
  const [profileData, setProfileData] = useState<ProfileData>({});

  const conversation = useConversation({
    clientTools: {
      updateProfile: async (parameters: { field: string; value: any }) => {
        console.log("Updating profile field:", parameters.field, "with value:", parameters.value);
        const updatedProfile = { ...profileData };
        updatedProfile[parameters.field] = parameters.value;
        setProfileData(updatedProfile);
        return "Profile updated successfully";
      },
      completeProfile: async () => {
        console.log("Profile complete, data:", profileData);
        return "Profile completed successfully";
      }
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are Sarah, a friendly and professional medical assistant helping patients complete their medical profile. Your role is to:

1. Gather essential medical information through natural conversation
2. Ask one question at a time, waiting for the patient's response
3. Confirm information before moving to the next question
4. Use the updateProfile function to save each piece of information
5. When all essential information is collected, use completeProfile function

Essential information to collect:
- first_name
- last_name
- date_of_birth (format: YYYY-MM-DD)
- emergency_contact (full name)
- emergency_phone
- allergies (if any)
- current_medications (if any)
- chronic_conditions (if any)

Always be empathetic, professional, and HIPAA-compliant. If you don't understand something, ask for clarification.`,
        },
        firstMessage: "Hi! I'm Sarah, your medical assistant. I'll help you complete your profile using voice interaction. Let's start with your name - what's your first name?",
        language: "en",
      },
      tts: {
        modelId: "eleven_multilingual_v2",
        voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah voice
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.0,
        useSSML: false
      }
    },
    onMessage: (message) => {
      if (message.content) {
        console.log("AI Message:", message.content);
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Error",
        description: "There was an error with the voice conversation. Please try again.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  });

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

  const startListening = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      const conversationId = await conversation.startSession({
        agentId: "sg6ewalyElwtFCXBkUOk",
      });
      console.log("Started conversation with ID:", conversationId);
    } catch (error) {
      console.error("Error starting voice conversation:", error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    await conversation.endSession();
    console.log("Ended conversation");
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
