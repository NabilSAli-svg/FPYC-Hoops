// Supabase Edge Function: send-sms
// Sends an SMS via Twilio to one or more recipients.
//
// Required secrets (set with `supabase secrets set NAME=value`):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER   e.g. +15551234567

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { to, body } = await req.json();
    const recipients: string[] = Array.isArray(to) ? to : [to];

    if (recipients.length === 0 || !body) {
      return new Response(JSON.stringify({ error: 'Missing "to" or "body"' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const token = Deno.env.get('TWILIO_AUTH_TOKEN');
    const from = Deno.env.get('TWILIO_FROM_NUMBER');
    if (!sid || !token || !from) {
      return new Response(JSON.stringify({ error: 'Twilio secrets are not configured (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER)' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const auth = btoa(`${sid}:${token}`);
    const results = [];
    for (const number of recipients) {
      const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: number, From: from, Body: body }),
      });
      const data = await resp.json();
      results.push({ to: number, ok: resp.ok, data });
    }

    const failures = results.filter(r => !r.ok);
    return new Response(JSON.stringify({ success: failures.length === 0, results }), {
      status: failures.length === 0 ? 200 : 207,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
