// Supabase Edge Function: send-email
// Sends an email via Resend (https://resend.com) to one or more recipients.
//
// Required secret (set with: supabase secrets set RESEND_API_KEY=re_xxx):
//   RESEND_API_KEY
// Optional secret (defaults to Resend's onboarding sender):
//   RESEND_FROM  e.g. "FPYC Basketball <noreply@yourdomain.com>"

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { to, subject, html, text } = await req.json();

    if (!to || (Array.isArray(to) && to.length === 0)) {
      return new Response(JSON.stringify({ error: 'No recipients provided' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const from = Deno.env.get('RESEND_FROM') || 'FPYC Basketball <onboarding@resend.dev>';

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject: subject || '(No subject)',
        html: html || `<p>${(text || '').replace(/\n/g, '<br/>')}</p>`,
        text: text || undefined,
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
