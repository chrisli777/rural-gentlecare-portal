import { useToast } from "@/hooks/use-toast";

export const processVoiceCommand = async (command: string) => {
  try {
    const response = await fetch('/api/process-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to process voice command');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
};

export const getFormAssistance = async (context: string, question: string) => {
  try {
    const response = await fetch('/api/form-assistance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context, question }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get form assistance');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting form assistance:', error);
    throw error;
  }
};