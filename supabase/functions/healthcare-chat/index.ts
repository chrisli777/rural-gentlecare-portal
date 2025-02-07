
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function queryHuggingFace(message: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `You are a helpful and knowledgeable healthcare assistant. Please provide accurate, concise medical information and general health guidance. Always remind users to consult healthcare professionals for specific medical advice. User question: ${message}`,
          parameters: {
            max_length: 1000,
            temperature: 0.7,
            top_p: 0.95,
            repetition_penalty: 1.15,
          },
        }),
      }
    );

    if (response.ok) {
      return response;
    }

    const error = await response.json();
    console.log(`Attempt ${i + 1} failed:`, error);

    if (error.error && error.error.includes("is currently loading")) {
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }

    // If it's not a loading error, throw it immediately
    throw new Error(`Hugging Face API error: ${JSON.stringify(error)}`);
  }

  throw new Error('Maximum retries reached while waiting for model to load');
}

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

    const response = await queryHuggingFace(message);
    const data = await response.json();
    console.log('Hugging Face API response:', data);

    if (!data || !Array.isArray(data) || data.length === 0 || !data[0].generated_text) {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid response format from Hugging Face API');
    }

    const aiResponse = data[0].generated_text.trim();

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
