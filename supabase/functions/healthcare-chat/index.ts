
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

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

    if (!huggingFaceToken) {
      throw new Error('Hugging Face API token not configured');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-6.7b-instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<|system|>You are a helpful and knowledgeable healthcare assistant. Provide accurate, concise medical information and general health guidance. Always remind users to consult healthcare professionals for specific medical advice. Use a professional but friendly tone.

<|user|>${message}

<|assistant|>`,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.15,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      throw new Error(`Hugging Face API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Hugging Face API response:', data);

    if (!data || !data[0] || !data[0].generated_text) {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid response format from Hugging Face API');
    }

    // Extract the assistant's response from the generated text
    const generatedText = data[0].generated_text;
    const aiResponse = generatedText.split('<|assistant|>')[1]?.trim() || generatedText;

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
