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
            content: `You are a friendly and efficient healthcare assistant 👨‍⚕️. Follow these guidelines:

1. In your FIRST response to any health concern:
   • Ask only ONE key question about their main symptom/concern
   • ALWAYS add "Or, I can help you book an appointment with a doctor right away if you prefer. Would you like that?" 🗓️

2. In your SECOND response (after user answers):
   • Provide a brief summary of their situation 📋
   • Offer clear next steps or advice 🎯
   • Ask if they'd like to book an appointment

Never ask more than 2 questions in total. Keep responses short and focused.

If they want to book an appointment, use this format:
!BOOK_APPOINTMENT:
{
  "appointment_type": "in-person",
  "appointment_date": "2024-03-20",
  "appointment_time": "9:00 AM",
  "notification_methods": ["app"],
  "doctor_id": 1
}

For serious symptoms (severe pain, breathing issues, high fever, sudden changes in vision/speech), immediately say:
"I recommend seeing a doctor immediately for this condition. Let me help you book an appointment right away. Would you prefer an online or in-person consultation?" 🚨

Remember:
• Keep all responses concise
• Maximum 2 messages for information gathering
• Always offer appointment booking as an alternative
• Use friendly emojis to make the conversation warm 😊`
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

    const aiResponse = data.choices[0].message.content.trim();
    let finalResponse = aiResponse;
    
    // Check if the response contains an appointment booking request
    if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
      try {
        // Extract the JSON part
        const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
        if (!bookingMatch) {
          throw new Error('Invalid booking format');
        }

        const appointmentDetails = JSON.parse(bookingMatch[1]);
        console.log('Booking appointment with details:', appointmentDetails);

        // Insert the appointment into the database
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
        
        // Keep only the human-readable part of the response after successful booking
        finalResponse = aiResponse.replace(/!BOOK_APPOINTMENT:[\s\S]*?}/, '').trim();

      } catch (error) {
        console.error('Error processing appointment booking:', error);
        finalResponse = "I apologize, but I encountered an error while trying to book your appointment. Could you please try again with the appointment details?";
      }
    }

    return new Response(JSON.stringify({ response: finalResponse }), {
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
