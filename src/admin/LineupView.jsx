import { useState } from 'react';
import { Card, Pill, Button, Jersey, Eyebrow, Display } from '../shared/index.js';

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

export default function LineupView({ players, game }) {
  const [starters, setStarters] = useState(players.slice(0, 5).map(p => p.id));
  const [posMap, setPosMap] = useState(() => {
    const m = {};
    players.slice(0, 5).forEach((p, i) => { m[p.id] = POSITIONS[i]; });
    return m;
  });
  const startersList = starters.map(id => players.find(p => p.id === id));
  const bench = players.filter(p => !starters.includes(p.id));

  const promote = (id) => {
    const nextPos = POSITIONS.find(pos => !Object.values(posMap).includes(pos)) || 'PG';
    if (starters.length < 5) {
      setStarters(s => [...s, id]);
      setPosMap(m => ({ ...m, [id]: nextPos }));
    } else {
      const removed = starters[starters.length - 1];
      setStarters(s => [...s.slice(0, -1), id]);
      setPosMap(m => { const n = { ...m, [id]: m[removed] || nextPos }; delete n[removed]; return n; });
    }
  };
  const demote = (id) => {
    setStarters(s => s.filter(x => x !== id));
    setPosMap(m => { const n = { ...m }; delete n[id]; return n; });
  };
  const cyclePos = (id) => {
    const cur = posMap[id] || 'PG';
    const next = POSITIONS[(POSITIONS.indexOf(cur) + 1) % POSITIONS.length];
    setPosMap(m => ({ ...m, [id]: next }));
  };

  const courtPositions = [
    { left: '12%', top: '50%', label: 'PG' },
    { left: '34%', top: '22%', label: 'SG' },
    { left: '34%', top: '78%', label: 'SF' },
    { left: '60%', top: '30%', label: 'PF' },
    { left: '60%', top: '70%', label: 'C' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ background: 'var(--court-navy)', color: '#fff', padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Eyebrow color="var(--varsity-gold)">Starting Five · {game.day}</Eyebrow>
              <Display size={26} color="#fff" style={{ marginTop: 4 }}>vs. {game.opponent}</Display>
            </div>
            <Pill kind="gold">{game.location.split('·')[0].trim()}</Pill>
          </div>

          {/* Court diagram */}
          <div style={{ position: 'relative', height: 320, background: 'linear-gradient(180deg, #C2A876 0%, #B89863 100%)', overflow: 'hidden' }}>
            <svg viewBox="0 0 400 320" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <g fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2">
                <rect x="20" y="20" width="360" height="280" />
                <line x1="20" y1="160" x2="380" y2="160" />
                <circle cx="200" cy="160" r="36" />
                <rect x="20" y="100" width="80" height="120" />
                <rect x="20" y="130" width="40" height="60" />
                <circle cx="100" cy="160" r="36" />
                <rect x="300" y="100" width="80" height="120" />
                <rect x="340" y="130" width="40" height="60" />
                <circle cx="300" cy="160" r="36" />
              </g>
            </svg>
            {courtPositions.map((pos, i) => {
              const p = startersList[i];
              return p ? (
                <div key={i} style={{ position: 'absolute', left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', background: 'var(--court-navy)',
                    color: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 24, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                    border: '3px solid var(--varsity-gold)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  }}>{String(p.number).padStart(2, '0')}</div>
                  <div style={{ background: '#fff', color: 'var(--court-navy)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    {p.name.split(' ')[1] || p.name}
                  </div>
                  <div style={{ fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: '0.10em' }}>{posMap[p.id] || pos.label}</div>
                </div>
              ) : null;
            })}
          </div>

          <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}><strong>{starters.length}/5</strong> starters set · <span style={{ color: 'var(--fg-muted)' }}>Click position badge to rotate</span></span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" size="sm" icon="rotate-ccw" onClick={() => {
                const ids = players.slice(0, 5).map(p => p.id);
                setStarters(ids);
                const m = {}; ids.forEach((id, i) => { m[id] = POSITIONS[i]; }); setPosMap(m);
              }}>Reset</Button>
              <Button kind="primary" icon="save">Save lineup</Button>
            </div>
          </div>
        </Card>

        <Card>
          <Display size={20}>Starters</Display>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {startersList.map((p) => p && (
              <PlayerRow key={p.id} player={p} pos={posMap[p.id]}
                onCyclePos={() => cyclePos(p.id)}
                action={<Button kind="quiet" size="sm" icon="arrow-down" onClick={() => demote(p.id)}>Bench</Button>}
              />
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <Display size={20}>Bench · {bench.length}</Display>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, maxHeight: 720, overflowY: 'auto' }}>
          {bench.map(p => (
            <PlayerRow key={p.id} player={p}
              action={<Button kind="gold" size="sm" icon="arrow-up" onClick={() => promote(p.id)}>Start</Button>}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function PlayerRow({ player, pos, onCyclePos, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8 }}>
      <Jersey number={player.number} size={36} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{player.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{player.grade} · {player.position}</div>
      </div>
      {pos && onCyclePos ? (
        <button onClick={onCyclePos} title="Click to change position" style={{
          all: 'unset', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.08em',
          padding: '3px 10px', borderRadius: 999,
          background: 'var(--varsity-gold)', color: 'var(--court-navy)',
          transition: 'opacity 120ms',
        }} onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
           onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {pos}
        </button>
      ) : pos ? <Pill kind="gold">{pos}</Pill> : null}
      {action}
    </div>
  );
}
