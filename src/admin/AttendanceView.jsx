import { useState } from 'react';
import { Card, Button, Pill, Icon, Display, Eyebrow, Jersey } from '../shared/index.js';

const SESSIONS = [
  { id: 's1', type: 'practice', label: 'Nov 3',  day: 'Sun', location: 'Daniels Run ES' },
  { id: 's2', type: 'practice', label: 'Nov 5',  day: 'Tue', location: 'Daniels Run ES' },
  { id: 's3', type: 'practice', label: 'Nov 10', day: 'Sun', location: 'Daniels Run ES' },
  { id: 's4', type: 'practice', label: 'Nov 12', day: 'Tue', location: 'Daniels Run ES' },
  { id: 's5', type: 'game',     label: 'Nov 16', day: 'Sat', location: 'Robinson HS · Gym B' },
  { id: 's6', type: 'game',     label: 'Nov 23', day: 'Sat', location: 'Cooper MS · Main' },
];

const STATUS = {
  present: { label: 'P', color: 'var(--status-win)',  bg: 'rgba(31,138,91,0.10)'  },
  absent:  { label: 'A', color: 'var(--foul-red)',    bg: 'rgba(200,16,46,0.08)'  },
  excused: { label: 'E', color: 'var(--status-warning)', bg: 'rgba(224,168,0,0.10)' },
  none:    { label: '—', color: 'var(--whistle-300)', bg: 'transparent' },
};

function initAttendance(players) {
  const map = {};
  players.forEach(p => {
    map[p.id] = {};
    SESSIONS.forEach(s => {
      const roll = Math.random();
      map[p.id][s.id] = roll > 0.85 ? 'absent' : roll > 0.75 ? 'excused' : 'present';
    });
  });
  return map;
}

const CYCLE = ['present', 'absent', 'excused', 'none'];

export default function AttendanceView({ players }) {
  const [filter, setFilter] = useState('all');
  const [attendance, setAttendance] = useState(() => initAttendance(players));
  const [showAdd, setShowAdd] = useState(false);

  const sessions = filter === 'all' ? SESSIONS : SESSIONS.filter(s => s.type === filter);

  const toggle = (pid, sid) => {
    setAttendance(prev => {
      const cur = prev[pid][sid] || 'none';
      const next = CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length];
      return { ...prev, [pid]: { ...prev[pid], [sid]: next } };
    });
  };

  const countForSession = (sid, status) =>
    players.filter(p => attendance[p.id]?.[sid] === status).length;

  const countForPlayer = (pid, status) =>
    SESSIONS.filter(s => attendance[pid]?.[s.id] === status).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[{ id: 'all', label: 'All sessions' }, { id: 'practice', label: 'Practices' }, { id: 'game', label: 'Games' }].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: filter === t.id ? 'var(--court-navy)' : 'transparent',
              color: filter === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" icon="download" size="sm">Export</Button>
          <Button kind="gold" icon="plus" onClick={() => setShowAdd(true)}>Log session</Button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
        {Object.entries(STATUS).filter(([k]) => k !== 'none').map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 20, height: 20, borderRadius: 4, background: v.bg, border: `1px solid ${v.color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: v.color }}>{v.label}</span>
            <span style={{ color: 'var(--fg-soft)', textTransform: 'capitalize' }}>{k}</span>
          </span>
        ))}
        <span style={{ color: 'var(--fg-muted)', fontSize: 12, marginLeft: 4 }}>Click a cell to cycle status</span>
      </div>

      {/* Grid */}
      <Card padding={0} style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
          <thead>
            <tr style={{ background: 'var(--bone)' }}>
              <th style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700, borderBottom: '1px solid var(--border)', minWidth: 200 }}>
                Player
              </th>
              {sessions.map(s => (
                <th key={s.id} style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', minWidth: 70 }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.day}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--court-navy)', lineHeight: 1.1 }}>{s.label}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 999, background: s.type === 'game' ? 'var(--court-navy)' : 'var(--border)', color: s.type === 'game' ? '#fff' : 'var(--fg-muted)' }}>{s.type}</span>
                  </div>
                </th>
              ))}
              <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', minWidth: 80 }}>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Rate</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              const pct = Math.round((countForPlayer(p.id, 'present') / SESSIONS.length) * 100);
              return (
                <tr key={p.id} style={{ borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '10px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Jersey number={p.number} size={28} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                      </div>
                    </div>
                  </td>
                  {sessions.map(s => {
                    const st = attendance[p.id]?.[s.id] || 'none';
                    const sv = STATUS[st];
                    return (
                      <td key={s.id} style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', padding: 4 }}>
                        <button onClick={() => toggle(p.id, s.id)} title="Click to cycle" style={{
                          width: 32, height: 32, borderRadius: 6, border: `1px solid ${st === 'none' ? 'var(--border)' : sv.color}`,
                          background: sv.bg, color: sv.color, fontWeight: 700, fontSize: 13,
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 120ms',
                        }}>{sv.label}</button>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', padding: '0 12px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: pct >= 80 ? 'var(--status-win)' : pct >= 60 ? 'var(--status-warning)' : 'var(--foul-red)' }}>{pct}%</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: 'var(--bone)', borderTop: '2px solid var(--border)' }}>
              <td style={{ padding: '10px 18px', fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Session total</td>
              {sessions.map(s => (
                <td key={s.id} style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', padding: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-win)' }}>{countForSession(s.id, 'present')}P</div>
                  <div style={{ fontSize: 11, color: 'var(--foul-red)' }}>{countForSession(s.id, 'absent')}A</div>
                </td>
              ))}
              <td style={{ borderLeft: '1px solid var(--border)' }} />
            </tr>
          </tfoot>
        </table>
      </Card>

      {showAdd && <AddSessionModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

function AddSessionModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 440, boxShadow: 'var(--shadow-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Display size={24}>Log session</Display>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Date" type="date" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Type</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Practice', 'Game', 'Scrimmage'].map(t => (
                <button key={t} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid var(--border)', background: t === 'Practice' ? 'var(--court-navy)' : 'transparent', color: t === 'Practice' ? '#fff' : 'var(--fg)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{t}</button>
              ))}
            </div>
          </div>
          <Field label="Location" placeholder="e.g. Daniels Run ES" />
          <Field label="Notes" placeholder="Optional notes…" />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'flex-end' }}>
          <Button kind="ghost" onClick={onClose}>Cancel</Button>
          <Button kind="gold" icon="check">Save session</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <input type={type} placeholder={placeholder} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box' }} />
    </div>
  );
}
