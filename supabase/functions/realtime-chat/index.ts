
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

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
    console.log("WebSocket connection established");

    socket.onopen = () => {
      console.log("Client connected");
      
      // Initialize session with OpenAI
      socket.send(JSON.stringify({
        type: 'session.create',
        session: {
          input_audio_format: 'pcm16',
          output_audio_format: 'pcm16',
          modalities: ['audio', 'text'],
          voice: 'alloy',
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          instructions: `You are a friendly and helpful healthcare assistant. Keep your responses concise and focused on healthcare topics. You can help with:
          1. Appointments (online, in-person, home visits)
          2. Medical advice and health information
          3. General healthcare questions`
        }
      }));
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data.type);

        // Forward messages to OpenAI
        const openAIResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });

        if (!openAIResponse.ok) {
          throw new Error(`OpenAI API error: ${await openAIResponse.text()}`);
        }

        const responseData = await openAIResponse.json();
        socket.send(JSON.stringify(responseData));
      } catch (error) {
        console.error("Error processing message:", error);
        socket.send(JSON.stringify({ error: error.message }));
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Client disconnected");
    };

    return response;
  } catch (error) {
    console.error("Error in realtime-chat function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
