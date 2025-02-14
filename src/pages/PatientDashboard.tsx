
import { useRef, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { useChat } from "@/hooks/useChat";
import { AnimatePresence } from "framer-motion";
import { MessageSquare, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const {
    conversation,
    handleSendMessage,
  } = useChat();
  
  const onVoiceProcessed = (text: string) => {
    if (text.trim()) {
      handleSendMessage(text);
    }
  };

  const { isRecording, toggleRecording } = useVoiceRecording(onVoiceProcessed);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 flex">
        <Card className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-[#1E5AAB] rounded-full animate-pulse" />
              <h2 className="text-lg font-semibold">AI Health Assistant</h2>
            </div>
            <Button
              onClick={() => navigate("/patient/ai-assistant")}
              className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white flex items-center gap-2"
              size="sm"
            >
              <MessageSquare className="h-4 w-4" />
              Switch to Text Conversation
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            <AnimatePresence>
              {conversation.map((msg, index) => (
                <ChatMessage
                  key={index}
                  message={msg}
                  onOptionSelect={handleSendMessage}
                />
              ))}
              <div ref={messagesEndRef} />
            </AnimatePresence>
          </div>

          <div className="p-4 border-t flex flex-col items-center gap-2">
            <Button
              onClick={toggleRecording}
              className={`rounded-full w-16 h-16 p-0 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-[#1E5AAB] hover:bg-[#1E5AAB]/90"
              }`}
            >
              {isRecording ? (
                <MicOff className="h-6 w-6 text-white" />
              ) : (
                <Mic className="h-6 w-6 text-white" />
              )}
            </Button>
            <span className="text-sm text-gray-600 font-medium">Talk to us</span>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
