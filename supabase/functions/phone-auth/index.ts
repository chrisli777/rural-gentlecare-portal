
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, phone, code } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    if (action === 'verify') {
      console.log('Verifying code for:', phone)
      
      // Verify with Twilio first
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-phone', {
        body: { action: 'verify', phone, code }
      })
      
      if (verifyError || verifyData?.status !== 'approved') {
        throw new Error('Invalid verification code')
      }
      
      // Check if profile exists
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phone)
        .maybeSingle()
      
      if (profileError) throw profileError

      // If no profile exists, create one
      if (!profiles) {
        const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
          phone,
          phone_confirmed_at: new Date().toISOString(),
          user_metadata: { phone_verified: true }
        })
        
        if (createError) throw createError
        
        // Profile will be created automatically via trigger
      }
      
      // Generate session
      const { data: { session }, error: sessionError } = await supabase.auth.admin.createSession({
        phone,
      })
      
      if (sessionError) throw sessionError
      
      return new Response(
        JSON.stringify({ 
          session,
          profileExists: !!profiles
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    throw new Error('Invalid action')
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
