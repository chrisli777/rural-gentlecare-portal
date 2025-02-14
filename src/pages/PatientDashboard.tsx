
import { useRef, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const [isRealtimeMode, setIsRealtimeMode] = useState(false);
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
          <ChatHeader 
            isRealtimeMode={isRealtimeMode} 
            onModeChange={setIsRealtimeMode} 
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isRealtimeMode ? "realtime" : "text"}
              initial={{ opacity: 0, x: isRealtimeMode ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRealtimeMode ? -100 : 100 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
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

              {!isRealtimeMode ? (
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  isLoading={isLoading}
                  onSendMessage={() => handleSendMessage()}
                />
              ) : (
                <motion.div 
                  className="p-4 border-t flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <button
                    onClick={toggleRecording}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-[#1E5AAB] hover:bg-[#1E5AAB]/90'
                    }`}
                  >
                    <motion.div
                      animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
                      transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
                    >
                      <span className="text-white text-xl">
                        {isRecording ? '⏹' : '🎤'}
                      </span>
                    </motion.div>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </main>
    </div>
  );
};

export default PatientDashboard;
