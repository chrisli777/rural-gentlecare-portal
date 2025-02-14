
import { useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChat } from "@/hooks/useChat";
import { AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

const PatientDashboard = () => {
  const {
    message,
    setMessage,
    conversation,
    isLoading,
    handleSendMessage,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleVoiceInput = async (text: string) => {
    // Send the transcribed text as a message
    await handleSendMessage(text);

    // Get the last assistant message
    const lastAssistantMessage = conversation[conversation.length - 1];
    if (lastAssistantMessage && lastAssistantMessage.role === 'assistant') {
      try {
        // Convert assistant's response to speech
        const { data, error } = await supabase.functions.invoke('text-to-speech', {
          body: { text: lastAssistantMessage.content }
        });

        if (error) throw error;

        if (data.audioContent) {
          // Play the audio response
          const audio = audioRef.current;
          if (audio) {
            audio.src = `data:audio/mp3;base64,${data.audioContent}`;
            await audio.play();
          }
        }
      } catch (error) {
        console.error('Error converting text to speech:', error);
      }
    }
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
            onSendMessage={() => handleSendMessage()}
            onToggleRecording={() => {}}
          />
        </Card>
      </main>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default PatientDashboard;
