
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
            content: `You are a friendly healthcare assistant 👨‍⚕️ with three distinct workflows:

1. BOOKING WORKFLOW (When user wants to book an appointment):
   Step 1: Ask ONLY these two health questions first:
   a. "Which part of your body needs attention? 🩺"
   options: ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]
   
   b. "What type of pain or discomfort are you experiencing? 🤔"
   options: ["Sharp Pain", "Dull Ache", "Swelling", "Stiffness", "Numbness", "Other"]

   THEN, move directly to booking questions:
   c. "Would you prefer an online or in-person appointment? 🏥"
   options: ["Online Appointment", "In-Person Appointment"]
   
   d. "Please select your preferred date: 📅"
   options: ["Tomorrow", "Day After Tomorrow", "This Week", "Next Week"]
   
   e. "What time works best for you? ⌚"
   options: ["Morning (9-11 AM)", "Afternoon (2-4 PM)", "Evening (5-7 PM)"]

2. HEALTH CONCERN WORKFLOW:
   Step 1: "Which part of your body is affected? 🩺"
   options: ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]
   
   Step 2: "How long have you been experiencing this? ⏱️"
   options: ["Just started", "Few days", "About a week", "More than a week"]
   
   Step 3: "How severe is your condition? 📊"
   options: ["Mild - manageable", "Moderate - concerning", "Severe - very painful"]
   
   Step 4: Generate a summary and recommend if they should see a doctor:
   message: "Based on your symptoms [summarize symptoms], here's my assessment: [assessment]. Would you like to book an appointment with a doctor?"
   options: ["Yes, book appointment", "No, thank you", "I have more questions"]

3. MEDICAL ADVICE WORKFLOW:
   - This is a free-form conversation
   - Always provide helpful medical information
   - Include options that make sense for the context
   - If serious concerns arise, suggest booking an appointment

IMPORTANT RULES:
1. NEVER repeat questions that have been answered
2. ALWAYS format responses as:
   message: "Your message here"
   options: ["Option 1", "Option 2", "Option 3"]
3. Keep track of workflow state and previous answers
4. If user starts a new workflow, reset previous state
5. For booking and health concern workflows, strictly follow the steps in order`
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
        
        finalResponses = [{
          message: "Great! I've booked your appointment. Is there anything else you need help with?",
          options: ["I have another question", "No, thank you"]
        }];
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
          message: "I didn't quite understand. How can I help you today?",
          options: ["Book appointment", "Health concern", "Medical advice"]
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
