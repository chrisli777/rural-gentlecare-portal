
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the file from storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from('medical-documents')
      .download(filePath);

    if (downloadError) {
      throw new Error('Failed to download file');
    }

    // Convert the file to base64
    const base64File = await fileData.arrayBuffer()
      .then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))));

    // Step 1: Process with Donut OCR model
    console.log('Sending file to Donut OCR API...');
    const ocrResponse = await fetch('https://api-inference.huggingface.co/models/naver-clova-ix/donut-base-finetuned-cord-v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: base64File,
      }),
    });

    if (!ocrResponse.ok) {
      throw new Error(`Hugging Face API error: ${ocrResponse.statusText}`);
    }

    const ocrResult = await ocrResponse.json();
    console.log('OCR processing complete. Extracted text:', ocrResult);

    // Step 2: Process with GPT-4o-mini for structured data extraction
    console.log('Sending OCR text to GPT for information extraction...');
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a medical document analyzer. Extract patient information from the provided OCR text and return it in a structured format. Focus on extracting these fields: first_name, last_name, date_of_birth, allergies, current_medications, chronic_conditions, emergency_contact, and emergency_phone. Make sure to format dates as YYYY-MM-DD and return data in JSON format. If a field cannot be found, leave it as an empty string.'
          },
          {
            role: 'user',
            content: `Please analyze this medical document text and extract patient information in JSON format:\n\n${JSON.stringify(ocrResult)}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!gptResponse.ok) {
      throw new Error('OpenAI API error');
    }

    const aiResponse = await gptResponse.json();
    
    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('No response from AI');
    }

    let extractedData;
    try {
      extractedData = JSON.parse(aiResponse.choices[0].message.content);
      console.log('Successfully extracted structured data from document');
    } catch (e) {
      console.error('Error parsing AI response:', aiResponse.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    // Get user ID from auth context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Update the processed_documents table with extracted data
    const { error: updateError } = await supabaseAdmin
      .from('processed_documents')
      .update({ processed_data: extractedData })
      .eq('file_path', filePath);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: extractedData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
