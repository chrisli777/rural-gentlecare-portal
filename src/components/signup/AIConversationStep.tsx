
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types/conversation";
import { useNavigate } from "react-router-dom";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useAudioContext } from "@/hooks/useAudioContext";
import { useConversationSetup } from "@/hooks/useConversationSetup";

interface AIConversationStepProps {
  onProfileComplete: () => void;
}

export const AIConversationStep = ({ onProfileComplete }: AIConversationStepProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          console.log("No authenticated session found");
          toast({
            title: "Authentication required",
            description: "Please log in to continue.",
            variant: "destructive",
          });
          navigate("/patient/login");
          return;
        }
        console.log("User authenticated:", session.user.id);
        setUserId(session.user.id);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication error",
          description: "Please try logging in again.",
          variant: "destructive",
        });
        navigate("/patient/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { conversation, isConversationEnded, messages: aiMessages } = useConversationSetup(userId, () => {
    console.log("Profile complete, navigating to form");
    onProfileComplete();
  });

  useEffect(() => {
    setMessages(aiMessages as Message[]);
  }, [aiMessages]);

  useEffect(() => {
    if (isConversationEnded) {
      console.log("Conversation ended, navigating to form");
      onProfileComplete();
    }
  }, [isConversationEnded, onProfileComplete]);

  const audioContext = useAudioContext();
  const { isRecording, conversationStarted, toggleVoiceRecording, setConversationStarted } = 
    useVoiceRecording(userId, conversation);

  useEffect(() => {
    return () => {
      if (conversationStarted) {
        conversation.endSession().catch(console.error);
      }
    };
  }, [conversationStarted, conversation]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !userId) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: currentMessage };
      setMessages(prev => [...prev, userMessage]);
      setCurrentMessage("");

      if (!conversationStarted) {
        console.log("Starting new conversation session for text message");
        await conversation.startSession({
          agentId: "sg6ewalyElwtFCXBkUOk",
          userId: userId,
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
    <Card className="p-4 space-y-4">
      <MessageList messages={messages} />
      <MessageInput
        currentMessage={currentMessage}
        setCurrentMessage={setCurrentMessage}
        isLoading={isLoading}
        isRecording={isRecording}
        handleSendMessage={handleSendMessage}
        toggleVoiceRecording={toggleVoiceRecording}
      />
      <div className="flex justify-center">
        <Button 
          onClick={onProfileComplete}
          variant="outline"
          className="w-full max-w-sm"
        >
          Continue to Form
        </Button>
      </div>
    </Card>
  );
};

