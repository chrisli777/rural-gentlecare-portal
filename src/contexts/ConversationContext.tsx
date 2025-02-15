
import React, { createContext, useContext, useState, useEffect } from "react";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { supabase } from "@/lib/supabase";

interface ConversationContextType {
  isRecording: boolean;
  currentTranscript: string;
  toggleVoiceRecording: () => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { language } = useAccessibility();
  const [isRecording, setIsRecording] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");

  const conversation = useConversation({
    clientTools: {
      completeProfile: async () => {
        console.log("Profile conversation completed");
        return "Profile completed successfully";
      },
      endCall: async () => {
        console.log("Voice command to end call received");
        if (isRecording) {
          await conversation.endSession();
          setIsRecording(false);
          setConversationStarted(false);
          toast({
            title: "Call Ended",
            description: "Voice call ended by voice command",
          });
        }
        return "Call ended successfully";
      }
    },
    overrides: {
      agent: {
        prompt: {
          prompt: language === 'en' 
            ? `You are Lisa, a friendly and professional medical assistant helping patients with their healthcare needs. Your role is to:

1. Have a natural conversation to assist with medical queries
2. Pay attention to what the patient says and provide relevant information
3. Be empathetic and understanding
4. Help schedule appointments if needed
5. End the call when the patient says "end call" or similar phrases by using the endCall tool

When patients ask about booking appointments or seeing a doctor, provide these specific instructions:
"Absolutely, you can see a doctor by booking an appointment. Here's how you can do it:

1. Click 'Appointments' in the top right corner
2. Select your preferred appointment type (online/in-person/home visit)
3. If choosing in-person visit, select your preferred clinic
4. Select which part of your body is affected
5. Add any additional description of your symptoms
6. Choose your preferred date and time
7. Review your appointment details and confirm

Remember, I can guide you through this process, but I can't make the booking for you."

Be friendly and conversational while maintaining professionalism. Always offer to help explain any part of the booking process that might be unclear.`
            : `Eres Lisa, una asistente médica amable y profesional que ayuda a los pacientes con sus necesidades de atención médica. Tu función es:

1. Mantener una conversación natural para ayudar con consultas médicas
2. Prestar atención a lo que dice el paciente y proporcionar información relevante
3. Ser empática y comprensiva
4. Ayudar a programar citas cuando sea necesario
5. Terminar la llamada cuando el paciente diga "terminar llamada" o frases similares usando la herramienta endCall

Cuando los pacientes pregunten sobre cómo reservar citas o ver a un médico, proporciona estas instrucciones específicas:
"Por supuesto, puedes ver a un médico reservando una cita. Aquí te explico cómo hacerlo:

1. Haz clic en 'Citas' en la esquina superior derecha
2. Selecciona tu tipo de cita preferido (en línea/presencial/visita a domicilio)
3. Si eliges visita presencial, selecciona tu clínica preferida
4. Selecciona qué parte de tu cuerpo está afectada
5. Añade una descripción adicional de tus síntomas
6. Elige tu fecha y hora preferidas
7. Revisa los detalles de tu cita y confirma

Recuerda, puedo guiarte a través de este proceso, pero no puedo hacer la reserva por ti."

Sé amable y conversacional mientras mantienes el profesionalismo. Siempre ofrece ayuda para explicar cualquier parte del proceso de reserva que no esté clara.`,
        },
        firstMessage: language === 'en' 
          ? "Hi! I'm Lisa, your medical assistant. How can I help you today?"
          : "¡Hola! Soy Lisa, tu asistente médica. ¿Cómo puedo ayudarte hoy?",
        language: language,
      },
      tts: {
        modelId: "eleven_multilingual_v2",
        voiceId: "EXAVITQu4vr4xnSDxMaL",
      }
    },
    onMessage: (message) => {
      if (message.type === 'transcript') {
        setCurrentTranscript(message.content);
      } else if (message.type === 'response') {
        setCurrentTranscript("");
      }
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const initAudio = async () => {
      try {
        const context = new AudioContext();
        await context.resume();
        setAudioContext(context);
        console.log("AudioContext initialized successfully");
      } catch (error) {
        console.error("Error initializing AudioContext:", error);
      }
    };
    initAudio();

    return () => {
      audioContext?.close();
    };
  }, []);

  const toggleVoiceRecording = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
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
            agentId: "TnwIxSktmaUK3EAqZ6fb",
            userId: userId,
          });
          console.log("Conversation session started");
          setConversationStarted(true);
        }
        
        setIsRecording(true);
        toast({
          title: "Recording Started",
          description: "You can now speak with Lisa",
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
    <ConversationContext.Provider value={{ isRecording, currentTranscript, toggleVoiceRecording }}>
      {children}
    </ConversationContext.Provider>
  );
}

export const useVoiceConversation = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error("useVoiceConversation must be used within a ConversationProvider");
  }
  return context;
};
