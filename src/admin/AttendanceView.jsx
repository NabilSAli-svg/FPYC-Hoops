import { useState } from 'react';
import { Card, Button, Icon, Display, Jersey } from '../shared/index.js';
import { usePractices, useGames, useAttendance } from '../shared/store.js';
import { csvDownload } from '../shared/csvDownload.js';

const STATUS = {
  present: { label: 'P', color: 'var(--status-win)',     bg: 'rgba(31,138,91,0.10)'  },
  absent:  { label: 'A', color: 'var(--foul-red)',       bg: 'rgba(200,16,46,0.08)'  },
  excused: { label: 'E', color: 'var(--status-warning)', bg: 'rgba(224,168,0,0.10)'  },
  none:    { label: '—', color: 'var(--whistle-300)',    bg: 'transparent'            },
};

const CYCLE = ['present', 'absent', 'excused', 'none'];

function deriveSessions(games, practices) {
  const gameSessions = games
    .filter(g => g.status === 'final')
    .map(g => ({ id: g.id, type: 'game', label: `${g.month} ${g.date}`, day: g.weekday, location: g.location }));
  const practiceSessions = practices
    .map(p => ({
      id: p.id, type: 'practice',
      label: (p.date || '').split(', ')[1] || p.date,
      day: p.date.split(',')[0].trim(),
      location: p.gym,
    }));
  return [...gameSessions, ...practiceSessions];
}

function hasConsecutiveAbsences(pid, sessions, attendance, n = 2) {
  let streak = 0;
  for (const s of sessions) {
    if ((attendance[pid]?.[s.id] ?? 'none') === 'absent') { streak++; if (streak >= n) return true; }
    else streak = 0;
  }
  return false;
}

function exportAttendanceCSV(players, sessions, attendance) {
  const headers = ['Player', '#', 'Rate', ...sessions.map(s => `${s.label} (${s.type})`)];
  const rows = players.map(p => {
    const present = sessions.filter(s => (attendance[p.id]?.[s.id] ?? 'none') === 'present').length;
    const pct = sessions.length > 0 ? `${Math.round(present / sessions.length * 100)}%` : '0%';
    return [p.name, p.number, pct, ...sessions.map(s => attendance[p.id]?.[s.id] ?? 'none')];
  });
  csvDownload('fpyc-attendance.csv', [headers, ...rows]);
}

export default function AttendanceView({ players }) {
  const [games]     = useGames();
  const [practices] = usePractices();
  const [filter, setFilter] = useState('all');

  const allSessions = deriveSessions(games, practices);

  const [rows, setRows] = useAttendance();
  const attendance = {};
  rows.forEach(r => {
    (attendance[r.player_id] ??= {})[r.session_id] = r.status;
  });

  const sessions = filter === 'all' ? allSessions
    : allSessions.filter(s => s.type === filter);

  const flagged = players.filter(p => hasConsecutiveAbsences(p.id, allSessions, attendance));

  const toggle = (pid, sid) => {
    const cur = attendance[pid]?.[sid] ?? 'none';
    const next = CYCLE[(CYCLE.indexOf(cur) + 1) % CYCLE.length];
    const id = `${pid}_${sid}`;
    setRows(prev => {
      const without = prev.filter(r => r.id !== id);
      return next === 'none' ? without : [...without, { id, player_id: pid, session_id: sid, status: next }];
    });
  };

  const countForSession = (sid, status) =>
    players.filter(p => (attendance[p.id]?.[sid] ?? 'none') === status).length;

  const countForPlayer = (pid, status) =>
    allSessions.filter(s => (attendance[pid]?.[s.id] ?? 'none') === status).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Consecutive-absence alert */}
      {flagged.length > 0 && (
        <div style={{ background: 'rgba(200,16,46,0.07)', border: '1.5px solid rgba(200,16,46,0.25)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="alert-triangle" size={18} color="var(--foul-red)" />
          <div style={{ flex: 1, fontSize: 13, color: '#7f1d1d' }}>
            <strong>{flagged.map(p => p.name.split(' ')[0]).join(', ')}</strong>{' '}
            {flagged.length === 1 ? 'has' : 'have'} 2+ consecutive absences — consider reaching out.
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'all',      label: `All · ${allSessions.length}` },
            { id: 'practice', label: `Practices · ${allSessions.filter(s => s.type === 'practice').length}` },
            { id: 'game',     label: `Games · ${allSessions.filter(s => s.type === 'game').length}` },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: filter === t.id ? 'var(--court-navy)' : 'transparent',
              color: filter === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            }}>{t.label}</button>
          ))}
        </div>
        <Button kind="ghost" icon="download" size="sm" onClick={() => exportAttendanceCSV(players, allSessions, attendance)}>Export</Button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(STATUS).filter(([k]) => k !== 'none').map(([k, v]) => (
          <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 20, height: 20, borderRadius: 4, background: v.bg, border: `1px solid ${v.color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, color: v.color }}>{v.label}</span>
            <span style={{ color: 'var(--fg-soft)', textTransform: 'capitalize' }}>{k}</span>
          </span>
        ))}
        <span style={{ color: 'var(--fg-muted)', fontSize: 12 }}>Click a cell to cycle</span>
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
                <th key={s.id} style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', minWidth: 68 }}>
                  <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.day}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--court-navy)', lineHeight: 1.1 }}>{s.label}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 6px', borderRadius: 999, background: s.type === 'game' ? 'var(--court-navy)' : 'var(--border)', color: s.type === 'game' ? '#fff' : 'var(--fg-muted)' }}>{s.type}</span>
                  </div>
                </th>
              ))}
              <th style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)', minWidth: 72 }}>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Rate</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => {
              const total   = allSessions.length;
              const present = countForPlayer(p.id, 'present');
              const pct     = total > 0 ? Math.round((present / total) * 100) : 0;
              const flaggedPlayer = flagged.includes(p);
              return (
                <tr key={p.id} style={{ borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none', background: flaggedPlayer ? 'rgba(200,16,46,0.02)' : 'transparent' }}>
                  <td style={{ padding: '10px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Jersey number={p.number} size={28} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          {p.name}
                          {flaggedPlayer && <Icon name="alert-circle" size={13} color="var(--foul-red)" />}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                      </div>
                    </div>
                  </td>
                  {sessions.map(s => {
                    const st = attendance[p.id]?.[s.id] ?? 'none';
                    const sv = STATUS[st];
                    return (
                      <td key={s.id} style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', padding: 4 }}>
                        <button onClick={() => toggle(p.id, s.id)} title={`${p.name} · ${s.label} · click to cycle`} style={{
                          width: 32, height: 32, borderRadius: 6,
                          border: `1px solid ${st === 'none' ? 'var(--border)' : sv.color}`,
                          background: sv.bg, color: sv.color, fontWeight: 700, fontSize: 13,
                          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 120ms',
                        }}>{sv.label}</button>
                      </td>
                    );
                  })}
                  <td style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', padding: '0 12px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: pct >= 80 ? 'var(--status-win)' : pct >= 60 ? 'var(--status-warning)' : 'var(--foul-red)' }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: 'var(--fg-muted)', fontWeight: 600 }}>{present}/{total}</div>
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
    </div>
  );
}
