
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
      
      try {
        // Verify with Twilio first
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-phone', {
          body: { action: 'verify', phone, code }
        })
        
        if (verifyError || verifyData?.status !== 'approved') {
          throw new Error('Invalid verification code')
        }
      } catch (error) {
        console.error('Twilio verification error:', error)
        throw new Error('Failed to verify code. Please try again.')
      }
      
      // Check if user exists by phone
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers()
      const existingUser = users?.find(u => u.phone === phone)
      
      let userId = existingUser?.id
      
      if (!existingUser) {
        // Create new user if doesn't exist
        const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
          phone,
          phone_confirmed_at: new Date().toISOString(),
          user_metadata: { phone_verified: true }
        })
        
        if (createError) {
          console.error('Create user error:', createError)
          throw new Error('Failed to create user account')
        }
        
        userId = user?.id
      }
      
      if (!userId) {
        throw new Error('Failed to get or create user')
      }
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phone)
        .maybeSingle()
      
      if (profileError) {
        console.error('Profile check error:', profileError)
        throw new Error('Failed to check user profile')
      }
      
      // Generate session
      const { data: { session }, error: sessionError } = await supabase.auth.admin.createSession({
        user_id: userId
      })
      
      if (sessionError) {
        console.error('Session creation error:', sessionError)
        throw new Error('Failed to create session')
      }
      
      return new Response(
        JSON.stringify({ 
          session,
          profileExists: !!profile
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
