
import { useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { AnimatePresence } from "framer-motion";
import { Mic, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIAssistant = () => {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-6 flex">
        <Card className="flex-1 flex flex-col h-[calc(100vh-8rem)] bg-white">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" style={{ color: "#1E5AAB" }} />
              <h2 className="text-lg font-semibold">AI Health Assistant</h2>
            </div>
            <Button
              onClick={() => navigate("/patient/dashboard")}
              className="bg-[#1E5AAB] hover:bg-[#1E5AAB]/90 text-white flex items-center gap-2"
              size="sm"
            >
              <Mic className="h-4 w-4" />
              Switch to Voice Conversation
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
