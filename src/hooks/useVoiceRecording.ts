
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

      // Initialize WebSocket connection using the project reference from the Supabase URL
      wsRef.current = new WebSocket(`wss://pascdrwwolpnfljfzioj.functions.supabase.co/realtime-chat`);
      
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
            audio: Array.from(channelData)
          }));
        }
      };

      // Handle incoming messages from the server
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'response.audio.delta') {
          // Play the audio response
          const audioData = atob(data.delta);
          const audioArray = new Float32Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i) / 255;
          }
          
          if (audioContext) {
            const buffer = audioContext.createBuffer(1, audioArray.length, 24000);
            buffer.copyToChannel(audioArray, 0);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
          }
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
      
      // Close WebSocket connection
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
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
