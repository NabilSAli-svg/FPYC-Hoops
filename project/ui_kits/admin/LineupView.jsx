/* global React */
const { useState: useStateL } = React;

window.LineupView = function LineupView({ players, game }) {
  const [starters, setStarters] = useStateL(players.slice(0, 5).map(p => p.id));
  const startersList = starters.map(id => players.find(p => p.id === id));
  const bench = players.filter(p => !starters.includes(p.id));

  const swap = (outId, inId) => {
    setStarters(s => s.map(id => id === outId ? inId : id));
  };
  const promote = (id) => {
    if (starters.length < 5) setStarters([...starters, id]);
    else swap(starters[starters.length - 1], id);
  };
  const demote = (id) => {
    setStarters(s => s.filter(x => x !== id));
  };

  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];

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

          {/* Court */}
          <div style={{
            position: 'relative',
            height: 320,
            background: 'linear-gradient(180deg, #C2A876 0%, #B89863 100%)',
            overflow: 'hidden',
          }}>
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
            {/* Player tokens */}
            {[
              { left: '12%', top: '50%', label: 'PG' },
              { left: '34%', top: '22%', label: 'SG' },
              { left: '34%', top: '78%', label: 'SF' },
              { left: '60%', top: '30%', label: 'PF' },
              { left: '60%', top: '70%', label: 'C' },
            ].map((pos, i) => {
              const p = startersList[i];
              return p ? (
                <div key={i} style={{
                  position: 'absolute', left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%', background: 'var(--court-navy)',
                    color: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 24, fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                    border: '3px solid var(--varsity-gold)', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  }}>{String(p.number).padStart(2, '0')}</div>
                  <div style={{ background: '#fff', color: 'var(--court-navy)', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>{p.name.split(' ')[1] || p.name}</div>
                  <div style={{ fontSize: 10, color: '#fff', fontWeight: 700, letterSpacing: '0.10em' }}>{pos.label}</div>
                </div>
              ) : null;
            })}
          </div>
          <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}><strong>{starters.length}/5</strong> starters set</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" size="sm" icon="rotate-ccw">Reset</Button>
              <Button kind="primary" icon="save">Save lineup</Button>
            </div>
          </div>
        </Card>

        <Card>
          <Display size={20}>Starters</Display>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {startersList.map((p, i) => p && (
              <PlayerRow key={p.id} player={p} pos={positions[i]} action={
                <Button kind="quiet" size="sm" icon="arrow-down" onClick={() => demote(p.id)}>Bench</Button>
              }/>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <Display size={20}>Bench · {bench.length}</Display>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, maxHeight: 720, overflow: 'auto' }}>
          {bench.map(p => (
            <PlayerRow key={p.id} player={p} action={
              <Button kind="gold" size="sm" icon="arrow-up" onClick={() => promote(p.id)}>Start</Button>
            }/>
          ))}
        </div>
      </Card>
    </div>
  );
};

function PlayerRow({ player, pos, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 10px', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8 }}>
      <Jersey number={player.number} size={36}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{player.name}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{player.grade} · {player.position}</div>
      </div>
      {pos ? <Pill kind="gold">{pos}</Pill> : null}
      {action}
    </div>
  );
}
