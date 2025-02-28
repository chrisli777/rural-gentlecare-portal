
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
        ? "👋 Welcome, I'm your Health Assistant Clara. I can help you with:\n📅 Booking an appointment with a doctor\n💬 Getting medical advice\n📖 Accessing health information"
        : "👋 Bienvenido, soy Clara, tu Asistente de Salud. Puedo ayudarte con:\n📅 Reservar una cita con un médico\n💬 Obtener consejo médico\n📖 Acceder a información de salud",
      options: language === 'en' 
        ? ["Booking an appointment with a doctor", "Getting medical advice", "Accessing health information"]
        : ["Reservar una cita con un médico", "Obtener consejo médico", "Acceder a información de salud"]
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
