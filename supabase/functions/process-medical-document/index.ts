
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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('medical-documents')
      .download(filePath);

    if (downloadError) {
      throw new Error('Failed to download file');
    }

    // Convert the file to base64
    const base64File = await fileData.arrayBuffer()
      .then(buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))));

    // Process with GPT-4
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a medical document analyzer. Extract patient information from the provided document and return it in a structured format. Focus on extracting these fields: first_name, last_name, date_of_birth, allergies, current_medications, chronic_conditions, emergency_contact, and emergency_phone. Make sure to format dates as YYYY-MM-DD and return data in JSON format.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this medical document and extract patient information in JSON format with the following fields: first_name, last_name, date_of_birth, allergies, current_medications, chronic_conditions, emergency_contact, and emergency_phone.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64File}`
                }
              }
            ]
          }
        ]
      })
    });

    const aiResponse = await response.json();
    
    if (!aiResponse.choices?.[0]?.message?.content) {
      throw new Error('No response from AI');
    }

    let extractedData;
    try {
      extractedData = JSON.parse(aiResponse.choices[0].message.content);
    } catch (e) {
      console.error('Error parsing AI response:', aiResponse.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }

    // Update the processed_documents table
    const { error: updateError } = await supabase
      .from('processed_documents')
      .update({ processed_data: extractedData })
      .eq('file_path', filePath);

    if (updateError) {
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
