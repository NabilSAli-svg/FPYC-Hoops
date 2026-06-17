import { useState, useEffect } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill, Avatar } from '../shared/index.js';
import { TEAM_INFO, TEAMS_INFO, useStaff, usePlayers } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';

const NOTIF_GROUPS = [
  {
    label: 'Game day',
    items: [
      { id: 'game_reminder',  label: 'Game reminders',       sub: '48h and 24h before tip-off', email: true,  sms: true  },
      { id: 'rsvp_update',    label: 'RSVP updates',         sub: 'When a player responds',      email: true,  sms: false },
      { id: 'lineup_confirm', label: 'Lineup confirmations', sub: 'After lineup is saved',        email: false, sms: false },
    ],
  },
  {
    label: 'Roster',
    items: [
      { id: 'new_player',     label: 'New player added',     sub: 'When director adds a player', email: true,  sms: false },
      { id: 'waiver_missing', label: 'Missing waivers',      sub: 'Alert before game day',        email: true,  sms: true  },
      { id: 'status_change',  label: 'Player status change', sub: 'Active / inactive updates',    email: true,  sms: false },
    ],
  },
  {
    label: 'League',
    items: [
      { id: 'commissioner',   label: 'Commissioner messages', sub: 'From league office',         email: true,  sms: false },
      { id: 'schedule_change',label: 'Schedule changes',      sub: 'Location / time updates',    email: true,  sms: true  },
    ],
  },
];

export default function SettingsView({ profile, role }) {
  const [tab, setTab] = useState('team');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[
          { id: 'team',    label: 'Team Info',   icon: 'shield' },
          { id: 'teams',   label: 'All Teams',   icon: 'layers' },
          { id: 'coaches', label: 'Coaches & Permissions', icon: 'key' },
          { id: 'notifs',  label: 'Notifications', icon: 'bell' },
          { id: 'account', label: 'Account',     icon: 'user' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
            color: tab === t.id ? 'var(--court-navy)' : 'var(--fg-muted)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginBottom: -1,
          }}>
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'team'    && <TeamInfoTab />}
      {tab === 'teams'   && <TeamsTab />}
      {tab === 'coaches' && <CoachesTab />}
      {tab === 'notifs'  && <NotificationsTab />}
      {tab === 'account' && <AccountTab profile={profile} role={role} />}
    </div>
  );
}

const DIVISIONS = ['Boys K–2 House', 'Girls K–2 House', 'Boys 3–4 House', 'Girls 3–4 House', 'Boys 5–6 House', 'Girls 5–6 House', 'Boys 7–8 House', 'Girls 7–8 House', 'Boys 3–4 Select', 'Boys 5–6 Select', 'Boys 7–8 Select', 'Girls 5–6 Select', 'Girls 7–8 Select'];

function TeamInfoTab() {
  const [info, setInfo] = useState({
    name:       TEAM_INFO.name,
    division:   TEAM_INFO.division,
    season:     'Season 2025–26',
    homeGym:    'Robinson Secondary · Gym B',
    homeGymAddr:'5035 Sideburn Rd, Fairfax, VA 22032',
    jerseyHome: 'Navy (#0A1F3D)',
    jerseyAway: 'White',
    rosterLimit: '15',
    quarterLen:  '8',
    coach:      TEAM_INFO.coach,
    coachEmail: TEAM_INFO.coachEmail,
    coachPhone: '(703) 555-0210',
    seasonStart:'Sat, Dec 7, 2025',
    seasonEnd:  'Sat, Feb 22, 2026',
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const set = (key, val) => setInfo(i => ({ ...i, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      {/* Identity */}
      <Card padding={22}>
        <Eyebrow style={{ marginBottom: 16 }}>Team identity</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Team name" value={info.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Division</div>
            <select
              value={info.division}
              onChange={e => set('division', e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, background: 'var(--bone)', color: 'var(--fg)', outline: 'none' }}
            >
              {DIVISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <InputField label="Season" value={info.season} onChange={e => set('season', e.target.value)} />
          <InputField label="Season start" value={info.seasonStart} onChange={e => set('seasonStart', e.target.value)} />
          <InputField label="Season end" value={info.seasonEnd} onChange={e => set('seasonEnd', e.target.value)} />
        </div>
      </Card>

      {/* Gym & jerseys */}
      <Card padding={22}>
        <Eyebrow style={{ marginBottom: 16 }}>Home gym & jerseys</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Home gym" value={info.homeGym} onChange={e => set('homeGym', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Gym address" value={info.homeGymAddr} onChange={e => set('homeGymAddr', e.target.value)} />
          </div>
          <div>
            <InputField label="Home jersey" value={info.jerseyHome} onChange={e => set('jerseyHome', e.target.value)} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0A1F3D', border: '1px solid var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Worn for home games</span>
            </div>
          </div>
          <div>
            <InputField label="Away jersey" value={info.jerseyAway} onChange={e => set('jerseyAway', e.target.value)} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: '#fff', border: '1.5px solid var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Worn for away games</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Game format */}
      <Card padding={22}>
        <Eyebrow style={{ marginBottom: 16 }}>Game format</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <InputField label="Roster limit" value={info.rosterLimit} onChange={e => set('rosterLimit', e.target.value)} />
          <InputField label="Quarter length (min)" value={info.quarterLen} onChange={e => set('quarterLen', e.target.value)} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Format</div>
            <select style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, background: 'var(--bone)', color: 'var(--fg)', outline: 'none' }}>
              <option>4 quarters</option>
              <option>2 halves</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Coach contact */}
      <Card padding={22}>
        <Eyebrow style={{ marginBottom: 16 }}>Head coach contact</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <InputField label="Name" value={info.coach} onChange={e => set('coach', e.target.value)} />
          <InputField label="Phone" value={info.coachPhone} onChange={e => set('coachPhone', e.target.value)} />
          <div style={{ gridColumn: '1 / -1' }}>
            <InputField label="Email" value={info.coachEmail} onChange={e => set('coachEmail', e.target.value)} type="email" />
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button kind="gold" icon={saved ? 'check' : 'save'} onClick={handleSave}>
          {saved ? 'Saved!' : 'Save team info'}
        </Button>
      </div>

      {saved && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, zIndex: 300, boxShadow: 'var(--shadow-3)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> Team info saved
        </div>
      )}
    </div>
  );
}

function TeamsTab() {
  const [players] = usePlayers();

  const teams = Object.values(TEAMS_INFO).map(t => ({
    ...t,
    players: players.filter(p => p.team === t.name).length,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Display size={22}>All teams</Display>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{teams.length} teams across the program</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {teams.map(team => (
          <Card key={team.id} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Display size={22}>{team.name}</Display>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{team.division}</div>
              </div>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
            </div>
            <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="user" size={14} color="var(--fg-muted)" />
                <span>{team.coach}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="users" size={14} color="var(--fg-muted)" />
                <span>{team.players} players</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const ALL_TEAM_OPTIONS = Object.keys(TEAMS_INFO);

function CoachesTab() {
  const [staff] = useStaff();
  const [profiles, setProfiles] = useState({});
  const [busyEmail, setBusyEmail] = useState(null);

  useEffect(() => {
    supabase.from('profiles').select('id,email,role,team').then(({ data, error }) => {
      if (error) { console.error('[supabase] fetch profiles:', error.message); return; }
      const map = {};
      (data || []).forEach(p => { map[(p.email || '').toLowerCase()] = p; });
      setProfiles(map);
    });
  }, []);

  // Group staff by email; coaches with no email get a unique key per id.
  const people = [];
  const seen = new Map();
  for (const s of staff) {
    const key = s.email ? s.email.toLowerCase() : `__noemail__${s.id}`;
    if (seen.has(key)) {
      const existing = seen.get(key);
      if (!existing.roles.includes(s.role)) existing.roles.push(s.role);
      if (s.team && !existing.teams.includes(s.team)) existing.teams.push(s.team);
    } else {
      const entry = { id: s.id, name: s.name, email: s.email || '', phone: s.phone, roles: [s.role], teams: s.team ? [s.team] : [], program: s.program };
      seen.set(key, entry);
      people.push(entry);
    }
  }

  async function setCoachRole(email, newRole) {
    const key = email.toLowerCase();
    const profile = profiles[key];
    if (!profile) return;
    setBusyEmail(key);
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', profile.id);
    if (error) {
      console.error('[supabase] update profile role:', error.message);
    } else {
      setProfiles(p => ({ ...p, [key]: { ...profile, role: newRole } }));
    }
    setBusyEmail(null);
  }

  async function setCoachTeam(email, team) {
    const key = email.toLowerCase();
    const profile = profiles[key];
    if (!profile) return;
    const { error } = await supabase.from('profiles').update({ team, role: 'coach' }).eq('id', profile.id);
    if (error) {
      console.error('[supabase] update profile team:', error.message);
    } else {
      setProfiles(p => ({ ...p, [key]: { ...profile, team, role: 'coach' } }));
    }
  }

  const PROGRAM_ORDER = ['Recreation', 'Select', 'Training'];
  const grouped = PROGRAM_ORDER.map(prog => ({
    label: prog,
    rows: people.filter(p => p.program === prog),
  })).filter(g => g.rows.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Display size={22}>Coaches & staff</Display>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
          Manage coach app access and team assignments. Coaches log in at /admin with their email and password.
        </div>
      </div>

      {grouped.map(group => (
        <div key={group.label}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>{group.label}</div>
          <Card padding={0}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `220px 1fr 180px 120px 80px`,
              padding: '10px 18px',
              background: 'var(--bone)',
              borderBottom: '1px solid var(--border)',
              fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700, gap: 8,
            }}>
              <div>Name</div>
              <div>Role & teams</div>
              <div>Assigned team</div>
              <div>Account</div>
              <div style={{ textAlign: 'center' }}>Admin</div>
            </div>

            {group.rows.map((person, i) => {
              const key = person.email ? person.email.toLowerCase() : `__noemail__${person.id}`;
              const profile = person.email ? profiles[person.email.toLowerCase()] : null;
              const isAdmin = profile?.role === 'commissioner';
              const isCoach = profile?.role === 'coach';
              const hasAccess = isAdmin || isCoach;
              return (
                <div key={key} style={{
                  display: 'grid',
                  gridTemplateColumns: `220px 1fr 180px 120px 80px`,
                  padding: '14px 18px',
                  borderBottom: i < group.rows.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'center', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={person.name} size={32} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{person.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{person.email || <span style={{ fontStyle: 'italic' }}>no email</span>}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {person.roles.map(r => <Pill key={r} kind="neutral">{r}</Pill>)}
                    {person.teams.map(t => <Pill key={t} kind="navy">{t}</Pill>)}
                  </div>

                  {/* Team assignment dropdown — only meaningful if they have/will have coach access */}
                  <div>
                    {profile && !isAdmin ? (
                      <select
                        value={profile.team || ''}
                        onChange={e => setCoachTeam(person.email, e.target.value)}
                        style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--fg)', width: '100%' }}
                      >
                        <option value="">— unassigned —</option>
                        {ALL_TEAM_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : profile && isAdmin ? (
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>All teams</span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>—</span>
                    )}
                  </div>

                  <div>
                    {profile
                      ? <Pill kind={isAdmin ? 'gold' : hasAccess ? 'navy' : 'neutral'}>{isAdmin ? 'admin' : isCoach ? 'coach' : profile.role}</Pill>
                      : <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{person.email ? 'No account' : 'Needs email'}</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {isAdmin ? (
                      <button
                        onClick={() => setCoachRole(person.email, 'coach')}
                        disabled={busyEmail === key}
                        title="Revoke admin — demote to coach"
                        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(31,138,91,0.12)', color: 'var(--status-win)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="check" size={14} />
                      </button>
                    ) : isCoach ? (
                      <button
                        onClick={() => setCoachRole(person.email, 'commissioner')}
                        disabled={busyEmail === key}
                        title="Promote to admin"
                        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="chevron-up" size={14} />
                      </button>
                    ) : (
                      <button
                        disabled
                        title={person.email ? 'No account yet — coach must sign up first' : 'Add an email address to enable login'}
                        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'default', background: 'var(--bone)', color: 'var(--fg-muted)', opacity: 0.4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="minus" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}

function TestSendCard() {
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [status, setStatus] = useState({ email: '', sms: '' });
  const [busy, setBusy] = useState({ email: false, sms: false });

  async function describeError(error, data) {
    if (error?.context) {
      try {
        const body = await error.context.clone().json();
        return JSON.stringify(body.error || body);
      } catch {
        try { return await error.context.clone().text(); } catch { /* fall through */ }
      }
    }
    if (data?.error) return JSON.stringify(data.error);
    return error?.message || 'Send failed';
  }

  async function sendTestEmail() {
    if (!testEmail.trim()) return;
    setBusy(b => ({ ...b, email: true }));
    setStatus(s => ({ ...s, email: '' }));
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to: testEmail.trim(), subject: 'FPYC Hoops test email', text: 'This is a test email from the FPYC Hoops admin console.' },
      });
      if (error || data?.success === false) throw new Error(await describeError(error, data));
      setStatus(s => ({ ...s, email: 'Test email sent!' }));
    } catch (err) {
      setStatus(s => ({ ...s, email: `Failed: ${err.message || err}` }));
    } finally {
      setBusy(b => ({ ...b, email: false }));
    }
  }

  async function sendTestSms() {
    if (!testPhone.trim()) return;
    setBusy(b => ({ ...b, sms: true }));
    setStatus(s => ({ ...s, sms: '' }));
    try {
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: { to: testPhone.trim(), body: 'This is a test text from the FPYC Hoops admin console.' },
      });
      if (error || data?.success === false) throw new Error(await describeError(error, data));
      setStatus(s => ({ ...s, sms: 'Test text sent!' }));
    } catch (err) {
      setStatus(s => ({ ...s, sms: `Failed: ${err.message || err}` }));
    } finally {
      setBusy(b => ({ ...b, sms: false }));
    }
  }

  return (
    <Card>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Send a test message</div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 12 }}>Verify your email and SMS providers are working.</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }} placeholder="test@example.com" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
            <Button kind="quiet" icon="mail" disabled={busy.email || !testEmail.trim()} onClick={sendTestEmail}>{busy.email ? 'Sending…' : 'Send test email'}</Button>
          </div>
          {status.email && <div style={{ fontSize: 12, marginTop: 6, color: status.email.startsWith('Failed') ? 'var(--basketball-orange)' : 'var(--fg-muted)' }}>{status.email}</div>}
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }} placeholder="(703) 555-0123" value={testPhone} onChange={e => setTestPhone(e.target.value)} />
            <Button kind="quiet" icon="message-circle" disabled={busy.sms || !testPhone.trim()} onClick={sendTestSms}>{busy.sms ? 'Sending…' : 'Send test text'}</Button>
          </div>
          {status.sms && <div style={{ fontSize: 12, marginTop: 6, color: status.sms.startsWith('Failed') ? 'var(--basketball-orange)' : 'var(--fg-muted)' }}>{status.sms}</div>}
        </div>
      </div>
    </Card>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState(() => {
    const map = {};
    NOTIF_GROUPS.forEach(g => g.items.forEach(item => {
      map[item.id] = { email: item.email, sms: item.sms };
    }));
    return map;
  });

  const toggle = (id, channel) => {
    setPrefs(prev => ({ ...prev, [id]: { ...prev[id], [channel]: !prev[id][channel] } }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <div>
        <Display size={22}>Notification preferences</Display>
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>Choose how and when you receive alerts for your team.</div>
      </div>

      {/* Channel info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(10,31,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="mail" size={20} color="var(--court-navy)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Email</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>mdavis@example.com</div>
            <Button kind="quiet" size="sm" style={{ marginTop: 6, padding: 0, fontSize: 12 }}>Change email</Button>
          </div>
        </Card>
        <Card style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(232,119,34,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="message-circle" size={20} color="var(--basketball-orange)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Text / SMS</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>(703) 555-0210</div>
            <Button kind="quiet" size="sm" style={{ marginTop: 6, padding: 0, fontSize: 12 }}>Change phone</Button>
          </div>
        </Card>
      </div>

      <TestSendCard />

      {/* Preference table */}
      {NOTIF_GROUPS.map(group => (
        <div key={group.label}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>{group.label}</div>
          <Card padding={0}>
            {group.items.map((item, i) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderBottom: i < group.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Toggle label="Email" on={prefs[item.id]?.email} onToggle={() => toggle(item.id, 'email')} />
                  <Toggle label="SMS" on={prefs[item.id]?.sms} onToggle={() => toggle(item.id, 'sms')} orange />
                </div>
              </div>
            ))}
          </Card>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button kind="gold" icon="save">Save preferences</Button>
      </div>
    </div>
  );
}

function AccountTab({ profile: authProfile, role }) {
  const [account, setAccount] = useState({
    name: authProfile?.parent_name || authProfile?.first_name || '',
    email: authProfile?.email || '',
    phone: authProfile?.phone || '',
  });
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (authProfile?.id) {
      await supabase.from('profiles').update({ parent_name: account.name, phone: account.phone }).eq('id', authProfile.id);
    }
    setSaved(true);
    setPasswords({ current: '', next: '' });
    setTimeout(() => setSaved(false), 2500);
  }

  const roleLabel = role === 'commissioner' ? 'Commissioner' : 'Volunteer Coach';
  const initials = (account.name || 'Coach').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
      <Display size={22}>Account</Display>
      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--court-navy)' }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{account.name || 'Coach'}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{roleLabel} · FPYC Season 2025–26</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField label="Full name" value={account.name} onChange={e => setAccount(p => ({ ...p, name: e.target.value }))} />
          <InputField label="Email" value={account.email} type="email" disabled />
          <InputField label="Phone" value={account.phone} onChange={e => setAccount(p => ({ ...p, phone: e.target.value }))} type="tel" />
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Change password</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <InputField label="Current password" type="password" placeholder="••••••••" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} />
              <InputField label="New password" type="password" placeholder="••••••••" value={passwords.next} onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button kind="ghost" onClick={() => setPasswords({ current: '', next: '' })}>Cancel</Button>
          <Button kind="gold" icon={saved ? 'check' : 'save'} onClick={handleSave}>{saved ? 'Saved!' : 'Save changes'}</Button>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--foul-red)', marginBottom: 8 }}>Danger zone</div>
        <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginBottom: 14 }}>These actions are permanent and cannot be undone.</div>
        <Button kind="danger" icon="log-out">Sign out of all devices</Button>
      </Card>

      {saved && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, zIndex: 300, boxShadow: 'var(--shadow-3)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> Account updated
        </div>
      )}
    </div>
  );
}

function Toggle({ label, on, onToggle, orange }) {
  const activeColor = orange ? 'var(--basketball-orange)' : 'var(--court-navy)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)' }}>{label}</div>
      <button onClick={onToggle} style={{
        width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: on ? activeColor : 'var(--border)',
        position: 'relative', transition: 'all 200ms',
        flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', top: 3, left: on ? 21 : 3, width: 18, height: 18,
          borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 200ms',
        }} />
      </button>
    </div>
  );
}

function InputField({ label, value, placeholder, type = 'text', onChange, disabled }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <input type={type} value={value ?? ''} placeholder={placeholder} onChange={onChange} disabled={disabled}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, color: disabled ? 'var(--fg-muted)' : 'var(--fg)', outline: 'none', background: disabled ? 'var(--border)' : 'var(--bone)', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'text' }} />
    </div>
  );
}

