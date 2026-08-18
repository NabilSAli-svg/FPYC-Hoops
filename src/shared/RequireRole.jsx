import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';
import { roleLabel } from './roles.js';
import Icon from './Icon.jsx';

/**
 * Gates a portal behind a Supabase session and an allowed role list.
 *
 *   <RequireRole allow={['admin', 'ops_director']} title="Master Scheduler">
 *     <SchedulerApp />
 *   </RequireRole>
 *
 * Without this, a portal is reachable by anyone who knows the URL.
 */
export default function RequireRole({ allow = [], title = 'FPYC', subtitle, children }) {
  const [ready, setReady] = useState(false);
  const [role, setRole]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load(session) {
      if (!session) { if (!cancelled) { setRole(null); setReady(true); } return; }
      const { data: profile } = await supabase
        .from('profiles').select('role').eq('id', session.user.id).single();
      if (!cancelled) { setRole(profile?.role ?? null); setReady(true); }
    }

    supabase.auth.getSession().then(({ data: { session } }) => load(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setReady(false);
      load(session);
    });
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  if (!ready) {
    return (
      <div style={shell}>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14 }}>Loading…</div>
      </div>
    );
  }

  if (role && allow.includes(role)) return children;

  return <Gate title={title} subtitle={subtitle} allow={allow} signedInAs={role} />;
}

function Gate({ title, subtitle, allow, signedInAs }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) { setError('Email and password are required.'); return; }
    setLoading(true); setError('');
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email: email.trim(), password,
    });
    if (authErr) { setLoading(false); setError(authErr.message); return; }
    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', data.user.id).single();
    setLoading(false);
    if (!profile || !allow.includes(profile.role)) {
      await supabase.auth.signOut();
      setError('This account does not have access to ' + title + '.');
    }
    // On success the onAuthStateChange listener re-renders with the new role.
  }

  const allowed = allow.map(roleLabel).join(', ');

  return (
    <div style={shell}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 56, objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
            {subtitle || `${allowed} access only`}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '26px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          {signedInAs && (
            <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 8, padding: '10px 13px', marginBottom: 16, fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>
              You are signed in as <strong>{roleLabel(signedInAs)}</strong>, which cannot open {title}.
              <button onClick={() => supabase.auth.signOut()} style={linkBtn}>Sign in as someone else</button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div>
              <label style={lbl}>Email</label>
              <input type="email" value={email} autoComplete="email"
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com" style={inp} />
            </div>
            <div>
              <label style={lbl}>Password</label>
              <input type="password" value={password} autoComplete="current-password"
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••" style={inp} />
            </div>
            {error && <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              marginTop: 2, padding: '12px', borderRadius: 8, border: 'none',
              background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Icon name="log-in" size={15} color="#fff" />
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <a href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>← Back to main site</a>
        </div>
      </div>
    </div>
  );
}

const shell = {
  minHeight: '100vh', background: 'var(--court-navy)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 24, fontFamily: 'var(--font-body)',
};
const lbl = { fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 5 };
const inp = {
  width: '100%', boxSizing: 'border-box', padding: '10px 13px', borderRadius: 8,
  border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)',
  color: '#111827', outline: 'none',
};
const linkBtn = {
  display: 'block', marginTop: 6, background: 'none', border: 'none', padding: 0,
  color: '#B91C1C', fontWeight: 700, fontSize: 13, cursor: 'pointer',
  fontFamily: 'var(--font-body)', textDecoration: 'underline',
};
