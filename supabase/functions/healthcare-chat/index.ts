import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AIService } from "./ai-service.ts";
import { AppointmentService } from "./appointment-service.ts";
import { ResponseHandler } from "./response-handler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Keep track of conversation state
const conversationStates = new Map();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received message:', message);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize services
    const aiService = new AIService(openAIApiKey);
    const appointmentService = new AppointmentService(supabaseUrl, supabaseServiceKey);

    // Get current state for this user
    const currentState = conversationStates.get(userId);

    // Get AI response
    const aiResponse = await aiService.getResponse(message);
    console.log('OpenAI API response:', aiResponse);

    // Parse and handle the response, passing the current state
    const { responses, state } = ResponseHandler.parseAIResponse(aiResponse, currentState);

    // Update conversation state for this user
    if (state) {
      conversationStates.set(userId, state);
    } else {
      conversationStates.delete(userId);
    }

    return new Response(JSON.stringify({ responses, state }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      responses: [{
        message: "I apologize, but something went wrong. How can I help you?",
        options: ["Start over", "Try again", "Contact support"]
      }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
