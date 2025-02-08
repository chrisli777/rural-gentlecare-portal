
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      try {
        // Verify with Twilio first
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-phone', {
          body: { action: 'verify', phone, code }
        })
        
        if (verifyError || verifyData?.status !== 'approved') {
          throw new Error('Invalid verification code')
        }

        // Format phone number to E.164
        const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`
        
        // First check if user exists
        const { data: existingUsers, error: getUserError } = await supabase.auth.admin.listUsers()
        if (getUserError) {
          console.error('Get users error:', getUserError)
          throw new Error('Failed to check existing users')
        }

        const existingUser = existingUsers?.users?.find(u => u.phone === formattedPhone)
        let userId = existingUser?.id
        let isNewUser = false

        // Create new user only if no existing user found
        if (!userId) {
          console.log('Creating new user for phone:', formattedPhone)
          const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
            phone: formattedPhone,
            user_metadata: { phone_verified: true },
            email_confirm: true,
            phone_confirm: true,
          })
          
          if (createError || !user) {
            console.error('Create user error:', createError)
            throw new Error('Failed to create user account: ' + createError?.message)
          }
          
          userId = user.id
          isNewUser = true
          console.log('Created new user with ID:', userId)
        } else {
          console.log('Found existing user with ID:', userId)
        }

        // Generate session for either new or existing user
        const { data: { session }, error: sessionError } = await supabase.auth.admin.createSession({
          user_id: userId
        })
        
        if (sessionError || !session) {
          console.error('Session creation error:', sessionError)
          throw new Error('Failed to create session')
        }

        // Check if profile exists (for both new and existing users)
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone_number', formattedPhone)
          .maybeSingle()
        
        return new Response(
          JSON.stringify({ 
            session,
            isNewUser,
            profileExists: !!profile
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error in verification process:', error)
        throw error
      }
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

