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
    const { message, appointmentInfo } = await req.json();
    console.log('Received message:', message);
    console.log('Current appointment info:', appointmentInfo);

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
            content: `You are a friendly and efficient healthcare assistant 👨‍⚕️. Guide users through booking appointments step by step.

Current appointment info: ${JSON.stringify(appointmentInfo)}

Required fields for booking:
- appointmentType
- appointmentDate
- appointmentTime
- bodyPart/symptoms
- clinicId (only if in-person)

Step-by-Step Logic:
1. If appointmentType is null: Ask what type of appointment they prefer
2. If appointmentType is set but no clinicId and type is in-person: Ask for clinic
3. If no appointmentDate: Ask for date
4. If date set but no time: Show available times
5. If no bodyPart/symptoms: Ask about affected body part
6. IF ALL REQUIRED FIELDS ARE PRESENT: Show summary and ask for confirmation

IMPORTANT RULES:
- Never assume appointmentType
- Only ask ONE question at a time
- After each answer, check if all required fields are present
- If all required fields are present, show summary and ask for confirmation
- Keep responses focused and friendly

For appointment booking, use !BOOK_APPOINTMENT:
{
  "appointment_type": "[type]",
  "appointment_date": "YYYY-MM-DD",
  "appointment_time": "HH:MM AM/PM",
  "notification_methods": ["app"],
  "clinic_id": "[clinic_id]",
  "body_part": "[body_part]",
  "description": "[description]"
}`
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
    let appointmentCreated = false;

    if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
      try {
        const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
        if (!bookingMatch) {
          throw new Error('Invalid booking format');
        }

        const appointmentDetails = JSON.parse(bookingMatch[1]);
        console.log('Booking appointment with details:', appointmentDetails);

        const appointmentDate = new Date(appointmentDetails.appointment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDate < today) {
          throw new Error('Appointment date must be today or in the future');
        }

        const { data: appointment, error: appointmentError } = await supabase
          .from('appointments')
          .insert([
            {
              appointment_type: appointmentDetails.appointment_type,
              appointment_date: appointmentDetails.appointment_date,
              appointment_time: appointmentDetails.appointment_time,
              notification_methods: appointmentDetails.notification_methods,
              clinic_id: appointmentDetails.clinic_id,
              body_part: appointmentDetails.body_part,
              description: appointmentDetails.description,
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
        appointmentCreated = true;
        
        finalResponses = [aiResponse.replace(/!BOOK_APPOINTMENT:[\s\S]*?}/, '').trim()];
      } catch (error) {
        console.error('Error processing appointment booking:', error);
        finalResponses = ["I apologize, but I encountered an error while trying to book your appointment. Please try selecting a different day or time."];
      }
    } else {
      finalResponses = [aiResponse];
    }

    return new Response(JSON.stringify({ responses: finalResponses, appointmentCreated }), {
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
