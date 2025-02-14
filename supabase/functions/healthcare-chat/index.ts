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

1. In your FIRST response to any health concern:
   SPLIT your response into TWO separate parts using [SPLIT] marker:
   PART 1: Ask only ONE key question about their main symptom/concern
   PART 2: "Or, I can help you book an appointment with a doctor right away. Would you like that? 🗓️"

2. For appointment booking:
   • When user shows ANY interest in booking (words like "yes", "book", "appointment", "doctor", etc.), ask:
   "What type of appointment would you prefer? 🏥"
   options: ["online", "in-person", "call-out"]

   • Accept ANY variation of these answers:
     - For online: "online", "virtual", "video", "remote", "tele", etc.
     - For in-person: "in person", "office", "clinic", "physical", "in-person", etc.
     - For call-out: "home", "house", "visit", "call-out", etc.

   • Then immediately suggest a time:
   "Perfect! How about tomorrow at 10:00 AM? Or I can check other times if this doesn't work for you. 📅"

Then use this format to book it (IMPORTANT: date must be in YYYY-MM-DD format):
!BOOK_APPOINTMENT:
{
  "appointment_type": "online",
  "appointment_date": "${new Date(Date.now() + 86400000).toISOString().split('T')[0]}",
  "appointment_time": "10:00 AM",
  "notification_methods": ["app"],
  "doctor_id": 1
}

For serious symptoms (severe pain, breathing issues, high fever, sudden changes in vision/speech), immediately say:
"This sounds serious. Let me help you book an appointment right away. What type of appointment would you prefer? 🚨"

Remember:
• Be VERY flexible with user inputs - accept short/informal answers
• Immediately proceed with booking when user shows any interest
• Keep messages short and clear
• Use emojis to keep it friendly 😊
• ALWAYS use tomorrow's date for appointments
• ONLY use these exact appointment types: "online", "in-person", or "call-out"`
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
    let finalResponses = [];

    // Split the response if it contains the [SPLIT] marker
    if (aiResponse.includes('[SPLIT]')) {
      finalResponses = aiResponse.split('[SPLIT]').map(part => part.trim());
    } else if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
      // Handle appointment booking response
      try {
        // Extract the JSON part
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

        // Validate appointment date
        const appointmentDate = new Date(appointmentDetails.appointment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (appointmentDate < today) {
          throw new Error('Appointment date must be today or in the future');
        }

        // Validate time format
        const validTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
        if (!validTimes.includes(appointmentDetails.appointment_time)) {
          throw new Error('Invalid appointment time');
        }

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
        
        // Keep only the human-readable part of the response
        const humanResponse = aiResponse.replace(/!BOOK_APPOINTMENT:[\s\S]*?}/, '').trim();
        finalResponses = [humanResponse || "Great! Your appointment has been booked successfully. 🎉"];
      } catch (error) {
        console.error('Error processing appointment booking:', error);
        finalResponses = [`I apologize, but I encountered an error while trying to book your appointment. 
        Let's try again with a different time. Available times are: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, or 4:00 PM. 
        Which time would you prefer? 🕒`];
      }
    } else {
      finalResponses = [aiResponse];
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
