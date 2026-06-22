import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import CoachHome from './CoachHome.jsx';
import CoachLineup from './CoachLineup.jsx';
import CoachPractice from './CoachPractice.jsx';
import CoachMessage from './CoachMessage.jsx';

const TEAMS = {
  '23boys': { id: '23boys',  name: 'Rising 2nd-3rd Boys', division: '3v3 Summer Cup',  coach: 'Nick Blessing',                    color: 'var(--court-navy)',       lineupKey: 'fpyc-lineup-starters-23boys'  },
  girls:    { id: 'girls',   name: 'Girls 3v3 (2nd-8th)', division: '3v3 Summer Cup',  coach: 'Coach',                            color: '#1F8A5B',                  lineupKey: 'fpyc-lineup-starters-girls'   },
  '45boys': { id: '45boys',  name: 'Rising 4th-5th Boys', division: '3v3 Summer Cup',  coach: 'Joshua Nehr, Jim Quinn & Shaun Ali', color: '#C8102E',                lineupKey: 'fpyc-lineup-starters-45boys'  },
  '68boys': { id: '68boys',  name: 'Rising 6th-8th Boys', division: '3v3 Summer Cup',  coach: 'Coach',                            color: 'var(--basketball-orange)', lineupKey: 'fpyc-lineup-starters-68boys'  },
  'ts-ab5': { id: 'ts-ab5',  name: 'Aidris B5',           division: 'Travel Select',   coach: 'Coach Aidris',                     color: '#7C3AED',                  lineupKey: 'fpyc-lineup-starters-ab5'     },
  'ts-tb6': { id: 'ts-tb6',  name: 'Tom B6',               division: 'Travel Select',   coach: 'Coach Tom',                        color: '#0369A1',                  lineupKey: 'fpyc-lineup-starters-tb6'     },
  'ts-mdg6':{ id: 'ts-mdg6', name: 'Mike Do G6',           division: 'Travel Select',   coach: 'Mike Do',                          color: '#059669',                  lineupKey: 'fpyc-lineup-starters-mdg6'    },
  'ts-eg7': { id: 'ts-eg7',  name: 'Earnest G7',           division: 'Travel Select',   coach: 'Coach Earnest',                    color: '#D97706',                  lineupKey: 'fpyc-lineup-starters-eg7'     },
  'ts-rb7': { id: 'ts-rb7',  name: 'Rene B7',              division: 'Travel Select',   coach: 'Coach Rene',                       color: '#BE185D',                  lineupKey: 'fpyc-lineup-starters-rb7'     },
  'ts-mlb8':{ id: 'ts-mlb8', name: 'Mike Lee B8',          division: 'Travel Select',   coach: 'Mike Lee',                         color: '#1D4ED8',                  lineupKey: 'fpyc-lineup-starters-mlb8'    },
  'ts-kb82':{ id: 'ts-kb82', name: 'Keun B8-2',            division: 'Travel Select',   coach: 'Coach Keun',                       color: '#374151',                  lineupKey: 'fpyc-lineup-starters-kb82'    },
};
const CREDENTIALS = { password: 'fpyc2025' };

const TABS = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'lineup',   label: 'Lineup',   icon: 'layout-list' },
  { id: 'practice', label: 'Practice', icon: 'clipboard-list' },
  { id: 'message',  label: 'Message',  icon: 'send' },
];

export default function CoachApp() {
  const [tab, setTab] = useState('home');
  const [team, setTeam] = useState(null);
  const [form, setForm] = useState({ teamId: 'hawks', password: '' });
  const [error, setError] = useState('');

  function handleLogin() {
    if (form.password === CREDENTIALS.password) {
      setTeam(TEAMS[form.teamId]);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  }

  if (!team) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {/* Logo + title */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 56, objectFit: 'contain', marginBottom: 16 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
              Coach Portal
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6, letterSpacing: '0.04em' }}>
              FPYC Basketball
            </div>
          </div>

          {/* Login card */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', display: 'block', marginBottom: 7 }}>
                Select Team
              </label>
              <select
                value={form.teamId}
                onChange={e => setForm(f => ({ ...f, teamId: e.target.value }))}
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '11px 14px',
                  borderRadius: 9, border: '1.5px solid #E2E5EA',
                  fontSize: 14, fontFamily: 'var(--font-body)', color: '#111',
                  outline: 'none', background: '#fff', cursor: 'pointer',
                }}
              >
                {Object.values(TEAMS).map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', display: 'block', marginBottom: 7 }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                placeholder="Enter password…"
                style={{
                  width: '100%', boxSizing: 'border-box', padding: '11px 14px',
                  borderRadius: 9, border: `1.5px solid ${error ? '#DC2626' : '#E2E5EA'}`,
                  fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none',
                }}
              />
              {error && (
                <div style={{ marginTop: 6, fontSize: 12, color: '#DC2626', fontWeight: 600 }}>{error}</div>
              )}
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                background: 'var(--court-navy)', color: '#fff',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Icon name="log-in" size={16} color="#fff" />
              Sign In
            </button>

            <div style={{ marginTop: 18, padding: '10px 14px', background: '#F9FAFB', borderRadius: 8, fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
              Demo credential — password: <span style={{ fontWeight: 700, color: '#374151' }}>fpyc2025</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        background: 'var(--court-navy)',
        borderBottom: '3px solid var(--varsity-gold)',
        position: 'sticky', top: 0, zIndex: 50,
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>
                {team.name}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>Coach Portal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{team.coach}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{team.division}</div>
            </div>
            <button
              onClick={() => { setTeam(null); setForm({ teamId: 'hawks', password: '' }); }}
              style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 7, padding: '5px 10px', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 640, width: '100%', margin: '0 auto', padding: '20px 16px', paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}>
        {tab === 'home'     && <CoachHome team={team} />}
        {tab === 'lineup'   && <CoachLineup team={team} />}
        {tab === 'practice' && <CoachPractice team={team} />}
        {tab === 'message'  && <CoachMessage team={team} />}
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #E2E5EA',
        display: 'flex', zIndex: 50,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 8px 12px', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? 'var(--court-navy)' : '#9CA3AF',
              transition: 'color 160ms', position: 'relative',
            }}>
              {active && (
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 3, background: 'var(--varsity-gold)', borderRadius: '0 0 3px 3px' }} />
              )}
              <Icon name={t.icon} size={22} color={active ? 'var(--court-navy)' : '#9CA3AF'} />
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, letterSpacing: '0.02em' }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
