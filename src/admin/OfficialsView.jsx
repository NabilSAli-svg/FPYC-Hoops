import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill } from '../shared/index.js';
import { useIsMobile } from '../shared/useIsMobile.js';

const REFS_INITIAL = [
  { id: 'r1', name: 'James Park',    cert: 'VBOS Level 2', phone: '(703) 555-0210', email: 'j.park@email.com',     games: 8,  rate: 35, paid: true,  available: true  },
  { id: 'r2', name: 'Marcus Lee',    cert: 'VBOS Level 2', phone: '(703) 555-0238', email: 'm.lee@email.com',      games: 6,  rate: 35, paid: false, available: true  },
  { id: 'r3', name: 'Sara Okafor',   cert: 'VBOS Level 1', phone: '(703) 555-0191', email: 's.okafor@email.com',   games: 4,  rate: 28, paid: true,  available: false },
  { id: 'r4', name: 'Devon Tyler',   cert: 'VBOS Level 1', phone: '(703) 555-0174', email: 'd.tyler@email.com',    games: 5,  rate: 28, paid: false, available: true  },
  { id: 'r5', name: 'Priya Nair',    cert: 'Provisional',  phone: '(703) 555-0162', email: 'p.nair@email.com',     games: 2,  rate: 22, paid: true,  available: true  },
  { id: 'r6', name: 'Leon Baptiste', cert: 'VBOS Level 3', phone: '(703) 555-0259', email: 'l.baptiste@email.com', games: 11, rate: 45, paid: false, available: true  },
];

const ASSIGNMENTS_INITIAL = [
  { id: 'g1', game: 'Dec 7 vs. Vienna Storm',       refs: ['James Park', 'Marcus Lee'],    status: 'confirmed'  },
  { id: 'g2', game: 'Dec 14 @ Reston Wolves',       refs: ['Leon Baptiste', 'Devon Tyler'], status: 'confirmed'  },
  { id: 'g3', game: 'Dec 21 @ Burke Lakers',        refs: ['James Park', 'TBD'],            status: 'partial'    },
  { id: 'g4', game: 'Jan 4 vs. McLean Mustangs',    refs: ['TBD', 'TBD'],                  status: 'unassigned' },
  { id: 'g5', game: 'Jan 11 vs. Springfield Bulls', refs: ['TBD', 'TBD'],                  status: 'unassigned' },
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
  const [tab, setTab] = useState('roster');
  const [refs, setRefs] = useState(REFS_INITIAL);
  const [assignments, setAssignments] = useState(ASSIGNMENTS_INITIAL);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [assignGame, setAssignGame] = useState(null);
  const [selectedRefs, setSelectedRefs] = useState([]);
  const [toast, setToast] = useState('');

  const totalOwed = refs.filter(r => !r.paid).reduce((s, r) => s + r.games * r.rate, 0);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Registered officials', value: refs.length,                                          icon: 'user-check',    color: 'var(--court-navy)'        },
          { label: 'Available this week',  value: refs.filter(r => r.available).length,                 icon: 'calendar-check', color: 'var(--status-win)'       },
          { label: 'Games unassigned',     value: assignments.filter(g => g.status === 'unassigned').length, icon: 'alert-circle', color: 'var(--foul-red)'      },
          { label: 'Payments pending',     value: `$${totalOwed}`,                                      icon: 'dollar-sign',   color: 'var(--basketball-orange)'  },
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

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[
          { id: 'roster',      label: 'Officials roster' },
          { id: 'assignments', label: 'Game assignments' },
          { id: 'payments',    label: 'Payments' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px 16px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            color: tab === t.id ? 'var(--court-navy)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 160ms',
          }}>{t.label}</button>
        ))}
        <div style={{ flex: 1 }} />
        <Button kind="gold" icon="user-plus" onClick={() => { setShowAdd(true); setForm(emptyForm()); }}>Add official</Button>
      </div>

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
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: r.available ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: r.available ? 'var(--status-win)' : 'var(--foul-red)' }}>
                    {r.available ? 'Available' : 'Unavailable'}
                  </span>
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
                  {['Official', 'Certification', 'Contact', 'Rate', 'Games', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: r.available ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: r.available ? 'var(--status-win)' : 'var(--foul-red)', display: 'inline-block', width: 'fit-content' }}>
                          {r.available ? 'Available' : 'Unavailable'}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: r.paid ? 'rgba(31,138,91,0.10)' : 'rgba(232,119,34,0.10)', color: r.paid ? 'var(--status-win)' : 'var(--basketball-orange)', display: 'inline-block', width: 'fit-content' }}>
                          {r.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
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

      {/* ── ASSIGNMENTS ── */}
      {tab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {assignments.map(g => (
            <Card key={g.id} padding={0} style={{ overflow: 'hidden' }}>
              <div style={{ display: isMobile ? 'flex' : 'grid', flexDirection: isMobile ? 'column' : undefined, gridTemplateColumns: '1fr auto auto', gap: isMobile ? 10 : 18, alignItems: isMobile ? 'flex-start' : 'center', padding: '16px 20px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 15 : 20, color: 'var(--court-navy)', textTransform: 'uppercase' }}>{g.game}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                    {g.refs.map((ref, ri) => (
                      <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: ref === 'TBD' ? 'rgba(200,16,46,0.08)' : 'rgba(10,31,61,0.06)', border: `1px solid ${ref === 'TBD' ? 'rgba(200,16,46,0.20)' : 'var(--border)'}` }}>
                        <Icon name={ref === 'TBD' ? 'help-circle' : 'user-check'} size={12} color={ref === 'TBD' ? 'var(--foul-red)' : 'var(--court-navy)'} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: ref === 'TBD' ? 'var(--foul-red)' : 'var(--court-navy)' }}>{ref === 'TBD' ? 'Ref needed' : ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Pill kind={g.status === 'confirmed' ? 'navy' : g.status === 'partial' ? 'warn' : 'neutral'}>
                  {g.status === 'confirmed' ? 'Confirmed' : g.status === 'partial' ? 'Partial' : 'Unassigned'}
                </Pill>
                <Button kind={g.status === 'confirmed' ? 'ghost' : 'gold'} size="sm" icon="user-plus" onClick={() => openAssign(g)}>
                  {g.status === 'confirmed' ? 'Edit' : 'Assign refs'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab === 'payments' && (
        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <Display size={20}>Payment tracker</Display>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" size="sm" icon="download">Export CSV</Button>
              <Button kind="gold" size="sm" icon="check" onClick={markAllPaid}>Mark all paid</Button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 500 : 'auto' }}>
              <thead>
                <tr style={{ background: 'var(--bone)' }}>
                  {['Official', 'Games', 'Rate', 'Amount due', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {refs.map((r, i) => {
                  const owed = r.games * r.rate;
                  return (
                    <tr key={r.id} style={{ borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none', background: r.paid ? '#fff' : 'rgba(232,119,34,0.03)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14 }}>{r.name}</td>
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
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', background: 'var(--bone)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Total outstanding</span>
            <Display size={28} color="var(--basketball-orange)">${totalOwed}</Display>
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
          <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--fg-soft)' }}>
            Select up to 2 officials for this game.{' '}
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
