import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { missingSupabaseEnv } from './shared/supabase.js';
import './styles/tokens.css';

const rootEl = document.getElementById('root');

if (missingSupabaseEnv.length > 0) {
  // Render this instead of the app so a missing Vercel env var shows up as a
  // readable message rather than a blank page with no clue why.
  rootEl.innerHTML = `<pre style="padding:24px;font:14px monospace;color:#b91c1c;white-space:pre-wrap;">Missing environment variable(s): ${missingSupabaseEnv.join(', ')}\n\nThis deployment has no Supabase configuration. Check Vercel → Settings → Environment Variables for this environment (Production vs. Preview).</pre>`;
  throw new Error(`Missing Supabase env var(s): ${missingSupabaseEnv.join(', ')}`);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
