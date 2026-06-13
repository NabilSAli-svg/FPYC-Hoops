import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { useGames } from '../shared/store.js';
import { useLocalStorage } from '../shared/useLocalStorage.js';

const INITIAL_REFS = [
  { id: 'r1', name: 'James Park',      email: 'j.park@email.com',      phone: '703-555-0101', cert: 'VBOS Level 2', status: 'active',   seasons: 4 },
  { id: 'r2', name: 'Marcus Lee',      email: 'm.lee@email.com',       phone: '703-555-0102', cert: 'VBOS Level 1', status: 'active',   seasons: 2 },
  { id: 'r3', name: 'Priya Sharma',    email: 'p.sharma@email.com',    phone: '703-555-0103', cert: 'VBOS Level 1', status: 'active',   seasons: 1 },
  { id: 'r4', name: 'Derek Thompson',  email: 'd.thompson@email.com',  phone: '703-555-0104', cert: 'VBOS Level 2', status: 'inactive', seasons: 3 },
  { id: 'r5', name: 'Alicia Torres',   email: 'a.torres@email.com',    phone: '703-555-0105', cert: 'In Training',  status: 'active',   seasons: 0 },
];

const INITIAL_ASSIGNMENTS = {
  g1: { lead: 'r1', partner: 'r2', confirmed: true },
  g2: { lead: 'r3', partner: null, confirmed: false },
  g3: { lead: 'r1', partner: 'r3', confirmed: true },
};

const INITIAL_TRAINING = [
  { id: 't1', title: 'Pre-Season Rules Clinic',   date: 'Nov 15, 2025', time: '6:00 PM', location: 'FPYC Meeting Room', required: true,  attendees: ['r1', 'r2', 'r3', 'r5'] },
  { id: 't2', title: 'Youth Foul Mechanics',       date: 'Dec 3, 2025',  time: '5:30 PM', location: 'FPYC Gym A',        required: false, attendees: ['r1', 'r3'] },
  { id: 't3', title: 'Spring Season Orientation',  date: 'Jan 8, 2026',  time: '6:00 PM', location: 'FPYC Meeting Room', required: true,  attendees: ['r1', 'r2', 'r3', 'r5'] },
];

const ADMIN_CREDS = { username: 'ref-admin', password: 'fpyc2025' };
const REF_PASSWORD = 'fpyc2025';

export default function RefAdminApp() {
  const [mode, setMode] = useState('choose'); // choose | admin-login | ref-login | admin | ref
  const [authedAdmin, setAuthedAdmin] = useState(false);
  const [authedRef, setAuthedRef] = useState(null); // ref id
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });
  const [refLoginForm, setRefLoginForm] = useState({ name: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [refs] = useLocalStorage('fpyc-refs', INITIAL_REFS);

  function handleAdminLogin(e) {
    e.preventDefault();
    if (adminForm.username === ADMIN_CREDS.username && adminForm.password === ADMIN_CREDS.password) {
      setAuthedAdmin(true);
      setMode('admin');
    } else {
      setLoginError('Invalid credentials.');
    }
  }

  function handleRefLogin(e) {
    e.preventDefault();
    const ref = refs.find(r => r.name === refLoginForm.name && r.status === 'active');
    if (ref && refLoginForm.password === REF_PASSWORD) {
      setAuthedRef(ref.id);
      setMode('ref');
    } else {
      setLoginError('Invalid name or password.');
    }
  }

  if (mode === 'choose') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 48, objectFit: 'contain', marginBottom: 12 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>Officials Portal</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>FPYC Basketball · Season 2025–26</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => { setMode('ref-login'); setLoginError(''); }} style={{
              background: 'var(--varsity-gold)', border: 'none', borderRadius: 12, padding: '20px 24px',
              cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'opacity 150ms',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(10,31,61,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="whistle" size={22} color="var(--court-navy)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--court-navy)' }}>I'm a referee</div>
                <div style={{ fontSize: 13, color: 'rgba(10,31,61,0.6)', marginTop: 2 }}>View your assignments and training schedule</div>
              </div>
              <Icon name="chevron-right" size={18} color="var(--court-navy)" style={{ marginLeft: 'auto' }} />
            </button>
            <button onClick={() => { setMode('admin-login'); setLoginError(''); }} style={{
              background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '20px 24px',
              cursor: 'pointer', fontFamily: 'var(--font-body)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'opacity 150ms',
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="shield" size={22} color="rgba(255,255,255,0.8)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Admin access</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Manage assignments, roster, and training</div>
              </div>
              <Icon name="chevron-right" size={18} color="rgba(255,255,255,0.5)" style={{ marginLeft: 'auto' }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'admin-login' || mode === 'ref-login') {
    const isAdmin = mode === 'admin-login';
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
          <button onClick={() => { setMode('choose'); setLoginError(''); }} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-muted)', marginBottom: 20 }}>
            <Icon name="arrow-left" size={14} color="var(--fg-muted)" /> Back
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase', color: 'var(--court-navy)' }}>
              {isAdmin ? 'Admin Sign In' : 'Referee Sign In'}
            </div>
          </div>

          {isAdmin ? (
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Username">
                <input value={adminForm.username} onChange={e => { setAdminForm(f => ({ ...f, username: e.target.value })); setLoginError(''); }}
                  placeholder="ref-admin" autoComplete="username" style={inputStyle} />
              </Field>
              <Field label="Password">
                <PwInput value={adminForm.password} onChange={v => { setAdminForm(f => ({ ...f, password: v })); setLoginError(''); }} show={showPw} onToggle={() => setShowPw(v => !v)} />
              </Field>
              {loginError && <ErrorMsg msg={loginError} />}
              <button type="submit" style={submitBtnStyle}>Sign in</button>
              <DemoHint text="ref-admin · fpyc2025" />
            </form>
          ) : (
            <form onSubmit={handleRefLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Your name">
                <select value={refLoginForm.name} onChange={e => { setRefLoginForm(f => ({ ...f, name: e.target.value })); setLoginError(''); }} style={inputStyle}>
                  <option value="">Select your name…</option>
                  {refs.filter(r => r.status === 'active').map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Password">
                <PwInput value={refLoginForm.password} onChange={v => { setRefLoginForm(f => ({ ...f, password: v })); setLoginError(''); }} show={showPw} onToggle={() => setShowPw(v => !v)} />
              </Field>
              {loginError && <ErrorMsg msg={loginError} />}
              <button type="submit" style={submitBtnStyle}>Sign in</button>
              <DemoHint text="Select your name · fpyc2025" />
            </form>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'admin') {
    return <AdminDashboard onSignOut={() => { setMode('choose'); setAuthedAdmin(false); setAdminForm({ username: '', password: '' }); }} />;
  }

  if (mode === 'ref') {
    const ref = refs.find(r => r.id === authedRef);
    return <RefMyView ref={ref} onSignOut={() => { setMode('choose'); setAuthedRef(null); setRefLoginForm({ name: '', password: '' }); }} />;
  }

  return null;
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────

function AdminDashboard({ onSignOut }) {
  const [tab, setTab] = useState('assignments');
  const TABS = [
    { id: 'assignments', label: 'Assignments', icon: 'calendar' },
    { id: 'referees',    label: 'Referees',    icon: 'users' },
    { id: 'training',    label: 'Training',    icon: 'book-open' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', fontFamily: 'var(--font-body)' }}>
      <header style={{ background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 30, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Officials Admin</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>FPYC Basketball · Season 2025–26</div>
            </div>
          </div>
          <button onClick={onSignOut} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
            <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Sign out
          </button>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              all: 'unset', cursor: 'pointer', padding: '10px 16px', fontSize: 13, fontWeight: 700,
              color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.5)',
              borderBottom: tab === t.id ? '2px solid var(--varsity-gold)' : '2px solid transparent',
              display: 'flex', alignItems: 'center', gap: 7, transition: 'all 140ms',
            }}>
              <Icon name={t.icon} size={14} color={tab === t.id ? '#fff' : 'rgba(255,255,255,0.5)'} /> {t.label}
            </button>
          ))}
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 64px' }}>
        {tab === 'assignments' && <AssignmentsTab />}
        {tab === 'referees'    && <RefereesTab />}
        {tab === 'training'    && <TrainingTab />}
      </div>
    </div>
  );
}

// ─── Assignments Tab ───────────────────────────────────────────────────────────

function AssignmentsTab() {
  const [games] = useGames();
  const [refs] = useLocalStorage('fpyc-refs', INITIAL_REFS);
  const [assignments, setAssignments] = useLocalStorage('fpyc-ref-assignments', INITIAL_ASSIGNMENTS);
  const [assignModal, setAssignModal] = useState(null); // game id
  const [formLead, setFormLead] = useState('');
  const [formPartner, setFormPartner] = useState('');

  const activeRefs = refs.filter(r => r.status === 'active');
  const scheduledGames = games.filter(g => g.status !== 'final').slice(0, 20);
  const completedGames = games.filter(g => g.status === 'final').slice(0, 10);

  function openAssign(gameId) {
    const a = assignments[gameId] || {};
    setFormLead(a.lead || '');
    setFormPartner(a.partner || '');
    setAssignModal(gameId);
  }

  function saveAssignment() {
    setAssignments(a => ({
      ...a,
      [assignModal]: { lead: formLead || null, partner: formPartner || null, confirmed: !!(formLead) },
    }));
    setAssignModal(null);
  }

  function removeAssignment(gameId) {
    setAssignments(a => { const n = { ...a }; delete n[gameId]; return n; });
  }

  function refName(id) {
    return refs.find(r => r.id === id)?.name || '—';
  }

  function GameRow({ game, done }) {
    const a = assignments[game.id];
    const hasLead = a?.lead;
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', opacity: done ? 0.7 : 1 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{game.opponent ? `vs. ${game.opponent}` : 'TBD'}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={10} color="var(--fg-muted)" />{game.date}</span>
            {game.time && <span>{game.time}</span>}
            {game.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={10} color="var(--fg-muted)" />{game.location}</span>}
            {game.team && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: 'rgba(10,31,61,0.06)', color: 'var(--court-navy)' }}>{game.team}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {hasLead ? (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Lead: <span style={{ fontWeight: 700, color: 'var(--fg)' }}>{refName(a.lead)}</span></div>
              {a.partner && <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Partner: <span style={{ fontWeight: 700, color: 'var(--fg)' }}>{refName(a.partner)}</span></div>}
              {!a.partner && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--foul-red)' }}>No partner</div>}
            </div>
          ) : (
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--foul-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icon name="alert-circle" size={12} color="var(--foul-red)" /> Unassigned
            </span>
          )}
          {!done && (
            <button onClick={() => openAssign(game.id)} style={{ ...smBtnStyle, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)' }}>
              {hasLead ? 'Edit' : 'Assign'}
            </button>
          )}
          {!done && hasLead && (
            <button onClick={() => removeAssignment(game.id)} style={{ ...smBtnStyle, color: 'var(--foul-red)', borderColor: 'rgba(200,16,46,0.3)' }}>
              <Icon name="x" size={13} color="var(--foul-red)" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const unassigned = scheduledGames.filter(g => !assignments[g.id]?.lead).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {unassigned > 0 && (
        <div style={{ background: 'rgba(200,16,46,0.06)', border: '1px solid rgba(200,16,46,0.2)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="alert-triangle" size={16} color="var(--foul-red)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--foul-red)' }}>{unassigned} upcoming game{unassigned !== 1 ? 's' : ''} without a lead referee</span>
        </div>
      )}

      <Section title="Upcoming games">
        {scheduledGames.length === 0
          ? <EmptyState icon="calendar" text="No upcoming games." />
          : scheduledGames.map(g => <GameRow key={g.id} game={g} />)
        }
      </Section>

      {completedGames.length > 0 && (
        <Section title="Completed">
          {completedGames.map(g => <GameRow key={g.id} game={g} done />)}
        </Section>
      )}

      {assignModal && (
        <Modal title="Assign Referees" onClose={() => setAssignModal(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Lead referee">
              <select value={formLead} onChange={e => setFormLead(e.target.value)} style={inputStyle}>
                <option value="">None</option>
                {activeRefs.map(r => <option key={r.id} value={r.id}>{r.name} ({r.cert})</option>)}
              </select>
            </Field>
            <Field label="Partner referee">
              <select value={formPartner} onChange={e => setFormPartner(e.target.value)} style={inputStyle}>
                <option value="">None</option>
                {activeRefs.filter(r => r.id !== formLead).map(r => <option key={r.id} value={r.id}>{r.name} ({r.cert})</option>)}
              </select>
            </Field>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={() => setAssignModal(null)} style={smBtnStyle}>Cancel</button>
              <button onClick={saveAssignment} style={{ ...smBtnStyle, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)' }}>Save</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Referees Tab ──────────────────────────────────────────────────────────────

function RefereesTab() {
  const [refs, setRefs] = useLocalStorage('fpyc-refs', INITIAL_REFS);
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const blank = { name: '', email: '', phone: '', cert: 'In Training', status: 'active', seasons: 0 };
  const [form, setForm] = useState(blank);

  function openEdit(ref) {
    setForm({ ...ref });
    setEditId(ref.id);
    setShowAdd(false);
  }

  function openAdd() {
    setForm(blank);
    setEditId(null);
    setShowAdd(true);
  }

  function saveEdit() {
    setRefs(rs => rs.map(r => r.id === editId ? { ...r, ...form } : r));
    setEditId(null);
  }

  function saveAdd() {
    const id = 'r' + Date.now();
    setRefs(rs => [...rs, { ...form, id }]);
    setShowAdd(false);
  }

  function removeRef(id) {
    setRefs(rs => rs.filter(r => r.id !== id));
  }

  const CERTS = ['In Training', 'VBOS Level 1', 'VBOS Level 2', 'VBOS Level 3'];

  function RefForm({ onSave, onCancel, title }) {
    return (
      <Modal title={title} onClose={onCancel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Full name"><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} /></Field>
          <Field label="Email"><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} /></Field>
          <Field label="Phone"><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} /></Field>
          <Field label="Certification">
            <select value={form.cert} onChange={e => setForm(f => ({ ...f, cert: e.target.value }))} style={inputStyle}>
              {CERTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <Field label="Seasons">
            <input type="number" min="0" value={form.seasons} onChange={e => setForm(f => ({ ...f, seasons: +e.target.value }))} style={inputStyle} />
          </Field>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onCancel} style={smBtnStyle}>Cancel</button>
            <button onClick={onSave} style={{ ...smBtnStyle, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)' }}>Save</button>
          </div>
        </div>
      </Modal>
    );
  }

  const certColor = { 'In Training': '#888', 'VBOS Level 1': 'var(--basketball-orange)', 'VBOS Level 2': 'var(--court-navy)', 'VBOS Level 3': 'var(--status-win)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--fg)' }}>Referee Roster</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{refs.filter(r => r.status === 'active').length} active · {refs.filter(r => r.status === 'inactive').length} inactive</div>
        </div>
        <button onClick={openAdd} style={{ ...smBtnStyle, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="user-plus" size={14} color="#fff" /> Add referee
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto 80px', gap: 0 }}>
          {['Name', 'Certification', 'Seasons', 'Status', ''].map((h, i) => (
            <div key={i} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', background: 'var(--bone)' }}>{h}</div>
          ))}
          {refs.map((r, i) => (
            <>
              <div key={r.id + 'n'} style={{ padding: '14px 16px', borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{r.email}</div>
              </div>
              <div key={r.id + 'c'} style={{ padding: '14px 16px', borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: `${certColor[r.cert]}18`, color: certColor[r.cert] || '#888' }}>{r.cert}</span>
              </div>
              <div key={r.id + 's'} style={{ padding: '14px 16px', borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 700 }}>{r.seasons}</div>
              <div key={r.id + 'st'} style={{ padding: '14px 16px', borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: r.status === 'active' ? 'rgba(31,138,91,0.10)' : 'rgba(0,0,0,0.06)', color: r.status === 'active' ? 'var(--status-win)' : 'var(--fg-muted)' }}>
                  {r.status}
                </span>
              </div>
              <div key={r.id + 'a'} style={{ padding: '10px 12px', borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => openEdit(r)} style={iconBtnStyle}><Icon name="edit-2" size={14} color="var(--fg-muted)" /></button>
                <button onClick={() => removeRef(r.id)} style={{ ...iconBtnStyle }}><Icon name="trash-2" size={14} color="var(--foul-red)" /></button>
              </div>
            </>
          ))}
        </div>
      </div>

      {editId && <RefForm title="Edit Referee" onSave={saveEdit} onCancel={() => setEditId(null)} />}
      {showAdd && <RefForm title="Add Referee" onSave={saveAdd} onCancel={() => setShowAdd(false)} />}
    </div>
  );
}

// ─── Training Tab ──────────────────────────────────────────────────────────────

function TrainingTab() {
  const [sessions, setSessions] = useLocalStorage('fpyc-ref-training', INITIAL_TRAINING);
  const [refs] = useLocalStorage('fpyc-refs', INITIAL_REFS);
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const blank = { title: '', date: '', time: '', location: '', required: false, attendees: [] };
  const [form, setForm] = useState(blank);

  function openEdit(session) {
    setForm({ ...session });
    setEditId(session.id);
    setShowAdd(false);
  }

  function saveEdit() {
    setSessions(ss => ss.map(s => s.id === editId ? { ...s, ...form } : s));
    setEditId(null);
  }

  function saveAdd() {
    setSessions(ss => [...ss, { ...form, id: 't' + Date.now() }]);
    setShowAdd(false);
  }

  function removeSession(id) {
    setSessions(ss => ss.filter(s => s.id !== id));
  }

  function toggleAttendee(refId) {
    setForm(f => ({
      ...f,
      attendees: f.attendees.includes(refId) ? f.attendees.filter(a => a !== refId) : [...f.attendees, refId],
    }));
  }

  function SessionForm({ title, onSave, onCancel }) {
    return (
      <Modal title={title} onClose={onCancel}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Session title"><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Date"><input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Jan 8, 2026" style={inputStyle} /></Field>
            <Field label="Time"><input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} placeholder="6:00 PM" style={inputStyle} /></Field>
          </div>
          <Field label="Location"><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={inputStyle} /></Field>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" id="req" checked={form.required} onChange={e => setForm(f => ({ ...f, required: e.target.checked }))} />
            <label htmlFor="req" style={{ fontSize: 13, fontWeight: 600 }}>Required for all refs</label>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Attendees</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {refs.filter(r => r.status === 'active').map(r => (
                <button key={r.id} type="button" onClick={() => toggleAttendee(r.id)} style={{
                  padding: '5px 12px', borderRadius: 999, border: `1.5px solid ${form.attendees.includes(r.id) ? 'var(--court-navy)' : 'var(--border)'}`,
                  background: form.attendees.includes(r.id) ? 'var(--court-navy)' : 'transparent',
                  color: form.attendees.includes(r.id) ? '#fff' : 'var(--fg-muted)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>
                  {r.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onCancel} style={smBtnStyle}>Cancel</button>
            <button onClick={onSave} style={{ ...smBtnStyle, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)' }}>Save</button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--fg)' }}>Training Sessions</div>
        <button onClick={() => { setForm(blank); setEditId(null); setShowAdd(true); }} style={{ ...smBtnStyle, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="plus" size={14} color="#fff" /> Add session
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sessions.length === 0 && <EmptyState icon="book-open" text="No training sessions yet." />}
        {sessions.map(s => (
          <div key={s.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                  {s.required && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)', letterSpacing: '0.06em' }}>REQUIRED</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={11} color="var(--fg-muted)" />{s.date} · {s.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={11} color="var(--fg-muted)" />{s.location}</span>
                </div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {s.attendees.map(id => {
                    const r = refs.find(r => r.id === id);
                    return r ? (
                      <span key={id} style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: 'rgba(10,31,61,0.06)', color: 'var(--court-navy)' }}>{r.name}</span>
                    ) : null;
                  })}
                  {s.attendees.length === 0 && <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontStyle: 'italic' }}>No attendees marked</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => openEdit(s)} style={iconBtnStyle}><Icon name="edit-2" size={14} color="var(--fg-muted)" /></button>
                <button onClick={() => removeSession(s.id)} style={iconBtnStyle}><Icon name="trash-2" size={14} color="var(--foul-red)" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editId && <SessionForm title="Edit Session" onSave={saveEdit} onCancel={() => setEditId(null)} />}
      {showAdd && <SessionForm title="Add Session" onSave={saveAdd} onCancel={() => setShowAdd(false)} />}
    </div>
  );
}

// ─── Ref Self-Service View ─────────────────────────────────────────────────────

function RefMyView({ ref: currentRef, onSignOut }) {
  const [games] = useGames();
  const [allRefs] = useLocalStorage('fpyc-refs', INITIAL_REFS);
  const [assignments] = useLocalStorage('fpyc-ref-assignments', INITIAL_ASSIGNMENTS);
  const [training] = useLocalStorage('fpyc-ref-training', INITIAL_TRAINING);

  if (!currentRef) return null;

  const myAssignments = Object.entries(assignments)
    .filter(([, a]) => a.lead === currentRef.id || a.partner === currentRef.id)
    .map(([gameId, a]) => ({ game: games.find(g => g.id === gameId), role: a.lead === currentRef.id ? 'Lead' : 'Partner', ...a }))
    .filter(a => a.game);

  const upcoming = myAssignments.filter(a => a.game.status !== 'final');
  const past = myAssignments.filter(a => a.game.status === 'final');
  const myTraining = training.filter(s => s.attendees.includes(currentRef.id) || s.required);
  const nextGame = upcoming[0];

  function refName(id) {
    return allRefs.find(r => r.id === id)?.name;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', fontFamily: 'var(--font-body)' }}>
      <header style={{ background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 30, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Officials Portal</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{currentRef.name} · {currentRef.cert}</div>
            </div>
          </div>
          <button onClick={onSignOut} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
            <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Sign out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px 64px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Welcome / next game hero */}
        {nextGame ? (
          <div style={{ background: 'var(--court-navy)', borderRadius: 14, padding: '24px', border: '2px solid var(--varsity-gold)' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 6 }}>Next assignment</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 10 }}>
              {nextGame.game.opponent ? `vs. ${nextGame.game.opponent}` : 'TBD'}
            </div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="calendar" size={12} color="rgba(255,255,255,0.55)" />{nextGame.game.date}{nextGame.game.time ? ` · ${nextGame.game.time}` : ''}</span>
              {nextGame.game.location && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="map-pin" size={12} color="rgba(255,255,255,0.55)" />{nextGame.game.location}</span>}
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="whistle" size={12} color="rgba(255,255,255,0.55)" />Role: {nextGame.role}</span>
              {nextGame.partner && nextGame.role === 'Lead' && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="user" size={12} color="rgba(255,255,255,0.55)" />Partner: {refName(nextGame.partner)}</span>}
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,199,44,0.08)', border: '1px solid rgba(255,199,44,0.25)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icon name="whistle" size={20} color="var(--varsity-gold)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>Welcome, {currentRef.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>No upcoming assignments at the moment.</div>
            </div>
          </div>
        )}

        {/* Upcoming assignments */}
        <Section title={`Upcoming assignments (${upcoming.length})`}>
          {upcoming.length === 0
            ? <EmptyState icon="calendar" text="No upcoming assignments." />
            : upcoming.map(a => <AssignmentCard key={a.game.id} a={a} refs={allRefs} currentRef={currentRef} />)
          }
        </Section>

        {/* Training */}
        <Section title="Training schedule">
          {myTraining.length === 0
            ? <EmptyState icon="book-open" text="No training sessions scheduled." />
            : myTraining.map(s => (
                <div key={s.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</span>
                    {s.required && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999, background: 'rgba(200,16,46,0.08)', color: 'var(--foul-red)', letterSpacing: '0.06em' }}>REQUIRED</span>}
                    {s.attendees.includes(currentRef.id) && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999, background: 'rgba(31,138,91,0.10)', color: 'var(--status-win)' }}>Registered</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={11} color="var(--fg-muted)" />{s.date} · {s.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={11} color="var(--fg-muted)" />{s.location}</span>
                  </div>
                </div>
              ))
          }
        </Section>

        {/* Past games */}
        {past.length > 0 && (
          <Section title="Past games">
            {past.map(a => <AssignmentCard key={a.game.id} a={a} refs={allRefs} currentRef={currentRef} past />)}
          </Section>
        )}

        {/* Rules quick ref */}
        <QuickRulesCard />
      </div>
    </div>
  );
}

function AssignmentCard({ a, refs, currentRef, past }) {
  const partner = a.role === 'Lead' ? (a.partner ? refs.find(r => r.id === a.partner)?.name : null) : refs.find(r => r.id === a.lead)?.name;
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', opacity: past ? 0.7 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{a.game.opponent ? `vs. ${a.game.opponent}` : 'TBD'}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="calendar" size={11} color="var(--fg-muted)" />{a.game.date}{a.game.time ? ` · ${a.game.time}` : ''}</span>
            {a.game.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="map-pin" size={11} color="var(--fg-muted)" />{a.game.location}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="whistle" size={11} color="var(--fg-muted)" />Role: {a.role}</span>
            {partner && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="user" size={11} color="var(--fg-muted)" />{a.role === 'Lead' ? 'Partner' : 'Lead'}: {partner}</span>}
          </div>
        </div>
        {past && a.game.status === 'final' && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(31,138,91,0.10)', color: 'var(--status-win)', flexShrink: 0 }}>Final</span>
        )}
      </div>
    </div>
  );
}

function QuickRulesCard() {
  const [open, setOpen] = useState(false);
  const rules = [
    { label: 'Quarter length',       value: '8 minutes' },
    { label: 'Overtime',             value: '3 minutes' },
    { label: 'Team foul bonus',      value: '7 fouls/quarter → bonus free throws' },
    { label: 'Personal foul limit',  value: '5 fouls → player disqualified' },
    { label: 'Shot clock',           value: 'None (youth house league)' },
    { label: 'Full-court press',     value: 'Not allowed (K–6 divisions)' },
    { label: 'Back-court violation', value: 'Yes, applies' },
    { label: '3-second lane',        value: 'Yes, offensive 3-in-the-key' },
  ];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{ all: 'unset', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="book-open" size={15} color="var(--court-navy)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--court-navy)' }}>FPYC Youth Rules — Quick Reference</span>
        </div>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color="var(--fg-muted)" />
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {rules.map((r, i) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 18px', background: i % 2 === 0 ? 'var(--bone)' : '#fff', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared helpers ────────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ padding: '28px', textAlign: 'center', background: '#fff', border: '1px dashed var(--border)', borderRadius: 10, color: 'var(--fg-muted)', fontSize: 13 }}>
      <Icon name={icon} size={20} color="var(--border)" />
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '24px', width: '100%', maxWidth: 440, boxShadow: '0 16px 48px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--fg)' }}>{title}</span>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer' }}><Icon name="x" size={18} color="var(--fg-muted)" /></button>
        </div>
        {children}
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

function PwInput({ value, onChange, show, onToggle }) {
  return (
    <div style={{ position: 'relative' }}>
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder="••••••••" autoComplete="current-password" style={{ ...inputStyle, paddingRight: 44 }} />
      <button type="button" onClick={onToggle} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <Icon name={show ? 'eye-off' : 'eye'} size={17} color="var(--fg-muted)" />
      </button>
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
      <Icon name="alert-circle" size={14} color="var(--foul-red)" /> {msg}
    </div>
  );
}

function DemoHint({ text }) {
  return (
    <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(10,31,61,0.05)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Demo credentials</div>
      <div style={{ fontSize: 12, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{text}</div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--fg)', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box',
};

const submitBtnStyle = {
  marginTop: 4, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'var(--court-navy)', color: '#fff',
  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, transition: 'opacity 150ms',
};

const smBtnStyle = {
  padding: '7px 14px', borderRadius: 7, border: '1.5px solid var(--border)',
  background: 'transparent', color: 'var(--fg)', cursor: 'pointer',
  fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)',
};

const iconBtnStyle = {
  width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)',
  background: 'var(--bone)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
};
