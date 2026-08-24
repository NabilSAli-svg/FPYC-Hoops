import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Exported so main.jsx can check this before ever calling createRoot/render,
// rather than relying on a throw during module evaluation (whose visibility
// depends on import order and isn't reliable in a production build with no
// dev error overlay).
export const missingSupabaseEnv = [!url && 'VITE_SUPABASE_URL', !key && 'VITE_SUPABASE_ANON_KEY'].filter(Boolean);

export const supabase = missingSupabaseEnv.length === 0 ? createClient(url, key) : null;
