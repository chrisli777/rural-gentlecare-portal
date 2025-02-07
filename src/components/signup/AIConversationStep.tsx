
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useConversation } from "@11labs/react";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const conversation = useConversation({
    clientTools: {
      updateProfile: async (parameters: { field: string; value: any }) => {
        const updatedProfile = { ...profileData };
        updatedProfile[parameters.field] = parameters.value;
        setProfileData(updatedProfile);
        await updateProfile(updatedProfile);
        return "Profile updated successfully";
      }
    },
    overrides: {
      agent: {
        prompt: {
          prompt: "You are a helpful medical assistant collecting patient information. Ask simple, clear questions one at a time to gather essential medical information. Focus on gathering: first name, last name, date of birth, emergency contact details, allergies, current medications, and chronic conditions. Be friendly but professional. After collecting basic information, ask about any specific health concerns or conditions they want to mention. Confirm information before moving to the next question.",
        },
        firstMessage: "Hi! I'm your medical assistant, and I'll help you complete your profile using voice interaction. You can speak naturally, and I'll guide you through the process. Let's start with your name. What's your first name?",
        language: "en",
      },
      tts: {
        voiceId: "EXAVITQu4vr4xnSDxMaL" // Sarah's voice - professional and friendly
      }
    },
    onMessage: (message) => {
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

  useEffect(() => {
    const initialMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your medical assistant, and I'll help you complete your profile using voice interaction. You can speak naturally, and I'll guide you through the process. Let's start with your name. What's your first name?"
    };
    setMessages([initialMessage]);
  }, []);

  const updateProfile = async (data: ProfileData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        const conversationId = await conversation.startSession({
          agentId: "medical_assistant", // Replace with your actual agent ID from ElevenLabs
        });
        console.log("Started conversation:", conversationId);
      } catch (error) {
        console.error("Error starting voice recording:", error);
        toast({
          title: "Error",
          description: "Could not access microphone",
          variant: "destructive",
        });
      }
    } else {
      setIsRecording(false);
      await conversation.endSession();
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");

    try {
      // Let the ElevenLabs agent handle the conversation flow
      // The response will come through the onMessage callback
      await conversation.sendMessage(currentMessage);
    } catch (error: any) {
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
      <div className="mb-4 flex justify-center space-x-4">
        <ProfilePhotoUpload
          profileData={profileData}
          setProfileData={setProfileData}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
      </div>

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
