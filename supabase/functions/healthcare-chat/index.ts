
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
IMPORTANT: Your responses should be in this format:
message: "Your question here?"
options: ["Option 1", "Option 2", "Option 3"]

1. For general health concerns:
   a. First message:
   message: "Which part of your body is affected? 🩺"
   options: ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]

   b. Then duration:
   message: "How long have you been experiencing this? ⏱️"
   options: ["Just started", "Few days", "About a week", "More than a week"]

   c. Then severity:
   message: "How severe is your condition? 📊"
   options: ["Mild - manageable", "Moderate - concerning", "Severe - very painful"]

   d. Then symptoms:
   message: "Select your main symptoms:"
   options: ["Fever", "Pain", "Cough", "Nausea", "Other"]

2. For appointments, follow EXACTLY this sequence:
   Step 1:
   message: "Which part of your body needs attention? 🩺"
   options: ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]

   Step 2:
   message: "Would you prefer an online or in-person appointment? 🏥"
   options: ["Online Appointment", "In-Person Appointment"]

   Step 3:
   message: "Please select your preferred date: 📅"
   options: ["Tomorrow", "Day After Tomorrow", "This Week", "Next Week"]

   Step 4:
   message: "What time works best for you? ⌚"
   options: ["Morning (9-11 AM)", "Afternoon (2-4 PM)", "Evening (5-7 PM)"]

IMPORTANT RULES:
1. ALWAYS format your response as:
   message: "Question here?"
   options: ["Option 1", "Option 2", "Option 3"]
2. NEVER include options in the message text
3. Keep messages short and clear
4. Use emojis for friendly tone 😊
5. Wait for user selection before moving to next step`
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
        finalResponses = [{
          message: "I apologize, but I encountered an error while trying to book your appointment. Would you like to try again?",
          options: ["Yes, try again", "No, maybe later"]
        }];
      }
    } else {
      // Parse the response to extract message and options
      const messageMatch = aiResponse.match(/message:\s*"([^"]+)"/);
      const optionsMatch = aiResponse.match(/options:\s*(\[[\s\S]*?\])/);

      if (messageMatch && optionsMatch) {
        try {
          const message = messageMatch[1];
          const options = JSON.parse(optionsMatch[1]);
          finalResponses = [{
            message: message,
            options: options
          }];
        } catch (error) {
          console.error('Error parsing message/options format:', error);
          finalResponses = [{
            message: "I apologize, but I encountered an error. How can I help you?",
            options: ["Start over", "Book appointment", "Get help"]
          }];
        }
      } else {
        finalResponses = [{
          message: aiResponse,
          options: ["I understand", "Tell me more", "Book appointment"]
        }];
      }
    }

    return new Response(JSON.stringify({ responses: finalResponses }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      responses: [{
        message: "I apologize, but something went wrong. How can I help you?",
        options: ["Start over", "Try again", "Contact support"]
      }]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
