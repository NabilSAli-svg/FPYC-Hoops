import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import RefGameDayView from './RefGameDayView.jsx';

const CREDENTIALS = { username: 'ref-admin', password: 'fpyc2025' };

export default function RefAdminApp() {
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (form.username === CREDENTIALS.username && form.password === CREDENTIALS.password) {
      setAuthed(true);
    } else {
      setError('Invalid credentials.');
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 28 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 44, objectFit: 'contain', marginBottom: 4 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', letterSpacing: '0.04em' }}>Officials Portal</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600 }}>Game-day tools for refs</div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Username">
              <input
                value={form.username}
                onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setError(''); }}
                placeholder="ref-admin"
                autoComplete="username"
                style={inputStyle}
              />
            </Field>
            <Field label="Password">
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={17} color="var(--fg-muted)" />
                </button>
              </div>
            </Field>
            {error && (
              <div style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="alert-circle" size={14} color="var(--foul-red)" /> {error}
              </div>
            )}
            <button type="submit" style={{
              marginTop: 4, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'var(--court-navy)', color: '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              transition: 'opacity 150ms',
            }}>
              Sign in
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(10,31,61,0.05)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Demo credentials</div>
            <div style={{ fontSize: 12, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>ref-admin · fpyc2025</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', fontFamily: 'var(--font-body)' }}>
      {/* Top bar */}
      <header style={{
        background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Officials Portal</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', marginTop: 2 }}>FPYC Basketball · Season 2025–26</div>
            </div>
          </div>
          <button onClick={() => setAuthed(false)} style={{
            all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)',
          }}>
            <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Sign out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 64px' }}>
        <RefGameDayView />
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--fg)', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box',
};
