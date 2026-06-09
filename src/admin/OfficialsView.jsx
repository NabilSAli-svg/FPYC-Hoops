import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill } from '../shared/index.js';
import { useIsMobile } from '../shared/useIsMobile.js';
import { csvDownload } from '../shared/csvDownload.js';

function exportPaymentsCSV(refs) {
  const headers = ['Name', 'Certification', 'Phone', 'Email', 'Games', 'Rate/Game', 'Total Owed', 'Paid'];
  const rows = refs.map(r => [
    r.name, r.cert, r.phone, r.email, r.games,
    `$${r.rate}`, r.paid ? '$0' : `$${r.games * r.rate}`, r.paid ? 'Yes' : 'No',
  ]);
  csvDownload('fpyc-officials-payments.csv', [headers, ...rows]);
}

const REFS_INITIAL = [
  { id: 'r1', name: 'James Park',    cert: 'VBOS Level 2', phone: '(703) 555-0210', email: 'j.park@email.com',     games: 8,  rate: 35, paid: true,  available: true  },
  { id: 'r2', name: 'Marcus Lee',    cert: 'VBOS Level 2', phone: '(703) 555-0238', email: 'm.lee@email.com',      games: 6,  rate: 35, paid: false, available: true  },
  { id: 'r3', name: 'Sara Okafor',   cert: 'VBOS Level 1', phone: '(703) 555-0191', email: 's.okafor@email.com',   games: 4,  rate: 28, paid: true,  available: false },
  { id: 'r4', name: 'Devon Tyler',   cert: 'VBOS Level 1', phone: '(703) 555-0174', email: 'd.tyler@email.com',    games: 5,  rate: 28, paid: false, available: true  },
  { id: 'r5', name: 'Priya Nair',    cert: 'Provisional',  phone: '(703) 555-0162', email: 'p.nair@email.com',     games: 2,  rate: 22, paid: true,  available: true  },
  { id: 'r6', name: 'Leon Baptiste', cert: 'VBOS Level 3', phone: '(703) 555-0259', email: 'l.baptiste@email.com', games: 11, rate: 45, paid: false, available: true  },
];

const ASSIGNMENTS_INITIAL = [
  { id: 'g1', game: 'Hawks vs. Vienna Storm',   day: 'Sat Dec 7',  time: '10:00 AM', location: 'FPYC Gym A',     home: true,  refs: ['James Park', 'Marcus Lee'],    status: 'confirmed'  },
  { id: 'g2', game: 'Hawks @ Reston Wolves',    day: 'Sat Dec 14', time: '11:30 AM', location: 'Reston Rec Center', home: false, refs: ['Leon Baptiste', 'Devon Tyler'], status: 'confirmed'  },
  { id: 'g3', game: 'Hawks @ Burke Lakers',     day: 'Sat Dec 21', time: '9:00 AM',  location: 'Burke Lake Park Gym', home: false, refs: ['James Park', 'TBD'],       status: 'partial'    },
  { id: 'g4', game: 'Hawks vs. McLean Mustangs',day: 'Sat Jan 4',  time: '10:00 AM', location: 'FPYC Gym B',     home: true,  refs: ['TBD', 'TBD'],                  status: 'unassigned' },
  { id: 'g5', game: 'Hawks vs. Springfield Bulls', day: 'Sat Jan 11', time: '1:00 PM', location: 'FPYC Gym A',   home: true,  refs: ['TBD', 'TBD'],                  status: 'unassigned' },
];

const CERT_COLOR = {
  'VBOS Level 3': 'var(--varsity-gold)',
  'VBOS Level 2': 'var(--court-navy)',
  'VBOS Level 1': 'var(--basketball-orange)',
  'Provisional':  'var(--fg-muted)',
};

const CERTS = ['VBOS Level 1', 'VBOS Level 2', 'VBOS Level 3', 'Provisional'];
const CERT_RATE = { 'VBOS Level 3': 45, 'VBOS Level 2': 35, 'VBOS Level 1': 28, 'Provisional': 22 };

function emptyForm() {
  return { firstName: '', lastName: '', email: '', phone: '', cert: 'VBOS Level 1', rate: '28' };
}

export default function OfficialsView() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState('dashboard');
  const [refs, setRefs] = useState(REFS_INITIAL);
  const [assignments, setAssignments] = useState(ASSIGNMENTS_INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [assignGame, setAssignGame] = useState(null);
  const [selectedRefs, setSelectedRefs] = useState([]);
  const [toast, setToast] = useState('');

  const totalOwed = refs.filter(r => !r.paid).reduce((s, r) => s + r.games * r.rate, 0);
  const unpaidCount = refs.filter(r => !r.paid).length;
  const unassigned = assignments.filter(g => g.status === 'unassigned');
  const partial = assignments.filter(g => g.status === 'partial');
  const availableRefs = refs.filter(r => r.available);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function handleAddOfficial() {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
    setRefs(rs => [...rs, {
      id: 'r' + Date.now(), name,
      cert: form.cert,
      phone: form.phone.trim() || '—',
      email: form.email.trim() || '—',
      games: 0,
      rate: parseInt(form.rate) || CERT_RATE[form.cert],
      paid: true,
      available: true,
    }]);
    setShowAdd(false);
    setForm(emptyForm());
    showToast(`${name} added`);
  }

  function markPaid(id) {
    const ref = refs.find(r => r.id === id);
    setRefs(rs => rs.map(r => r.id === id ? { ...r, paid: true } : r));
    showToast(`${ref.name} marked paid`);
  }

  function markAllPaid() {
    setRefs(rs => rs.map(r => ({ ...r, paid: true })));
    showToast('All officials marked paid');
  }

  function toggleAvailability(id) {
    const ref = refs.find(r => r.id === id);
    const next = !ref.available;
    setRefs(rs => rs.map(r => r.id === id ? { ...r, available: next } : r));
    showToast(`${ref.name} marked ${next ? 'available' : 'unavailable'}`);
  }

  function toggleRefSelect(name) {
    setSelectedRefs(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : prev.length < 2 ? [...prev, name] : prev
    );
  }

  function confirmAssignment() {
    if (!assignGame) return;
    const filled = [...selectedRefs];
    while (filled.length < 2) filled.push('TBD');
    const status = filled.every(r => r !== 'TBD') ? 'confirmed' : filled.some(r => r !== 'TBD') ? 'partial' : 'unassigned';
    setAssignments(as => as.map(a => a.id === assignGame.id ? { ...a, refs: filled, status } : a));
    showToast(`Officials assigned to ${assignGame.game}`);
    setAssignGame(null);
    setSelectedRefs([]);
  }

  function openAssign(g) {
    setAssignGame(g);
    setSelectedRefs(g.refs.filter(r => r !== 'TBD'));
  }

  const TABS = [
    { id: 'dashboard',   label: 'Dashboard',   icon: 'layout' },
    { id: 'roster',      label: 'Officials',   icon: 'users' },
    { id: 'assignments', label: 'Schedule',    icon: 'calendar' },
    { id: 'payments',    label: 'Payments',    icon: 'dollar-sign' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', flexWrap: 'wrap', alignItems: 'center' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 16px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 6,
            color: tab === t.id ? 'var(--court-navy)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 160ms',
          }}>
            <Icon name={t.icon} size={14} color={tab === t.id ? 'var(--court-navy)' : 'var(--fg-muted)'} />
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <Button kind="gold" icon="user-plus" onClick={() => { setShowAdd(true); setForm(emptyForm()); }}>Add official</Button>
      </div>

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Registered officials', value: refs.length,          icon: 'user-check',     color: 'var(--court-navy)'        },
              { label: 'Available this week',  value: availableRefs.length, icon: 'calendar-check', color: 'var(--status-win)'        },
              { label: 'Games unassigned',     value: unassigned.length + partial.length, icon: 'alert-circle', color: 'var(--foul-red)' },
              { label: 'Payments pending',     value: `$${totalOwed}`,      icon: 'dollar-sign',    color: 'var(--basketball-orange)' },
            ].map((s, i) => (
              <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={s.icon} size={20} color={s.color} />
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 22 : 28, lineHeight: 1, color: 'var(--court-navy)' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 3 }}>{s.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Alerts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {unassigned.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(200,16,46,0.07)', border: '1px solid rgba(200,16,46,0.25)', borderRadius: 8, padding: '12px 16px' }}>
                <Icon name="alert-circle" size={16} color="var(--foul-red)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', flex: 1 }}>
                  {unassigned.length} game{unassigned.length > 1 ? 's' : ''} fully unassigned — refs needed
                </span>
                <Button kind="ghost" size="sm" onClick={() => setTab('assignments')}>View schedule</Button>
              </div>
            )}
            {partial.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(232,119,34,0.08)', border: '1px solid rgba(232,119,34,0.25)', borderRadius: 8, padding: '12px 16px' }}>
                <Icon name="alert-triangle" size={16} color="var(--basketball-orange)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', flex: 1 }}>
                  {partial.length} game{partial.length > 1 ? 's' : ''} still need a second ref
                </span>
                <Button kind="ghost" size="sm" onClick={() => setTab('assignments')}>Assign now</Button>
              </div>
            )}
            {unpaidCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(232,119,34,0.06)', border: '1px solid rgba(232,119,34,0.18)', borderRadius: 8, padding: '12px 16px' }}>
                <Icon name="dollar-sign" size={16} color="var(--basketball-orange)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', flex: 1 }}>
                  ${totalOwed} owed to {unpaidCount} official{unpaidCount > 1 ? 's' : ''}
                </span>
                <Button kind="ghost" size="sm" onClick={() => setTab('payments')}>View payments</Button>
              </div>
            )}
            {unassigned.length === 0 && partial.length === 0 && unpaidCount === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(31,138,91,0.07)', border: '1px solid rgba(31,138,91,0.20)', borderRadius: 8, padding: '12px 16px' }}>
                <Icon name="check-circle" size={16} color="var(--status-win)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>All games covered and payments up to date</span>
              </div>
            )}
          </div>

          {/* Upcoming games needing action */}
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Upcoming Games</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {assignments.map(g => (
                <Card key={g.id} padding={0} style={{ overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ width: 4, alignSelf: 'stretch', background: g.status === 'confirmed' ? 'var(--status-win)' : g.status === 'partial' ? 'var(--basketball-orange)' : 'var(--foul-red)', flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: isMobile ? 10 : 20, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)', marginBottom: 3 }}>{g.game}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="calendar" size={11} color="var(--fg-muted)" /> {g.day} · {g.time}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon name="map-pin" size={11} color="var(--fg-muted)" /> {g.location}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {g.refs.map((ref, ri) => (
                            <span key={ri} style={{ fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: ref === 'TBD' ? 'rgba(200,16,46,0.10)' : 'rgba(10,31,61,0.07)', color: ref === 'TBD' ? 'var(--foul-red)' : 'var(--court-navy)' }}>
                              {ref === 'TBD' ? 'TBD' : ref}
                            </span>
                          ))}
                        </div>
                        <Button kind={g.status === 'confirmed' ? 'ghost' : 'gold'} size="sm" icon="user-plus" onClick={() => { openAssign(g); setTab('assignments'); }}>
                          {g.status === 'confirmed' ? 'Edit' : 'Assign'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Available refs this week */}
          <div>
            <Eyebrow style={{ marginBottom: 12 }}>Available Officials This Week</Eyebrow>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 10 }}>
              {refs.map(r => (
                <Card key={r.id} padding={14} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: r.available ? 1 : 0.5 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: r.available ? 'var(--court-navy)' : 'var(--fg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--varsity-gold)', flexShrink: 0 }}>
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{r.cert}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, flexShrink: 0, background: r.available ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: r.available ? 'var(--status-win)' : 'var(--foul-red)' }}>
                    {r.available ? 'Available' : 'Out'}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ROSTER ── */}
      {tab === 'roster' && (
        isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {refs.map(r => (
              <Card key={r.id} padding={16}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--varsity-gold)', flexShrink: 0 }}>
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: `${CERT_COLOR[r.cert]}18`, color: CERT_COLOR[r.cert] }}>{r.cert}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>${r.rate}/game</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{r.games} games</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    onClick={() => toggleAvailability(r.id)}
                    style={{ all: 'unset', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: r.available ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: r.available ? 'var(--status-win)' : 'var(--foul-red)', border: `1px solid ${r.available ? 'rgba(31,138,91,0.25)' : 'rgba(200,16,46,0.20)'}` }}
                  >
                    {r.available ? 'Available' : 'Unavailable'}
                  </button>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: r.paid ? 'rgba(31,138,91,0.10)' : 'rgba(232,119,34,0.10)', color: r.paid ? 'var(--status-win)' : 'var(--basketball-orange)' }}>
                    {r.paid ? 'Paid' : 'Unpaid'}
                  </span>
                  <Button kind="ghost" size="sm" icon="mail">Contact</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding={0}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bone)' }}>
                  {['Official', 'Certification', 'Contact', 'Rate', 'Games', 'Availability', 'Payment', ''].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refs.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', background: '#fff' }}>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--varsity-gold)', flexShrink: 0 }}>
                          {r.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: `${CERT_COLOR[r.cert]}18`, color: CERT_COLOR[r.cert] }}>{r.cert}</span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--fg-soft)' }}>
                      <div>{r.phone}</div>
                      <div style={{ color: 'var(--court-navy)' }}>{r.email}</div>
                    </td>
                    <td style={{ padding: '13px 16px', fontFamily: 'var(--font-mono)', fontSize: 14 }}>${r.rate}/game</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}><Display size={22}>{r.games}</Display></td>
                    <td style={{ padding: '13px 16px' }}>
                      <button
                        onClick={() => toggleAvailability(r.id)}
                        title="Click to toggle availability"
                        style={{ all: 'unset', cursor: 'pointer', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: r.available ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: r.available ? 'var(--status-win)' : 'var(--foul-red)', border: `1px solid ${r.available ? 'rgba(31,138,91,0.25)' : 'rgba(200,16,46,0.20)'}`, transition: 'all 120ms' }}
                      >
                        {r.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: r.paid ? 'rgba(31,138,91,0.10)' : 'rgba(232,119,34,0.10)', color: r.paid ? 'var(--status-win)' : 'var(--basketball-orange)' }}>
                        {r.paid ? 'Paid' : `$${r.games * r.rate} owed`}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <Button kind="ghost" size="sm" icon="mail">Contact</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      )}

      {/* ── SCHEDULE / ASSIGNMENTS ── */}
      {tab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {assignments.map(g => {
            const statusColor = g.status === 'confirmed' ? 'var(--status-win)' : g.status === 'partial' ? 'var(--basketball-orange)' : 'var(--foul-red)';
            return (
              <Card key={g.id} padding={0} style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 5, background: statusColor, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    {/* Game header */}
                    <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 15 : 18, color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{g.game}</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 5, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="calendar" size={11} color="var(--fg-muted)" /> {g.day} · {g.time}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="map-pin" size={11} color="var(--fg-muted)" /> {g.location}
                          </span>
                          <span style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Icon name="shirt" size={11} color="var(--fg-muted)" /> {g.home ? 'Home — Navy jerseys' : 'Away — White jerseys'}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: `${statusColor}18`, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {g.status === 'confirmed' ? 'Confirmed' : g.status === 'partial' ? 'Partial' : 'Unassigned'}
                        </span>
                        <Button kind={g.status === 'confirmed' ? 'ghost' : 'gold'} size="sm" icon="user-plus" onClick={() => openAssign(g)}>
                          {g.status === 'confirmed' ? 'Edit' : 'Assign refs'}
                        </Button>
                      </div>
                    </div>
                    {/* Refs row */}
                    <div style={{ padding: '10px 18px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Officials:</span>
                      {g.refs.map((ref, ri) => (
                        <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: ref === 'TBD' ? 'rgba(200,16,46,0.08)' : 'rgba(10,31,61,0.06)', border: `1px solid ${ref === 'TBD' ? 'rgba(200,16,46,0.20)' : 'var(--border)'}` }}>
                          <Icon name={ref === 'TBD' ? 'help-circle' : 'user-check'} size={12} color={ref === 'TBD' ? 'var(--foul-red)' : 'var(--court-navy)'} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: ref === 'TBD' ? 'var(--foul-red)' : 'var(--court-navy)' }}>{ref === 'TBD' ? 'Ref needed' : ref}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab === 'payments' && (
        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <Display size={20}>Payment tracker</Display>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" size="sm" icon="download" onClick={() => exportPaymentsCSV(refs)}>Export CSV</Button>
              <Button kind="gold" size="sm" icon="check" onClick={markAllPaid}>Mark all paid</Button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 'auto' : 500 }}>
              <thead>
                <tr style={{ background: 'var(--bone)' }}>
                  {['Official', 'Cert', 'Games', 'Rate', 'Amount due', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refs.map((r, i) => {
                  const owed = r.games * r.rate;
                  return (
                    <tr key={r.id} style={{ borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', background: r.paid ? '#fff' : 'rgba(232,119,34,0.03)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--varsity-gold)', flexShrink: 0 }}>
                            {r.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: `${CERT_COLOR[r.cert]}18`, color: CERT_COLOR[r.cert] }}>{r.cert}</span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{r.games}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--fg-muted)' }}>${r.rate}</td>
                      <td style={{ padding: '12px 16px', fontFamily: 'var(--font-display)', fontSize: 22, color: r.paid ? 'var(--fg-muted)' : 'var(--court-navy)' }}>${owed}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: r.paid ? 'rgba(31,138,91,0.10)' : 'rgba(232,119,34,0.10)', color: r.paid ? 'var(--status-win)' : 'var(--basketball-orange)' }}>
                          {r.paid ? 'Paid' : `$${owed} owed`}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {!r.paid && <Button kind="ghost" size="sm" icon="check" onClick={() => markPaid(r.id)}>Mark paid</Button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', background: 'var(--bone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{unpaidCount} official{unpaidCount !== 1 ? 's' : ''} unpaid</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Total outstanding</span>
              <Display size={28} color="var(--basketball-orange)">${totalOwed}</Display>
            </div>
          </div>
        </Card>
      )}

      {/* ── Add Official Modal ── */}
      {showAdd && (
        <Modal title="Add official" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            {[
              { key: 'firstName', label: 'First name', placeholder: 'First' },
              { key: 'lastName',  label: 'Last name',  placeholder: 'Last' },
              { key: 'email',     label: 'Email',      placeholder: 'email@example.com' },
              { key: 'phone',     label: 'Phone',      placeholder: '(703) 555-0000' },
            ].map(f => (
              <div key={f.key}>
                <FieldLabel>{f.label}</FieldLabel>
                <input
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={modalInput}
                />
              </div>
            ))}
            <div>
              <FieldLabel>Certification</FieldLabel>
              <select
                value={form.cert}
                onChange={e => setForm(prev => ({ ...prev, cert: e.target.value, rate: String(CERT_RATE[e.target.value]) }))}
                style={{ ...modalInput, cursor: 'pointer' }}
              >
                {CERTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Rate per game ($)</FieldLabel>
              <input
                type="number"
                value={form.rate}
                onChange={e => setForm(prev => ({ ...prev, rate: e.target.value }))}
                placeholder="35"
                style={modalInput}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button kind="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button
              kind="gold" icon="check"
              onClick={handleAddOfficial}
              disabled={!form.firstName.trim() || !form.lastName.trim()}
            >Add official</Button>
          </div>
        </Modal>
      )}

      {/* ── Assign Refs Modal ── */}
      {assignGame && (
        <Modal title={`Assign officials — ${assignGame.game}`} onClose={() => { setAssignGame(null); setSelectedRefs([]); }}>
          <div style={{ marginBottom: 4, padding: '10px 14px', borderRadius: 8, background: 'var(--bone)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--fg-muted)' }}>
            <span style={{ fontWeight: 700, color: 'var(--fg)' }}>{assignGame.day} · {assignGame.time}</span> · {assignGame.location}
          </div>
          <div style={{ margin: '14px 0 10px', fontSize: 13, color: 'var(--fg-soft)' }}>
            Select up to 2 officials.{' '}
            <strong style={{ color: selectedRefs.length === 2 ? 'var(--status-win)' : 'var(--court-navy)' }}>{selectedRefs.length}/2 selected.</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {refs.filter(r => r.available).map(r => {
              const checked = selectedRefs.includes(r.name);
              return (
                <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${checked ? 'var(--varsity-gold)' : 'var(--border)'}`, cursor: !checked && selectedRefs.length >= 2 ? 'not-allowed' : 'pointer', background: checked ? 'rgba(255,199,44,0.07)' : '#fff', transition: 'all 120ms', opacity: !checked && selectedRefs.length >= 2 ? 0.5 : 1 }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRefSelect(r.name)}
                    disabled={!checked && selectedRefs.length >= 2}
                    style={{ accentColor: 'var(--varsity-gold)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{r.cert} · ${r.rate}/game</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: 'rgba(31,138,91,0.10)', color: 'var(--status-win)' }}>Available</span>
                </label>
              );
            })}
            {refs.filter(r => r.available).length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--fg-muted)', fontSize: 14 }}>No officials marked available this week.</div>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <Button kind="ghost" onClick={() => { setAssignGame(null); setSelectedRefs([]); }}>Cancel</Button>
            <Button kind="gold" icon="check" onClick={confirmAssignment} disabled={selectedRefs.length === 0}>Confirm assignment</Button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '10px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, zIndex: 300, boxShadow: 'var(--shadow-3)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> {toast}
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children }) {
  return <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{children}</label>;
}

const modalInput = {
  width: '100%', boxSizing: 'border-box', padding: '9px 12px',
  borderRadius: 7, border: '1.5px solid var(--border)',
  fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
  background: 'var(--bone)', color: 'var(--fg)',
};

function Modal({ title, onClose, children }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, boxShadow: 'var(--shadow-3)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Display size={22}>{title}</Display>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
