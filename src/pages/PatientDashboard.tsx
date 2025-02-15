import { useRef, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { supabase } from "@/lib/supabase";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useAccessibility();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState<string>("");
  const {
    conversation: chatConversation,
    handleSendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        voiceId: "EXAVITQu4vr4xnSDxMaL", // Lisa voice
      }
    },
    onMessage: (message) => {
      if (message.type === 'transcript') {
        // Update current transcript for real-time display
        setCurrentTranscript(message.content);
      } else if (message.type === 'response') {
        // Clear transcript and add both user's message and assistant's response
        if (currentTranscript) {
          setMessages(prev => [...prev, {
            role: 'user',
            content: currentTranscript
          }]);
          setCurrentTranscript("");
        }
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: message.content
        }]);
      }
    }
  });

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 flex">
        <Card className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#1E5AAB] rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold">
                {language === 'en' ? 'AI Health Assistant' : 'Asistente de Salud IA'}
              </h2>
            </div>
            <Button
              onClick={() => navigate("/patient/ai-assistant")}
              className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white flex items-center gap-2"
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
              {language === 'en' ? 'Switch to Text Conversation' : 'Cambiar a Conversación de Texto'}
            </Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold text-gray-900">
                {language === 'en' ? 'Talk to Us' : 'Habla con Nosotros'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {language === 'en' 
                  ? 'Click the button below to start speaking with your AI Health assistant'
                  : 'Haz clic en el botón para comenzar a hablar con tu asistente de salud IA'}
              </p>
            </motion.div>
            
            <motion.button
              onClick={toggleVoiceRecording}
              className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 overflow-hidden ${
                isRecording 
                  ? 'ring-4 ring-destructive ring-offset-4 animate-pulse' 
                  : 'bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 ring-offset-4 hover:ring-4 hover:ring-[#1E5AAB]'
              }`}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="w-full h-full">
                <AvatarImage
                  src="https://production.listennotes.com/podcasts/sarah-and-avneet/sarah-and-avneet-episode-46-BmqPz1w2sQl-vDU5PUMqVrY.1400x1400.jpg"
                  alt="Lisa AI Assistant"
                  className="object-cover"
                />
                <AvatarFallback className="bg-[#1E5AAB]">
                  {isRecording ? (
                    <MicOff className="h-20 w-20 text-white" />
                  ) : (
                    <Mic className="h-20 w-20 text-white" />
                  )}
                </AvatarFallback>
              </Avatar>
            </motion.button>

            {currentTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="text-lg text-primary">{currentTranscript}</p>
              </motion.div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
