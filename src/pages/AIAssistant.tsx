
import { useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Bot, Calendar, FileText, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const AIAssistant = () => {
  const navigate = useNavigate();
  const { language } = useAccessibility();
  const {
    message,
    setMessage,
    conversation,
    isLoading,
    handleSendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Load speech synthesis voices when component mounts
  useEffect(() => {
    // Force loading of voices
    if ('speechSynthesis' in window) {
      // In some browsers, voices can only be populated after an utterance is created
      const utterance = new SpeechSynthesisUtterance('');
      
      // Function to load voices
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      // Load voices initially
      loadVoices();
      
      // Some browsers (like Chrome) load voices asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const navigationCards = [
    {
      title: language === 'en' ? 'Appointments' : 'Citas',
      description: language === 'en' ? 'View and manage your upcoming appointments' : 'Ver y gestionar tus próximas citas',
      icon: <Calendar className="h-6 w-6 text-[#1E5AAB]" />,
      color: 'bg-blue-50',
      path: '/patient/appointments'
    },
    {
      title: language === 'en' ? 'Medical Records' : 'Registros Médicos',
      description: language === 'en' ? 'Access your medical history and reports' : 'Acceder a tu historial médico e informes',
      icon: <FileText className="h-6 w-6 text-[#1E5AAB]" />,
      color: 'bg-green-50',
      path: '/patient/records'
    },
    {
      title: language === 'en' ? 'My Profile' : 'Mi Perfil',
      description: language === 'en' ? 'Update your personal information' : 'Actualizar tu información personal',
      icon: <User className="h-6 w-6 text-[#1E5AAB]" />,
      color: 'bg-purple-50',
      path: '/patient/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 flex flex-col gap-6">
        {/* Navigation Cards */}
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
              <Card className={`h-full hover:shadow-md transition-shadow ${card.color} border-none`}>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white">
                    {card.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Assistant Card */}
        <Card className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#1E5AAB] rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold">
                {language === 'en' ? 'AI Health Assistant Clara' : 'Asistente de Salud IA Clara'}
              </h2>
            </div>
            <Button
              onClick={() => navigate("/patient/dashboard")}
              className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white flex items-center gap-2"
              size="sm"
            >
              <Mic className="h-4 w-4" />
              {language === 'en' ? 'Switch to Voice Conversation' : 'Cambiar a Conversación de Voz'}
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <AnimatePresence>
              {conversation.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  onOptionSelect={handleSendMessage}
                  assistantAvatar="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                />
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <ChatInput
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </Card>
      </main>
    </div>
  );
};

export default AIAssistant;
