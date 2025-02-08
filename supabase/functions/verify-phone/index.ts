
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'npm:twilio'

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
    
    const twilioClient = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID'),
      Deno.env.get('TWILIO_AUTH_TOKEN')
    )
    
    const verifyServiceSid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')

    if (action === 'send') {
      const verification = await twilioClient.verify.v2
        .services(verifyServiceSid)
        .verifications.create({ to: phone, channel: "sms" })
      
      return new Response(
        JSON.stringify({ success: true, status: verification.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (action === 'verify') {
      const verificationCheck = await twilioClient.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({ to: phone, code })
      
      return new Response(
        JSON.stringify({ success: true, status: verificationCheck.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    throw new Error('Invalid action')
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
