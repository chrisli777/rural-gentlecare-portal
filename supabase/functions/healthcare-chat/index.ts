
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
            content: `You are a friendly and efficient healthcare assistant 👨‍⚕️ that gathers information about health concerns.

1. Start by asking about the main health concern.

2. Then gather essential information in this order:
   • Duration of symptoms
   • Severity (mild/moderate/severe)
   • Any related symptoms
   • Past medical history for this condition

3. After gathering ALL information, provide a summary and THEN offer to book an appointment.

Format ALL your responses as JSON with a message and options:
{
  "message": "Your question or response here",
  "options": ["option1", "option2", "option3"]
}

For appointment booking:
- Appointment types: ["online", "in-person", "call-out"]
- Time slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

Examples of responses:
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
  "message": "How would you rate the severity of your symptoms?",
  "options": ["Mild - manageable", "Moderate - concerning", "Severe - very worried"]
}

For appointment type:
{
  "message": "What type of appointment would you prefer?",
  "options": ["online", "in-person", "call-out"]
}

For time slots:
{
  "message": "What time works best for you?",
  "options": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
}

Remember:
• ALWAYS format responses as JSON with message and options
• Keep messages clear and concise
• Use emojis to be friendly 😊
• Only suggest booking AFTER gathering all health information
• Make ALL choices clickable options`
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
      // Parse the response as JSON
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
      // If parsing fails, handle appointment booking
      if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
        try {
          const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
          if (!bookingMatch) {
            throw new Error('Invalid booking format');
          }

          const appointmentDetails = JSON.parse(bookingMatch[1]);
          console.log('Booking appointment with details:', appointmentDetails);

          // Validate appointment type
          if (!appointmentDetails.appointment_type || 
              !["online", "in-person", "call-out"].includes(appointmentDetails.appointment_type)) {
            throw new Error('Invalid appointment type');
          }

          // Insert appointment
          const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert([appointmentDetails])
            .select()
            .single();

          if (appointmentError) {
            throw new Error('Failed to book appointment');
          }

          console.log('Successfully booked appointment:', appointment);
          
          finalResponses = [{
            role: "assistant",
            content: "Your appointment has been booked successfully! 🎉",
            options: ["View appointment details", "Return to main menu"]
          }];
        } catch (error) {
          console.error('Error processing appointment booking:', error);
          finalResponses = [{
            role: "assistant",
            content: "I couldn't book that appointment. Please select an available time:",
            options: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
          }];
        }
      } else {
        // For non-JSON responses, try to extract options from "or" statements
        const parts = aiResponse.split(/\s+(?:or|OR)\s+/);
        if (parts.length > 1) {
          // If we have "or" statements, create options
          const options = parts.map(part => 
            part.replace(/[?.,!]$/g, '').trim() // Remove punctuation at the end
          ).filter(Boolean); // Remove empty strings
          
          finalResponses = [{
            role: "assistant",
            content: parts[0].split('?')[0] + '?', // Keep only the question part
            options: options
          }];
        } else {
          // Regular message without options
          finalResponses = [{
            role: "assistant",
            content: aiResponse
          }];
        }
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
