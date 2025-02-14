
import { useRef, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { AnimatePresence } from "framer-motion";

const PatientDashboard = () => {
  const {
    message,
    setMessage,
    conversation: initialConversation,
    isLoading,
    handleSendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversation, setConversation] = useState(initialConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleVoiceInput = (text: string) => {
    const newMessage = {
      role: text.includes("Hello! 👋") ? "assistant" : "user",
      content: text
    };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleTextInput = async () => {
    if (!message.trim()) return;
    
    const userMessage = {
      role: "user",
      content: message
    };
    
    setConversation(prev => [...prev, userMessage]);
    await handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 flex">
        <Card className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-white">
          <ChatHeader onVoiceInputReceived={handleVoiceInput} />
          
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
            isRecording={false}
            onSendMessage={handleTextInput}
            onToggleRecording={() => {}}
          />
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
