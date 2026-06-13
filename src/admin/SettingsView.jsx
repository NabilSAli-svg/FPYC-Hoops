import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill, Avatar } from '../shared/index.js';
import { TEAM_INFO } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';

const COACHES = [
  { id: 'c1', name: 'M. Davis', role: 'Head Coach', email: 'mdavis@example.com', phone: '(703) 555-0210', perms: { roster: true,  lineup: true,  schedule: true, evaluations: true,  messages: true,  settings: false } },
  { id: 'c2', name: 'T. Johnson', role: 'Asst. Coach', email: 'tjohn@example.com', phone: '(703) 555-0244', perms: { roster: true,  lineup: true,  schedule: true, evaluations: false, messages: false, settings: false } },
  { id: 'c3', name: 'R. Patel', role: 'Team Manager', email: 'rpatel@example.com', phone: '(703) 555-0288', perms: { roster: true,  lineup: false, schedule: true, evaluations: false, messages: true,  settings: false } },
  { id: 'c4', name: 'L. Kim', role: 'Scorekeeper', email: 'lkim@example.com',   phone: '(703) 555-0199', perms: { roster: false, lineup: false, schedule: true, evaluations: false, messages: false, settings: false } },
];

const PERMS_META = [
  { id: 'roster',      label: 'Roster',       icon: 'users',          desc: 'View & edit player info' },
  { id: 'lineup',      label: 'Lineup',       icon: 'clipboard-list', desc: 'Build and save lineups' },
  { id: 'schedule',    label: 'Schedule',     icon: 'calendar',       desc: 'View and edit schedule' },
  { id: 'evaluations', label: 'Evaluations',  icon: 'star',           desc: 'Rate and note players' },
  { id: 'messages',    label: 'Messages',     icon: 'message-square', desc: 'Send email & SMS' },
  { id: 'settings',    label: 'Settings',     icon: 'settings',       desc: 'Full admin access' },
];

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

const TEAMS_LIST = [
  { id: 'hawks',   name: 'Fairfax Hawks',   division: 'Boys 5–6 House',     coach: 'M. Davis',    players: 12 },
  { id: 'wolves',  name: 'Fairfax Wolves',  division: 'Girls 5–6 House',    coach: 'S. Thompson', players: 11 },
  { id: 'eagles',  name: 'Fairfax Eagles',  division: 'Boys 7–8 Select',    coach: 'J. Williams', players: 14 },
  { id: 'cougars', name: 'Fairfax Cougars', division: 'Girls 3–4 House',    coach: 'D. Park',     players: 10 },
];

export default function SettingsView() {
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
      {tab === 'account' && <AccountTab />}
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
  const [teams, setTeams] = useState(TEAMS_LIST);
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', division: 'Boys 5–6 House', coach: '', email: '', phone: '' });

  function addTeam() {
    if (!newTeam.name.trim() || !newTeam.coach.trim()) return;
    setTeams(ts => [...ts, { id: `t${Date.now()}`, name: newTeam.name, division: newTeam.division, coach: newTeam.coach, players: 0 }]);
    setNewTeam({ name: '', division: 'Boys 5–6 House', coach: '', email: '', phone: '' });
    setShowAdd(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Display size={22}>My teams</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>Season 2025–26 · {teams.length} teams registered</div>
        </div>
        <Button kind="gold" icon="plus" onClick={() => setShowAdd(true)}>Add team</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {teams.map(team => (
          <Card key={team.id} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Display size={22}>{team.name}</Display>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{team.division}</div>
              </div>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--fg-muted)' }}>
                <Icon name="more-horizontal" size={18} />
              </button>
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
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" size="sm" icon="users">Roster</Button>
              <Button kind="ghost" size="sm" icon="settings">Manage</Button>
            </div>
          </Card>
        ))}
        {/* Add team card */}
        <button onClick={() => setShowAdd(true)} style={{
          border: '2px dashed var(--border)', borderRadius: 8, padding: 24,
          background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--fg-muted)',
          transition: 'all 160ms',
        }}>
          <Icon name="plus-circle" size={28} color="var(--fg-muted)" />
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14 }}>Add new team</span>
        </button>
      </div>

      {showAdd && <AddTeamModal value={newTeam} onChange={setNewTeam} onSave={addTeam} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function CoachesTab() {
  const [coaches, setCoaches] = useState(COACHES);
  const [showAdd, setShowAdd] = useState(false);
  const [newCoach, setNewCoach] = useState({ name: '', email: '', phone: '', role: 'Asst. Coach' });

  const togglePerm = (cid, perm) => {
    setCoaches(prev => prev.map(c =>
      c.id === cid ? { ...c, perms: { ...c.perms, [perm]: !c.perms[perm] } } : c
    ));
  };

  function inviteCoach() {
    if (!newCoach.name.trim() || !newCoach.email.trim()) return;
    const defaultPerms = { roster: true, lineup: false, schedule: true, evaluations: false, messages: false, settings: false };
    setCoaches(cs => [...cs, { id: `c${Date.now()}`, name: newCoach.name, role: newCoach.role, email: newCoach.email, phone: newCoach.phone, perms: defaultPerms }]);
    setNewCoach({ name: '', email: '', phone: '', role: 'Asst. Coach' });
    setShowAdd(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Display size={22}>Coaches & staff</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>Manage who can access what in the console</div>
        </div>
        <Button kind="gold" icon="user-plus" onClick={() => setShowAdd(true)}>Invite coach</Button>
      </div>

      <Card padding={0}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `180px 140px ${PERMS_META.map(() => '1fr').join(' ')}`,
          padding: '10px 18px',
          background: 'var(--bone)',
          borderBottom: '1px solid var(--border)',
          fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700, gap: 8,
        }}>
          <div>Coach</div>
          <div>Role</div>
          {PERMS_META.map(p => (
            <div key={p.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              <Icon name={p.icon} size={14} />
              <span>{p.label}</span>
            </div>
          ))}
        </div>

        {coaches.map((coach, i) => (
          <div key={coach.id} style={{
            display: 'grid',
            gridTemplateColumns: `180px 140px ${PERMS_META.map(() => '1fr').join(' ')}`,
            padding: '14px 18px',
            borderBottom: i < coaches.length - 1 ? '1px solid var(--border)' : 'none',
            alignItems: 'center', gap: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={coach.name} size={32} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{coach.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{coach.email}</div>
              </div>
            </div>
            <div>
              <Pill kind={coach.role === 'Head Coach' ? 'navy' : 'neutral'}>{coach.role}</Pill>
            </div>
            {PERMS_META.map(p => {
              const on = coach.perms[p.id];
              const isHead = coach.role === 'Head Coach';
              return (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => !isHead && togglePerm(coach.id, p.id)}
                    title={`${on ? 'Revoke' : 'Grant'} ${p.label} access`}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: 'none', cursor: isHead ? 'default' : 'pointer',
                      background: on ? (isHead ? 'rgba(31,138,91,0.15)' : 'rgba(31,138,91,0.12)') : 'var(--bone)',
                      color: on ? 'var(--status-win)' : 'var(--fg-muted)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 120ms',
                    }}
                  >
                    <Icon name={on ? 'check' : 'minus'} size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </Card>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 440, boxShadow: 'var(--shadow-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Display size={22}>Invite coach</Display>
              <button onClick={() => setShowAdd(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <InputField label="Full name" placeholder="Coach name" value={newCoach.name} onChange={e => setNewCoach(c => ({ ...c, name: e.target.value }))} />
              <InputField label="Email address" placeholder="coach@example.com" type="email" value={newCoach.email} onChange={e => setNewCoach(c => ({ ...c, email: e.target.value }))} />
              <InputField label="Phone (for SMS)" placeholder="(703) 555-0000" type="tel" value={newCoach.phone} onChange={e => setNewCoach(c => ({ ...c, phone: e.target.value }))} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Head Coach', 'Asst. Coach', 'Team Manager', 'Scorekeeper'].map(r => (
                    <button key={r} onClick={() => setNewCoach(c => ({ ...c, role: r }))} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: newCoach.role === r ? 'var(--court-navy)' : 'transparent', color: newCoach.role === r ? '#fff' : 'var(--fg)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{r}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
              <Button kind="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button kind="gold" icon="send" onClick={inviteCoach} disabled={!newCoach.name.trim() || !newCoach.email.trim()}>Send invite</Button>
            </div>
          </div>
        </div>
      )}
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

function AccountTab() {
  const [profile, setProfile] = useState({ name: 'M. Davis', email: 'mdavis@example.com', phone: '(703) 555-0210' });
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setPasswords({ current: '', next: '' });
    setTimeout(() => setSaved(false), 2500);
  }

  const initials = profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 520 }}>
      <Display size={22}>Account</Display>
      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: 'var(--court-navy)' }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{profile.name || 'Coach'}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Head Coach · Volunteer · FPYC Season 2025–26</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField label="Full name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          <InputField label="Email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} type="email" />
          <InputField label="Phone" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} type="tel" />
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

function InputField({ label, value, placeholder, type = 'text', onChange }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <input type={type} value={value ?? ''} placeholder={placeholder} onChange={onChange}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box' }} />
    </div>
  );
}

function AddTeamModal({ value, onChange, onSave, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 480, boxShadow: 'var(--shadow-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Display size={22}>Add team</Display>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <InputField label="Team name" placeholder="e.g. Fairfax Hawks" value={value.name} onChange={e => onChange(v => ({ ...v, name: e.target.value }))} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Division</div>
            <select value={value.division} onChange={e => onChange(v => ({ ...v, division: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, background: 'var(--bone)', color: 'var(--fg)', outline: 'none' }}>
              {DIVISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <InputField label="Head coach name" placeholder="Coach name" value={value.coach} onChange={e => onChange(v => ({ ...v, coach: e.target.value }))} />
          <InputField label="Head coach email" placeholder="coach@example.com" type="email" value={value.email} onChange={e => onChange(v => ({ ...v, email: e.target.value }))} />
          <InputField label="Head coach phone" placeholder="(703) 555-0000" type="tel" value={value.phone} onChange={e => onChange(v => ({ ...v, phone: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <Button kind="ghost" onClick={onClose}>Cancel</Button>
          <Button kind="gold" icon="shield" onClick={onSave} disabled={!value.name.trim() || !value.coach.trim()}>Create team</Button>
        </div>
      </div>
    </div>
  );
}
