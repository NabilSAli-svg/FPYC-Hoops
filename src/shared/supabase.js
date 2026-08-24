import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  // createClient() throws on a missing/empty URL, which white-screens the
  // whole app with no clue why. Surface it instead — this is almost always a
  // missing Vercel env var for the current environment (Production/Preview).
  const missing = [!url && 'VITE_SUPABASE_URL', !key && 'VITE_SUPABASE_ANON_KEY'].filter(Boolean).join(', ');
  document.body.innerHTML = `<pre style="padding:24px;font:14px monospace;color:#b91c1c;white-space:pre-wrap;">Missing environment variable(s): ${missing}\n\nThis deployment has no Supabase configuration. Check Vercel → Settings → Environment Variables for this environment.</pre>`;
  throw new Error(`Missing Supabase env var(s): ${missing}`);
}

export const supabase = createClient(url, key);
