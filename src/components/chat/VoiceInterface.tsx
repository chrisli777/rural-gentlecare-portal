
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { supabase } from '@/lib/supabase';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface VoiceInterfaceProps {
  onSpeakingChange: (speaking: boolean) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onSpeakingChange }) => {
  const { toast } = useToast();
  const { language } = useAccessibility();
  const [isConnected, setIsConnected] = useState(false);
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
    console.log('Received message:', event);
    
    // Handle different event types
    if (event.type === 'response.audio.delta') {
      onSpeakingChange(true);
    } else if (event.type === 'response.audio.done') {
      onSpeakingChange(false);
    }
  };

  const startConversation = async () => {
    try {
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init(language);
      setIsConnected(true);
      
      toast({
        title: language === 'es' ? "Conectado" : "Connected",
        description: language === 'es' ? "Interfaz de voz está lista" : "Voice interface is ready",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setIsConnected(false);
    onSpeakingChange(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
      {!isConnected ? (
        <Button 
          onClick={startConversation}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {language === 'es' ? "Iniciar Conversación" : "Start Conversation"}
        </Button>
      ) : (
        <Button 
          onClick={endConversation}
          variant="secondary"
        >
          {language === 'es' ? "Finalizar Conversación" : "End Conversation"}
        </Button>
      )}
    </div>
  );
};

export default VoiceInterface;
