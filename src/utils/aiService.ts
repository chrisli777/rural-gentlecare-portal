
import { supabase } from "@/integrations/supabase/client";

export const processVoiceCommand = async (command: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('process-voice-command', {
      body: { command }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
};

export const getFormAssistance = async (context: string, userInput: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('form-assistance', {
      body: { context, userInput }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting form assistance:', error);
    throw error;
  }
};
