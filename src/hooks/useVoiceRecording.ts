
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useVoiceRecording = (onVoiceProcessed: (text: string) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize WebSocket immediately when component mounts
    const projectRef = "pascdrwwolpnfljfzioj";
    wsRef.current = new WebSocket(`wss://${projectRef}.functions.supabase.co/realtime-chat`);
    
    // Send initial greeting message when connection is established
    wsRef.current.onopen = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'message',
            role: 'assistant',
            content: [
              {
                type: 'input_text',
                text: "Hello! I'm your AI Health Assistant. How can I help you today?"
              }
            ]
          }
        }));
        wsRef.current.send(JSON.stringify({ type: 'response.create' }));
      }
    };

    // Handle incoming messages from the server
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'response.audio.delta') {
        // Convert base64 audio to Float32Array and play
        const audioData = atob(data.delta);
        const audioArray = new Float32Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i) / 255;
        }
        
        // Create a new AudioContext for playing the greeting
        const ctx = new AudioContext({ sampleRate: 24000 });
        const buffer = ctx.createBuffer(1, audioArray.length, 24000);
        buffer.copyToChannel(audioArray, 0);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      } else if (data.type === 'response.text.delta') {
        onVoiceProcessed(data.delta);
      }
    };

    // Cleanup WebSocket on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (isRecording) {
      const ctx = new AudioContext({ sampleRate: 24000 });
      setAudioContext(ctx);
    } else if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const recorder = new MediaRecorder(stream);
      const audioChunks: Float32Array[] = [];

      recorder.ondataavailable = async (event) => {
        const audioData = await event.data.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 24000 });
        const audioBuffer = await audioContext.decodeAudioData(audioData);
        const channelData = audioBuffer.getChannelData(0);
        
        // Send audio data through WebSocket
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodeAudioData(channelData)
          }));
        }
      };

      setMediaRecorder(recorder);
      recorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      toast({
        title: "Voice Chat Started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      toast({
        title: "Voice Chat Ended",
        description: "Voice chat has ended.",
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return {
    isRecording,
    toggleRecording
  };
};

const encodeAudioData = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};
