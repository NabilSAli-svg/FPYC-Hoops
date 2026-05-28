import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill } from '../shared/index.js';
import { useIsMobile } from '../shared/useIsMobile.js';
import { csvDownload } from '../shared/csvDownload.js';
import { useDraftState, DRAFT_PLAYERS, DRAFT_TEAMS, buildSnakeOrder, INITIAL_DRAFT, useBracket, INITIAL_BRACKET, useAnnouncements } from '../shared/store.js';

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

const DIV_FEE = { 'Boys 5–6 House': 195, 'Girls 5–6 House': 195, 'Girls 3–4 House': 195, 'Boys 7–8 Select': 425 };

const FPYC_STANDINGS = {
  'Fairfax Hawks':   { div: 'Boys 5–6 House',  rank: 2, playoff: true  },
  'Fairfax Wolves':  { div: 'Girls 5–6 House', rank: 5, playoff: false },
  'Fairfax Eagles':  { div: 'Boys 7–8 Select', rank: 1, playoff: true  },
  'Fairfax Cougars': { div: 'Girls 3–4 House', rank: 5, playoff: false },
};

const SEASON_WEEKS = [
  { label: 'Registration',  dates: 'Sep–Oct',  done: true  },
  { label: 'Team draft',    dates: 'Oct',       done: true  },
  { label: 'Practices',     dates: 'Nov',       done: true  },
  { label: 'Regular season',dates: 'Dec–Jan',   done: false, current: true },
  { label: 'Playoffs',      dates: 'Jan',       done: false },
  { label: 'Awards night',  dates: 'Feb',       done: false },
];

function DashboardTab({ isMobile }) {
  const [bracket]       = useBracket();
  const [announcements] = useAnnouncements();

  const regs = INITIAL_REGS;
  const total     = regs.length;
  const approved  = regs.filter(r => r.status === 'approved').length;
  const pending   = regs.filter(r => r.status === 'pending').length;
  const waitlist  = regs.filter(r => r.status === 'waitlisted').length;
  const revenue   = regs.filter(r => r.paid).reduce((s, r) => s + (DIV_FEE[r.division] || 195), 0);
  const waiverMissing = regs.filter(r => r.status === 'approved' && !r.waiver).length;
  const recentRegs = [...regs].reverse().slice(0, 5);

  const bracketPhase = bracket.status === 'setup' ? 'Not started' : bracket.status === 'semis' ? 'Semis live' : bracket.status === 'finals' ? 'Finals live' : 'Complete';
  const bracketColor = bracket.status === 'setup' ? 'var(--fg-muted)' : bracket.status === 'complete' ? 'var(--status-win)' : 'var(--basketball-orange)';

  const kpis = [
    { label: 'Players registered', value: total,    sub: `${approved} approved · ${pending} pending`,   icon: 'users',        color: 'var(--court-navy)'        },
    { label: 'Revenue collected',  value: `$${revenue.toLocaleString()}`, sub: `${regs.filter(r=>r.paid).length} of ${total} paid`, icon: 'dollar-sign', color: 'var(--status-win)' },
    { label: 'Need action',        value: pending + waiverMissing, sub: `${pending} pending · ${waiverMissing} waivers missing`, icon: 'alert-triangle', color: pending + waiverMissing > 0 ? 'var(--basketball-orange)' : 'var(--status-win)' },
    { label: 'Bracket',            value: bracketPhase, sub: bracket.champion != null ? `Champion: ${bracket.seeds[bracket.champion]?.name}` : 'Season 2025–26', icon: 'trophy', color: bracketColor },
  ];

  const alerts = [
    pending > 0   && { kind: 'warn',  icon: 'clock',         msg: `${pending} registration${pending > 1 ? 's' : ''} awaiting approval` },
    waiverMissing > 0 && { kind: 'warn', icon: 'shield-off',  msg: `${waiverMissing} approved player${waiverMissing > 1 ? 's' : ''} missing signed waiver` },
    waitlist > 0  && { kind: 'info',  icon: 'list',          msg: `${waitlist} player${waitlist > 1 ? 's' : ''} on waitlist — review for open spots` },
    announcements.filter(a => a.pinned).length === 0 && { kind: 'info', icon: 'megaphone', msg: 'No pinned announcements — families see nothing in the website banner' },
  ].filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 14 }}>
        {kpis.map(k => (
          <Card key={k.label} padding={isMobile ? '14px 16px' : '18px 20px'}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={k.icon} size={17} color={k.color} />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28, color: k.color, lineHeight: 1, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 2 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 8, background: a.kind === 'warn' ? 'rgba(232,119,34,0.08)' : 'rgba(10,31,61,0.05)', border: `1px solid ${a.kind === 'warn' ? 'rgba(232,119,34,0.3)' : 'rgba(10,31,61,0.12)'}` }}>
              <Icon name={a.icon} size={15} color={a.kind === 'warn' ? 'var(--basketball-orange)' : 'var(--court-navy)'} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', flex: 1 }}>{a.msg}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* FPYC Teams */}
        <div>
          <Eyebrow style={{ marginBottom: 12 }}>FPYC Teams — Current Standing</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TEAMS.map(t => {
              const st = FPYC_STANDINGS[t.name];
              return (
                <Card key={t.name} padding={16}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff' }}>{t.name.split(' ')[1][0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)', marginBottom: 1 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{t.division} · Coach {t.coach}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--court-navy)' }}>{t.record}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: st.playoff ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: st.playoff ? 'var(--status-win)' : 'var(--foul-red)' }}>
                        {st.playoff ? `#${st.rank} — In playoffs` : `#${st.rank} — Out`}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Season timeline + reg breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Season Timeline</Eyebrow>
            <Card padding={18}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SEASON_WEEKS.map((w, i) => (
                  <div key={w.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: w.done ? 'var(--court-navy)' : w.current ? 'var(--varsity-gold)' : 'var(--border)' }}>
                      {w.done
                        ? <Icon name="check" size={12} color="#fff" />
                        : w.current
                          ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--court-navy)' }} />
                          : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    {i < SEASON_WEEKS.length - 1 && (
                      <div style={{ position: 'absolute', marginLeft: 11, marginTop: 24, width: 2, height: 10, background: w.done ? 'var(--court-navy)' : 'var(--border)' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: w.current ? 800 : 600, color: w.current ? 'var(--court-navy)' : w.done ? 'var(--fg)' : 'var(--fg-muted)' }}>{w.label}</span>
                      {w.current && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)' }}>NOW</span>}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>{w.dates}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Registration Breakdown</Eyebrow>
            <Card padding={18}>
              {Object.entries(
                regs.reduce((acc, r) => { acc[r.division] = (acc[r.division] || 0) + 1; return acc; }, {})
              ).map(([div, count]) => {
                const divApproved = regs.filter(r => r.division === div && r.status === 'approved').length;
                const pct = Math.round((divApproved / count) * 100);
                return (
                  <div key={div} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)' }}>{div}</span>
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{divApproved}/{count}</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, borderRadius: 999, background: 'var(--court-navy)', transition: 'width 600ms' }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', gap: 16, marginTop: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                {[['approved', 'var(--status-win)'], ['pending', 'var(--basketball-orange)'], ['waitlisted', 'var(--fg-muted)']].map(([s, c]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600 }}>{regs.filter(r => r.status === s).length} {s}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div>
        <Eyebrow style={{ marginBottom: 12 }}>Recent Registrations</Eyebrow>
        <Card padding={0}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bone)' }}>
                {['Player', 'Division', 'Date', 'Paid', 'Waiver', 'Status'].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRegs.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < recentRegs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '11px 14px', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{r.player}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--fg-muted)' }}>{r.division}</td>
                  <td style={{ padding: '11px 14px', fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{r.date}</td>
                  <td style={{ padding: '11px 14px' }}>
                    <Icon name={r.paid ? 'check-circle' : 'x-circle'} size={15} color={r.paid ? 'var(--status-win)' : 'var(--foul-red)'} />
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <Icon name={r.waiver ? 'check-circle' : 'x-circle'} size={15} color={r.waiver ? 'var(--status-win)' : 'var(--basketball-orange)'} />
                  </td>
                  <td style={{ padding: '11px 14px' }}><StatusPill status={r.status} /></td>
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

const TEMPLATES = [
  { label: 'Practice cancelled',   title: 'Practice cancelled this week', body: 'Due to gym scheduling conflicts, practice this week has been cancelled. We will resume our normal schedule next week. Stay warm!' },
  { label: 'Game postponed',       title: 'Saturday game postponed',      body: 'This Saturday\'s game has been postponed due to weather/facility issues. A make-up date will be announced shortly.' },
  { label: 'Photo day',            title: 'Team photo day — this Saturday', body: 'Team photos will be taken before your game this Saturday. Please arrive 20 minutes early in your full uniform. Order forms available at the gym.' },
  { label: 'Playoffs confirmed',   title: 'Playoffs bracket is set',      body: 'The playoff bracket has been finalized and is available on the FPYC Basketball website. Good luck to all teams!' },
  { label: 'Volunteer needed',     title: 'Volunteers needed for Saturday', body: 'We need a few parent volunteers to help with scorekeeping and concessions this Saturday. Please reply if you can help — it\'s greatly appreciated!' },
];

const TYPE_CONFIG = {
  urgent:  { color: 'var(--foul-red)',           bg: 'rgba(200,16,46,0.08)',   label: 'Urgent'  },
  info:    { color: 'var(--court-navy)',          bg: 'rgba(10,31,61,0.07)',    label: 'Info'    },
  general: { color: 'var(--basketball-orange)',   bg: 'rgba(232,119,34,0.10)', label: 'General' },
};

function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useAnnouncements();
  const [form, setForm] = useState({ title: '', body: '', target: 'All families', type: 'info', pinned: false });
  const [showTemplates, setShowTemplates] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState('');

  const now = new Date();
  const dateStr = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2500); }

  function handlePost() {
    if (!form.title.trim() || !form.body.trim()) return;
    const next = { id: `a${Date.now()}`, title: form.title.trim(), body: form.body.trim(), target: form.target, type: form.type, pinned: form.pinned, date: dateStr, author: 'Commissioner' };
    setAnnouncements(prev => [next, ...prev]);
    setForm({ title: '', body: '', target: 'All families', type: 'info', pinned: false });
    setPreview(false);
    showToast('Announcement posted');
  }

  function handleDelete(id) {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast('Announcement deleted');
  }

  function handlePin(id) {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  }

  function applyTemplate(t) {
    setForm(f => ({ ...f, title: t.title, body: t.body }));
    setShowTemplates(false);
  }

  const sorted = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  const canPost = form.title.trim() && form.body.trim();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Compose */}
      <Card padding={22}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <Eyebrow>New Announcement</Eyebrow>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button kind="ghost" size="sm" icon="file-text" onClick={() => setShowTemplates(t => !t)}>Templates</Button>
            {canPost && <Button kind="ghost" size="sm" icon="eye" onClick={() => setPreview(p => !p)}>{preview ? 'Edit' : 'Preview'}</Button>}
          </div>
        </div>

        {/* Templates drawer */}
        {showTemplates && (
          <div style={{ marginBottom: 16, padding: '12px', background: 'var(--bone)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Quick templates</div>
            {TEMPLATES.map(t => (
              <button key={t.label} onClick={() => applyTemplate(t)} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="file-text" size={13} color="var(--fg-muted)" /> {t.label}
              </button>
            ))}
          </div>
        )}

        {preview ? (
          /* Preview card */
          <div style={{ border: `1.5px solid ${TYPE_CONFIG[form.type].color}`, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ padding: '10px 14px', background: TYPE_CONFIG[form.type].bg, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name={form.type === 'urgent' ? 'alert-circle' : form.type === 'info' ? 'info' : 'megaphone'} size={14} color={TYPE_CONFIG[form.type].color} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: TYPE_CONFIG[form.type].color }}>{TYPE_CONFIG[form.type].label}</span>
              {form.pinned && <Icon name="pin" size={12} color={TYPE_CONFIG[form.type].color} />}
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600 }}>{form.target} · {dateStr}</span>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', marginBottom: 6 }}>{form.title}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>{form.body}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
            {/* Type row */}
            <div style={{ display: 'flex', gap: 8 }}>
              {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => setForm(f => ({ ...f, type: key }))} style={{ flex: 1, padding: '7px 10px', borderRadius: 7, border: `1.5px solid ${form.type === key ? cfg.color : 'var(--border)'}`, background: form.type === key ? cfg.bg : '#fff', color: form.type === key ? cfg.color : 'var(--fg-muted)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 120ms' }}>
                  {cfg.label}
                </button>
              ))}
            </div>

            <AnnField label="Title">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title…" style={annInput} />
            </AnnField>

            <AnnField label="Message" hint={`${form.body.length}/280`}>
              <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value.slice(0, 280) }))} placeholder="Write your announcement…" rows={3} style={{ ...annInput, resize: 'vertical' }} />
            </AnnField>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <AnnField label="Audience">
                  <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={{ ...annInput, cursor: 'pointer' }}>
                    {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </AnnField>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 1 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: form.pinned ? 'var(--court-navy)' : 'var(--fg-muted)', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${form.pinned ? 'var(--court-navy)' : 'var(--border)'}`, background: form.pinned ? 'rgba(10,31,61,0.06)' : '#fff', transition: 'all 120ms' }}>
                  <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} style={{ accentColor: 'var(--court-navy)' }} />
                  <Icon name="pin" size={13} color={form.pinned ? 'var(--court-navy)' : 'var(--fg-muted)'} /> Pin to top
                </label>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button kind="gold" icon="send" onClick={handlePost} disabled={!canPost}>Post announcement</Button>
        </div>
      </Card>

      {/* Posted list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eyebrow>Posted — {announcements.length} total</Eyebrow>
        </div>
        {sorted.map(a => {
          const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
          return (
            <div key={a.id} style={{ background: '#fff', border: `1px solid var(--border)`, borderLeft: `4px solid ${cfg.color}`, borderRadius: '0 10px 10px 0', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                      {a.pinned && <Icon name="pin" size={12} color="var(--court-navy)" />}
                      <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: cfg.color }}>{cfg.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 999, background: a.target === 'All families' ? 'rgba(10,31,61,0.08)' : 'rgba(232,119,34,0.12)', color: a.target === 'All families' ? 'var(--court-navy)' : 'var(--basketball-orange)' }}>{a.target}</span>
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)', marginLeft: 'auto' }}>{a.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)', lineHeight: 1.3 }}>{a.title}</div>
                  </div>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{a.body}</p>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button onClick={() => handlePin(a.id)} style={{ ...ghostBtn, color: a.pinned ? 'var(--court-navy)' : 'var(--fg-muted)' }}>
                    <Icon name="pin" size={13} color={a.pinned ? 'var(--court-navy)' : 'var(--fg-muted)'} /> {a.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button onClick={() => handleDelete(a.id)} style={{ ...ghostBtn, color: 'var(--foul-red)' }}>
                    <Icon name="trash-2" size={13} color="var(--foul-red)" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, zIndex: 300, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> {toast}
        </div>
      )}
    </div>
  );
}

function AnnField({ label, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
        {hint && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const annInput = { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box' };
const ghostBtn = { all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, padding: '4px 8px', borderRadius: 6, background: 'var(--bone)', fontFamily: 'var(--font-body)' };

// ─── Bracket Tab ──────────────────────────────────────────────────────────────

function BracketTab({ isMobile }) {
  const [bracket, setBracket] = useBracket();
  const [scores, setScores] = useState({});

  const { seeds, semis, final, status } = bracket;

  function setScore(matchId, side, val) {
    setScores(s => ({ ...s, [`${matchId}_${side}`]: val }));
  }
  function getScore(matchId, side) {
    return scores[`${matchId}_${side}`] ?? '';
  }

  function publishBracket() {
    setBracket(b => ({ ...b, status: 'semis' }));
  }

  function advanceSemis() {
    const updatedSemis = semis.map(s => {
      const sT = parseInt(getScore(s.id, 'top'))    || 0;
      const sB = parseInt(getScore(s.id, 'bottom')) || 0;
      return { ...s, scoreTop: sT, scoreBottom: sB, winner: sT >= sB ? s.top : s.bottom };
    });
    const finalTop    = updatedSemis[0].winner;
    const finalBottom = updatedSemis[1].winner;
    setBracket(b => ({ ...b, semis: updatedSemis, final: { ...b.final, top: finalTop, bottom: finalBottom }, status: 'finals' }));
    setScores({});
  }

  function crownChampion() {
    const sT = parseInt(getScore('final', 'top'))    || 0;
    const sB = parseInt(getScore('final', 'bottom')) || 0;
    const winnerIdx = sT >= sB ? final.top : final.bottom;
    setBracket(b => ({
      ...b,
      final: { ...b.final, scoreTop: sT, scoreBottom: sB, winner: winnerIdx },
      champion: winnerIdx,
      status: 'complete',
    }));
  }

  function resetBracket() {
    setBracket({ ...INITIAL_BRACKET });
    setScores({});
  }

  function SeedCard({ idx, score, isWinner, isLoser }) {
    const team = seeds[idx];
    if (!team) return <div style={{ padding: '12px 16px', borderRadius: 8, border: '1.5px dashed var(--border)', color: 'var(--fg-muted)', fontSize: 13 }}>TBD</div>;
    return (
      <div style={{
        padding: '11px 16px', borderRadius: 8,
        background: isWinner ? 'rgba(31,138,91,0.08)' : isLoser ? 'rgba(0,0,0,0.03)' : '#fff',
        border: `1.5px solid ${isWinner ? 'var(--status-win)' : isLoser ? 'var(--border)' : team.fpyc ? 'var(--varsity-gold)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', gap: 10, opacity: isLoser ? 0.55 : 1,
        transition: 'all 200ms',
      }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--fg-muted)', width: 14, flexShrink: 0 }}>#{team.seed}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {team.fpyc && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
            <span style={{ fontWeight: 700, fontSize: 13, color: isLoser ? 'var(--fg-muted)' : 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{team.record}</div>
        </div>
        {score != null && (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: isWinner ? 'var(--status-win)' : 'var(--fg-muted)', fontWeight: 700, flexShrink: 0 }}>{score}</span>
        )}
        {isWinner && <Icon name="check-circle" size={15} color="var(--status-win)" />}
      </div>
    );
  }

  function ScoreEntry({ matchId, topIdx, bottomIdx, topScore, bottomScore }) {
    const topTeam    = seeds[topIdx];
    const bottomTeam = seeds[bottomIdx];
    if (!topTeam || !bottomTeam) return null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>#{topTeam.seed} {topTeam.name.split(' ').slice(-1)[0]}</div>
          <input type="number" min="0" value={topScore ?? getScore(matchId, 'top')} readOnly={topScore != null}
            onChange={e => setScore(matchId, 'top', e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: 28, textAlign: 'center', outline: 'none', color: 'var(--court-navy)', background: topScore != null ? 'var(--bone)' : '#fff', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg-muted)', textAlign: 'center' }}>–</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', marginBottom: 6 }}>#{bottomTeam.seed} {bottomTeam.name.split(' ').slice(-1)[0]}</div>
          <input type="number" min="0" value={bottomScore ?? getScore(matchId, 'bottom')} readOnly={bottomScore != null}
            onChange={e => setScore(matchId, 'bottom', e.target.value)}
            placeholder="0"
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1.5px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: 28, textAlign: 'center', outline: 'none', color: 'var(--court-navy)', background: bottomScore != null ? 'var(--bone)' : '#fff', boxSizing: 'border-box' }}
          />
        </div>
      </div>
    );
  }

  // ── Setup ──
  if (status === 'setup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding={22}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <Display size={22}>Playoff Bracket</Display>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--fg-muted)' }}>{bracket.division} · Season {bracket.season} · 4-team single elimination</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' }}>SETUP</span>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          {semis.map((s, i) => (
            <Card key={s.id} padding={20}>
              <Eyebrow style={{ marginBottom: 14 }}>Semifinal {i + 1}</Eyebrow>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <SeedCard idx={s.top} />
                <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--fg-muted)', fontWeight: 700 }}>vs.</div>
                <SeedCard idx={s.bottom} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Date</label>
                    <input defaultValue={s.date} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Time</label>
                    <input defaultValue={s.time} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Location</label>
                  <input defaultValue={s.location} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card padding={20}>
          <Eyebrow style={{ marginBottom: 14 }}>Championship Game</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Date</label>
              <input defaultValue={final.date} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Time</label>
              <input defaultValue={final.time} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>Location</label>
              <input defaultValue={final.location} style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button kind="primary" icon="send" onClick={publishBracket}>Publish Bracket</Button>
        </div>
      </div>
    );
  }

  // ── Semis ──
  if (status === 'semis') {
    const semisComplete = semis.every(s => getScore(s.id, 'top') !== '' && getScore(s.id, 'bottom') !== '');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 4 }}>Semifinals</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff' }}>{bracket.division} Playoffs</div>
          </div>
          <Button kind="gold" icon="arrow-right" onClick={advanceSemis} disabled={!semisComplete}>Advance winners</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          {semis.map((s, i) => (
            <Card key={s.id} padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Eyebrow>Semifinal {i + 1}</Eyebrow>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.date} · {s.time}</div>
              </div>
              <ScoreEntry matchId={s.id} topIdx={s.top} bottomIdx={s.bottom} topScore={s.scoreTop} bottomScore={s.scoreBottom} />
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="map-pin" size={12} color="var(--fg-muted)" /> {s.location}
              </div>
            </Card>
          ))}
        </div>

        {/* Bracket preview */}
        <BracketPreview bracket={bracket} seeds={seeds} isMobile={isMobile} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button kind="ghost" size="sm" onClick={resetBracket}>Reset bracket</Button>
        </div>
      </div>
    );
  }

  // ── Finals ──
  if (status === 'finals') {
    const finalsComplete = getScore('final', 'top') !== '' && getScore('final', 'bottom') !== '';
    const topTeam    = seeds[final.top];
    const bottomTeam = seeds[final.bottom];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 4 }}>Championship Game</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff' }}>{final.date} · {final.time}</div>
          </div>
          <Button kind="gold" icon="trophy" onClick={crownChampion} disabled={!finalsComplete}>Crown champion</Button>
        </div>

        <Card padding={24}>
          <Eyebrow style={{ marginBottom: 16 }}>Championship · {final.location}</Eyebrow>
          <ScoreEntry matchId="final" topIdx={final.top} bottomIdx={final.bottom} topScore={final.scoreTop} bottomScore={final.scoreBottom} />
        </Card>

        <BracketPreview bracket={bracket} seeds={seeds} isMobile={isMobile} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button kind="ghost" size="sm" onClick={resetBracket}>Reset bracket</Button>
        </div>
      </div>
    );
  }

  // ── Complete ──
  const champ = seeds[bracket.champion];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'var(--court-navy)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ background: 'var(--varsity-gold)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="trophy" size={20} color="var(--court-navy)" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', color: 'var(--court-navy)', letterSpacing: '0.04em' }}>Champion Crowned</span>
        </div>
        <div style={{ padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>{bracket.season} {bracket.division} Champions</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 44px)', color: '#fff', lineHeight: 1, marginBottom: 12 }}>{champ?.name}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{champ?.record} regular season record</div>
        </div>
      </div>

      <BracketPreview bracket={bracket} seeds={seeds} isMobile={isMobile} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button kind="ghost" size="sm" onClick={resetBracket}>Reset bracket</Button>
      </div>
    </div>
  );
}

function BracketPreview({ bracket, seeds, isMobile }) {
  const { semis, final, status } = bracket;

  function TeamSlot({ idx, score, isWinner, isLoser, label }) {
    const team = idx != null ? seeds[idx] : null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 7, background: isWinner ? 'rgba(31,138,91,0.10)' : '#fff', border: `1px solid ${isWinner ? 'var(--status-win)' : 'var(--border)'}`, opacity: isLoser ? 0.45 : 1, minWidth: 0 }}>
        {team ? (
          <>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', width: 14, flexShrink: 0 }}>#{team.seed}</span>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 12, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</span>
            {score != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: isWinner ? 'var(--status-win)' : 'var(--fg-muted)', flexShrink: 0 }}>{score}</span>}
          </>
        ) : (
          <span style={{ flex: 1, fontSize: 12, color: 'var(--fg-muted)', fontStyle: 'italic' }}>{label || 'TBD'}</span>
        )}
      </div>
    );
  }

  return (
    <Card padding={20}>
      <Eyebrow style={{ marginBottom: 16 }}>Bracket</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 20px 1fr 20px 1fr', gap: isMobile ? 16 : 0, alignItems: 'center' }}>
        {/* Semis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {semis.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Semifinal {i + 1}</div>
              <TeamSlot idx={s.top}    score={s.scoreTop}    isWinner={s.winner === s.top}    isLoser={s.winner != null && s.winner !== s.top} />
              <TeamSlot idx={s.bottom} score={s.scoreBottom} isWinner={s.winner === s.bottom} isLoser={s.winner != null && s.winner !== s.bottom} />
            </div>
          ))}
        </div>

        {/* Arrow */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevron-right" size={16} color="var(--fg-muted)" />
          </div>
        )}

        {/* Final */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Championship</div>
          <TeamSlot idx={final.top}    score={final.scoreTop}    isWinner={final.winner === final.top}    isLoser={final.winner != null && final.winner !== final.top}    label="Winner SF1" />
          <TeamSlot idx={final.bottom} score={final.scoreBottom} isWinner={final.winner === final.bottom} isLoser={final.winner != null && final.winner !== final.bottom} label="Winner SF2" />
        </div>

        {/* Arrow */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevron-right" size={16} color="var(--fg-muted)" />
          </div>
        )}

        {/* Champion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Champion</div>
          {bracket.champion != null ? (
            <div style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--court-navy)', border: '1.5px solid var(--varsity-gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="trophy" size={14} color="var(--varsity-gold)" />
              <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>{seeds[bracket.champion]?.name}</span>
            </div>
          ) : (
            <div style={{ padding: '12px 14px', borderRadius: 8, border: '1.5px dashed var(--border)', color: 'var(--fg-muted)', fontSize: 13, fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="trophy" size={14} color="var(--fg-muted)" /> TBD
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Draft Tab ────────────────────────────────────────────────────────────────

function DraftTab({ isMobile }) {
  const [draft, setDraft] = useDraftState();
  const [rounds, setRounds] = useState(draft.totalRounds);

  const pickOrder = buildSnakeOrder(draft.draftOrder, draft.totalRounds);
  const draftedIds = Object.values(draft.roster).flat().map(p => p.id);
  const available = DRAFT_PLAYERS.filter(p => !draftedIds.includes(p.id));

  const currentTeamId = pickOrder[draft.currentPick];
  const currentTeam = DRAFT_TEAMS.find(t => t.id === currentTeamId);
  const currentRound = Math.floor(draft.currentPick / draft.draftOrder.length) + 1;

  function makePick(player) {
    setDraft(d => {
      const order = buildSnakeOrder(d.draftOrder, d.totalRounds);
      const teamId = order[d.currentPick];
      const round = Math.floor(d.currentPick / d.draftOrder.length) + 1;
      const newRoster = { ...d.roster, [teamId]: [...(d.roster[teamId] || []), player] };
      const newPick = d.currentPick + 1;
      const newLog = [...d.log, { pick: d.currentPick + 1, round, teamId, player }];
      const isDone = newPick >= order.length;
      return { ...d, roster: newRoster, currentPick: newPick, log: newLog, status: isDone ? 'completed' : 'live' };
    });
  }

  function autoPick() {
    if (available.length === 0) return;
    const best = [...available].sort((a, b) => b.skill - a.skill)[0];
    makePick(best);
  }

  function randomizeOrder() {
    setDraft(d => ({ ...d, draftOrder: [...d.draftOrder].sort(() => Math.random() - 0.5) }));
  }

  function openDraft() {
    setDraft(d => ({ ...d, status: 'open', totalRounds: rounds }));
  }

  function startDraft() {
    setDraft(d => ({ ...d, status: 'live' }));
  }

  function resetDraft() {
    setDraft({ ...INITIAL_DRAFT });
    setRounds(INITIAL_DRAFT.totalRounds);
  }

  // ── Setup ──
  if (draft.status === 'setup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Card padding={22}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <Display size={22}>Draft Setup</Display>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--fg-muted)' }}>{draft.division} · Season {draft.season}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' }}>SETUP</span>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: 16 }}>
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Eyebrow>Draft Order</Eyebrow>
              <Button kind="ghost" size="sm" icon="shuffle" onClick={randomizeOrder}>Randomize</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {draft.draftOrder.map((teamId, i) => {
                const team = DRAFT_TEAMS.find(t => t.id === teamId);
                return (
                  <div key={teamId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bone)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{team.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Coach {team.coach}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>Rnd 1 · Pick {i + 1}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Rounds</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[2, 3, 4].map(r => (
                  <button key={r} onClick={() => setRounds(r)} style={{
                    all: 'unset', cursor: 'pointer', width: 40, height: 40, borderRadius: 8,
                    border: rounds === r ? '2px solid var(--court-navy)' : '1.5px solid var(--border)',
                    background: rounds === r ? 'var(--court-navy)' : '#fff',
                    color: rounds === r ? '#fff' : 'var(--fg)',
                    fontWeight: 700, fontSize: 14, textAlign: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{r}</button>
                ))}
              </div>
            </div>
          </Card>

          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Eyebrow>Player Pool</Eyebrow>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600 }}>{DRAFT_PLAYERS.length} players · {rounds} rounds</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DRAFT_PLAYERS.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 8, background: 'var(--bone)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 22, textAlign: 'right', flexShrink: 0 }}>#{p.number}</span>
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--fg)' }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--court-navy)' }}>{p.skill.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button kind="primary" icon="play" onClick={openDraft}>Open Draft</Button>
        </div>
      </div>
    );
  }

  // ── Open ──
  if (draft.status === 'open') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'rgba(31,138,91,0.10)', border: '1.5px solid var(--status-win)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--status-win)', flexShrink: 0, boxShadow: '0 0 0 4px rgba(31,138,91,0.2)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg)' }}>Draft is Open</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>Coaches can review the format. Click "Start Draft" when all coaches are ready.</div>
          </div>
        </div>

        <Card padding={20}>
          <Eyebrow style={{ marginBottom: 14 }}>Pick Schedule · Snake Draft</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {Array.from({ length: draft.totalRounds }, (_, r) => {
              const roundTeams = r % 2 === 0 ? draft.draftOrder : [...draft.draftOrder].reverse();
              return (
                <div key={r}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Round {r + 1}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {roundTeams.map((teamId, i) => {
                      const team = DRAFT_TEAMS.find(t => t.id === teamId);
                      const globalPick = r * draft.draftOrder.length + i + 1;
                      return (
                        <div key={teamId + r} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', minWidth: 120 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 22, flexShrink: 0 }}>#{globalPick}</span>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{team.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={20}>
          <Eyebrow style={{ marginBottom: 14 }}>Player Pool · {DRAFT_PLAYERS.length} Players</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 8 }}>
            {DRAFT_PLAYERS.map(p => (
              <div key={p.id} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bone)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 20, flexShrink: 0 }}>#{p.number}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position} · {p.grade}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--court-navy)', flexShrink: 0 }}>{p.skill.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button kind="ghost" size="sm" onClick={() => setDraft(d => ({ ...d, status: 'setup' }))}>Back to Setup</Button>
          <Button kind="primary" icon="play" onClick={startDraft}>Start Draft</Button>
        </div>
      </div>
    );
  }

  // ── Live ──
  if (draft.status === 'live') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: currentTeam.color, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>On the clock</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', marginTop: 4, lineHeight: 1.1 }}>{currentTeam.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Pick #{draft.currentPick + 1} · Round {currentRound} · Coach {currentTeam.coach}</div>
          </div>
          <Button kind="ghost" size="sm" icon="zap" onClick={autoPick}>Auto-pick</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.4fr', gap: 16, alignItems: 'start' }}>
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Eyebrow>Available Players</Eyebrow>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600 }}>{available.length} left</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[...available].sort((a, b) => b.skill - a.skill).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 22, textAlign: 'right', flexShrink: 0 }}>#{p.number}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position} · {p.grade}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--court-navy)', marginRight: 6 }}>{p.skill.toFixed(1)}</span>
                  <button
                    onClick={() => makePick(p)}
                    style={{
                      all: 'unset', cursor: 'pointer',
                      padding: '6px 14px', borderRadius: 6,
                      fontSize: 12, fontWeight: 700,
                      background: currentTeam.color, color: '#fff',
                      flexShrink: 0, whiteSpace: 'nowrap',
                    }}
                  >Pick</button>
                </div>
              ))}
              {available.length === 0 && (
                <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--fg-muted)', padding: '20px 0' }}>All players drafted</div>
              )}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DRAFT_TEAMS.map(team => {
              const roster = draft.roster[team.id] || [];
              const isOnClock = team.id === currentTeamId;
              return (
                <Card key={team.id} padding={16} style={{ borderLeft: `4px solid ${team.color}`, opacity: isOnClock ? 1 : 0.8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: roster.length > 0 ? 10 : 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: team.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#fff' }}>{team.name[0]}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{team.name}</span>
                        {isOnClock && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: team.color, color: '#fff', letterSpacing: '0.06em' }}>ON CLOCK</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Coach {team.coach} · {roster.length} picks</div>
                    </div>
                  </div>
                  {roster.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {roster.map((p, i) => (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, background: 'var(--bone)' }}>
                          <span style={{ fontSize: 10, color: 'var(--fg-muted)', width: 14 }}>{i + 1}.</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', flex: 1 }}>{p.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</span>
                          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--court-navy)', fontWeight: 700 }}>{p.skill.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {draft.log.length > 0 && (
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 12 }}>Pick Log</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 200, overflowY: 'auto' }}>
              {[...draft.log].reverse().map(entry => {
                const team = DRAFT_TEAMS.find(t => t.id === entry.teamId);
                return (
                  <div key={entry.pick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 56, flexShrink: 0 }}>Rnd {entry.round} #{entry.pick}</span>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: team?.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg)', minWidth: 60 }}>{team?.name}</span>
                    <span style={{ fontSize: 13, color: 'var(--fg)', flex: 1 }}>{entry.player.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{entry.player.position}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ── Completed ──
  function avgSkill(teamId) {
    const players = draft.roster[teamId] || [];
    if (players.length === 0) return 0;
    return players.reduce((s, p) => s + p.skill, 0) / players.length;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>Draft complete</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--varsity-gold)' }}>{draft.division}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Season {draft.season} · {draft.log.length} picks · {draft.totalRounds} rounds</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button kind="ghost" size="sm" onClick={resetDraft}>Reset</Button>
          <button
            onClick={() => {}}
            style={{ all: 'unset', cursor: 'pointer', padding: '10px 20px', borderRadius: 8, background: 'var(--varsity-gold)', color: 'var(--court-navy)', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}
          >Publish Teams</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
        {DRAFT_TEAMS.map(team => {
          const players = draft.roster[team.id] || [];
          const avg = avgSkill(team.id);
          return (
            <Card key={team.id} padding={0} style={{ overflow: 'hidden', borderTop: `4px solid ${team.color}` }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: team.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#fff' }}>{team.name[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)' }}>{team.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Coach {team.coach} · {players.length} players</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--court-navy)' }}>{avg.toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 600 }}>avg skill</div>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                {players.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', width: 18, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 26, flexShrink: 0 }}>#{p.number}</span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 13, color: 'var(--fg)' }}>{p.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--court-navy)' }}>{p.skill.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <Card padding={20}>
        <Eyebrow style={{ marginBottom: 14 }}>Team Balance</Eyebrow>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
          {DRAFT_TEAMS.map(team => {
            const avg = avgSkill(team.id);
            return (
              <div key={team.id} style={{ padding: 14, borderRadius: 10, border: '1px solid var(--border)', background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)' }}>{team.name}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: 'var(--court-navy)', lineHeight: 1 }}>{avg.toFixed(2)}</div>
                <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: 'var(--bone)' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: team.color, width: `${(avg / 5) * 100}%`, transition: 'width 0.4s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {draft.log.length > 0 && (
        <Card padding={20}>
          <Eyebrow style={{ marginBottom: 12 }}>Complete Pick Log</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 280, overflowY: 'auto' }}>
            {draft.log.map(entry => {
              const team = DRAFT_TEAMS.find(t => t.id === entry.teamId);
              return (
                <div key={entry.pick} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 60, flexShrink: 0 }}>Rnd {entry.round} #{entry.pick}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: team?.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: team?.color, minWidth: 60 }}>{team?.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--fg)', flex: 1 }}>{entry.player.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{entry.player.position}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--court-navy)' }}>{entry.player.skill.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const TABS = ['Dashboard', 'Teams', 'Registrations', 'Standings', 'Bracket', 'Draft', 'Announcements'];

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
        {activeTab === 'Bracket'        && <BracketTab isMobile={isMobile} />}
        {activeTab === 'Draft'          && <DraftTab isMobile={isMobile} />}
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
