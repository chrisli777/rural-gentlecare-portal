
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useConversation } from "@11labs/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { ProfileData } from "@/types/conversation";

interface AIConversationStepProps {
  onProfileComplete: () => void;
  onProfileUpdate: (data: ProfileData) => void;
}

export const AIConversationStep = ({ onProfileComplete, onProfileUpdate }: AIConversationStepProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [isRecording, setIsRecording] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
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

  const conversation = useConversation({
    clientTools: {
      updateProfile: async (parameters: { field: string; value: any }) => {
        console.log("Updating profile field:", parameters.field, "with value:", parameters.value);
        setProfileData(prev => {
          const updatedData = { ...prev, [parameters.field]: parameters.value };
          onProfileUpdate(updatedData); // Send updated data to parent component
          return updatedData;
        });
        
        try {
          if (!userId) throw new Error('No user ID available');
          
          const { error } = await supabase
            .from('profiles')
            .update({ [parameters.field]: parameters.value })
            .eq('id', userId);

          if (error) throw error;
          
          return "Profile updated successfully";
        } catch (error: any) {
          console.error("Error updating profile:", error);
          return "Failed to update profile";
        }
      },
      completeProfile: async () => {
        console.log("Profile complete, data:", profileData);
        try {
          if (!userId) throw new Error('No user ID available');

          const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', userId);

          if (error) throw error;

          toast({
            title: "Profile Complete",
            description: "Your medical profile has been saved successfully.",
          });

          onProfileComplete();
          return "Profile completed successfully";
        } catch (error: any) {
          console.error("Error completing profile:", error);
          toast({
            title: "Error",
            description: "Failed to save profile. Please try again.",
            variant: "destructive",
          });
          return "Failed to complete profile";
        }
      }
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are Sarah, a friendly and professional medical assistant helping patients complete their medical profile. Your role is to:

1. Gather essential medical information through natural conversation
2. Ask one question at a time, waiting for the patient's response
3. Confirm information before moving to the next question
4. Use the updateProfile function to save each piece of information immediately after confirmation
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
        stability: 0.75,
        similarityBoost: 0.85,
        style: 0.0,
        useSSML: false
      }
    }
  });

  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new AudioContext();
        await context.resume();
        setAudioContext(context);
        console.log("AudioContext initialized successfully");
      } catch (error) {
        console.error("Error initializing AudioContext:", error);
        toast({
          title: "Error",
          description: "Could not initialize audio system. Please check your browser settings.",
          variant: "destructive",
        });
      }
    };
    initAudio();

    return () => {
      audioContext?.close();
      if (conversationStarted) {
        conversation.endSession().catch(console.error);
      }
    };
  }, []);

  const toggleVoiceRecording = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      navigate("/patient/login");
      return;
    }

    try {
      if (!audioContext) {
        console.error("AudioContext not initialized");
        toast({
          title: "Error",
          description: "Audio system not initialized. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      if (!isRecording) {
        console.log("Starting voice recording...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted");
        
        if (!conversationStarted) {
          console.log("Starting new conversation session");
          await conversation.startSession({
            agentId: "wMSrAmBurxqAvGQKpCgH",
            userId: userId,
          });
          console.log("Conversation session started");
          setConversationStarted(true);
        }
        
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "You can now speak with Sarah",
        });
      } else {
        console.log("Stopping voice recording...");
        setIsRecording(false);
        
        if (conversationStarted) {
          console.log("Ending conversation session");
          await conversation.endSession();
          setConversationStarted(false);
          console.log("Conversation session ended");
        }
        
        toast({
          title: "Recording Stopped",
          description: "Voice interaction ended",
        });
      }
    } catch (error: any) {
      console.error("Error with voice recording:", error);
      toast({
        title: "Error",
        description: error.message || "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
      setConversationStarted(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2">Talk to Sarah</h2>
          <p className="text-muted-foreground">Click the button below to start speaking with your AI medical assistant</p>
        </div>
        
        <button
          onClick={toggleVoiceRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
              : 'bg-primary hover:bg-primary/90'
          }`}
          disabled={isLoading}
        >
          {isRecording ? (
            <MicOff className="h-12 w-12 text-white" />
          ) : (
            <Mic className="h-12 w-12 text-white" />
          )}
        </button>
      </Card>
      
      <Button 
        className="w-full"
        onClick={() => onProfileUpdate(profileData)}
      >
        Continue to Form
      </Button>
    </div>
  );
};
