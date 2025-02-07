
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useConversation } from "@11labs/react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Message, ProfileData } from "@/types/conversation";

interface AIConversationStepProps {
  onProfileComplete: () => void;
}

export const AIConversationStep = ({ onProfileComplete }: AIConversationStepProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isRecording, setIsRecording] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const conversation = useConversation({
    clientTools: {
      updateProfile: async (parameters: { field: string; value: any }) => {
        console.log("Updating profile field:", parameters.field, "with value:", parameters.value);
        const updatedProfile = { ...profileData };
        updatedProfile[parameters.field] = parameters.value;
        setProfileData(updatedProfile);
        
        try {
          await updateProfile(updatedProfile);
          return "Profile updated successfully";
        } catch (error) {
          console.error("Error updating profile:", error);
          return "Failed to update profile";
        }
      },
      completeProfile: async () => {
        console.log("Profile complete, data:", profileData);
        onProfileComplete();
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
        stability: 0.75,
        similarityBoost: 0.85,
        style: 0.0,
        useSSML: false
      }
    },
    onMessage: (message) => {
      console.log("Received message:", message);
      if (message.content) {
        setMessages(prev => [...prev, { role: message.role, content: message.content }]);
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Error",
        description: "There was an error with the voice conversation. Please try again.",
        variant: "destructive",
      });
      setIsRecording(false);
      setConversationStarted(false);
    }
  });

  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new AudioContext();
        await context.resume();
        setAudioContext(context);
        console.log("AudioContext initialized successfully");
      } catch (error) {
        console.error("Error initializing AudioContext:", error);
        toast({
          title: "Error",
          description: "Could not initialize audio system. Please check your browser settings.",
          variant: "destructive",
        });
      }
    };
    initAudio();

    return () => {
      audioContext?.close();
      if (conversationStarted) {
        conversation.endSession().catch(console.error);
      }
    };
  }, []);

  const updateProfile = async (data: ProfileData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      
      console.log("Profile updated successfully with data:", data);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleVoiceRecording = async () => {
    try {
      if (!audioContext) {
        console.error("AudioContext not initialized");
        toast({
          title: "Error",
          description: "Audio system not initialized. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      if (!isRecording) {
        // Start recording
        console.log("Starting voice recording...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted");
        
        if (!conversationStarted) {
          console.log("Starting new conversation session");
          await conversation.startSession({
            agentId: "sg6ewalyElwtFCXBkUOk",
          });
          console.log("Conversation session started");
          setConversationStarted(true);
        }
        
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "You can now speak with Sarah",
        });
      } else {
        // Stop recording
        console.log("Stopping voice recording...");
        setIsRecording(false);
        
        if (conversationStarted) {
          console.log("Ending conversation session");
          await conversation.endSession();
          setConversationStarted(false);
          console.log("Conversation session ended");
        }
        
        toast({
          title: "Recording Stopped",
          description: "Voice interaction ended",
        });
      }
    } catch (error: any) {
      console.error("Error with voice recording:", error);
      toast({
        title: "Error",
        description: error.message || "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
      setConversationStarted(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");

    try {
      if (!conversationStarted) {
        console.log("Starting new conversation session for text message");
        await conversation.startSession({
          agentId: "sg6ewalyElwtFCXBkUOk",
        });
        setConversationStarted(true);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <MessageList messages={messages} />
      <MessageInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        isLoading={isLoading}
        isRecording={isRecording}
        handleSendMessage={handleSendMessage}
        toggleVoiceRecording={toggleVoiceRecording}
      />
    </Card>
  );
};
