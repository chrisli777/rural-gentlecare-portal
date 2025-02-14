
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { WebSocketClient } from "https://deno.land/x/websocket@v0.1.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const ws = new WebSocketClient('wss://api.openai.com/v1/audio/speech')
    
    // Connect to OpenAI's WebSocket API
    ws.on('open', () => {
      console.log("Connected to OpenAI WebSocket");
      ws.send(JSON.stringify({
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
8. Review your appointment details and confirm

For other queries, you can help with:
- Medical advice and health information
- General healthcare questions`
        }
      }))
    })

    ws.on('message', (message) => {
      console.log("Received message from OpenAI:", message);
      const data = JSON.parse(message)
      
      if (data.type === 'session.created') {
        console.log("Session created, updating settings");
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            voice: 'alloy',
            temperature: 0.7,
            max_response_output_tokens: 100
          }
        }))
      }
      
      // Forward messages to the client
      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      })
    })

    // Handle incoming audio from the client
    const { audio } = await req.json()
    if (audio) {
      console.log("Sending audio to OpenAI");
      ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: audio
      }))
    }

  } catch (error) {
    console.error("Error in realtime-chat:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
