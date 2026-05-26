import { useState } from 'react';
import { useLocalStorage } from '../shared/useLocalStorage.js';
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
  { id: 'hawks',   name: 'Hawks',   color: '#0A1F3D' },
  { id: 'wolves',  name: 'Wolves',  color: '#1F8A5B' },
  { id: 'eagles',  name: 'Eagles',  color: '#C8102E' },
  { id: 'cougars', name: 'Cougars', color: '#E87722' },
];

function teamAvg(pids) {
  if (!pids.length) return null;
  return pids.reduce((sum, id) => sum + (ALL_PLAYERS.find(p => p.id === id)?.skill || 0), 0) / pids.length;
}

function posBreakdown(pids) {
  const counts = { Guard: 0, Forward: 0, Center: 0 };
  pids.forEach(id => {
    const p = ALL_PLAYERS.find(x => x.id === id);
    if (p) counts[p.position]++;
  });
  return counts;
}

export default function DraftBoardView() {
  const [roster, setRoster] = useLocalStorage('fpyc-draft-roster', {});
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState('skill');
  const [confirmReset, setConfirmReset] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const drafted = new Set(Object.values(roster).flat());
  const pool = ALL_PLAYERS.filter(p => !drafted.has(p.id));

  const sorted = [...pool].sort((a, b) =>
    sortBy === 'skill' ? b.skill - a.skill :
    sortBy === 'name'  ? a.name.localeCompare(b.name) :
    a.position.localeCompare(b.position)
  );

  const assign = (teamId) => {
    if (!selected) return;
    setRoster(prev => ({ ...prev, [teamId]: [...(prev[teamId] || []), selected] }));
    setSelected(null);
  };

  const remove = (teamId, pid) => {
    setRoster(prev => ({ ...prev, [teamId]: prev[teamId].filter(id => id !== pid) }));
  };

  const autoBalance = () => {
    const players = [...ALL_PLAYERS].sort((a, b) => b.skill - a.skill);
    const newRoster = {};
    TEAMS.forEach(t => { newRoster[t.id] = []; });
    const n = TEAMS.length;
    players.forEach((p, i) => {
      const round = Math.floor(i / n);
      const pos = i % n;
      const ti = round % 2 === 0 ? pos : (n - 1 - pos);
      newRoster[TEAMS[ti].id].push(p.id);
    });
    setRoster(newRoster);
    setSelected(null);
  };

  // Balance metrics
  const avgs = TEAMS.map(t => teamAvg(roster[t.id] || [])).filter(a => a !== null);
  const maxAvg = avgs.length ? Math.max(...avgs) : 0;
  const minAvg = avgs.length ? Math.min(...avgs) : 0;
  const spread = maxAvg - minAvg;
  const allDrafted = drafted.size === ALL_PLAYERS.length;
  const balanceLabel = !avgs.length ? null : spread < 0.25 ? 'Balanced' : spread < 0.5 ? 'Slightly uneven' : 'Unbalanced';
  const balanceColor = !avgs.length ? null : spread < 0.25 ? 'var(--status-win)' : spread < 0.5 ? '#E87722' : 'var(--foul-red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Pill kind="navy">{pool.length} in pool</Pill>
          <Pill kind="neutral">{drafted.size} drafted</Pill>
          {selected && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,199,44,0.15)', border: '1px solid var(--varsity-gold)', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: 'var(--court-navy)' }}>
              <Icon name="mouse-pointer" size={14} color="var(--varsity-gold)" />
              {ALL_PLAYERS.find(p => p.id === selected)?.name} — click a team to assign
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" size="sm" icon="shuffle" onClick={autoBalance}>Auto-balance</Button>
          <Button kind="ghost" size="sm" icon="rotate-ccw" onClick={() => setConfirmReset(true)}>Reset draft</Button>
          <Button kind="gold" size="sm" icon="save" onClick={() => setFinalized(true)} disabled={!allDrafted}>Finalize teams</Button>
        </div>
      </div>

      {/* Balance bar */}
      {avgs.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: balanceColor }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: balanceColor }}>{balanceLabel}</span>
            {avgs.length === TEAMS.length && (
              <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>spread {spread.toFixed(2)}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {TEAMS.map(t => {
              const avg = teamAvg(roster[t.id] || []);
              if (avg === null) return null;
              return (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: t.color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>{t.name}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-display)', color: avg === maxAvg ? balanceColor : 'var(--fg)' }}>{avg.toFixed(1)}</span>
                </div>
              );
            })}
          </div>
          {!allDrafted && avgs.length === TEAMS.length && (
            <span style={{ fontSize: 11, color: 'var(--fg-muted)', marginLeft: 'auto' }}>{pool.length} unassigned</span>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
        {/* Player pool */}
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

        {/* Teams 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {TEAMS.map(team => {
            const pids = roster[team.id] || [];
            const teamPlayers = pids.map(id => ALL_PLAYERS.find(p => p.id === id)).filter(Boolean);
            const avg = teamAvg(pids);
            const pos = posBreakdown(pids);
            return (
              <div key={team.id} onClick={() => selected && assign(team.id)} style={{
                background: '#fff', border: `2px solid ${selected ? team.color : 'var(--border)'}`,
                borderRadius: 10, overflow: 'hidden', cursor: selected ? 'pointer' : 'default',
                transition: 'all 160ms',
                boxShadow: selected ? `0 0 0 3px ${team.color}22` : 'var(--shadow-1)',
              }}>
                <div style={{ background: team.color, color: '#fff', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{team.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                        {teamPlayers.length} players{avg !== null ? ` · Avg ${avg.toFixed(1)}` : ''}
                      </div>
                    </div>
                    {selected
                      ? <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 700 }}>+ Add here</div>
                      : avg !== null && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1 }}>{avg.toFixed(1)}</div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase' }}>avg</div>
                        </div>
                      )
                    }
                  </div>
                  {teamPlayers.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {[['G', pos.Guard], ['F', pos.Forward], ['C', pos.Center]].map(([lbl, count]) => count > 0 && (
                        <div key={lbl} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 5, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>
                          {count}{lbl}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 0', minHeight: 72 }}>
                  {teamPlayers.length === 0 && (
                    <div style={{ padding: '18px 16px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 12 }}>
                      {selected ? 'Click to add player' : 'No players yet'}
                    </div>
                  )}
                  {teamPlayers.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px' }}>
                      <Jersey number={p.number} size={26} />
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position[0]}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg-muted)', minWidth: 24, textAlign: 'right' }}>{p.skill}</span>
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

      {/* Reset confirm modal */}
      {confirmReset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: '28px 28px 24px', width: '100%', maxWidth: 360, boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--court-navy)', marginBottom: 10 }}>Reset draft?</div>
            <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '0 0 22px', lineHeight: 1.5 }}>All {drafted.size} player assignments will be cleared and everyone goes back to the pool.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button kind="ghost" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
              <Button kind="danger" size="sm" icon="rotate-ccw" onClick={() => { setRoster({}); setSelected(null); setConfirmReset(false); }}>Yes, reset</Button>
            </div>
          </div>
        </div>
      )}

      {/* Finalize modal */}
      {finalized && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 580, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--court-navy)' }}>Finalize teams</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>Boys 5–6 House · Season 2025–26</div>
              </div>
              <button onClick={() => setFinalized(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6 }}>
                <Icon name="x" size={18} color="var(--fg-muted)" />
              </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {TEAMS.map(team => {
                const pids = roster[team.id] || [];
                const teamPlayers = pids.map(id => ALL_PLAYERS.find(p => p.id === id)).filter(Boolean);
                const avg = teamAvg(pids);
                return (
                  <div key={team.id} style={{ border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ background: team.color, color: '#fff', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{team.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>Avg {avg?.toFixed(1)}</div>
                    </div>
                    {teamPlayers.map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                        <Jersey number={p.number} size={22} />
                        <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
                        <span style={{ color: 'var(--fg-muted)', fontSize: 11 }}>{p.position[0]}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg-muted)' }}>{p.skill}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                Balance spread: <strong style={{ color: balanceColor }}>{spread.toFixed(2)}</strong> · {balanceLabel}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Button kind="ghost" size="sm" onClick={() => setFinalized(false)}>Back to editing</Button>
                <Button kind="gold" size="sm" icon="check">Confirm & publish</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
