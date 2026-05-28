import { useState } from 'react';
import { usePlayers } from '../shared/store.js';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import Icon from '../shared/Icon.jsx';

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

export default function CoachLineup({ team }) {
  const [players] = usePlayers();
  const roster = players.filter(p => p.team === team.name && p.status === 'active');

  const defaultStarters = roster.slice(0, 5).map(p => p.id);
  const [starters, setStarters] = useLocalStorage(team.lineupKey, defaultStarters);
  const [posMap, setPosMap]     = useLocalStorage('fpyc-lineup-pos', () => {
    const m = {};
    roster.slice(0, 5).forEach((p, i) => { m[p.id] = POSITIONS[i]; });
    return m;
  });

  const [dragId, setDragId] = useState(null);
  const [saved, setSaved] = useState(false);

  const bench = roster.filter(p => !starters.includes(p.id));
  const startingFive = starters.map(id => roster.find(p => p.id === id)).filter(Boolean);

  function toggleStarter(pid) {
    if (starters.includes(pid)) {
      if (starters.length <= 1) return;
      setStarters(prev => prev.filter(id => id !== pid));
      setSaved(false);
    } else {
      if (starters.length >= 5) return;
      setStarters(prev => [...prev, pid]);
      setSaved(false);
    }
  }

  function setPos(pid, pos) {
    setPosMap(m => ({ ...m, [pid]: pos }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Starting 5 */}
      <div style={{ background: 'var(--court-navy)', borderRadius: 16, padding: '18px 18px 20px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.5)' }}>Starting Five</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginTop: 2 }}>{team.name}</div>
          </div>
          <CourtIcon />
        </div>

        {/* Half-court visual */}
        <div style={{ position: 'relative', height: 190, background: '#1A3A6C', borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
          <CourtMarkings />
          {PLAYER_SPOTS.map((spot, i) => {
            const player = startingFive[i];
            const pos = player ? (posMap[player.id] || POSITIONS[i]) : POSITIONS[i];
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `${spot.x}%`, top: `${spot.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                cursor: player ? 'pointer' : 'default',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: player ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.15)',
                  border: player ? '2px solid rgba(255,255,255,0.6)' : '2px dashed rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {player
                    ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800, color: 'var(--court-navy)' }}>#{player.number}</span>
                    : <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.3)' }}>+</span>
                  }
                </div>
                <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 4, padding: '1px 5px' }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
                    {player ? player.name.split(' ')[1] ?? player.name : pos}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Starter rows */}
        {startingFive.map((p, i) => (
          <div key={p?.id ?? i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 0',
            borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--varsity-gold)', width: 28 }}>
              {p ? `#${p.number}` : '—'}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{p?.name ?? 'Empty'}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{p?.grade ?? ''}</div>
            </div>
            {p && (
              <select
                value={posMap[p.id] || POSITIONS[i]}
                onChange={e => setPos(p.id, e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', borderRadius: 6, padding: '4px 6px', fontSize: 12, fontWeight: 700,
                  fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none',
                }}
              >
                {POSITIONS.map(pos => <option key={pos} value={pos} style={{ background: 'var(--court-navy)' }}>{pos}</option>)}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Bench */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>
            Bench · {bench.length} players
          </div>
        </div>
        {bench.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>All players in starting lineup</div>
        ) : bench.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px',
            borderBottom: i < bench.length - 1 ? '1px solid #F9FAFB' : 'none',
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#F4F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#374151' }}>#{p.number}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.position} · {p.grade}</div>
            </div>
            <button
              onClick={() => toggleStarter(p.id)}
              disabled={starters.length >= 5}
              style={{
                background: starters.length >= 5 ? '#F4F5F7' : 'var(--court-navy)',
                color: starters.length >= 5 ? '#9CA3AF' : '#fff',
                border: 'none', borderRadius: 7, padding: '6px 12px',
                fontSize: 12, fontWeight: 700, cursor: starters.length >= 5 ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              {starters.length >= 5 ? 'Full' : '+ Start'}
            </button>
          </div>
        ))}
      </div>

      {/* Starters — remove button */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Adjust Starters</div>
        </div>
        {startingFive.map((p, i) => (
          <div key={p?.id ?? i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px',
            borderBottom: i < 4 ? '1px solid #F9FAFB' : 'none',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--court-navy)', width: 28 }}>#{p?.number}</span>
            <div style={{ flex: 1, fontWeight: 600, fontSize: 13, color: '#111' }}>{p?.name}</div>
            <button
              onClick={() => toggleStarter(p.id)}
              style={{
                background: 'rgba(239,68,68,0.08)', color: '#DC2626',
                border: '1px solid rgba(239,68,68,0.2)', borderRadius: 7,
                padding: '5px 10px', fontSize: 12, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
              }}
            >
              Bench
            </button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '14px', borderRadius: 10, border: 'none',
          background: saved ? '#059669' : 'var(--court-navy)',
          color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'background 300ms',
        }}
      >
        <Icon name={saved ? 'check' : 'save'} size={16} color="#fff" />
        {saved ? 'Lineup saved!' : 'Save lineup'}
      </button>
    </div>
  );
}

const PLAYER_SPOTS = [
  { x: 50, y: 82 },  // PG — top of key
  { x: 20, y: 60 },  // SG — left wing
  { x: 80, y: 60 },  // SF — right wing
  { x: 30, y: 30 },  // PF — left block
  { x: 70, y: 30 },  // C  — right block
];

function CourtMarkings() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 300 190" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
      {/* Baseline */}
      <line x1="0" y1="180" x2="300" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
      {/* Paint */}
      <rect x="105" y="120" width="90" height="60" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      {/* Free throw line */}
      <line x1="105" y1="120" x2="195" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      {/* 3-point arc */}
      <path d="M 30 180 Q 150 20 270 180" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      {/* Free throw arc */}
      <path d="M 105 120 Q 150 80 195 120" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      {/* Basket */}
      <circle cx="150" cy="165" r="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      <line x1="150" y1="159" x2="150" y2="180" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
    </svg>
  );
}

function CourtIcon() {
  return (
    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="layout-grid" size={18} color="rgba(255,255,255,0.4)" />
    </div>
  );
}
