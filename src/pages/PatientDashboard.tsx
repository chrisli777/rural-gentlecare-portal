import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Mic, MicOff, Calendar, MessageCircle, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useVoiceConversation } from "@/contexts/ConversationContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ConsentDialog from "@/components/ConsentDialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { language } = useAccessibility();
  const { isRecording, currentTranscript, toggleVoiceRecording } = useVoiceConversation();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [showConsentDialog, setShowConsentDialog] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
        } else {
          console.log("User not logged in");
        }
      } catch (error) {
        console.error("Error in auth check:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, []);

  useEffect(() => {
    if (showWelcomeMessage) {
      const welcomeMessage = {
        role: "assistant",
        content: language === 'en' 
          ? "👋 Welcome, I'm your Health Assistant Clara. I can help you with:\n📅 Booking an appointment with a doctor\n💬 Getting medical advice\n📖 Accessing health information"
          : "👋 Bienvenido, soy Clara, tu Asistente de Salud. Puedo ayudarte con:\n📅 Reservar una cita con un médico\n💬 Obtener consejo médico\n📖 Acceder a información de salud"
      };
      setMessages([welcomeMessage]);
      setShowWelcomeMessage(false);
    }
  }, [showWelcomeMessage, language]);

  const handleConsentGiven = () => {
    setShowConsentDialog(false);
    
    toast({
      title: "Thank you!",
      description: "Your consent has been recorded. You now have full access to the platform.",
      duration: 5000,
    });
  };

  const handleOptionSelect = (option: string) => {
    const userMessage = { role: "user", content: option };
    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      let response = "";
      
      if (option.includes("appointment") || option.includes("cita")) {
        response = language === 'en'
          ? "I can help you book an appointment. Please go to the Appointments section using the navigation menu, or I can guide you through the process here."
          : "Puedo ayudarte a reservar una cita. Por favor, ve a la sección de Citas usando el menú de navegación, o puedo guiarte a través del proceso aquí.";
      } else if (option.includes("advice") || option.includes("consejo")) {
        response = language === 'en'
          ? "What medical concerns do you have today? I'm here to provide general guidance, but remember I'm not a replacement for professional medical care."
          : "¿Qué preocupaciones médicas tienes hoy? Estoy aquí para brindarte orientación general, pero recuerda que no soy un reemplazo para la atención médica profesional.";
      } else if (option.includes("information") || option.includes("información")) {
        response = language === 'en'
          ? "What health information are you looking for today? I can provide general information about common conditions, preventive care, and healthy habits."
          : "¿Qué información de salud estás buscando hoy? Puedo proporcionarte información general sobre condiciones comunes, cuidados preventivos y hábitos saludables.";
      }
      
      const assistantMessage = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const navigationCards = [
    {
      title: language === 'en' ? 'Appointments' : 'Citas',
      description: language === 'en' ? 'View and manage your upcoming appointments' : 'Ver y gestionar tus próximas citas',
      color: 'bg-blue-50',
      path: '/patient/appointments',
      image: '/1.jpg'
    },
    {
      title: language === 'en' ? 'Medical Records' : 'Registros Médicos',
      description: language === 'en' ? 'Access your medical history and reports' : 'Acceder a tu historial médico e informes',
      color: 'bg-green-50',
      path: '/patient/records',
      image: '/2.jpg'
    },
    {
      title: language === 'en' ? 'My Profile' : 'Mi Perfil',
      description: language === 'en' ? 'Update your personal information' : 'Actualizar tu información personal',
      color: 'bg-purple-50',
      path: '/patient/profile',
      image: '/3.jpg'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {navigationCards.map((card, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(card.path)}
              className="cursor-pointer"
            >
              <Card className="h-full hover:shadow-md transition-shadow border-none overflow-hidden">
                <div className="grid grid-cols-2 h-full">
                  <div className="flex items-center justify-center h-full overflow-hidden bg-gray-100">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage 
                        src={card.image} 
                        alt={card.title} 
                        className="object-cover object-center h-full w-full"
                      />
                      <AvatarFallback className="text-lg h-full w-full rounded-none">
                        {card.title.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardContent className={`p-6 flex flex-col justify-center ${card.color}`}>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-sm text-gray-600">{card.description}</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#1E5AAB] rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold">
                {language === 'en' ? 'AI Health Assistant Clara' : 'Asistente de Salud IA Clara'}
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  {msg.role === "assistant" && (
                    <Avatar className="mt-1 h-10 w-10 border border-blue-100">
                      <AvatarImage 
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                        alt="Clara AI Assistant" 
                        className="object-cover object-center"
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        CA
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex-1 ${msg.role === "user" ? "flex justify-end" : ""}`}>
                    <div 
                      className={`p-3 rounded-lg max-w-[80%] whitespace-pre-wrap text-base ${
                        msg.role === "user" 
                          ? "bg-[#1E5AAB] text-white ml-auto" 
                          : "bg-gray-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <Avatar className="mt-1 h-10 w-10 border border-blue-100">
                      <AvatarFallback className="bg-[#1E5AAB] text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {messages.length === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex flex-wrap gap-2 justify-center mt-6"
              >
                <Button
                  onClick={() => handleOptionSelect(language === 'en' ? "Booking an appointment with a doctor" : "Reservar una cita con un médico")}
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 flex items-center gap-2"
                  size="lg"
                >
                  <Calendar className="h-5 w-5 text-[#1E5AAB]" />
                  {language === 'en' ? 'Book Appointment' : 'Reservar Cita'}
                </Button>
                <Button
                  onClick={() => handleOptionSelect(language === 'en' ? "Getting medical advice" : "Obtener consejo médico")}
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 flex items-center gap-2"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 text-[#1E5AAB]" />
                  {language === 'en' ? 'Medical Advice' : 'Consejo Médico'}
                </Button>
                <Button
                  onClick={() => handleOptionSelect(language === 'en' ? "Accessing health information" : "Acceder a información de salud")}
                  className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 flex items-center gap-2"
                  size="lg"
                >
                  <Book className="h-5 w-5 text-[#1E5AAB]" />
                  {language === 'en' ? 'Health Information' : 'Información de Salud'}
                </Button>
              </motion.div>
            )}
          </div>
          
          <div className="p-4 border-t flex flex-col items-center">
            <motion.button
              onClick={toggleVoiceRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? 'ring-4 ring-[#1E5AAB] ring-offset-2 animate-pulse bg-red-500' 
                  : 'bg-[#1E5AAB] hover:bg-[#1E5AAB]/90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? (
                <MicOff className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 w-6 text-white" />
              )}
            </motion.button>
            
            <p className="text-sm text-gray-500 mt-2">
              {language === 'en' 
                ? 'Click the microphone to speak with Clara' 
                : 'Haz clic en el micrófono para hablar con Clara'}
            </p>

            {currentTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg"
              >
                <p className="text-sm text-[#1E5AAB]">{currentTranscript}</p>
              </motion.div>
            )}
          </div>
        </Card>
      </main>

      {userId && (
        <ConsentDialog 
          open={showConsentDialog} 
          onOpenChange={setShowConsentDialog}
          onConsentGiven={handleConsentGiven}
          patientId={userId}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
