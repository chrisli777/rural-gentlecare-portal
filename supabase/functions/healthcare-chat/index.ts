
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Received message:', message);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a friendly and efficient healthcare assistant 👨‍⚕️.

For EVERY response, provide:
1. A clear message
2. A list of options for the user to choose from

Format ALL responses as:
{
  "message": "Your message here",
  "options": ["option1", "option2", "option3"]
}

EXAMPLES:

For symptoms:
{
  "message": "What's your main health concern today? 🩺",
  "options": ["Fever", "Headache", "Cough", "Stomach pain", "Other"]
}

For duration:
{
  "message": "How long have you been experiencing these symptoms?",
  "options": ["Today", "Few days", "About a week", "More than a week"]
}

For severity:
{
  "message": "How would you rate your symptoms?",
  "options": ["Mild", "Moderate", "Severe"]
}

For appointments:
{
  "message": "What time works best for you?",
  "options": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
}

Remember:
• ALWAYS provide options in your response
• Keep messages clear and concise
• Use emojis for friendly tone 😊
• Show ALL time slots for appointments`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log('OpenAI API response:', data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid response format from OpenAI API');
    }

    let aiResponse = data.choices[0].message.content.trim();
    console.log('AI response:', aiResponse);

    try {
      // Parse the response as JSON
      const parsedResponse = JSON.parse(aiResponse);
      console.log('Parsed response:', parsedResponse);
      
      if (!parsedResponse.message || !parsedResponse.options) {
        throw new Error('Invalid response structure');
      }
      
      // For appointment-related messages, ensure all time slots are shown
      if (parsedResponse.message.toLowerCase().includes('time') || 
          parsedResponse.message.toLowerCase().includes('appointment')) {
        parsedResponse.options = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
      }
      
      return new Response(JSON.stringify({
        responses: [{
          role: "assistant",
          content: parsedResponse.message,
          options: parsedResponse.options
        }]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback response with error message and options
      return new Response(JSON.stringify({
        responses: [{
          role: "assistant",
          content: "I apologize, but I'm having trouble understanding. Could you please try again? 🤔",
          options: ["Start over", "Speak to a doctor", "Get help"]
        }]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    
    // Return a user-friendly error response with options
    return new Response(JSON.stringify({
      responses: [{
        role: "assistant",
        content: "I apologize, but I encountered an error. How can I help you? 🤔",
        options: ["Try again", "Start over", "Get help"]
      }]
    }), {
      status: 200, // Changed to 200 to ensure the client always gets a valid response
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
