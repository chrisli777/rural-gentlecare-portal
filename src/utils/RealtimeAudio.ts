
import { supabase } from '@/lib/supabase';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export class RealtimeChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private recorder: AudioRecorder | null = null;

  constructor(private onMessage: (message: any) => void) {
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async init(language: 'en' | 'es') {
    try {
      const { data, error } = await supabase.functions.invoke("realtime-chat", {
        body: { language }
      });
      if (error) throw error;

      if (!data.client_secret?.value) {
        throw new Error("Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;

      // Set up WebRTC connection
      this.pc = new RTCPeerConnection();
      this.pc.ontrack = e => this.audioEl.srcObject = e.streams[0];

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.pc.addTrack(ms.getTracks()[0]);

      // Set up data channel
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        const event = JSON.parse(e.data);
        console.log("Received event:", event);
        
        // Handle different types of events
        if (event.type === 'response.audio_transcript.delta') {
          this.onMessage({
            type: 'transcript',
            content: event.delta,
            role: 'user'
          });
        } else if (event.type === 'response.message.delta') {
          this.onMessage({
            type: 'message',
            content: event.delta,
            role: 'assistant'
          });
        }
      });

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

      // Start recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.dc?.readyState === 'open') {
          this.dc.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: this.encodeAudioData(audioData)
          }));
        }
      });
      await this.recorder.start();

      // Send initial greeting
      const greeting = language === 'es' 
        ? "¡Hola! 👋 Soy tu Asistente de Salud con IA. ¿Cómo puedo ayudarte hoy?"
        : "Hello! 👋 I'm your AI Health Assistant. How can I help you today?";
      
      this.sendMessage(greeting);

    } catch (error) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  }

  private encodeAudioData(float32Array: Float32Array): string {
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
  }

  async sendMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Data channel not ready');
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'assistant',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.dc.send(JSON.stringify(event));
    this.dc.send(JSON.stringify({type: 'response.create'}));
  }

  disconnect() {
    this.recorder?.stop();
    this.dc?.close();
    this.pc?.close();
  }
}
