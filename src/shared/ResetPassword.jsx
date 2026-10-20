import { useState, useEffect } from 'react';
import { supabase } from './supabase.js';
import Icon from './Icon.jsx';

// Lands here from the password-reset email link. Supabase's redirect
// establishes a recovery session automatically; this just lets the user
// set a new password against it.
export default function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setDone(true);
  }

  return (
    <div style={shell}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 56, objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
            Reset password
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: '26px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          {!ready && <div style={{ fontSize: 13, color: '#6B7280', textAlign: 'center' }}>Loading…</div>}

          {ready && !hasSession && !done && (
            <div style={{ fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>
              This reset link is invalid or has expired. Go back to the login screen and request a new one.
            </div>
          )}

          {ready && hasSession && !done && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={lbl}>New password</label>
                <input type="password" value={password} autoComplete="new-password"
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••" style={inp} />
              </div>
              <div>
                <label style={lbl}>Confirm password</label>
                <input type="password" value={confirm} autoComplete="new-password"
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
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
                <Icon name="check" size={15} color="#fff" />
                {loading ? 'Saving…' : 'Set new password'}
              </button>
            </form>
          )}

          {done && (
            <div style={{ fontSize: 13, color: '#059669', lineHeight: 1.5 }}>
              Password updated. You can close this tab and sign in with your new password.
            </div>
          )}
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
