
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
            content: `You are a friendly and efficient healthcare assistant 👨‍⚕️. Be VERY flexible in understanding user responses - accept short, informal answers.

Your responses should be structured in TWO parts:
1. A message to the user
2. A JSON object with options (if any)

Examples of correct response format:
For appointment type:
{
  "message": "What type of appointment would you prefer? 🏥",
  "options": ["online", "in-person", "call-out"]
}

For time slots:
{
  "message": "Perfect! When would you like to schedule your appointment?",
  "options": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
}

For serious symptoms:
{
  "message": "This sounds serious. Let me help you book an appointment right away.",
  "options": ["Book urgent appointment", "Talk to a doctor now", "Find nearest hospital"]
}

Remember:
• ALWAYS format your response as a JSON object with "message" and optional "options" fields
• Use emojis to keep it friendly 😊
• Be very flexible with user inputs
• Keep messages short and clear
• For appointment booking, use EXACT values:
  - Types: "online", "in-person", "call-out"
  - Times: "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"
• Never include the word "options:" in your message text`
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
    let finalResponses = [];

    try {
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(aiResponse);
      
      if (parsedResponse.message) {
        const responseObject = {
          role: "assistant",
          content: parsedResponse.message,
          options: parsedResponse.options
        };
        finalResponses = [responseObject];
      }
    } catch (e) {
      // If parsing fails, handle as regular text
      console.log('Failed to parse as JSON, handling as regular text:', e);
      if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
        // Handle appointment booking response
        try {
          const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
          if (!bookingMatch) {
            throw new Error('Invalid booking format');
          }

          const appointmentDetails = JSON.parse(bookingMatch[1]);
          console.log('Booking appointment with details:', appointmentDetails);

          // Validate appointment details
          if (!appointmentDetails.appointment_type || 
              !["online", "in-person", "call-out"].includes(appointmentDetails.appointment_type)) {
            throw new Error('Invalid appointment type');
          }

          // Insert the appointment into the database
          const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert([appointmentDetails])
            .select()
            .single();

          if (appointmentError) {
            console.error('Error booking appointment:', appointmentError);
            throw new Error('Failed to book appointment');
          }

          console.log('Successfully booked appointment:', appointment);
          
          finalResponses = [{
            role: "assistant",
            content: "Great! Your appointment has been booked successfully. 🎉",
            options: ["View appointment details", "Book another appointment"]
          }];
        } catch (error) {
          console.error('Error processing appointment booking:', error);
          finalResponses = [{
            role: "assistant",
            content: "I apologize, but I encountered an error while trying to book your appointment. Would you like to try a different time?",
            options: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
          }];
        }
      } else {
        // Handle regular text response
        finalResponses = [{
          role: "assistant",
          content: aiResponse
        }];
      }
    }

    return new Response(JSON.stringify({ responses: finalResponses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
