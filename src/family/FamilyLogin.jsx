import { useState } from 'react';
import Icon from '../shared/Icon.jsx';

export default function FamilyLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const demoLogin = (who) => {
    setLoading(true);
    setTimeout(() => onLogin(who), 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--court-navy) 0%, #0d2b52 60%, #1a3a6b 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'var(--font-body)',
    }}>
      {/* Watermark glow */}
      <div style={{ position: 'fixed', top: '10%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,199,44,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '5%', left: '-15%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(232,119,34,0.05)', pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 64, objectFit: 'contain', marginBottom: 14 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>FPYC Basketball</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>Family Portal</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--court-navy)', marginBottom: 20 }}>Sign in</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="parent@example.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                onBlur={e => e.target.style.borderColor = '#E2E5EA'} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                onBlur={e => e.target.style.borderColor = '#E2E5EA'} />
            </div>
          </div>

          <button onClick={() => demoLogin('reeves')} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 10, border: 'none',
            background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12,
          }}>
            {loading ? 'Signing in…' : <><Icon name="log-in" size={16} /> Sign in</>}
          </button>

          <div style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>— or try a demo account —</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <DemoBtn icon="user" label="Sign in as A. Reeves" sub="Jordan · #23 · Guard" onClick={() => demoLogin('reeves')} />
            <DemoBtn icon="user" label="Sign in as L. Chen" sub="Maya · #7 · Guard" onClick={() => demoLogin('chen')} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Fairfax Police Youth Club · 501(c)(3) nonprofit<br />
          <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>Back to main site</a>
        </div>
      </div>
    </div>
  );
}

function DemoBtn({ icon, label, sub, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '10px 14px', borderRadius: 10,
      border: '1.5px solid #E2E5EA', background: '#F9FAFB', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
      fontFamily: 'var(--font-body)', transition: 'border-color 160ms',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--court-navy)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E5EA'}
    >
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={16} color="#fff" />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--court-navy)' }}>{label}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{sub}</div>
      </div>
      <Icon name="arrow-right" size={14} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
    </button>
  );
}

const labelStyle = { fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '0.04em', display: 'block', marginBottom: 6 };
const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)', color: '#111827', outline: 'none', transition: 'border-color 160ms' };
