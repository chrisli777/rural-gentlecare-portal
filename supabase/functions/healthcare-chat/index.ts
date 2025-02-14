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
            content: `You are a friendly and professional healthcare assistant. Your responses should:

1. Be concise and clear 📝
2. Use simple language, explaining medical terms when needed 🔍
3. Include relevant emojis to make the conversation friendly 😊
4. Format lists and steps properly using markdown syntax for better readability
5. Be empathetic and supportive 💝

Conversation Flow:
1. First, gather essential information (2-3 key questions maximum) about their concern 🤔
2. If you detect any serious symptoms, immediately suggest booking a doctor's appointment ⚡
3. Otherwise, after gathering basic info, provide:
   - A brief summary of their situation 📋
   - Suggested next steps or advice 🎯
   - Ask if they'd like to book an appointment with a doctor 👨‍⚕️

When asking questions, focus on:
• Main symptoms or concerns
• Duration
• Severity or impact on daily life

For appointment booking, ask:
1. Preference for online or in-person
2. Preferred date
3. Preferred time (from: 9:00 AM, 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM)

Use this format for booking:
!BOOK_APPOINTMENT:
{
  "appointment_type": "in-person",
  "appointment_date": "2024-03-20",
  "appointment_time": "9:00 AM",
  "notification_methods": ["app"],
  "doctor_id": 1
}

Serious symptoms requiring immediate doctor consultation include:
• Severe chest pain or difficulty breathing
• Sudden severe headache
• High fever with severe symptoms
• Sudden changes in vision or speech
• Severe abdominal pain
• Mental health crisis

Remember to:
• Keep responses concise and well-formatted
• Use markdown for lists and important points
• Include relevant emojis naturally
• Be warm and professional
• Immediately recommend doctor consultation for serious symptoms`
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
