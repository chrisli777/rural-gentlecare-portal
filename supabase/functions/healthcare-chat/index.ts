
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
   Step 1: Ask first:
   "Which part of your body needs attention? 🩺"
   options: ["Head/Face", "Chest/Heart", "Stomach/Digestive", "Back/Spine", "Arms/Hands", "Legs/Feet", "Skin", "Other"]
   
   Step 2: After getting body part, ask:
   "How severe is your condition? 📊"
   options: ["Mild - manageable", "Moderate - concerning", "Severe - very painful"]

   Step 3: After getting severity, ask:
   "Would you prefer an online or in-person appointment? 🏥"
   options: ["Online Appointment", "In-Person Appointment"]
   
   Step 4: After getting appointment type, ask:
   "Please select your preferred date: 📅"
   options: ["Tomorrow", "Day After Tomorrow", "This Week", "Next Week"]
   
   Step 5: Ask:
   "What time works best for you? ⌚"
   options: ["Morning (9-11 AM)", "Afternoon (2-4 PM)", "Evening (5-7 PM)"]

   Step 6: Finally, show appointment summary and ask for confirmation:
   message: "Please confirm your appointment details:
   - Body Part: [body part]
   - Severity: [severity]
   - Appointment Type: [online/in-person]
   - Date: [date]
   - Time: [time]
   
   Would you like to confirm this appointment?"
   options: ["Yes, confirm booking", "No, I need to make changes"]

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
1. For booking workflow, STRICTLY follow the steps in exact order:
   a. Body part
   b. Severity
   c. Appointment type (online/in-person)
   d. Date
   e. Time
   f. Confirmation
2. NEVER repeat questions that have been answered
3. ALWAYS format responses as:
   message: "Your message here"
   options: ["Option 1", "Option 2", "Option 3"]
4. Keep track of workflow state and previous answers
5. If user says "I need to book an appointment", start booking workflow from Step 1
6. If user needs to make changes to appointment details, start booking workflow from Step 1
7. Only create the appointment after user confirms the details
8. NEVER skip steps or ask questions out of order in booking workflow`
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
            message: "How can I help you today?",
            options: ["I need to book an appointment", "I have a health concern", "I need medical advice"]
          }];
        }
      } else {
        finalResponses = [{
          message: "How can I help you today?",
          options: ["I need to book an appointment", "I have a health concern", "I need medical advice"]
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
