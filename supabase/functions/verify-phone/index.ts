
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import * as twilio from 'npm:twilio'

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
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const verifyServiceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')

    if (!accountSid || !authToken || !verifyServiceSid) {
      throw new Error('Missing Twilio configuration')
    }
    
    const client = twilio.default(accountSid, authToken)

    if (action === 'send') {
      console.log('Sending verification to:', phone)
      const verification = await client.verify.v2
        .services(verifyServiceSid)
        .verifications.create({ to: phone, channel: "sms" })
      
      console.log('Verification status:', verification.status)
      
      return new Response(
        JSON.stringify({ success: true, status: verification.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (action === 'verify') {
      console.log('Verifying code for:', phone)
      const verificationCheck = await client.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({ to: phone, code })
      
      console.log('Verification check status:', verificationCheck.status)
      
      return new Response(
        JSON.stringify({ success: true, status: verificationCheck.status }),
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
