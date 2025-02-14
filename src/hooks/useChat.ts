
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface AppointmentInfo {
  appointmentType?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  symptoms?: string;
  duration?: string;
  severity?: string;
  clinicId?: number;
  bodyPart?: string;
  description?: string;
}

export const useChat = () => {
  const [message, setMessage] = useState("");
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo>({});
  const [conversation, setConversation] = useState<{ role: string; content: string; options?: string[] }[]>([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your AI Health Assistant. How can I help you today? You can book an appointment or discuss your health concerns.",
      options: [
        "Book an appointment",
        "Discuss health concerns",
        "Get medical advice"
      ]
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getOptionsForResponse = (content: string, currentInfo: AppointmentInfo): string[] => {
    if (content.toLowerCase().includes("online or in-person")) {
      return ["Online Appointment", "In-Person Appointment", "Home Visit"];
    }
    if (content.toLowerCase().includes("what date")) {
      return ["Today", "Tomorrow", "Next Week", "Choose specific date"];
    }
    if (content.toLowerCase().includes("available times") || content.toLowerCase().includes("time works")) {
      return ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
    }
    if (content.toLowerCase().includes("which clinic") && currentInfo.appointmentType === "in-person") {
      return ["Adams Rural Care Main Clinic", "Adams Rural Care East Branch"];
    }
    if (content.toLowerCase().includes("what symptoms") || content.toLowerCase().includes("body part")) {
      return ["Head", "Neck", "Chest", "Back", "Arms", "Hands", "Abdomen", "Legs", "Feet", "Multiple Areas"];
    }
    if (content.toLowerCase().includes("how long")) {
      return ["Just started", "Few days", "About a week", "More than a week"];
    }
    if (content.toLowerCase().includes("severity")) {
      return ["Mild", "Moderate", "Severe"];
    }
    if (content.toLowerCase().includes("confirm")) {
      return ["Confirm Appointment", "Change Details"];
    }
    return [];
  };

  const updateAppointmentInfo = (response: string, selectedOption: string) => {
    const newInfo = { ...appointmentInfo };
    
    if (response.toLowerCase().includes("online or in-person")) {
      newInfo.appointmentType = selectedOption.toLowerCase().includes("online") 
        ? "online" 
        : selectedOption.toLowerCase().includes("home") 
          ? "call-out"
          : "in-person";
    } else if (response.toLowerCase().includes("what date")) {
      // Handle date selection
      let date = new Date();
      if (selectedOption === "Tomorrow") {
        date.setDate(date.getDate() + 1);
      } else if (selectedOption === "Next Week") {
        date.setDate(date.getDate() + 7);
      }
      newInfo.appointmentDate = date.toISOString().split('T')[0];
    } else if (response.toLowerCase().includes("time works")) {
      newInfo.appointmentTime = selectedOption;
    } else if (response.toLowerCase().includes("which clinic")) {
      newInfo.clinicId = selectedOption.includes("Main") ? 1 : 2;
    } else if (response.toLowerCase().includes("body part") || response.toLowerCase().includes("what symptoms")) {
      newInfo.bodyPart = selectedOption;
      newInfo.symptoms = selectedOption;
    } else if (response.toLowerCase().includes("how long")) {
      newInfo.duration = selectedOption;
      if (!newInfo.description) {
        newInfo.description = '';
      }
      newInfo.description += `Duration: ${selectedOption}. `;
    } else if (response.toLowerCase().includes("severity")) {
      newInfo.severity = selectedOption;
      if (!newInfo.description) {
        newInfo.description = '';
      }
      newInfo.description += `Severity: ${selectedOption}.`;
    }

    setAppointmentInfo(newInfo);
  };

  const handleSendMessage = async (manualMessage?: string) => {
    const messageToSend = manualMessage || message;
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: messageToSend };
    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('healthcare-chat', {
        body: { 
          message: userMessage.content,
          appointmentInfo: appointmentInfo 
        }
      });

      if (error) throw error;

      if (data.responses) {
        const newMessages = data.responses.map((response: string) => {
          const options = getOptionsForResponse(response, appointmentInfo);
          const message = {
            role: "assistant",
            content: response,
            options: options
          };

          if (userMessage.content) {
            updateAppointmentInfo(response, userMessage.content);
          }

          return message;
        });
        setConversation(prev => [...prev, ...newMessages]);
      }

      // If appointment was created successfully
      if (data.appointmentCreated) {
        toast({
          title: "Success",
          description: "Your appointment has been successfully scheduled!",
        });
        // Reset appointment info after successful booking
        setAppointmentInfo({});
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
    appointmentInfo,
    handleSendMessage,
  };
};
