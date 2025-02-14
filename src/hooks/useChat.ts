
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useChat = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string; options?: string[] }[]>([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your AI Health Assistant. How can I help you today?",
      options: [
        "Need to see a doctor?",
        "Get medical advice",
        "Health information"
      ]
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (manualMessage?: string) => {
    const messageToSend = manualMessage || message;
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: messageToSend };
    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('healthcare-chat', {
        body: { message: userMessage.content }
      });

      if (error) throw error;

      if (data.responses) {
        const newMessages = data.responses.map((response: string) => ({
          role: "assistant",
          content: response,
          options: ["Need to see a doctor?", "Get medical advice", "Health information"]
        }));
        setConversation(prev => [...prev, ...newMessages]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
      console.error("AI Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    message,
    setMessage,
    conversation,
    isLoading,
    handleSendMessage,
  };
};
