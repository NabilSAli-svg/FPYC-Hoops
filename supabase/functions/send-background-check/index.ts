// Supabase Edge Function: send-background-check
// Initiates a basic background check via Checkr for a staff member/volunteer.
//
// Required secrets (set with `supabase secrets set NAME=value`):
//   CHECKR_API_KEY

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { name, email } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Missing "name" or "email"' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('CHECKR_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Checkr secret is not configured (CHECKR_API_KEY)' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const auth = btoa(`${apiKey}:`);
    const [first_name, ...rest] = String(name).trim().split(' ');
    const last_name = rest.join(' ') || first_name;

    const candidateResp = await fetch('https://api.checkr.com/v1/candidates', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ first_name, last_name, email }),
    });
    const candidate = await candidateResp.json();
    if (!candidateResp.ok) {
      return new Response(JSON.stringify({ error: 'Checkr candidate creation failed', details: candidate }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reportResp = await fetch('https://api.checkr.com/v1/reports', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ candidate_id: candidate.id, package: 'basic_plus_volunteer' }),
    });
    const report = await reportResp.json();

    return new Response(JSON.stringify({ success: reportResp.ok, candidate, report }), {
      status: reportResp.ok ? 200 : 207,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
