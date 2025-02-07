
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

    // Try different OCR models in case of failure
    const ocrModels = [
      'microsoft/trocr-large-printed',
      'naver-clova-ix/donut-base-finetuned-cord-v2',
      'facebook/nougat-base'
    ];

    let ocrResult = null;
    let usedModel = '';

    for (const model of ocrModels) {
      try {
        console.log(`Attempting OCR with model: ${model}`);
        const ocrResponse = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: base64File,
          }),
        });

        if (ocrResponse.ok) {
          ocrResult = await ocrResponse.json();
          usedModel = model;
          console.log(`Successfully processed with model: ${model}`);
          break;
        }
      } catch (error) {
        console.log(`Failed with model ${model}:`, error);
        continue;
      }
    }

    if (!ocrResult) {
      throw new Error('All OCR models failed to process the document');
    }

    // Process with FLAN-T5 for structured data extraction
    console.log('Sending OCR text to FLAN-T5 for information extraction...');
    const extractionModels = [
      'google/flan-t5-large',
      'google/flan-t5-xl',
      'google/flan-t5-base'
    ];

    let extractedData = null;
    let extractionResult = null;

    for (const model of extractionModels) {
      try {
        console.log(`Attempting extraction with model: ${model}`);
        const extractionResponse = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Extract the following information from this medical document in JSON format. Include these fields: first_name, last_name, date_of_birth (YYYY-MM-DD), allergies, current_medications, chronic_conditions, emergency_contact, and emergency_phone. If any field is unclear or missing, use an empty string. Here's the document text: ${JSON.stringify(ocrResult)}`,
          }),
        });

        if (extractionResponse.ok) {
          extractionResult = await extractionResponse.text();
          console.log(`Successfully processed with model: ${model}`);
          break;
        }
      } catch (error) {
        console.log(`Failed with model ${model}:`, error);
        continue;
      }
    }

    if (!extractionResult) {
      throw new Error('All extraction models failed to process the document');
    }

    try {
      // Try to parse the response as JSON first
      extractedData = JSON.parse(extractionResult);
    } catch (e) {
      // If parsing fails, try to convert the text response into a structured format
      console.log('Parsing raw text response into structured format');
      const lines = extractionResult.split('\n');
      extractedData = {
        first_name: '',
        last_name: '',
        date_of_birth: '',
        allergies: '',
        current_medications: '',
        chronic_conditions: '',
        emergency_contact: '',
        emergency_phone: ''
      };

      lines.forEach(line => {
        const [key, ...values] = line.split(':').map(s => s.trim());
        const value = values.join(':').trim();
        
        switch (key.toLowerCase()) {
          case 'first name':
          case 'firstname':
            extractedData.first_name = value;
            break;
          case 'last name':
          case 'lastname':
            extractedData.last_name = value;
            break;
          case 'date of birth':
          case 'dob':
            // Try to format the date as YYYY-MM-DD
            const dateMatch = value.match(/\d{4}-\d{2}-\d{2}/);
            extractedData.date_of_birth = dateMatch ? dateMatch[0] : value;
            break;
          case 'allergies':
            extractedData.allergies = value;
            break;
          case 'medications':
          case 'current medications':
            extractedData.current_medications = value;
            break;
          case 'conditions':
          case 'chronic conditions':
            extractedData.chronic_conditions = value;
            break;
          case 'emergency contact':
            extractedData.emergency_contact = value;
            break;
          case 'emergency phone':
          case 'emergency contact phone':
            extractedData.emergency_phone = value;
            break;
        }
      });
    }

    console.log('Successfully extracted structured data:', extractedData);

    // Get user ID from auth context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Update the processed_documents table with extracted data
    const { error: updateError } = await supabaseAdmin
      .from('processed_documents')
      .update({ 
        processed_data: extractedData,
        processing_metadata: {
          ocr_model: usedModel,
          processing_timestamp: new Date().toISOString()
        }
      })
      .eq('file_path', filePath);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: extractedData,
      metadata: {
        ocr_model: usedModel
      }
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
