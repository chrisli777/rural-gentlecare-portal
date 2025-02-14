
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
            content: `You are a friendly and helpful healthcare assistant. When users ask about booking appointments or select "Need to see a doctor?", provide direct guidance without asking for more details. Your response should be concise:

"Based on your request, here's how to book an appointment:
1. Click 'Appointments' in the top right corner of the page
2. Select your preferred appointment type (online/in-person/home visit)
3. If choosing in-person visit, select your preferred clinic
4. Select which part of your body is affected
5. Add any additional description of your symptoms
6. Choose your preferred date and time
7. Review your appointment details and confirm"

For other health topics, provide focused responses with relevant follow-up options in a JSON array at the end of your message, formatted like this: "OPTIONS:["option1", "option2"]". The options should be contextual to your response. For example, if discussing diet, options might include "Learn about nutrition", "Get exercise tips". Limit to 2-3 relevant options.`
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

    const content = data.choices[0].message.content.trim();
    let options: string[] = ["Need to see a doctor?"];

    // Extract options if present
    const optionsMatch = content.match(/OPTIONS:\[(.*?)\]/);
    const cleanContent = content.replace(/OPTIONS:\[.*?\]/, '').trim();

    if (optionsMatch && optionsMatch[1]) {
      const parsedOptions = optionsMatch[1].split(',').map(opt => opt.trim().replace(/"/g, ''));
      options = [...options, ...parsedOptions];
    }

    return new Response(JSON.stringify({ 
      responses: [{
        content: cleanContent,
        options: options
      }]
    }), {
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
