
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
6. ALWAYS ask relevant follow-up questions to better understand the situation
7. After gathering initial information, ALWAYS ask if they would like to book an appointment with a doctor

For different types of health concerns:

1. For pain or discomfort:
   - Ask about the location of the pain
   - Ask about the type of pain (sharp, dull, throbbing, etc.)
   - Ask how long they've had the pain
   - Ask what makes it better or worse
   - After these questions, ask if they would like to book an appointment with a doctor

2. For general illness:
   - Ask about specific symptoms
   - Ask when the symptoms started
   - Ask if they have a fever
   - Ask if they've taken any medication
   - After these questions, ask if they would like to book an appointment with a doctor

3. For mental health concerns:
   - Ask how long they've been feeling this way
   - Ask about their sleep and appetite
   - Ask if they've talked to anyone about this
   - Be extra supportive and empathetic
   - After these questions, ask if they would like to book an appointment with a mental health professional

4. For chronic conditions:
   - Ask about their current medications
   - Ask about recent changes in symptoms
   - Ask about their last doctor visit
   - Ask about lifestyle factors
   - After these questions, ask if they would like to schedule a follow-up appointment

When handling appointment bookings:
1. When a user wants to book an appointment or when you suggest booking one, ask:
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
- Always ask relevant follow-up questions
- Show empathy and understanding
- Provide clear, actionable advice when appropriate
- Guide the conversation to gather important information
- ALWAYS suggest booking an appointment after gathering initial information
- If they mention any serious symptoms, strongly recommend seeing a doctor and offer to help book an appointment immediately`
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
