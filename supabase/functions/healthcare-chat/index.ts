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
            content: `You are a friendly and helpful healthcare assistant. Your responses should be concise and include relevant follow-up options at the end of your message.

For appointment booking requests (in English or Spanish), provide the following guidance:

For English:
"Based on your request, here's how to book an appointment:
1. Click 'Appointments' in the top right corner of the page
2. Select your preferred appointment type (online/in-person/home visit)
3. If choosing in-person visit, select your preferred clinic
4. Select which part of your body is affected
5. Add any additional description of your symptoms
6. Choose your preferred date and time
7. Review your appointment details and confirm"

For Spanish:
"Según tu solicitud, aquí te explico cómo reservar una cita:
1. Haz clic en 'Citas' en la esquina superior derecha de la página
2. Selecciona el tipo de cita que prefieras (en línea/presencial/visita a domicilio)
3. Si eliges visita presencial, selecciona tu clínica preferida
4. Selecciona qué parte de tu cuerpo está afectada
5. Añade cualquier descripción adicional de tus síntomas
6. Elige tu fecha y hora preferida
7. Revisa los detalles de tu cita y confirma"

For all responses, ALWAYS provide 2-4 contextual follow-up options based on the conversation topic. Format these options in a JSON array at the end of your message like this: "OPTIONS:["option1", "option2"]". The options should be in the same language as the user's message and be directly related to the current topic of discussion.

For example, if discussing headaches:
English: OPTIONS:["How severe is your headache?", "Do you have any other symptoms?", "Would you like information about migraine prevention?"]
Spanish: OPTIONS:["¿Qué tan fuerte es tu dolor de cabeza?", "¿Tienes otros síntomas?", "¿Quieres información sobre prevención de migrañas?"]`
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

    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected API response format:', data);
      if (data.error) {
        throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      throw new Error('Invalid response format from OpenAI API');
    }

    const content = data.choices[0].message.content.trim();
    
    // Extract options if present, otherwise use an empty array
    const optionsMatch = content.match(/OPTIONS:\[(.*?)\]/);
    let options: string[] = [];

    if (optionsMatch && optionsMatch[1]) {
      try {
        options = optionsMatch[1].split(',').map(opt => opt.trim().replace(/"/g, ''));
      } catch (error) {
        console.error('Error parsing options:', error);
        // If parsing fails, keep options array empty
      }
    }

    // Only add "Need to see a doctor" if no options were found and it's the first message
    if (options.length === 0) {
      options = message.toLowerCase().includes('español') || /[áéíóúñ¿¡]/.test(message)
        ? ["¿Necesitas ver a un médico?"]
        : ["Need to see a doctor?"];
    }

    const cleanContent = content.replace(/OPTIONS:\[.*?\]/, '').trim();

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
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      details: error
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
