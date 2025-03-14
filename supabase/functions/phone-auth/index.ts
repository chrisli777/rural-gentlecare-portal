
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
        
        // Get existing users
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers()
        if (getUserError) {
          console.error('Get users error:', getUserError)
          throw new Error('Failed to check existing users')
        }

        // Check for existing user with this phone number
        console.log('Checking for existing user with phone:', formattedPhone)
        console.log('Total users:', users?.length)
        
        const existingUser = users?.find(u => {
          const userPhone = u.phone
          console.log('Comparing with user phone:', userPhone)
          return userPhone === formattedPhone
        })

        if (!existingUser) {
          throw new Error('No account found with this phone number. Please sign up first.')
        }

        // Generate access token and refresh token for the user
        const { data: tokens, error: tokenError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: `${existingUser.id}@temp.com`, // Using a temporary email since we're using phone auth
        })
        
        if (tokenError || !tokens) {
          console.error('Token generation error:', tokenError)
          throw new Error('Failed to generate session tokens')
        }

        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('phone_number', formattedPhone)
          .maybeSingle()
        
        // Create a session object that matches the structure expected by the client
        const session = {
          access_token: tokens.properties.access_token,
          refresh_token: tokens.properties.refresh_token,
          expires_in: 3600,
          user: existingUser
        }

        return new Response(
          JSON.stringify({ 
            session,
            isNewUser: false,
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
