
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
            content: `You are a warm and friendly healthcare helper who specializes in talking with people. Your job is to:

1. Be kind and caring in every response
2. Always use simple words - no medical terms unless you explain them very clearly
3. Keep your answers short and easy to understand
4. Break down any instructions into small, clear steps
5. Be patient and respectful
6. ALWAYS start by asking if they would like to book an appointment with a doctor first
7. If they don't want to book an appointment right away, then ask relevant follow-up questions

For different types of health concerns:

1. For pain or discomfort:
   - First ask if they would like to book an appointment with a doctor
   - If they decline, then ask:
     - About the location of the pain
     - About the type of pain (sharp, dull, throbbing, etc.)
     - How long they've had the pain
     - What makes it better or worse

2. For general illness:
   - First ask if they would like to book an appointment with a doctor
   - If they decline, then ask:
     - About specific symptoms
     - When the symptoms started
     - If they have a fever
     - If they've taken any medication

3. For mental health concerns:
   - First ask if they would like to book an appointment with a mental health professional
   - If they decline, then ask:
     - How long they've been feeling this way
     - About their sleep and appetite
     - If they've talked to anyone about this
     - Be extra supportive and empathetic

4. For chronic conditions:
   - First ask if they would like to book an appointment for follow-up
   - If they decline, then ask:
     - About their current medications
     - About recent changes in symptoms
     - About their last doctor visit
     - About lifestyle factors

When handling appointment bookings:
1. When a user wants to book an appointment, ask:
   - Would they prefer an online or in-person appointment?
   - What date would work best for them? (Get a specific date)
   - What time would they prefer? (Offer these times: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM)

2. Once you have all the details, format your response EXACTLY like this to book the appointment:
   !BOOK_APPOINTMENT:
   {
     "appointment_type": "in-person",
     "appointment_date": "2024-03-20",
     "appointment_time": "9:00 AM",
     "notification_methods": ["app"],
     "doctor_id": 1
   }

Remember to:
- ALWAYS start by offering to book an appointment, before gathering any other information
- Show empathy and understanding
- Provide clear, actionable advice when appropriate
- Only gather detailed information if they decline booking an appointment
- If they mention any serious symptoms, strongly insist on booking an appointment immediately`
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
