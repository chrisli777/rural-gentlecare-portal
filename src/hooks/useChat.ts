
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export const useChat = () => {
  const { language } = useAccessibility();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: string; content: string; options?: string[] }[]>([
    {
      role: "assistant",
      content: language === 'en' 
        ? "Hello! 👋 I'm your AI Health Assistant. How can I help you today?"
        : "¡Hola! 👋 Soy tu Asistente de Salud con IA. ¿Cómo puedo ayudarte hoy?",
      options: language === 'en' 
        ? ["Need to see a doctor?", "Get medical advice", "Health information"]
        : ["¿Necesitas ver a un médico?", "Obtener consejo médico", "Información de salud"]
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
        const newMessages = data.responses.map((response: any) => ({
          role: "assistant",
          content: response.content,
          options: response.options || ["Need to see a doctor?"]
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
