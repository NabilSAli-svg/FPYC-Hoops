import { usePlayers, useGames, useStats, useRsvps, countRsvps } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';

const TEAM = 'Fairfax Hawks';

export default function CoachHome({ coach }) {
  const [players] = usePlayers();
  const [games]   = useGames();
  const [stats]   = useStats();

  const [rsvps] = useRsvps();
  const roster  = players.filter(p => p.team === TEAM && p.status === 'active');
  const played  = games.filter(g => g.status === 'final');
  const upcoming = games.filter(g => g.status === 'scheduled').sort((a, b) => a.date - b.date);
  const next    = upcoming[0] ?? null;

  const wins   = played.filter(g => g.us > g.them).length;
  const losses = played.filter(g => g.us < g.them).length;

  // Team PPG from stats store
  let totalPts = 0, statGames = 0;
  played.forEach(g => {
    if (stats[g.id]) {
      totalPts += Object.values(stats[g.id]).reduce((s, p) => s + (p.pts || 0), 0);
      statGames++;
    }
  });
  const ppg = statGames > 0 ? (totalPts / statGames).toFixed(1) : '—';

  // Top scorer
  const playerTotals = {};
  Object.values(stats).forEach(game => {
    Object.entries(game).forEach(([pid, s]) => {
      playerTotals[pid] = (playerTotals[pid] || 0) + s.pts;
    });
  });
  const topScorerEntry = Object.entries(playerTotals).sort((a, b) => b[1] - a[1])[0];
  const topScorer = topScorerEntry ? players.find(p => p.id === topScorerEntry[0]) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Record banner */}
      <div style={{
        background: 'var(--court-navy)', borderRadius: 16, padding: '20px 22px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Season Record</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: '#fff', lineHeight: 1 }}>
            {wins}<span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 28, margin: '0 6px' }}>–</span>{losses}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
          <Stat label="PPG" value={ppg} />
          <Stat label="Roster" value={roster.length} />
          <Stat label="Games left" value={upcoming.length} />
        </div>
      </div>

      {/* Next game */}
      {next && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Next Game</div>
            <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(255,199,44,0.15)', color: 'var(--court-navy)' }}>
              {next.day}
            </div>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)', lineHeight: 1, marginBottom: 10 }}>
              {next.home ? 'vs.' : '@'} {next.opponent}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <InfoRow icon="clock"   text={next.time} />
              <InfoRow icon="map-pin" text={next.location} />
              {next.refs && <InfoRow icon="user" text={`Refs: ${next.refs}`} />}
              {(() => { const n = countRsvps(rsvps, next.id); return n > 0 ? <InfoRow icon="check-circle" text={`${n} player${n !== 1 ? 's' : ''} confirmed`} /> : null; })()}
            </div>
            {next.note && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFF9E6', border: '1px solid rgba(255,199,44,0.3)', borderRadius: 8, fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
                {next.note}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top scorer callout */}
      {topScorer && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,199,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="star" size={20} color="var(--varsity-gold)" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 2 }}>Season Leader</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{topScorer.name}</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>{topScorerEntry[1]} total points · #{topScorer.number}</div>
          </div>
        </div>
      )}

      {/* Roster quick view */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Roster · {roster.length} players</div>
        </div>
        <div>
          {roster.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '11px 18px',
              borderBottom: i < roster.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--varsity-gold)' }}>#{p.number}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.position} · {p.grade}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>
                {playerTotals[p.id] ?? 0} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past results */}
      {played.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>Results</div>
          </div>
          {[...played].reverse().map((g, i) => {
            const win = g.us > g.them;
            return (
              <div key={g.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
                borderBottom: i < played.length - 1 ? '1px solid #F9FAFB' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  background: win ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14, color: win ? '#059669' : '#DC2626',
                }}>{win ? 'W' : 'L'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{g.home ? 'vs.' : '@'} {g.opponent}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{g.day}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: '#374151' }}>{g.us}–{g.them}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Icon name={icon} size={13} color="#9CA3AF" />
      <span style={{ fontSize: 13, color: '#374151' }}>{text}</span>
    </div>
  );
}
