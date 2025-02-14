
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

FOLLOW THIS EXACT CONVERSATION FLOW:

1. FIRST, ask about their main health concern:
   - Provide common symptom options as buttons
   - Allow "Other" option for custom input

2. THEN gather these details in order:
   - Duration of symptoms
   - Severity level
   - Related symptoms
   - Impact on daily life
   - Previous similar experiences

3. AFTER gathering ALL information:
   - Provide a summary of their health concern
   - Generate a brief health report
   - ONLY THEN suggest booking an appointment

APPOINTMENT BOOKING RULES:
- Only suggest booking AFTER completing the health assessment
- When booking, show ALL available times:
  ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

FORMAT ALL RESPONSES AS:
{
  "message": "Your clear, concise message here",
  "options": ["option1", "option2", "option3"]
}

EXAMPLE RESPONSES:

For initial contact:
{
  "message": "What's your main health concern today? 🩺",
  "options": ["Fever", "Headache", "Cough", "Stomach pain", "Other"]
}

For duration:
{
  "message": "How long have you been experiencing these symptoms?",
  "options": ["Just started", "Few days", "About a week", "More than a week"]
}

For severity:
{
  "message": "How would you rate the severity?",
  "options": ["Mild", "Moderate", "Severe"]
}

For booking (only after health assessment):
{
  "message": "Based on your symptoms, I recommend seeing a doctor. What time works best for you?",
  "options": ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
}

Remember:
• Complete the FULL health assessment before suggesting appointments
• Keep messages clear and concise
• Use emojis for a friendly tone 😊
• Show ALL time slots when booking
• Make every choice a clickable option`
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
        // For appointment times, ensure all slots are shown
        if (parsedResponse.message.toLowerCase().includes('time') || 
            parsedResponse.message.toLowerCase().includes('appointment')) {
          parsedResponse.options = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
        }
        
        const responseObject = {
          role: "assistant",
          content: parsedResponse.message,
          options: parsedResponse.options
        };
        finalResponses = [responseObject];
      }
    } catch (e) {
      console.log('Failed to parse as JSON, handling appointment booking:', e);
      
      if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
        try {
          const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
          if (!bookingMatch) {
            throw new Error('Invalid booking format');
          }

          const appointmentDetails = JSON.parse(bookingMatch[1]);
          console.log('Booking appointment with details:', appointmentDetails);

          // Insert appointment into database
          const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert([
              {
                appointment_type: appointmentDetails.appointment_type,
                appointment_date: appointmentDetails.appointment_date,
                appointment_time: appointmentDetails.appointment_time,
                notification_methods: appointmentDetails.notification_methods,
                doctor_id: appointmentDetails.doctor_id,
                status: 'pending'
              }
            ])
            .select()
            .single();

          if (appointmentError) {
            console.error('Error booking appointment:', appointmentError);
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
            content: "I couldn't book that appointment. Please select another time:",
            options: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]
          }];
        }
      } else {
        // For non-JSON responses, use text as message without options
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
