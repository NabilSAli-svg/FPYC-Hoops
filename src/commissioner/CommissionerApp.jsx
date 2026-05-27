import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill } from '../shared/index.js';
import { useIsMobile } from '../shared/useIsMobile.js';
import { csvDownload } from '../shared/csvDownload.js';

const CREDENTIALS = { username: 'commissioner', password: 'fpyc2025' };

// ─── Data ────────────────────────────────────────────────────────────────────

const TEAMS = [
  { name: 'Fairfax Hawks',   division: 'Boys 5–6 House',  coach: 'M. Davis',    email: 'mdavis@fpycsports.com',    phone: '(703) 555-0210', players: 12, record: '6–3', seed: '2nd', color: 'var(--court-navy)' },
  { name: 'Fairfax Wolves',  division: 'Girls 5–6 House', coach: 'S. Thompson', email: 'sthompson@fpycsports.com', phone: '(703) 555-0233', players: 11, record: '4–5', seed: '5th', color: '#1F8A5B' },
  { name: 'Fairfax Eagles',  division: 'Boys 7–8 Select', coach: 'J. Williams', email: 'jwilliams@fpycsports.com', phone: '(703) 555-0247', players: 14, record: '8–1', seed: '1st', color: '#C8102E' },
  { name: 'Fairfax Cougars', division: 'Girls 3–4 House', coach: 'D. Park',     email: 'dpark@fpycsports.com',    phone: '(703) 555-0218', players: 10, record: '3–6', seed: '6th', color: 'var(--basketball-orange)' },
];

const INITIAL_REGS = [
  { id: 'r1',  parent: 'A. Reeves',    player: 'Jordan Reeves',   grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 3',  paid: true,  waiver: true,  status: 'approved' },
  { id: 'r2',  parent: 'L. Chen',      player: 'Maya Chen',       grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 3',  paid: true,  waiver: true,  status: 'approved' },
  { id: 'r3',  parent: 'K. Brooks',    player: 'Devon Brooks',    grade: '6th', division: 'Boys 7–8 Select', date: 'Oct 5',  paid: true,  waiver: true,  status: 'approved' },
  { id: 'r4',  parent: 'P. Whitaker',  player: 'Sam Whitaker',    grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 7',  paid: true,  waiver: true,  status: 'approved' },
  { id: 'r5',  parent: 'R. Singh',     player: 'Tariq Singh',     grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 8',  paid: true,  waiver: false, status: 'approved' },
  { id: 'r6',  parent: 'M. Romero',    player: 'Alex Romero',     grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 9',  paid: true,  waiver: true,  status: 'approved' },
  { id: 'r7',  parent: 'G. Bianchi',   player: 'Luca Bianchi',    grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 10', paid: true,  waiver: true,  status: 'approved' },
  { id: 'r8',  parent: 'H. Park',      player: 'Ethan Park',      grade: '6th', division: 'Boys 5–6 House',  date: 'Oct 12', paid: false, waiver: false, status: 'pending' },
  { id: 'r9',  parent: 'O. Adeyemi',   player: 'Tolu Adeyemi',    grade: '5th', division: 'Boys 5–6 House',  date: 'Nov 28', paid: false, waiver: false, status: 'pending' },
  { id: 'r10', parent: 'P. Walsh',     player: 'Casey Walsh',     grade: '5th', division: 'Girls 5–6 House', date: 'Nov 27', paid: true,  waiver: false, status: 'pending' },
  { id: 'r11', parent: 'R. Hernandez', player: 'Sofia Hernandez', grade: '4th', division: 'Girls 3–4 House', date: 'Nov 24', paid: false, waiver: false, status: 'pending' },
  { id: 'r12', parent: 'T. Morrison',  player: 'Jake Morrison',   grade: '5th', division: 'Boys 5–6 House',  date: 'Nov 22', paid: true,  waiver: true,  status: 'approved' },
  { id: 'r13', parent: 'D. Okafor',    player: 'Imani Okafor',    grade: '7th', division: 'Boys 7–8 Select', date: 'Nov 20', paid: true,  waiver: true,  status: 'waitlisted' },
  { id: 'r14', parent: 'V. Patel',     player: 'Noah Patel',      grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 15', paid: true,  waiver: true,  status: 'approved' },
  { id: 'r15', parent: 'B. Walker',    player: 'Imani Walker',    grade: '5th', division: 'Boys 5–6 House',  date: 'Oct 11', paid: true,  waiver: false, status: 'approved' },
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 'a1', title: 'Late fees begin November 15', body: 'Registration fees increase by $45 after Nov 15. Please complete registration before this date to avoid the surcharge.', target: 'All families', date: 'Nov 1', author: 'Commissioner' },
  { id: 'a3', title: 'Season opener Dec 7', body: 'House League season kicks off Saturday December 7. All teams report to your assigned gyms by 9:30 AM.', target: 'All families', date: 'Nov 15', author: 'Commissioner' },
  { id: 'a2', title: 'Walk-in registration — Oct 11', body: 'Final walk-in registration session this Saturday, Oct 11, 10am–12pm at the FPYC office, 3955 Pickett Rd.', target: 'All families', date: 'Oct 9', author: 'Commissioner' },
  { id: 'a4', title: 'Select Travel tryout results posted', body: 'Coaches have notified all participants. Check your email for placement details.', target: 'Boys 7–8 Select', date: 'Sep 12', author: 'Commissioner' },
];

const DIVISIONS = ['All families', 'Boys 5–6 House', 'Girls 5–6 House', 'Boys 7–8 Select', 'Girls 3–4 House'];

const STANDINGS_BY_DIVISION = {
  'Boys 5–6 House': [
    { rank: 1, team: 'Centreville Eagles', fpyc: false, w: 8, l: 1, pf: 524, pa: 398, streak: 'W3' },
    { rank: 2, team: 'Fairfax Hawks',       fpyc: true,  w: 6, l: 3, pf: 487, pa: 423, streak: 'W2' },
    { rank: 3, team: 'Vienna Storm',        fpyc: false, w: 5, l: 4, pf: 461, pa: 448, streak: 'L1' },
    { rank: 4, team: 'Reston Wolves',       fpyc: false, w: 5, l: 4, pf: 439, pa: 441, streak: 'W1' },
    { rank: 5, team: 'Oakton Patriots',     fpyc: false, w: 4, l: 5, pf: 412, pa: 459, streak: 'L2' },
    { rank: 6, team: 'McLean Mustangs',     fpyc: false, w: 3, l: 6, pf: 398, pa: 467, streak: 'L3' },
    { rank: 7, team: 'Burke Lakers',        fpyc: false, w: 2, l: 7, pf: 374, pa: 492, streak: 'L4' },
    { rank: 8, team: 'Springfield Bulls',   fpyc: false, w: 1, l: 8, pf: 352, pa: 520, streak: 'L5' },
  ],
  'Girls 5–6 House': [
    { rank: 1, team: 'Arlington Stars',     fpyc: false, w: 7, l: 2, pf: 498, pa: 412, streak: 'W4' },
    { rank: 2, team: 'McLean Cardinals',    fpyc: false, w: 6, l: 3, pf: 471, pa: 438, streak: 'W1' },
    { rank: 3, team: 'Vienna Rockets',      fpyc: false, w: 5, l: 4, pf: 449, pa: 441, streak: 'W2' },
    { rank: 4, team: 'Reston Blaze',        fpyc: false, w: 4, l: 5, pf: 422, pa: 449, streak: 'L1' },
    { rank: 5, team: 'Fairfax Wolves',      fpyc: true,  w: 4, l: 5, pf: 418, pa: 461, streak: 'L2' },
    { rank: 6, team: 'Herndon Thunder',     fpyc: false, w: 2, l: 7, pf: 378, pa: 501, streak: 'L3' },
  ],
  'Boys 7–8 Select': [
    { rank: 1, team: 'Fairfax Eagles',      fpyc: true,  w: 8, l: 1, pf: 612, pa: 489, streak: 'W5' },
    { rank: 2, team: 'McLean Select',       fpyc: false, w: 7, l: 2, pf: 588, pa: 511, streak: 'W2' },
    { rank: 3, team: 'Reston Select',       fpyc: false, w: 5, l: 4, pf: 562, pa: 534, streak: 'L1' },
    { rank: 4, team: 'Arlington Gold',      fpyc: false, w: 4, l: 5, pf: 531, pa: 558, streak: 'W1' },
    { rank: 5, team: 'Vienna Elite',        fpyc: false, w: 3, l: 6, pf: 501, pa: 587, streak: 'L4' },
    { rank: 6, team: 'Chantilly Force',     fpyc: false, w: 1, l: 8, pf: 467, pa: 612, streak: 'L5' },
  ],
  'Girls 3–4 House': [
    { rank: 1, team: 'Arlington Aces',      fpyc: false, w: 7, l: 2, pf: 312, pa: 278, streak: 'W3' },
    { rank: 2, team: 'Reston Stars',        fpyc: false, w: 6, l: 3, pf: 301, pa: 289, streak: 'L1' },
    { rank: 3, team: 'Vienna Flames',       fpyc: false, w: 5, l: 4, pf: 290, pa: 298, streak: 'W2' },
    { rank: 4, team: 'McLean Gems',         fpyc: false, w: 4, l: 5, pf: 276, pa: 309, streak: 'L2' },
    { rank: 5, team: 'Fairfax Cougars',     fpyc: true,  w: 3, l: 6, pf: 261, pa: 324, streak: 'L3' },
    { rank: 6, team: 'Herndon Comets',      fpyc: false, w: 1, l: 8, pf: 234, pa: 342, streak: 'L4' },
  ],
};

const PLAYOFF_SPOTS = 4;

// ─── Sub-components ──────────────────────────────────────────────────────────

function BoolIcon({ yes }) {
  return yes
    ? <Icon name="check-circle" size={15} color="var(--status-win)" />
    : <Icon name="x-circle" size={15} color="var(--foul-red)" />;
}

function StatusPill({ status }) {
  const map = {
    approved:   { bg: 'var(--status-win)',     color: '#fff' },
    pending:    { bg: 'var(--basketball-orange)', color: '#fff' },
    waitlisted: { bg: 'var(--whistle-300)',    color: 'var(--fg)' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 9px',
      borderRadius: 'var(--radius-pill)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      background: s.bg,
      color: s.color,
    }}>
      {status}
    </span>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ isMobile }) {
  const stats = [
    { label: 'Total Registered Kids', value: '47', icon: 'users' },
    { label: 'Season Revenue',        value: '$8,227', icon: 'dollar-sign' },
    { label: 'Pending Approvals',     value: '3', icon: 'clock' },
    { label: 'Games This Weekend',    value: '4', icon: 'calendar' },
  ];

  const glance = [
    { short: 'Hawks',   ...TEAMS[0] },
    { short: 'Wolves',  ...TEAMS[1] },
    { short: 'Eagles',  ...TEAMS[2] },
    { short: 'Cougars', ...TEAMS[3] },
  ];

  const recentRegs = [
    { player: 'O. Adeyemi',   division: 'Boys 5–6 House',  date: 'Nov 28', status: 'pending' },
    { player: 'P. Walsh',     division: 'Girls 5–6 House', date: 'Nov 27', status: 'pending' },
    { player: 'K. Brooks',    division: 'Boys 7–8 Select', date: 'Nov 25', status: 'approved' },
    { player: 'R. Hernandez', division: 'Girls 3–4 House', date: 'Nov 24', status: 'pending' },
    { player: 'T. Morrison',  division: 'Boys 5–6 House',  date: 'Nov 22', status: 'approved' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16 }}>
        {stats.map(s => (
          <Card key={s.label} padding={isMobile ? '14px 16px' : 20}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
              <Eyebrow>{s.label}</Eyebrow>
              <Icon name={s.icon} size={16} color="var(--fg-muted)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 24 : 32, color: 'var(--court-navy)', lineHeight: 1 }}>{s.value}</div>
          </Card>
        ))}
      </div>

      {/* Alert strip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(232,119,34,0.10)', border: '1px solid var(--basketball-orange)',
          borderRadius: 8, padding: '12px 16px',
        }}>
          <Icon name="alert-triangle" size={16} color="var(--basketball-orange)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
            3 families haven't completed waivers — games are Saturday
          </span>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(200,16,46,0.08)', border: '1px solid var(--foul-red)',
          borderRadius: 8, padding: '12px 16px',
        }}>
          <Icon name="alert-circle" size={16} color="var(--foul-red)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
            2 refs unassigned for Dec 21
          </span>
        </div>
      </div>

      {/* Teams at a glance */}
      <div>
        <Eyebrow style={{ marginBottom: 14 }}>Teams at a Glance</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
          {glance.map(t => (
            <Card key={t.name} padding={18}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#fff', lineHeight: 1 }}>
                    {t.short.slice(0,1)}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{t.short}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>{t.division}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Coach {t.coach}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--court-navy)' }}>{t.record}</span>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{t.players} players</span>
                    <Pill kind="navy">{t.seed}</Pill>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent registrations */}
      <div>
        <Eyebrow style={{ marginBottom: 14 }}>Recent Registrations</Eyebrow>
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Player', 'Division', 'Date', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRegs.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < recentRegs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '11px 16px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{r.player}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--fg-muted)' }}>{r.division}</td>
                  <td style={{ padding: '11px 16px', fontSize: 13, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{r.date}</td>
                  <td style={{ padding: '11px 16px' }}><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ─── Teams Tab ────────────────────────────────────────────────────────────────

function TeamsTab() {
  const [expanded, setExpanded] = useState(null);

  function toggle(name) {
    setExpanded(prev => prev === name ? null : name);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {TEAMS.map(t => {
        const isOpen = expanded === t.name;
        return (
          <Card key={t.name} padding={0} style={{ overflow: 'hidden' }}>
            {/* Card header — always visible */}
            <button
              onClick={() => toggle(t.name)}
              style={{
                all: 'unset', display: 'flex', alignItems: 'center', gap: 16,
                width: '100%', padding: '18px 20px', cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: t.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff' }}>
                  {t.name.split(' ')[1].slice(0, 1)}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg)' }}>{t.name}</span>
                  <span style={{
                    display: 'inline-block', padding: '2px 9px', borderRadius: 'var(--radius-pill)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    background: t.color, color: '#fff',
                  }}>{t.division}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Coach {t.coach}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--court-navy)', lineHeight: 1.2 }}>{t.record}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{t.players} players · {t.seed} seed</div>
                </div>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="var(--fg-muted)" />
              </div>
            </button>

            {/* Expanded details */}
            {isOpen && (
              <div style={{ borderTop: '1px solid var(--border)', padding: '18px 20px', background: 'var(--bone)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div>
                    <Eyebrow style={{ marginBottom: 4 }}>Coach</Eyebrow>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{t.coach}</div>
                  </div>
                  <div>
                    <Eyebrow style={{ marginBottom: 4 }}>Email</Eyebrow>
                    <div style={{ fontSize: 13, color: 'var(--fg-muted)', wordBreak: 'break-all' }}>{t.email}</div>
                  </div>
                  <div>
                    <Eyebrow style={{ marginBottom: 4 }}>Phone</Eyebrow>
                    <div style={{ fontSize: 14, color: 'var(--fg)' }}>{t.phone}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Button kind="ghost" size="sm" icon="users" onClick={() => {}}>View Roster</Button>
                  <Button kind="ghost" size="sm" icon="message-circle" onClick={() => {}}>Message Coach</Button>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── Registrations Tab ───────────────────────────────────────────────────────

function RegistrationsTab({ isMobile }) {
  const [regs, setRegs] = useState(INITIAL_REGS);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDivision, setFilterDivision] = useState('All');

  function updateStatus(id, newStatus) {
    setRegs(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  }

  const filtered = regs.filter(r => {
    const statusMatch = filterStatus === 'All' || r.status === filterStatus.toLowerCase();
    const divMatch    = filterDivision === 'All' || r.division === filterDivision;
    return statusMatch && divMatch;
  });

  const counts = {
    approved:   regs.filter(r => r.status === 'approved').length,
    pending:    regs.filter(r => r.status === 'pending').length,
    waitlisted: regs.filter(r => r.status === 'waitlisted').length,
  };

  const statusFilters = ['All', 'Pending', 'Approved', 'Waitlisted'];

  function exportRegsCSV() {
    const rows = [
      ['Parent', 'Player', 'Grade', 'Division', 'Date', 'Paid', 'Waiver', 'Status'],
      ...regs.map(r => [r.parent, r.player, r.grade, r.division, r.date, r.paid ? 'Yes' : 'No', r.waiver ? 'Yes' : 'No', r.status]),
    ];
    csvDownload('fpyc-registrations.csv', rows);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              style={{
                all: 'unset', cursor: 'pointer',
                padding: '7px 14px', borderRadius: 'var(--radius-pill)',
                fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
                background: filterStatus === f ? 'var(--court-navy)' : '#fff',
                color: filterStatus === f ? '#fff' : 'var(--fg)',
                border: '1px solid var(--border)',
                transition: 'all 120ms',
              }}
            >{f}</button>
          ))}
        </div>
        <select
          value={filterDivision}
          onChange={e => setFilterDivision(e.target.value)}
          style={{
            padding: '7px 12px', borderRadius: 8,
            border: '1px solid var(--border)', fontFamily: 'var(--font-body)',
            fontSize: 13, color: 'var(--fg)', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="All">All Divisions</option>
          {DIVISIONS.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <Button kind="ghost" size="sm" icon="download" onClick={exportRegsCSV}>Export CSV</Button>
        </div>
      </div>

      {/* Table / Cards */}
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 ? (
            <Card padding={20}>
              <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--fg-muted)' }}>
                No registrations match the current filters.
              </div>
            </Card>
          ) : (
            filtered.map(r => (
              <Card key={r.id} padding={16}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', lineHeight: 1.2 }}>{r.player}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{r.parent}</div>
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10 }}>
                  {r.division} · Grade {r.grade} · {r.date}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: r.status === 'pending' || r.status === 'waitlisted' ? 10 : 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--fg-muted)' }}>
                    <BoolIcon yes={r.paid} /> Paid
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--fg-muted)' }}>
                    <BoolIcon yes={r.waiver} /> Waiver
                  </span>
                </div>
                {(r.status === 'pending' || r.status === 'waitlisted' || r.status === 'approved') && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {r.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(r.id, 'approved')}
                          style={{
                            all: 'unset', cursor: 'pointer', padding: '7px 14px',
                            borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: 'var(--status-win)', color: '#fff',
                          }}
                        >Approve</button>
                        <button
                          onClick={() => updateStatus(r.id, 'waitlisted')}
                          style={{
                            all: 'unset', cursor: 'pointer', padding: '7px 14px',
                            borderRadius: 6, fontSize: 12, fontWeight: 700,
                            border: '1px solid var(--border)', color: 'var(--fg)',
                            background: '#fff',
                          }}
                        >Waitlist</button>
                      </>
                    )}
                    {r.status === 'approved' && (
                      <button
                        onClick={() => {}}
                        style={{
                          all: 'unset', cursor: 'pointer', padding: '7px 14px',
                          borderRadius: 6, fontSize: 12, fontWeight: 700,
                          border: '1px solid var(--border)', color: 'var(--fg)',
                          background: '#fff',
                        }}
                      >Contact</button>
                    )}
                    {r.status === 'waitlisted' && (
                      <button
                        onClick={() => updateStatus(r.id, 'approved')}
                        style={{
                          all: 'unset', cursor: 'pointer', padding: '7px 14px',
                          borderRadius: 6, fontSize: 12, fontWeight: 700,
                          background: 'var(--status-win)', color: '#fff',
                        }}
                      >Approve</button>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bone)' }}>
                  {['Parent', 'Player', 'Grade', 'Division', 'Registered', 'Paid', 'Waiver', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left', fontSize: 11,
                      fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--fg-muted)', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', verticalAlign: 'middle' }}
                  >
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-muted)' }}>{r.parent}</td>
                    <td style={{ padding: '11px 14px', fontSize: 14, fontWeight: 600, color: 'var(--fg)', whiteSpace: 'nowrap' }}>{r.player}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-muted)' }}>{r.grade}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{r.division}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>{r.date}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}><BoolIcon yes={r.paid} /></td>
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}><BoolIcon yes={r.waiver} /></td>
                    <td style={{ padding: '11px 14px' }}><StatusPill status={r.status} /></td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                        {r.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(r.id, 'approved')}
                              style={{
                                all: 'unset', cursor: 'pointer', padding: '5px 11px',
                                borderRadius: 6, fontSize: 12, fontWeight: 700,
                                background: 'var(--status-win)', color: '#fff',
                                whiteSpace: 'nowrap',
                              }}
                            >Approve</button>
                            <button
                              onClick={() => updateStatus(r.id, 'waitlisted')}
                              style={{
                                all: 'unset', cursor: 'pointer', padding: '5px 11px',
                                borderRadius: 6, fontSize: 12, fontWeight: 700,
                                border: '1px solid var(--border)', color: 'var(--fg)',
                                background: '#fff', whiteSpace: 'nowrap',
                              }}
                            >Waitlist</button>
                          </>
                        )}
                        {r.status === 'approved' && (
                          <button
                            onClick={() => {}}
                            style={{
                              all: 'unset', cursor: 'pointer', padding: '5px 11px',
                              borderRadius: 6, fontSize: 12, fontWeight: 700,
                              border: '1px solid var(--border)', color: 'var(--fg)',
                              background: '#fff', whiteSpace: 'nowrap',
                            }}
                          >Contact</button>
                        )}
                        {r.status === 'waitlisted' && (
                          <button
                            onClick={() => updateStatus(r.id, 'approved')}
                            style={{
                              all: 'unset', cursor: 'pointer', padding: '5px 11px',
                              borderRadius: 6, fontSize: 12, fontWeight: 700,
                              background: 'var(--status-win)', color: '#fff',
                              whiteSpace: 'nowrap',
                            }}
                          >Approve</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: '28px', textAlign: 'center', fontSize: 14, color: 'var(--fg-muted)' }}>
                      No registrations match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 18, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--status-win)' }}>{counts.approved}</span> approved
        </span>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--basketball-orange)' }}>{counts.pending}</span> pending
        </span>
        <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          <span style={{ fontWeight: 700, color: 'var(--whistle-500)' }}>{counts.waitlisted}</span> waitlisted
        </span>
      </div>
    </div>
  );
}

// ─── Standings Tab ────────────────────────────────────────────────────────────

function StandingsTab() {
  const divNames = Object.keys(STANDINGS_BY_DIVISION);
  const [activeDiv, setActiveDiv] = useState(divNames[0]);
  const rows = STANDINGS_BY_DIVISION[activeDiv];
  const leader = rows[0];
  const fpycRows = rows.filter(r => r.fpyc);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Division pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {divNames.map(d => (
          <button key={d} onClick={() => setActiveDiv(d)} style={{
            padding: '7px 14px', borderRadius: 999, border: '1px solid var(--border)', cursor: 'pointer',
            background: activeDiv === d ? 'var(--court-navy)' : '#fff',
            color: activeDiv === d ? '#fff' : 'var(--fg-soft)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, transition: 'all 120ms',
          }}>{d}</button>
        ))}
      </div>

      {/* Standings table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Display size={20}>{activeDiv}</Display>
          <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600 }}>Top {PLAYOFF_SPOTS} advance to playoffs</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bone)' }}>
              {['#', 'Team', 'W', 'L', 'PCT', 'GB', 'PF', 'PA', 'Str'].map(h => (
                <th key={h} style={{ padding: '9px 14px', textAlign: h === 'Team' ? 'left' : 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const pct = row.w + row.l > 0 ? (row.w / (row.w + row.l)).toFixed(3).replace(/^0/, '') : '.000';
              const gbVal = ((leader.w - row.w) + (row.l - leader.l)) / 2;
              const gb = i === 0 ? '—' : gbVal === 0 ? '—' : gbVal % 1 === 0 ? String(gbVal) : gbVal.toFixed(1);
              const inPlayoffs = i < PLAYOFF_SPOTS;
              return (
                <>
                  <tr key={row.rank} style={{ background: row.fpyc ? 'rgba(255,199,44,0.08)' : '#fff', borderBottom: '1px solid var(--border)', fontWeight: row.fpyc ? 700 : 400 }}>
                    <td style={{ padding: '11px 14px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: inPlayoffs ? 'var(--status-win)' : 'var(--fg-muted)' }}>{row.rank}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {row.fpyc && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
                        <span style={{ color: row.fpyc ? 'var(--court-navy)' : 'var(--fg)' }}>{row.team}</span>
                        {row.fpyc && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>FPYC</span>}
                      </div>
                    </td>
                    {[row.w, row.l, pct, gb, row.pf, row.pa].map((v, j) => (
                      <td key={j} style={{ padding: '11px 14px', textAlign: 'center', fontSize: 13, fontFamily: j >= 2 ? 'var(--font-mono)' : 'inherit', color: 'var(--fg)' }}>{v}</td>
                    ))}
                    <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: row.streak.startsWith('W') ? 'rgba(31,138,91,0.12)' : 'rgba(200,16,46,0.10)', color: row.streak.startsWith('W') ? 'var(--status-win)' : 'var(--foul-red)' }}>{row.streak}</span>
                    </td>
                  </tr>
                  {i === PLAYOFF_SPOTS - 1 && i < rows.length - 1 && (
                    <tr key="cutoff">
                      <td colSpan={9} style={{ padding: 0 }}>
                        <div style={{ borderTop: '2px dashed var(--status-warning)', position: 'relative' }}>
                          <span style={{ position: 'absolute', right: 14, top: -9, fontSize: 9, background: 'var(--status-warning)', color: '#fff', padding: '1px 7px', borderRadius: 999, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Playoff cutoff</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* FPYC teams summary */}
      {fpycRows.length > 0 && (
        <Card>
          <Eyebrow style={{ marginBottom: 14 }}>FPYC Teams · {activeDiv}</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {fpycRows.map((r, i) => {
              const inPlayoffs = r.rank <= PLAYOFF_SPOTS;
              return (
                <div key={r.team} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < fpycRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.team}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>Rank #{r.rank} · {r.w}–{r.l}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--court-navy)', lineHeight: 1 }}>{r.w}–{r.l}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: inPlayoffs ? 'rgba(31,138,91,0.12)' : 'rgba(200,16,46,0.10)', color: inPlayoffs ? 'var(--status-win)' : 'var(--foul-red)' }}>
                      {inPlayoffs ? `In playoffs — #${r.rank}` : `Out — #${r.rank}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Announcements Tab ───────────────────────────────────────────────────────

function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [form, setForm] = useState({ title: '', body: '', target: 'All families' });

  function handlePost(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'short' });
    const newAnnouncement = {
      id: `a${Date.now()}`,
      title: form.title.trim(),
      body: form.body.trim(),
      target: form.target,
      date: `${month} ${now.getDate()}`,
      author: 'Commissioner',
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setForm({ title: '', body: '', target: 'All families' });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Compose form */}
      <Card padding={22}>
        <Eyebrow style={{ marginBottom: 16 }}>New Announcement</Eyebrow>
        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Title</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Announcement title…"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--fg)', outline: 'none',
                background: 'var(--bone)', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Body</label>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Write your announcement…"
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
                fontSize: 14, color: 'var(--fg)', outline: 'none', resize: 'vertical',
                background: 'var(--bone)', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Target</label>
              <select
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)',
                  fontSize: 14, color: 'var(--fg)', background: 'var(--bone)', cursor: 'pointer',
                }}
              >
                {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <Button kind="primary" icon="send" onClick={handlePost}>Post Announcement</Button>
          </div>
        </form>
      </Card>

      {/* Announcements list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Eyebrow>Posted Announcements</Eyebrow>
        {announcements.map(a => (
          <Card key={a.id} padding={20}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', lineHeight: 1.3 }}>{a.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{
                  display: 'inline-block', padding: '3px 9px', borderRadius: 'var(--radius-pill)',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: a.target === 'All families' ? 'var(--court-navy)' : 'var(--basketball-orange)',
                  color: '#fff',
                }}>{a.target}</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{a.body}</p>
            <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="calendar" size={12} color="var(--fg-muted)" /> {a.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="user" size={12} color="var(--fg-muted)" /> {a.author}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const TABS = ['Dashboard', 'Teams', 'Registrations', 'Standings', 'Announcements'];

export default function CommissionerApp() {
  const isMobile = useIsMobile();
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  function handleLogin(e) {
    e.preventDefault();
    if (form.username === CREDENTIALS.username && form.password === CREDENTIALS.password) {
      setAuthed(true);
    } else {
      setError('Invalid credentials.');
    }
  }

  // ── Login screen ──
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--court-navy)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', padding: 24,
      }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '36px 32px',
          width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 28 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 44, objectFit: 'contain', marginBottom: 4 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', letterSpacing: '0.04em' }}>Commissioner Portal</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600 }}>Commissioner access only</div>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <LoginField label="Username">
              <input
                value={form.username}
                onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setError(''); }}
                placeholder="commissioner"
                autoComplete="username"
                style={inputStyle}
              />
            </LoginField>
            <LoginField label="Password">
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
            </LoginField>
            {error && (
              <div style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="alert-circle" size={14} color="var(--foul-red)" /> {error}
              </div>
            )}
            <button type="submit" style={{
              marginTop: 4, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'var(--court-navy)', color: '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
            }}>
              Sign in
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(10,31,61,0.05)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Demo credentials</div>
            <div style={{ fontSize: 12, color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>commissioner / fpyc2025</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Authenticated portal ──
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bone)', fontFamily: 'var(--font-body)' }}>
      {/* Top bar */}
      <header style={{
        background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Logo row */}
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Commissioner Portal</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', marginTop: 2 }}>FPYC Basketball · Season 2025–26</div>
            </div>
          </div>
          <button
            onClick={() => setAuthed(false)}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}
          >
            <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Sign out
          </button>
        </div>

        {/* Tab row */}
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          display: 'flex', gap: 4,
          overflowX: isMobile ? 'auto' : undefined,
          WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
        }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                all: 'unset', cursor: 'pointer',
                padding: isMobile ? '10px 14px' : '10px 18px',
                fontSize: 13, fontWeight: 700,
                flexShrink: isMobile ? 0 : undefined,
                color: activeTab === tab ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.60)',
                borderBottom: activeTab === tab ? '3px solid var(--varsity-gold)' : '3px solid transparent',
                transition: 'color 120ms, border-color 120ms',
                marginBottom: -3,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px 16px 64px' : '28px 24px 64px' }}>
        {activeTab === 'Dashboard'      && <DashboardTab isMobile={isMobile} />}
        {activeTab === 'Teams'          && <TeamsTab />}
        {activeTab === 'Registrations'  && <RegistrationsTab isMobile={isMobile} />}
        {activeTab === 'Standings'      && <StandingsTab />}
        {activeTab === 'Announcements'  && <AnnouncementsTab />}
      </div>
    </div>
  );
}

// ── Helpers ──

function LoginField({ label, children }) {
  return (
    <div>
      <label style={{
        fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6,
      }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14,
  color: 'var(--fg)', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box',
};
