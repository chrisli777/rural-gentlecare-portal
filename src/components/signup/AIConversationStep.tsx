import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface ProfileData {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_type?: string;
  allergies?: string;
  current_medications?: string;
  chronic_conditions?: string;
  primary_physician?: string;
  insurance_provider?: string;
  insurance_number?: string;
  smoker?: boolean;
}

interface AIConversationStepProps {
  onProfileComplete: () => void;
}

export const AIConversationStep = ({ onProfileComplete }: AIConversationStepProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});

  useEffect(() => {
    // Start the conversation
    const initialMessage: Message = {
      role: 'assistant',
      content: "Hi! I'll help you complete your profile. Let's start with your name. What's your first name?"
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

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: currentMessage };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");

    try {
      // TODO: Replace with actual AI integration
      // For now, using a simple mock response
      const lastAssistantMessage = messages[messages.length - 1];
      let response: Message = { role: 'assistant', content: '' };
      let updatedProfile = { ...profileData };

      if (lastAssistantMessage.content.includes("first name")) {
        updatedProfile.first_name = currentMessage;
        response.content = "Great! What's your last name?";
      } else if (lastAssistantMessage.content.includes("last name")) {
        updatedProfile.last_name = currentMessage;
        response.content = "When is your date of birth? (MM/DD/YYYY)";
      } else {
        response.content = "Thank you! Your profile has been updated.";
        await updateProfile(updatedProfile);
        onProfileComplete();
      }

      setProfileData(updatedProfile);
      setMessages(prev => [...prev, response]);
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
      <div className="h-[400px] overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your response..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </Card>
  );
};