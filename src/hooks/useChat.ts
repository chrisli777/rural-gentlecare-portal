
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { parse, isValid } from "date-fns";

interface AppointmentInfo {
  appointmentType?: string | null;
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
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo>({
    appointmentType: null // Setting default to null instead of in-person
  });
  const [conversation, setConversation] = useState<{ role: string; content: string; options?: string[] }[]>([
    {
      role: "assistant",
      content: "Hello! 👋 I'm your AI Health Assistant. How can I help you today?",
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
    // Only return options that are specifically related to the current context
    if (content.toLowerCase().includes("book an appointment") || content.toLowerCase().includes("let's get started")) {
      return ["Online Appointment", "In-Person Appointment", "Home Visit"];
    }
    if (content.toLowerCase().includes("what date") || content.toLowerCase().includes("which date")) {
      return ["Today", "Tomorrow", "Next Week"];
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
    // Don't return default options anymore
    return [];
  };

  const parseDateFromMessage = (message: string): string | null => {
    // Try different date formats
    const formats = [
      'MM/dd',
      'MM-dd',
      'MM.dd',
      'MMMM d',
      'MMM d',
    ];

    for (const format of formats) {
      // Add current year to the date
      const currentYear = new Date().getFullYear();
      const dateWithYear = `${message}/${currentYear}`;
      const parsedDate = parse(dateWithYear, `${format}/yyyy`, new Date());
      
      if (isValid(parsedDate)) {
        return parsedDate.toISOString().split('T')[0];
      }
    }

    return null;
  };

  const updateAppointmentInfo = async (response: string, selectedOption: string) => {
    let newInfo = { ...appointmentInfo };
    let updated = false;
    
    // Handle appointment type selection
    if (selectedOption.toLowerCase().includes("appointment")) {
      newInfo.appointmentType = selectedOption.toLowerCase().includes("online") 
        ? "online" 
        : selectedOption.toLowerCase().includes("home") 
          ? "call-out"
          : "in-person";
      updated = true;
    }
    
    // Handle date selection
    if (!updated && ["Today", "Tomorrow", "Next Week"].includes(selectedOption)) {
      let date = new Date();
      if (selectedOption === "Tomorrow") {
        date.setDate(date.getDate() + 1);
      } else if (selectedOption === "Next Week") {
        date.setDate(date.getDate() + 7);
      }
      newInfo.appointmentDate = date.toISOString().split('T')[0];
      updated = true;
    }
    
    // Try to parse date from message if not already updated
    if (!updated) {
      const parsedDate = parseDateFromMessage(selectedOption);
      if (parsedDate) {
        newInfo.appointmentDate = parsedDate;
        updated = true;
      }
    }
    
    // Handle time selection
    if (!updated && (selectedOption.includes("AM") || selectedOption.includes("PM"))) {
      newInfo.appointmentTime = selectedOption;
      updated = true;
    }
    
    // Handle clinic selection
    if (!updated && selectedOption.includes("Clinic")) {
      newInfo.clinicId = selectedOption.includes("Main") ? 1 : 2;
      updated = true;
    }
    
    // Handle body part/symptoms selection
    if (!updated && ["Head", "Neck", "Chest", "Back", "Arms", "Hands", "Abdomen", "Legs", "Feet", "Multiple Areas"].includes(selectedOption)) {
      newInfo.bodyPart = selectedOption;
      newInfo.symptoms = selectedOption;
      updated = true;
    }
    
    // Handle duration selection
    if (!updated && ["Just started", "Few days", "About a week", "More than a week"].includes(selectedOption)) {
      newInfo.duration = selectedOption;
      if (!newInfo.description) {
        newInfo.description = '';
      }
      newInfo.description += `Duration: ${selectedOption}. `;
      updated = true;
    }
    
    // Handle severity selection
    if (!updated && ["Mild", "Moderate", "Severe"].includes(selectedOption)) {
      if (!newInfo.description) {
        newInfo.description = '';
      }
      newInfo.description += `Severity: ${selectedOption}.`;
      updated = true;
    }

    if (updated) {
      setAppointmentInfo(newInfo);
      console.log("Updated appointment info:", newInfo);
    }

    return newInfo;
  };

  const handleSendMessage = async (manualMessage?: string) => {
    const messageToSend = manualMessage || message;
    if (!messageToSend.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: messageToSend };
    setConversation(prev => [...prev, userMessage]);
    setMessage("");

    try {
      // First update the appointment info based on the user's selection
      const updatedInfo = await updateAppointmentInfo(message, messageToSend);

      const { data, error } = await supabase.functions.invoke('healthcare-chat', {
        body: { 
          message: userMessage.content,
          appointmentInfo: updatedInfo 
        }
      });

      if (error) throw error;

      if (data.responses) {
        const newMessages = data.responses.map((response: string) => {
          const options = getOptionsForResponse(response, updatedInfo);
          return {
            role: "assistant",
            content: response,
            options: options
          };
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
