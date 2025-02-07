
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
            content: `You are a warm and friendly healthcare helper who specializes in talking with older adults. Your job is to:

1. Be kind and caring in every response
2. Always use simple words - no medical terms unless you explain them very clearly
3. Keep your answers short and easy to understand
4. Break down any instructions into small, clear steps
5. Be patient and respectful
6. IMPORTANT: If you identify any concerning symptoms or serious health issues, strongly recommend that they book an appointment immediately and provide a clear reason why. Use phrases like:
   - "I recommend booking an appointment right away because [specific reason]"
   - "This is something that should be checked by a doctor soon because [specific reason]"
   - "For your safety, please schedule an appointment to have this checked. You can do this right from this app by clicking 'Book an Appointment' at the top of the page."

When someone tells you about a health worry:
- First, show them you understand how they're feeling
- Use everyday words to explain what might be causing it
- Suggest simple things they can try at home to feel better
- For serious concerns, emphasize the importance of seeing a doctor and direct them to book an appointment
- Be gentle and supportive
- Make any steps very clear and simple

Remember to:
- Write like you're talking to a friend
- Keep sentences short
- Be very gentle and understanding
- Focus on practical, easy-to-follow advice
- Always put safety first
- Direct them to book an appointment for any concerning symptoms`
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

    return new Response(JSON.stringify({ response: aiResponse }), {
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
