import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Jersey, Pill } from '../shared/index.js';

const ALL_PLAYERS = [
  { id: 'u1',  number: 1,  name: 'Marcus Williams', grade: '5th', position: 'Guard',   school: 'Daniels Run ES', skill: 4.2 },
  { id: 'u2',  number: 2,  name: 'Sofia Torres',    grade: '5th', position: 'Forward', school: 'Providence ES',  skill: 3.8 },
  { id: 'u3',  number: 3,  name: 'Kai Johnson',     grade: '6th', position: 'Center',  school: 'Lanier MS',      skill: 4.5 },
  { id: 'u4',  number: 4,  name: 'Priya Nair',      grade: '6th', position: 'Guard',   school: 'Mosby Woods ES', skill: 3.5 },
  { id: 'u5',  number: 5,  name: 'Zach Carter',     grade: '5th', position: 'Forward', school: 'Daniels Run ES', skill: 4.0 },
  { id: 'u6',  number: 6,  name: 'Lily Okafor',     grade: '6th', position: 'Guard',   school: 'Providence ES',  skill: 3.2 },
  { id: 'u7',  number: 7,  name: 'Drew Kim',        grade: '5th', position: 'Center',  school: 'Lanier MS',      skill: 3.9 },
  { id: 'u8',  number: 8,  name: 'Aaliyah Brown',   grade: '6th', position: 'Forward', school: 'Daniels Run ES', skill: 4.3 },
  { id: 'u9',  number: 9,  name: 'Finn Murphy',     grade: '5th', position: 'Guard',   school: 'Mosby Woods ES', skill: 3.6 },
  { id: 'u10', number: 10, name: 'Nia Peterson',    grade: '6th', position: 'Center',  school: 'Providence ES',  skill: 4.1 },
  { id: 'u11', number: 11, name: 'Liam Burke',      grade: '5th', position: 'Guard',   school: 'Lanier MS',      skill: 3.4 },
  { id: 'u12', number: 12, name: 'Aria Shah',       grade: '6th', position: 'Forward', school: 'Daniels Run ES', skill: 3.7 },
];

const TEAMS = [
  { id: 'hawks', name: 'Hawks', color: '#0A1F3D' },
  { id: 'wolves', name: 'Wolves', color: '#1F8A5B' },
  { id: 'eagles', name: 'Eagles', color: '#C8102E' },
  { id: 'cougars', name: 'Cougars', color: '#E87722' },
];

export default function DraftBoardView() {
  const [roster, setRoster] = useState({});
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('skill');

  const drafted = new Set(Object.values(roster).flat());
  const pool = ALL_PLAYERS.filter(p => !drafted.has(p.id));

  const sorted = [...pool].sort((a, b) =>
    sortBy === 'skill' ? b.skill - a.skill :
    sortBy === 'name' ? a.name.localeCompare(b.name) :
    a.position.localeCompare(b.position)
  );

  const assign = (teamId) => {
    if (!selected) return;
    setRoster(prev => ({
      ...prev,
      [teamId]: [...(prev[teamId] || []), selected],
    }));
    setSelected(null);
  };

  const remove = (teamId, pid) => {
    setRoster(prev => ({ ...prev, [teamId]: prev[teamId].filter(id => id !== pid) }));
  };

  const teamAvg = (teamId) => {
    const pids = roster[teamId] || [];
    if (!pids.length) return '—';
    const avg = pids.reduce((sum, id) => sum + (ALL_PLAYERS.find(p => p.id === id)?.skill || 0), 0) / pids.length;
    return avg.toFixed(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Pill kind="navy">{pool.length} in pool</Pill>
          <Pill kind="neutral">{drafted.size} drafted</Pill>
          {selected && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,199,44,0.15)', border: '1px solid var(--varsity-gold)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: 'var(--court-navy)' }}>
              <Icon name="cursor-pointer" size={14} color="var(--varsity-gold)" />
              {ALL_PLAYERS.find(p => p.id === selected)?.name} selected — click a team to assign
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" size="sm" icon="shuffle">Auto-balance</Button>
          <Button kind="ghost" size="sm" icon="rotate-ccw">Reset draft</Button>
          <Button kind="gold" size="sm" icon="save">Finalize teams</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        {/* Player pool */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Card padding={0}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Display size={18}>Player pool</Display>
              <div style={{ display: 'flex', gap: 4, background: 'var(--bone)', borderRadius: 6, padding: 3 }}>
                {['skill', 'name', 'pos'].map(s => (
                  <button key={s} onClick={() => setSortBy(s)} style={{
                    padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
                    background: sortBy === s ? 'var(--court-navy)' : 'transparent',
                    color: sortBy === s ? '#fff' : 'var(--fg-muted)',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
              {sorted.map(p => (
                <button key={p.id} onClick={() => setSelected(selected === p.id ? null : p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', textAlign: 'left',
                  border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                  background: selected === p.id ? 'rgba(255,199,44,0.15)' : 'transparent',
                  outline: selected === p.id ? '2px solid var(--varsity-gold)' : 'none',
                  outlineOffset: -2,
                }}>
                  <Jersey number={p.number} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg)' }}>{p.skill}</div>
                    <div style={{ fontSize: 9, color: 'var(--fg-muted)', fontWeight: 700, textTransform: 'uppercase' }}>rating</div>
                  </div>
                </button>
              ))}
              {sorted.length === 0 && (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
                  All players assigned!
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Teams */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {TEAMS.map(team => {
            const teamPlayers = (roster[team.id] || []).map(id => ALL_PLAYERS.find(p => p.id === id)).filter(Boolean);
            const avg = teamAvg(team.id);
            return (
              <div key={team.id} onClick={() => selected && assign(team.id)} style={{
                background: '#fff', border: `2px solid ${selected ? team.color : 'var(--border)'}`,
                borderRadius: 10, overflow: 'hidden', cursor: selected ? 'pointer' : 'default',
                transition: 'all 160ms',
                boxShadow: selected ? `0 0 0 3px ${team.color}20` : 'var(--shadow-1)',
              }}>
                <div style={{ background: team.color, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{teamPlayers.length} players · Avg {avg}</div>
                  </div>
                  {selected && <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700 }}>+ Add here</div>}
                </div>
                <div style={{ padding: '10px 0', minHeight: 80 }}>
                  {teamPlayers.length === 0 && (
                    <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 12 }}>
                      {selected ? 'Click to add player' : 'No players yet'}
                    </div>
                  )}
                  {teamPlayers.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px' }}>
                      <Jersey number={p.number} size={26} />
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</span>
                      <button onClick={e => { e.stopPropagation(); remove(team.id, p.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4, color: 'var(--fg-muted)' }}>
                        <Icon name="x" size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
