
import { useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const {
    message,
    setMessage,
    conversation,
    isLoading,
    handleSendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleVoiceProcessed = (text: string) => {
    setMessage(text);
    handleSendMessage(text);
  };

  const { isRecording, toggleRecording } = useVoiceRecording(handleVoiceProcessed);

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
          <ChatHeader />
          
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

          <ChatInput
            message={message}
            setMessage={setMessage}
            isLoading={isLoading}
            isRecording={isRecording}
            onSendMessage={() => handleSendMessage()}
            onToggleRecording={toggleRecording}
          />
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
