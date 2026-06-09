import { useState } from 'react';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import { Card, Button, Jersey, Eyebrow, Display, Pill } from '../shared/index.js';
import { printLineup } from '../shared/printSheet.js';
import { TEAM_INFO } from '../shared/store.js';

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

const COURT_SPOTS = [
  { left: '12%', top: '50%', label: 'PG' },
  { left: '34%', top: '22%', label: 'SG' },
  { left: '34%', top: '78%', label: 'SF' },
  { left: '60%', top: '30%', label: 'PF' },
  { left: '60%', top: '70%', label: 'C'  },
];

export default function LineupView({ players, games }) {
  const upcoming = (games || []).filter(g => g.status === 'scheduled' || g.status === 'live');
  const [gameIdx, setGameIdx] = useState(0);
  const game = upcoming[gameIdx] ?? games?.[0];

  const [starters, setStarters] = useLocalStorage('fpyc-lineup-starters',
    () => players.slice(0, 5).map(p => p.id));
  const [posMap, setPosMap] = useLocalStorage('fpyc-lineup-pos', () => {
    const m = {};
    players.slice(0, 5).forEach((p, i) => { m[p.id] = POSITIONS[i]; });
    return m;
  });
  const [benchOrder, setBenchOrder] = useLocalStorage('fpyc-lineup-bench', () => []);
  const [fouls, setFouls] = useState(() => Object.fromEntries(players.map(p => [p.id, 0])));
  const [toast, setToast] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  const startersList = starters.map(id => players.find(p => p.id === id)).filter(Boolean);
  const benchRaw = players.filter(p => !starters.includes(p.id));
  const bench = [
    ...benchOrder.map(id => benchRaw.find(p => p.id === id)).filter(Boolean),
    ...benchRaw.filter(p => !benchOrder.includes(p.id)),
  ];

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2200); }

  function promote(id) {
    const nextPos = POSITIONS.find(pos => !Object.values(posMap).includes(pos)) || 'PG';
    if (starters.length < 5) {
      setStarters(s => [...s, id]);
      setPosMap(m => ({ ...m, [id]: nextPos }));
    } else {
      const removed = starters[starters.length - 1];
      setStarters(s => [...s.slice(0, -1), id]);
      setPosMap(m => { const n = { ...m, [id]: m[removed] || nextPos }; delete n[removed]; return n; });
    }
    setBenchOrder(o => o.filter(x => x !== id));
  }

  function demote(id) {
    setStarters(s => s.filter(x => x !== id));
    setPosMap(m => { const n = { ...m }; delete n[id]; return n; });
  }

  function cyclePos(id) {
    const cur = posMap[id] || 'PG';
    setPosMap(m => ({ ...m, [id]: POSITIONS[(POSITIONS.indexOf(cur) + 1) % POSITIONS.length] }));
  }

  function moveBench(id, dir) {
    const ids = bench.map(p => p.id);
    const i = ids.indexOf(id);
    if (i < 0) return;
    const ni = Math.max(0, Math.min(ids.length - 1, i + dir));
    const next = [...ids];
    [next[i], next[ni]] = [next[ni], next[i]];
    setBenchOrder(next);
  }

  function addFoul(id) { setFouls(f => ({ ...f, [id]: Math.min(5, (f[id] || 0) + 1) })); }
  function remFoul(id) { setFouls(f => ({ ...f, [id]: Math.max(0, (f[id] || 0) - 1) })); }

  function handleSave() { setSavedAt(new Date()); showToast('Lineup saved!'); }
  function handleReset() {
    const ids = players.slice(0, 5).map(p => p.id);
    setStarters(ids);
    const m = {}; ids.forEach((id, i) => { m[id] = POSITIONS[i]; }); setPosMap(m);
    setBenchOrder([]);
    setFouls(Object.fromEntries(players.map(p => [p.id, 0])));
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, position: 'relative' }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '10px 22px', borderRadius: 999, fontWeight: 700, fontSize: 13, zIndex: 200, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Game selector */}
        {upcoming.length > 1 && (
          <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
            {upcoming.map((g, i) => (
              <button key={g.id} onClick={() => setGameIdx(i)} style={{
                flex: 1, padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: gameIdx === i ? 'var(--court-navy)' : 'transparent',
                color: gameIdx === i ? '#fff' : 'var(--fg-soft)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, transition: 'all 120ms',
              }}>{g.month} {g.date} · {(g.opponent || '').split(' ').slice(-1)[0]}</button>
            ))}
          </div>
        )}

        {/* Court card */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ background: 'var(--court-navy)', color: '#fff', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Eyebrow color="var(--varsity-gold)">Starting Five · {game?.day}</Eyebrow>
              <Display size={26} color="#fff" style={{ marginTop: 4 }}>{game?.home ? 'vs.' : '@'} {game?.opponent}</Display>
            </div>
            {game && <Pill kind="gold">{(game.location || 'TBD').split('·')[0].trim()}</Pill>}
          </div>

          <div style={{ position: 'relative', height: 320, background: 'linear-gradient(180deg, #C2A876 0%, #B89863 100%)', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 320" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <g fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
                <rect x="20" y="20" width="360" height="280" />
                <line x1="20" y1="160" x2="380" y2="160" />
                <circle cx="200" cy="160" r="36" />
                <rect x="20" y="100" width="80" height="120" />
                <rect x="20" y="130" width="40" height="60" />
                <circle cx="100" cy="160" r="36" />
                <rect x="300" y="100" width="80" height="120" />
                <rect x="340" y="130" width="40" height="60" />
                <circle cx="300" cy="160" r="36" />
                <path d="M20,75 C120,20 280,20 380,75" strokeDasharray="5 4" opacity="0.5" />
              </g>
            </svg>

            {COURT_SPOTS.map((spot, i) => {
              const p = startersList[i];
              const fc = p ? (fouls[p.id] || 0) : 0;
              const borderColor = fc >= 4 ? '#DC2626' : 'var(--varsity-gold)';
              return p ? (
                <div key={i} style={{ position: 'absolute', left: spot.left, top: spot.top, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--court-navy)', color: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, border: `3px solid ${borderColor}`, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                    {String(p.number).padStart(2, '0')}
                  </div>
                  <div style={{ background: '#fff', color: 'var(--court-navy)', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    {p.name.split(' ')[1] || p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: '0.10em' }}>{posMap[p.id] || spot.label}</span>
                    {fc > 0 && <span style={{ fontSize: 10, fontWeight: 800, color: fc >= 4 ? '#DC2626' : fc >= 3 ? '#D97706' : '#fff', background: 'rgba(255,255,255,0.85)', borderRadius: 999, padding: '0 5px' }}>{fc}F</span>}
                  </div>
                </div>
              ) : (
                <div key={i} style={{ position: 'absolute', left: spot.left, top: spot.top, transform: 'translate(-50%,-50%)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2.5px dashed rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>{spot.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '12px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
              <strong style={{ color: starters.length === 5 ? 'var(--status-win)' : 'var(--status-warning)' }}>{starters.length}/5</strong> starters
              {savedAt && <span style={{ marginLeft: 8, color: 'var(--fg-muted)' }}>· saved {savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" size="sm" icon="printer" onClick={() => game && printLineup(game, startersList, posMap, bench, TEAM_INFO)}>Print</Button>
              <Button kind="ghost" size="sm" icon="rotate-ccw" onClick={handleReset}>Reset</Button>
              <Button kind="gold" size="sm" icon="save" onClick={handleSave}>Save lineup</Button>
            </div>
          </div>
        </Card>

        {/* Starters list with foul counter */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Display size={20}>Starters</Display>
            <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Tap ±  to track fouls · click pos to rotate</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {startersList.map(p => {
              if (!p) return null;
              const fc = fouls[p.id] || 0;
              const foulDotColor = fc >= 4 ? '#DC2626' : fc >= 3 ? '#D97706' : 'var(--court-navy)';
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: fc >= 4 ? 'rgba(220,38,38,0.04)' : 'var(--bone)', border: `1px solid ${fc >= 4 ? 'rgba(220,38,38,0.2)' : 'var(--border)'}`, borderRadius: 8 }}>
                  <Jersey number={p.number} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                  </div>
                  {/* Foul counter */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => remFoul(p.id)} style={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'var(--border)', fontSize: 16, color: 'var(--fg-soft)', fontWeight: 700 }}>−</button>
                    <div style={{ display: 'flex', gap: 3, padding: '0 4px' }}>
                      {[1,2,3,4,5].map(n => (
                        <span key={n} style={{ width: 9, height: 9, borderRadius: '50%', background: n <= fc ? foulDotColor : 'var(--border)', display: 'inline-block', transition: 'background 150ms' }} />
                      ))}
                    </div>
                    <button onClick={() => addFoul(p.id)} style={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'var(--border)', fontSize: 16, color: 'var(--fg-soft)', fontWeight: 700 }}>+</button>
                  </div>
                  <button onClick={() => cyclePos(p.id)} title="Click to change position" style={{ all: 'unset', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, padding: '3px 10px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)', transition: 'opacity 120ms' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    {posMap[p.id] || '—'}
                  </button>
                  <Button kind="quiet" size="sm" icon="arrow-down" onClick={() => demote(p.id)}>Bench</Button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Bench with rotation order */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Display size={20}>Bench · {bench.length}</Display>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>↑↓ to set sub order</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bench.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < 3 ? 'var(--court-navy)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: i < 3 ? '#fff' : 'var(--fg-muted)', flexShrink: 0 }}>
                {i + 1}
              </div>
              <Jersey number={p.number} size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginRight: 2 }}>
                <button onClick={() => moveBench(p.id, -1)} disabled={i === 0} style={{ all: 'unset', cursor: i === 0 ? 'default' : 'pointer', opacity: i === 0 ? 0.25 : 0.65, fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1, padding: '1px 5px', textAlign: 'center' }}>▲</button>
                <button onClick={() => moveBench(p.id, 1)} disabled={i === bench.length - 1} style={{ all: 'unset', cursor: i === bench.length - 1 ? 'default' : 'pointer', opacity: i === bench.length - 1 ? 0.25 : 0.65, fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1, padding: '1px 5px', textAlign: 'center' }}>▼</button>
              </div>
              <Button kind="gold" size="sm" icon="arrow-up" onClick={() => promote(p.id)}>Start</Button>
            </div>
          ))}
          {bench.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: 'var(--fg-muted)' }}>All players are starters</div>
          )}
        </div>
      </Card>
    </div>
  );
}
