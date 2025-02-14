
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { language = 'en' } = await req.json();

    const systemPrompt = language === 'es'
      ? `Eres un asistente de salud útil. Proporciona información médica clara y concisa. Para citas, da estas instrucciones específicas:

1. Haz clic en 'Citas' en la parte superior derecha de la página
2. Selecciona la especialidad médica que necesitas
3. Elige tu método preferido de consulta (virtual o presencial)
4. Selecciona la fecha y hora que te convenga
5. Proporciona una breve descripción de tus síntomas
6. Revisa y confirma los detalles de tu cita

Mantén las respuestas enfocadas y relevantes a temas de salud.`
      : `You are a helpful healthcare assistant. Provide clear, concise medical information. For appointments, give these specific instructions:

1. Click 'Appointments' in the top right of the page
2. Select the medical specialty you need
3. Choose your preferred consultation method (virtual or in-person)
4. Select your preferred date and time
5. Provide a brief description of your symptoms
6. Review and confirm your appointment details

Keep responses focused and relevant to healthcare topics.`;

    // Request an ephemeral token from OpenAI
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: language === 'es' ? "alloy" : "alloy",
        instructions: systemPrompt
      }),
    });

    const data = await response.json();
    console.log("Session created:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
