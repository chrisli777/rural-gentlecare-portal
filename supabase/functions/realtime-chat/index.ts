
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
          instructions: `You are a friendly and helpful healthcare assistant. Keep your responses concise and focused on healthcare topics. You can help with:
          1. Appointments (online, in-person, home visits)
          2. Medical advice and health information
          3. General healthcare questions`
        }
      }))
    })

    // Handle messages from OpenAI
    ws.on('message', (message) => {
      const data = JSON.parse(message)
      
      if (data.type === 'session.created') {
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
      ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: audio
      }))
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
