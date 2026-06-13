import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { supabase } from '../shared/supabase.js';

export default function FamilyLogin({ onLogin }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]     = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [notice, setNotice] = useState('');

  function clearForm() { setEmail(''); setPassword(''); setName(''); setError(''); setNotice(''); }

  async function handleSignIn(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Email and password are required.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    // FamilyApp's onAuthStateChange will fire and call onLogin automatically
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !name.trim()) { setError('All fields are required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { parent_name: name.trim(), first_name: name.split(' ')[0] } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setNotice('Check your email for a confirmation link, then sign in.');
    setMode('signin');
    clearForm();
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Enter your email address.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (err) { setError(err.message); return; }
    setNotice('Password reset email sent — check your inbox.');
    setMode('signin');
  }

  const title = mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Reset password' : 'Sign in';

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg, var(--court-navy) 0%, #0d2b52 55%, #152e54 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ position: 'fixed', top: '8%', right: '-8%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,199,44,0.07)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '8%', left: '-12%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(232,119,34,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 60, objectFit: 'contain', marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>FPYC Basketball</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Family Portal</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 28px 72px rgba(0,0,0,0.40)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 20 }}>
            {title}
          </div>

          {notice && (
            <div style={{ background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#059669', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="check-circle" size={14} color="#059669" /> {notice}
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626', display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="alert-circle" size={14} color="#DC2626" /> {error}
            </div>
          )}

          <form onSubmit={mode === 'signup' ? handleSignUp : mode === 'reset' ? handleReset : handleSignIn}
                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'signup' && (
              <Field label="Your name" value={name} onChange={setName} placeholder="Alex Reeves" autoComplete="name" />
            )}
            <Field label="Email address" type="email" value={email} onChange={setEmail} placeholder="parent@example.com" autoComplete="email" />
            {mode !== 'reset' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={labelStyle}>Password</label>
                  {mode === 'signin' && (
                    <button type="button" onClick={() => { setMode('reset'); setError(''); setNotice(''); }} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--court-navy)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)', padding: 0 }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                    onBlur={e => e.target.style.borderColor = '#E2E5EA'}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Icon name={showPw ? 'eye-off' : 'eye'} size={16} color="#9CA3AF" />
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 10, border: 'none', marginTop: 2,
              background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 160ms',
            }}>
              {loading ? <><Spinner /> Working…</> : <><Icon name="log-in" size={16} /> {title}</>}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13 }}>
            {mode === 'signin' ? (
              <span style={{ color: '#6B7280' }}>
                New to FPYC?{' '}
                <button onClick={() => { setMode('signup'); clearForm(); }} style={{ background: 'none', border: 'none', color: 'var(--court-navy)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, padding: 0 }}>
                  Create an account
                </button>
              </span>
            ) : (
              <button onClick={() => { setMode('signin'); clearForm(); }} style={{ background: 'none', border: 'none', color: 'var(--court-navy)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }}>
                <Icon name="arrow-left" size={13} /> Back to sign in
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Fairfax Police Youth Club · 501(c)(3) nonprofit</div>
          <a href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>← Back to main site</a>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={autoComplete}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
        onBlur={e => e.target.style.borderColor = '#E2E5EA'}
      />
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

const labelStyle = { fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '0.04em', display: 'block', marginBottom: 6 };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)', color: '#111827', outline: 'none', transition: 'border-color 160ms', background: '#fff' };
