import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Mic, MicOff, Camera, ImagePlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useConversation } from "@11labs/react";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

type ProfileFieldValue = string | boolean | Record<string, any> | null;

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
  profile_photo?: string;
  voice_preferences?: Record<string, any>;
  ai_analyzed_data?: Record<string, any>;
}

interface AIConversationStepProps {
  onProfileComplete: () => void;
}

export const AIConversationStep = ({ onProfileComplete }: AIConversationStepProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const updateProfileField = async (field: keyof ProfileData, value: ProfileFieldValue) => {
    const updatedProfile = { ...profileData };
    updatedProfile[field] = value;
    setProfileData(updatedProfile);
    await updateProfile(updatedProfile);
    return "Profile updated successfully";
  };

  const conversation = useConversation({
    clientTools: {
      updateProfile: updateProfileField
    },
    overrides: {
      agent: {
        prompt: {
          prompt: "You are a helpful medical assistant collecting patient information. Ask simple, clear questions one at a time to gather essential medical information. Start with basic details like name and date of birth, then move on to medical history, allergies, and current medications. Be friendly but professional.",
          model: "eleven_turbo_v2"
        },
        firstMessage: "Hi! I'm your medical assistant, and I'll help you complete your profile. Let's start with your name. What's your first name?",
        language: "en",
      },
      tts: {
        voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah's voice
        model: "eleven_turbo_v2"
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

  useEffect(() => {
    // Start the conversation
    const initialMessage: Message = {
      role: 'assistant',
      content: "Hi! I'm your medical assistant, and I'll help you complete your profile. Let's start with your name. What's your first name?"
    };
    setMessages([initialMessage]);

    // Check for microphone permission
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream after checking
      setHasPermission(true);
    } catch (error) {
      console.error("Error checking microphone permission:", error);
      setHasPermission(false);
    }
  };

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(`${userId}/${file.name}`, file);

      if (error) throw error;

      const photoUrl = data.path;
      await updateProfile({ ...profileData, profile_photo: photoUrl });

      toast({
        title: "Photo uploaded successfully",
        description: "Your profile photo has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading photo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleVoiceRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(true);
        setHasPermission(true);
        
        await conversation.startSession();
        
      } catch (error: any) {
        console.error("Error starting voice recording:", error);
        setHasPermission(false);
        toast({
          title: "Voice Chat Error",
          description: "There was an error starting the voice conversation. Please try again.",
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
      <div className="mb-4 flex justify-center space-x-4">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-photo"
          />
          <label
            htmlFor="profile-photo"
            className="cursor-pointer flex flex-col items-center"
          >
            {previewUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <span className="text-sm text-muted-foreground mt-2">
              Upload Photo
            </span>
          </label>
        </div>
      </div>

      <div className="h-[300px] overflow-y-auto mb-4 space-y-4">
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
        <Button
          variant="outline"
          size="icon"
          onClick={toggleVoiceRecording}
          className={isRecording ? 'bg-red-100' : ''}
          title={hasPermission === false ? "Microphone access denied" : "Toggle voice chat"}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className={`h-4 w-4 ${hasPermission === false ? 'text-red-500' : ''}`} />
          )}
        </Button>
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your response..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={isLoading || isRecording}
        />
        <Button onClick={handleSendMessage} disabled={isLoading || isRecording}>
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
