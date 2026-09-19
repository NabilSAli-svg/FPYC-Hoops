import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import CoachHome from './CoachHome.jsx';
import CoachLineup from './CoachLineup.jsx';
import CoachPractice from './CoachPractice.jsx';
import CoachMessage from './CoachMessage.jsx';
import { supabase } from '../shared/supabase.js';

// Roles allowed to open a team in the coach portal.
const COACH_ROLES = ['coach', 'league_director', 'admin'];

const TEAMS = {
  // ── Winter 2026–27 · Rec ───────────────────────────────────────────────────
  'k3-3v3': { id: 'k3-3v3', name: 'K-3 3v3',    division: 'Winter Rec', coach: 'Coach', color: '#0891B2',           lineupKey: 'fpyc-lineup-starters-k3',      password: 'k3hoops27'   },
  '34boys': { id: '34boys', name: '3/4 Boys',   division: 'Winter Rec', coach: 'Coach', color: 'var(--court-navy)', lineupKey: 'fpyc-lineup-starters-34boys',  password: 'boys34win'   },
  '34girls':{ id: '34girls',name: '3/4 Girls',  division: 'Winter Rec', coach: 'Coach', color: '#BE185D',           lineupKey: 'fpyc-lineup-starters-34girls', password: 'girls34win'  },
  '56boys': { id: '56boys', name: '5/6 Boys',   division: 'Winter Rec', coach: 'Coach', color: '#1D4ED8',           lineupKey: 'fpyc-lineup-starters-56boys',  password: 'boys56win'   },
  '56girls':{ id: '56girls',name: '5/6 Girls',  division: 'Winter Rec', coach: 'Coach', color: '#DB2777',           lineupKey: 'fpyc-lineup-starters-56girls', password: 'girls56win'  },
  '78boys': { id: '78boys', name: '7/8 Boys',   division: 'Winter Rec', coach: 'Coach', color: '#C8102E',           lineupKey: 'fpyc-lineup-starters-78boys',  password: 'boys78win'   },
  '78girls':{ id: '78girls',name: '7/8 Girls',  division: 'Winter Rec', coach: 'Coach', color: '#9333EA',           lineupKey: 'fpyc-lineup-starters-78girls', password: 'girls78win'  },
  'hsboys': { id: 'hsboys', name: 'HS Boys',    division: 'Winter Rec', coach: 'Coach', color: '#111827',           lineupKey: 'fpyc-lineup-starters-hsboys',  password: 'hsboyswin'   },
  'hsgirls':{ id: 'hsgirls',name: 'HS Girls',   division: 'Winter Rec', coach: 'Coach', color: '#7C3AED',           lineupKey: 'fpyc-lineup-starters-hsgirls', password: 'hsgirlswin'  },

  // ── Winter 2026–27 · Select ────────────────────────────────────────────────
  'sel-5b': { id: 'sel-5b', name: '5th Boys Select',  division: 'Winter Select', coach: 'Coach', color: '#0369A1', lineupKey: 'fpyc-lineup-starters-sel5b', password: 'sel5boys27'  },
  'sel-5g': { id: 'sel-5g', name: '5th Girls Select', division: 'Winter Select', coach: 'Coach', color: '#E11D48', lineupKey: 'fpyc-lineup-starters-sel5g', password: 'sel5girls27' },
  'sel-6b': { id: 'sel-6b', name: '6th Boys Select',  division: 'Winter Select', coach: 'Coach', color: '#047857', lineupKey: 'fpyc-lineup-starters-sel6b', password: 'sel6boys27'  },
  'sel-6g': { id: 'sel-6g', name: '6th Girls Select', division: 'Winter Select', coach: 'Coach', color: '#A21CAF', lineupKey: 'fpyc-lineup-starters-sel6g', password: 'sel6girls27' },
  'sel-7b': { id: 'sel-7b', name: '7th Boys Select',  division: 'Winter Select', coach: 'Coach', color: '#B45309', lineupKey: 'fpyc-lineup-starters-sel7b', password: 'sel7boys27'  },
  'sel-7g': { id: 'sel-7g', name: '7th Girls Select', division: 'Winter Select', coach: 'Coach', color: '#BE123C', lineupKey: 'fpyc-lineup-starters-sel7g', password: 'sel7girls27' },
  'sel-8b': { id: 'sel-8b', name: '8th Boys Select',  division: 'Winter Select', coach: 'Coach', color: '#1E40AF', lineupKey: 'fpyc-lineup-starters-sel8b', password: 'sel8boys27'  },
  'sel-8g': { id: 'sel-8g', name: '8th Girls Select', division: 'Winter Select', coach: 'Coach', color: '#86198F', lineupKey: 'fpyc-lineup-starters-sel8g', password: 'sel8girls27' },

  // ── Fall Skills Clinic ────────────────────────────────────────────────────
  'fc-beg': { id: 'fc-beg', name: 'Training - Beginner',     division: 'Fall Skills Clinic', coach: 'Coach', color: '#0D9488', lineupKey: 'fpyc-lineup-starters-fcbeg', password: 'fcbeginner27' },
  'fc-int': { id: 'fc-int', name: 'Training - Intermediate', division: 'Fall Skills Clinic', coach: 'Coach', color: '#CA8A04', lineupKey: 'fpyc-lineup-starters-fcint', password: 'fcinter27'   },
  'fc-adv': { id: 'fc-adv', name: 'Training - Advanced',     division: 'Fall Skills Clinic', coach: 'Coach', color: '#DC2626', lineupKey: 'fpyc-lineup-starters-fcadv', password: 'fcadvanced27'},

  // ── Archived · Summer 2026 (logins still work for past-season review) ──────
  '23boys': { id: '23boys',  name: 'Rising 2nd-3rd Boys', division: '3v3 Summer Cup',  coach: 'Nick Blessing',                      color: 'var(--court-navy)',       lineupKey: 'fpyc-lineup-starters-23boys',  password: 'nick2025'    },
  girls:    { id: 'girls',   name: 'Girls 3v3 (2nd-8th)', division: '3v3 Summer Cup',  coach: 'Coach',                              color: '#1F8A5B',                  lineupKey: 'fpyc-lineup-starters-girls',   password: 'girls2025'   },
  '45boys': { id: '45boys',  name: 'Rising 4th-5th Boys', division: '3v3 Summer Cup',  coach: 'Joshua Nehr, Jim Quinn & Shaun Ali', color: '#C8102E',                  lineupKey: 'fpyc-lineup-starters-45boys',  password: 'rising2025'  },
  '68boys': { id: '68boys',  name: 'Rising 6th-8th Boys', division: '3v3 Summer Cup',  coach: 'Coach',                              color: 'var(--basketball-orange)', lineupKey: 'fpyc-lineup-starters-68boys',  password: 'rising682025'},
  'ts-ab5': { id: 'ts-ab5',  name: 'Aidris B5',           division: 'Travel Select',   coach: 'Coach Aidris',                       color: '#7C3AED',                  lineupKey: 'fpyc-lineup-starters-ab5',     password: 'aidris2025'  },
  'ts-tb6': { id: 'ts-tb6',  name: 'Tom B6',               division: 'Travel Select',   coach: 'Coach Tom',                          color: '#0369A1',                  lineupKey: 'fpyc-lineup-starters-tb6',     password: 'tom2025'     },
  'ts-mdg6':{ id: 'ts-mdg6', name: 'Mike Do G6',           division: 'Travel Select',   coach: 'Mike Do',                            color: '#059669',                  lineupKey: 'fpyc-lineup-starters-mdg6',    password: 'mikedo2025'  },
  'ts-eg7': { id: 'ts-eg7',  name: 'Earnest G7',           division: 'Travel Select',   coach: 'Coach Earnest',                      color: '#D97706',                  lineupKey: 'fpyc-lineup-starters-eg7',     password: 'earnest2025' },
  'ts-rb7': { id: 'ts-rb7',  name: 'Rene B7',              division: 'Travel Select',   coach: 'Coach Rene',                         color: '#BE185D',                  lineupKey: 'fpyc-lineup-starters-rb7',     password: 'rene2025'    },
  'ts-mlb8':{ id: 'ts-mlb8', name: 'Mike Lee B8',          division: 'Travel Select',   coach: 'Mike Lee',                           color: '#1D4ED8',                  lineupKey: 'fpyc-lineup-starters-mlb8',    password: 'mikele2025'  },
  'ts-kb82':{ id: 'ts-kb82', name: 'Keun B8-2',            division: 'Travel Select',   coach: 'Coach Keun',                         color: '#374151',                  lineupKey: 'fpyc-lineup-starters-kb82',    password: 'keun2025'    },
};

const labelSt = { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', display: 'block', marginBottom: 7 };
const errSt   = { marginTop: 6, fontSize: 12, color: '#DC2626', fontWeight: 600 };
const inputSt = (error) => ({
  width: '100%', boxSizing: 'border-box', padding: '11px 14px',
  borderRadius: 9, border: `1.5px solid ${error ? '#DC2626' : '#E2E5EA'}`,
  fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none',
});

const TABS = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'lineup',   label: 'Lineup',   icon: 'layout-list' },
  { id: 'practice', label: 'Practice', icon: 'clipboard-list' },
  { id: 'message',  label: 'Message',  icon: 'send' },
];

export default function CoachApp() {
  const [tab, setTab] = useState('home');
  const [team, setTeam] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [mode, setMode] = useState('account'); // 'account' | 'teamcode'
  const [acctEmail, setAcctEmail] = useState('');
  const [acctPassword, setAcctPassword] = useState('');

  async function handleLogin() {
    const pw = password.trim();
    if (!pw) return;
    setLoading(true);
    setError('');
    try {
      const { data, error: rpcError } = await supabase.rpc('coach_login', { p_password: pw });
      if (rpcError) throw rpcError;
      if (data && data.length > 0) {
        const row = data[0];
        const teamDef = TEAMS[row.team_id];
        setTeam({ ...teamDef, _teamId: row.team_id, _password: pw });
      } else {
        // Fallback to hardcoded while migration is being applied
        const matched = Object.values(TEAMS).find(t => t.password === pw);
        if (matched) {
          setTeam({ ...matched, _teamId: matched.id, _password: pw });
        } else {
          setError('Incorrect password. Contact the commissioner if you need access.');
        }
      }
    } catch {
      // Fallback to hardcoded if Supabase unavailable
      const matched = Object.values(TEAMS).find(t => t.password === pw);
      if (matched) {
        setTeam({ ...matched, _teamId: matched.id, _password: pw });
      } else {
        setError('Incorrect password. Contact the commissioner if you need access.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Resolve a signed-in Supabase account to its coach team.
  async function teamFromProfile(userId) {
    const { data: profile } = await supabase
      .from('profiles').select('role, team, parent_name, email').eq('id', userId).single();
    if (!profile) return { error: 'No profile found for this account.' };
    if (!COACH_ROLES.includes(profile.role)) {
      return { error: 'This account is not set up as a coach. Ask an admin for access.' };
    }
    if (!profile.team) return { error: 'No team assigned to your account yet. Ask the commissioner.' };
    const def = Object.values(TEAMS).find(t => t.name === profile.team);
    if (!def) return { error: `Your assigned team (${profile.team}) is not active this season.` };
    return { team: { ...def, _teamId: def.id, _account: profile.email || profile.parent_name } };
  }

  async function handleAccountLogin() {
    if (!acctEmail.trim() || !acctPassword) { setError('Email and password are required.'); return; }
    setLoading(true); setError('');
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email: acctEmail.trim(), password: acctPassword,
    });
    if (authErr) { setLoading(false); setError(authErr.message); return; }
    const res = await teamFromProfile(data.user.id);
    setLoading(false);
    if (res.error) { await supabase.auth.signOut(); setError(res.error); return; }
    setTeam(res.team);
  }

  if (!team) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 56, objectFit: 'contain', marginBottom: 16 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
              Coach Portal
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6, letterSpacing: '0.04em' }}>
              FPYC Basketball
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
            {/* Mode switch */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E2E5EA', marginBottom: 20 }}>
              {[{ id: 'account', label: 'My account' }, { id: 'teamcode', label: 'Team code' }].map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); setError(''); }} style={{
                  flex: 1, padding: '8px 4px', border: 'none', background: 'transparent', cursor: 'pointer',
                  borderBottom: `2px solid ${mode === m.id ? 'var(--court-navy)' : 'transparent'}`,
                  color: mode === m.id ? 'var(--court-navy)' : '#9CA3AF',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, marginBottom: -1,
                }}>{m.label}</button>
              ))}
            </div>

            {mode === 'account' ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelSt}>Email</label>
                  <input
                    type="email" value={acctEmail} autoComplete="email"
                    onChange={e => { setAcctEmail(e.target.value); setError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') handleAccountLogin(); }}
                    placeholder="you@example.com" autoFocus
                    style={inputSt(error)}
                  />
                </div>
                <div style={{ marginBottom: 22 }}>
                  <label style={labelSt}>Password</label>
                  <input
                    type="password" value={acctPassword} autoComplete="current-password"
                    onChange={e => { setAcctPassword(e.target.value); setError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') handleAccountLogin(); }}
                    placeholder="••••••••"
                    style={inputSt(error)}
                  />
                  {error && <div style={errSt}>{error}</div>}
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 22 }}>
                <label style={labelSt}>Team Code</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                  placeholder="Enter your team code…"
                  autoFocus
                  style={inputSt(error)}
                />
                {error && <div style={errSt}>{error}</div>}
              </div>
            )}

            <button
              onClick={mode === 'account' ? handleAccountLogin : handleLogin}
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <Icon name="log-in" size={16} color="#fff" />
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <div style={{ marginTop: 16, fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.5 }}>
              {mode === 'account'
                ? 'Use the same email and password as the family portal. Ask the commissioner to grant coach access.'
                : 'Shared code from the commissioner — everyone on the team uses the same one.'}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{team.coach}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{team.division}</div>
            </div>
            <button
              onClick={() => setShowChangePassword(true)}
              title="Change password"
              style={{
                background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 7, padding: '5px 8px', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
              }}
            >
              <Icon name="key" size={14} color="rgba(255,255,255,0.75)" />
            </button>
            <button
              onClick={() => { setTeam(null); setPassword(''); setError(''); }}
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

      {/* Change password modal */}
      {showChangePassword && (
        <ChangePasswordModal
          team={team}
          onClose={() => setShowChangePassword(false)}
          onChanged={(newPw) => { setTeam(t => ({ ...t, _password: newPw })); setShowChangePassword(false); }}
        />
      )}

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

function ChangePasswordModal({ team, onClose, onChanged }) {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    setError('');
    if (newPw.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (newPw !== confirm) { setError('Passwords do not match.'); return; }
    setSaving(true);
    try {
      const { data, error: rpcError } = await supabase.rpc('coach_change_password', {
        p_team_id: team._teamId,
        p_old_password: oldPw,
        p_new_password: newPw,
      });
      if (rpcError) throw rpcError;
      if (data === true) {
        setSuccess(true);
        setTimeout(() => onChanged(newPw), 1200);
      } else {
        setError('Current password is incorrect.');
      }
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '28px 24px', width: '100%', maxWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Icon name="key" size={18} color="var(--court-navy)" />
          <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--court-navy)' }}>Change Password</div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', marginLeft: 'auto', color: '#9CA3AF' }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: '#059669', fontWeight: 700, fontSize: 15 }}>
            ✓ Password updated successfully!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PwField label="Current password" value={oldPw} onChange={setOldPw} />
            <PwField label="New password" value={newPw} onChange={setNewPw} hint="Minimum 6 characters" />
            <PwField label="Confirm new password" value={confirm} onChange={setConfirm} />
            {error && <div style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>{error}</div>}
            <button
              onClick={handleSave}
              disabled={saving || !oldPw || !newPw || !confirm}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                background: saving || !oldPw || !newPw || !confirm ? '#E2E5EA' : 'var(--court-navy)',
                color: saving || !oldPw || !newPw || !confirm ? '#9CA3AF' : '#fff',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                cursor: saving || !oldPw || !newPw || !confirm ? 'not-allowed' : 'pointer', marginTop: 4,
              }}
            >
              {saving ? 'Saving…' : 'Update Password'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PwField({ label, value, onChange, hint }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 5 }}>{label}</label>
      <input
        type="password"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E2E5EA', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', color: '#111' }}
        onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
        onBlur={e => e.target.style.borderColor = '#E2E5EA'}
      />
      {hint && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{hint}</div>}
    </div>
  );
}
