import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SmtpClient } from 'https://deno.land/x/smtp/mod.ts'
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
    const { results, userEmail, therapistEmail, subscribedToNewsletter } = await req.json()

    // Send email to user
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME')!,
      port: 587,
      username: Deno.env.get('SMTP_USERNAME')!,
      password: Deno.env.get('SMTP_PASSWORD')!,
    })

    // Send to user
    await client.send({
      from: 'TherapyAssess <noreply@therapyassess.com>',
      to: userEmail,
      subject: `Your ${results.surveyTitle} Results`,
      content: `
        <h2>Your Assessment Results</h2>
        <p>Assessment: ${results.surveyTitle}</p>
        <p>Score: ${results.totalScore} - ${results.scoreRange.level}</p>
        <p>${results.scoreRange.description}</p>
      `,
    })

    // Send to therapist
    await client.send({
      from: 'TherapyAssess <noreply@therapyassess.com>',
      to: therapistEmail,
      subject: `New Assessment Results - ${results.surveyTitle}`,
      content: `
        <h2>New Assessment Results</h2>
        <p>Client: ${userEmail}</p>
        <p>Assessment: ${results.surveyTitle}</p>
        <p>Score: ${results.totalScore} - ${results.scoreRange.level}</p>
        <p>${results.scoreRange.description}</p>
        <p>Detailed responses: ${JSON.stringify(results.answers, null, 2)}</p>
      `,
    })

    await client.close()

    // Handle newsletter subscription if needed
    if (subscribedToNewsletter) {
      // Add to Mailchimp logic here
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})