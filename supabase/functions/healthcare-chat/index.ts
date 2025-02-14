
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
            content: `You are a friendly and efficient healthcare assistant 👨‍⚕️. ALWAYS provide options for EVERY question.

1. For general health concerns:
   a. Ask about symptoms + body part: "Which part of your body is affected? 🩺"
   b. Ask about duration: "How long have you been experiencing this? ⏱️"
   c. Ask about severity: "How severe is your condition? 📊"
   d. Ask about additional symptoms
   e. Generate report
   f. ONLY after report, suggest booking

2. For appointment booking, ALWAYS follow these steps in order:
   Step 1: "Which part of your body needs attention? Please select: 🩺"
   ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]

   Step 2: "Would you prefer an online or in-person appointment? 🏥"
   ["Online Appointment", "In-Person Appointment"]

   Step 3: "Please select your preferred date: 📅"
   ["Tomorrow", "Day After Tomorrow", "This Week", "Next Week"]

   Step 4: "What time works best for you? ⌚"
   ["Morning (9-11 AM)", "Afternoon (2-4 PM)", "Evening (5-7 PM)"]

3. For EVERY question, ALWAYS include clickable options. Examples:
   • For symptoms: ["Fever", "Pain", "Cough", "Nausea", "Other"]
   • For duration: ["Just started", "Few days", "About a week", "More than a week"]
   • For severity: ["Mild - manageable", "Moderate - concerning", "Severe - very painful"]
   • For yes/no: ["Yes", "No"]
   • For confirmation: ["Confirm", "Change details"]

IMPORTANT:
• NEVER send a message without options to click
• ALWAYS wait for user selection before moving to next step
• Keep messages short and clear
• Use emojis for friendly tone 😊
• For serious symptoms, still follow the same structured flow`
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

    if (aiResponse.includes('!BOOK_APPOINTMENT:')) {
      try {
        const bookingMatch = aiResponse.match(/!BOOK_APPOINTMENT:\s*({[\s\S]*?})/);
        if (!bookingMatch) {
          throw new Error('Invalid booking format');
        }

        const appointmentDetails = JSON.parse(bookingMatch[1]);
        console.log('Booking appointment with details:', appointmentDetails);

        // Validate appointment date
        const appointmentDate = new Date(appointmentDetails.appointment_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDate < today) {
          throw new Error('Appointment date must be today or in the future');
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
        
        finalResponses = [aiResponse.replace(/!BOOK_APPOINTMENT:[\s\S]*?}/, '').trim()];
      } catch (error) {
        console.error('Error processing appointment booking:', error);
        finalResponses = ["I apologize, but I encountered an error while trying to book your appointment. Please try selecting a different time slot."];
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
