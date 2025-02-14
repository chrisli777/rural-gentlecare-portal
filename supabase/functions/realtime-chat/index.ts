
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";
  
  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const openaiWs = new WebSocket('wss://api.openai.com/v1/audio/speech');

    openaiWs.onopen = () => {
      console.log("Connected to OpenAI WebSocket");
      openaiWs.send(JSON.stringify({
        type: 'session.create',
        model: 'gpt-4',
        session: {
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          modalities: ['audio', 'text'],
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          instructions: `You are a friendly and helpful healthcare assistant. Keep your responses concise and focused on healthcare topics. When users ask about booking appointments, guide them through these specific steps:

1. Click 'Appointments' in the top right corner of the page
2. Select your preferred appointment type:
   - Online Consultation
   - In-Person Visit
   - Home Visit
3. If choosing in-person visit, select your preferred clinic from the available options
4. Select which part of your body is affected from the provided list
5. Add any additional description of your symptoms (optional)
6. Choose your preferred date from the calendar
7. Select an available time slot
8. Review your appointment details and confirm`
        }
      }));
    };

    openaiWs.onmessage = (event) => {
      console.log("Message from OpenAI:", event.data);
      socket.send(event.data);
    };

    socket.onmessage = (event) => {
      console.log("Message from client:", event.data);
      const data = JSON.parse(event.data);
      
      if (data.type === 'session.created') {
        openaiWs.send(JSON.stringify({
          type: 'session.update',
          session: {
            voice: 'alloy',
            temperature: 0.7,
            max_response_output_tokens: 100
          }
        }));
      } else {
        openaiWs.send(event.data);
      }
    };

    socket.onclose = () => {
      console.log("Client disconnected");
      openaiWs.close();
    };

    return response;
  } catch (error) {
    console.error("Error in realtime-chat:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
