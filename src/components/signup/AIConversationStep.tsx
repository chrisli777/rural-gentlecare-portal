
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
        stability: 0.5,
        similarityBoost: 0.75,
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
    }
  });

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
      if (!isRecording) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        
        if (!conversationStarted) {
          const conversationId = await conversation.startSession({
            agentId: "sg6ewalyElwtFCXBkUOk",
          });
          console.log("Started conversation with ID:", conversationId);
          setConversationStarted(true);
        }
      } else {
        setIsRecording(false);
        if (conversationStarted) {
          await conversation.endSession();
          console.log("Ended conversation");
          setConversationStarted(false);
        }
      }
    } catch (error) {
      console.error("Error with voice recording:", error);
      toast({
        title: "Error",
        description: "Could not access microphone or start conversation. Please check your microphone permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
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
        await conversation.startSession({
          agentId: "sg6ewalyElwtFCXBkUOk",
          messages: [...messages, userMessage]
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
