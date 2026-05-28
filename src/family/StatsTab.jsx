import { useStats, useGames, usePlayers } from '../shared/store.js';

const COL = ['PTS', 'REB', 'AST', 'FLS'];
const KEY = ['pts', 'reb', 'ast', 'fls'];

export default function StatsTab({ family }) {
  const [stats]   = useStats();
  const [games]   = useGames();
  const [players] = usePlayers();

  const player = players.find(p => p.name === family.child.name);
  if (!player) return <Empty />;

  const played = games
    .filter(g => g.status === 'final' && stats[g.id]?.[player.id])
    .sort((a, b) => (b.month === a.month ? b.date - a.date : 0));

  if (played.length === 0) return <Empty />;

  const lines = played.map(g => ({ game: g, stat: stats[g.id][player.id] }));
  const gp = lines.length;

  const totals = lines.reduce(
    (acc, { stat }) => ({ pts: acc.pts + stat.pts, reb: acc.reb + stat.reb, ast: acc.ast + stat.ast, fls: acc.fls + stat.fls }),
    { pts: 0, reb: 0, ast: 0, fls: 0 },
  );

  const avg = k => (totals[k] / gp).toFixed(1);

  const best = {
    pts: Math.max(...lines.map(l => l.stat.pts)),
    reb: Math.max(...lines.map(l => l.stat.reb)),
    ast: Math.max(...lines.map(l => l.stat.ast)),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Player header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--varsity-gold)' }}>
            #{player.number}
          </span>
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>{player.name}</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>{player.position} · {player.division}</div>
        </div>
      </div>

      {/* Season averages strip */}
      <div style={{
        background: 'var(--court-navy)', borderRadius: 14, padding: '18px 20px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
      }}>
        {[
          { label: 'GP',  value: gp },
          { label: 'PPG', value: avg('pts') },
          { label: 'RPG', value: avg('reb') },
          { label: 'APG', value: avg('ast') },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--varsity-gold)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Career highs */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', padding: '16px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 12 }}>Season Highs</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'Points',  value: best.pts },
            { label: 'Rebounds', value: best.reb },
            { label: 'Assists', value: best.ast },
          ].map(h => (
            <div key={h.label} style={{ textAlign: 'center', padding: '10px 8px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #F0F1F3' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--court-navy)', lineHeight: 1 }}>{h.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{h.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Game log */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid #F0F1F3' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Game Log</div>
        </div>

        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr repeat(4, 44px)',
          padding: '8px 18px', background: '#F9FAFB', borderBottom: '1px solid #F0F1F3',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Game</div>
          {COL.map(c => (
            <div key={c} style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{c}</div>
          ))}
        </div>

        {/* Rows */}
        {lines.map(({ game: g, stat: s }, i) => {
          const win = g.us > g.them;
          const isHighPts = s.pts === best.pts;
          return (
            <div key={g.id} style={{
              display: 'grid', gridTemplateColumns: '1fr repeat(4, 44px)',
              padding: '12px 18px', alignItems: 'center',
              borderBottom: i < lines.length - 1 ? '1px solid #F0F1F3' : 'none',
              background: isHighPts ? 'rgba(255,199,44,0.04)' : 'transparent',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                  <span style={{
                    fontWeight: 800, fontSize: 11, padding: '2px 6px', borderRadius: 5,
                    background: win ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.10)',
                    color: win ? '#059669' : '#DC2626',
                  }}>{win ? 'W' : 'L'} {g.us}–{g.them}</span>
                  {isHighPts && (
                    <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--varsity-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>★ Game high</span>
                  )}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{g.home ? 'vs' : '@'} {g.opponent}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>{g.day}</div>
              </div>
              {KEY.map(k => (
                <div key={k} style={{
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700,
                  color: k === 'fls' && s[k] >= 4 ? '#EF4444' : k === 'fls' && s[k] >= 3 ? '#F59E0B' : '#111827',
                }}>{s[k]}</div>
              ))}
            </div>
          );
        })}

        {/* Totals row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr repeat(4, 44px)',
          padding: '10px 18px', background: '#F0F4FF', borderTop: '2px solid #E5E7EB',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Season Total</div>
          {KEY.map(k => (
            <div key={k} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800, color: 'var(--court-navy)' }}>
              {totals[k]}
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
        Stats tracked by FPYC scorekeeper. Contact your coach to report discrepancies.
      </p>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9CA3AF' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
      <div style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginBottom: 6 }}>No stats yet</div>
      <div style={{ fontSize: 13 }}>Stats will appear here after your first game.</div>
    </div>
  );
}
