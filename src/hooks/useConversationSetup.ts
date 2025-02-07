
import { useState } from "react";
import { useConversation } from "@11labs/react";
import { ProfileData } from "@/types/conversation";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useConversationSetup = (userId: string | null, onProfileComplete: () => void) => {
  const [profileData, setProfileData] = useState<ProfileData>({});

  const conversation = useConversation({
    clientTools: {
      updateProfile: async (parameters: { field: string; value: any }) => {
        console.log("Updating profile field:", parameters.field, "with value:", parameters.value);
        const updatedProfile = { ...profileData };
        updatedProfile[parameters.field] = parameters.value;
        setProfileData(updatedProfile);
        
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
4. Use the updateProfile function to save each piece of information
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

  return { conversation, profileData };
};
