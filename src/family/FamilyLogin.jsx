import { useState } from 'react';
import Icon from '../shared/Icon.jsx';

const DEMO_ACCOUNTS = [
  { id: 'reeves', label: 'A. Reeves (Parent)', sub: 'Jordan · #23 · Guard', initials: 'AR', color: 'var(--court-navy)' },
  { id: 'chen',   label: 'L. Chen (Parent)',   sub: 'Maya · #7 · Guard',    initials: 'LC', color: '#1e3a8a' },
];

export default function FamilyLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoLogin = (id) => {
    setError('');
    setLoading(true);
    setTimeout(() => onLogin(id), 900);
  };

  function handleSignIn(e) {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }
    setError('');
    // Demo: match by prefix
    if (email.toLowerCase().includes('chen')) { demoLogin('chen'); return; }
    demoLogin('reeves');
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg, var(--court-navy) 0%, #0d2b52 55%, #152e54 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
      paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: '8%', right: '-8%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(255,199,44,0.07)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '8%', left: '-12%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(232,119,34,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        {/* Logo + wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 60, objectFit: 'contain', marginBottom: 12, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>
            FPYC Basketball
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 5, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Family Portal
          </div>
        </div>

        {/* Main card */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '28px 28px 24px', boxShadow: '0 28px 72px rgba(0,0,0,0.40)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 20 }}>
            Sign in
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              fontSize: 13, color: '#DC2626', display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <Icon name="alert-circle" size={14} color="#DC2626" />
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="parent@example.com"
                autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                onBlur={e => e.target.style.borderColor = '#E2E5EA'}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--court-navy)', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-body)', padding: 0 }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                  onBlur={e => e.target.style.borderColor = '#E2E5EA'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}
                >
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={16} color="#9CA3AF" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none', marginTop: 2,
                background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 160ms',
              }}
            >
              {loading
                ? <><Spinner /> Signing in…</>
                : <><Icon name="log-in" size={16} /> Sign in</>
              }
            </button>
          </form>

          <Divider label="or try a demo account" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {DEMO_ACCOUNTS.map(a => (
              <DemoBtn key={a.id} account={a} disabled={loading} onClick={() => demoLogin(a.id)} />
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div style={{ textAlign: 'center', marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="/register" style={{ fontSize: 13, color: 'var(--varsity-gold)', fontWeight: 700, textDecoration: 'none' }}>
            New to FPYC? Register your player →
          </a>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Fairfax Police Youth Club · 501(c)(3) nonprofit
          </div>
          <a href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
            ← Back to main site
          </a>
        </div>
      </div>
    </div>
  );
}

function DemoBtn({ account: a, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', padding: '10px 14px', borderRadius: 10,
        border: '1.5px solid #E2E5EA', background: '#F9FAFB', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
        fontFamily: 'var(--font-body)', transition: 'border-color 160ms, background 160ms',
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.borderColor = 'var(--court-navy)'; e.currentTarget.style.background = '#F0F4FF'; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E5EA'; e.currentTarget.style.background = '#F9FAFB'; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: a.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--varsity-gold)', letterSpacing: '0.02em',
      }}>
        {a.initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--court-navy)' }}>{a.label}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{a.sub}</div>
      </div>
      <Icon name="arrow-right" size={14} color="#9CA3AF" />
    </button>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 1, background: '#E2E5EA' }} />
      <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#E2E5EA' }} />
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
