
import { useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useVoiceConversation } from "@/contexts/ConversationContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { language } = useAccessibility();
  const { isRecording, currentTranscript, toggleVoiceRecording } = useVoiceConversation();

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
                  ? 'ring-4 ring-[#1E5AAB] ring-offset-4 animate-pulse' 
                  : 'bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 ring-offset-4 hover:ring-4 hover:ring-[#1E5AAB]'
              }`}
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
                <p className="text-lg text-[#1E5AAB]">{currentTranscript}</p>
              </motion.div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
