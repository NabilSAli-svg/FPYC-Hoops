import { Card, Display, Eyebrow, Pill } from '../shared/index.js';
import { useStandings, INITIAL_STANDINGS } from '../shared/store.js';

function ScoringChart({ games }) {
  const final = [...games].filter(g => g.status === 'final').reverse();
  if (!final.length) return null;
  const maxScore = Math.max(...final.flatMap(g => [g.us, g.them]), 1);
  const H = 80, barW = 14, gap = 5, groupW = 52;
  const totalW = final.length * groupW;
  return (
    <svg width={totalW} height={H + 46} viewBox={`0 0 ${totalW} ${H + 46}`} style={{ display: 'block', overflow: 'visible' }}>
      {final.map((g, i) => {
        const win = g.us > g.them;
        const x = i * groupW + (groupW - barW * 2 - gap) / 2;
        const usH = Math.max(Math.round((g.us / maxScore) * H), 2);
        const themH = Math.max(Math.round((g.them / maxScore) * H), 2);
        return (
          <g key={g.id}>
            <rect x={x} y={H - usH} width={barW} height={usH} rx={3} style={{ fill: win ? '#FFC72C' : '#0A1F3D' }} />
            <text x={x + barW / 2} y={H - usH - 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: win ? '#059669' : '#DC2626', fontFamily: 'Arial,sans-serif' }}>{g.us}</text>
            <rect x={x + barW + gap} y={H - themH} width={barW} height={themH} rx={3} style={{ fill: '#D1D5DB' }} />
            <text x={x + barW + gap + barW / 2} y={H - themH - 4} textAnchor="middle" style={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'Arial,sans-serif' }}>{g.them}</text>
            <text x={x + barW + gap / 2} y={H + 14} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: win ? '#059669' : '#DC2626', fontFamily: 'Arial,sans-serif' }}>{win ? 'W' : 'L'}</text>
            <text x={x + barW + gap / 2} y={H + 27} textAnchor="middle" style={{ fontSize: 9, fill: '#9CA3AF', fontFamily: 'Arial,sans-serif' }}>{g.month} {g.date}</text>
            <text x={x + barW + gap / 2} y={H + 39} textAnchor="middle" style={{ fontSize: 9, fill: '#6B7280', fontFamily: 'Arial,sans-serif' }}>{(g.opponent || '').split(' ').slice(-1)[0]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function computeStats(games) {
  const final = games.filter(g => g.status === 'final');
  const scheduled = games.filter(g => g.status === 'scheduled');
  const wins = final.filter(g => g.us > g.them).length;
  const losses = final.length - wins;
  const pf = final.reduce((s, g) => s + g.us, 0);
  const pa = final.reduce((s, g) => s + g.them, 0);
  const homeGames = final.filter(g => g.home);
  const homeW = homeGames.filter(g => g.us > g.them).length;
  const awayGames = final.filter(g => !g.home);
  const awayW = awayGames.filter(g => g.us > g.them).length;
  const margin = final.length ? ((pf - pa) / final.length).toFixed(1) : '0.0';
  const ppg = final.length ? (pf / final.length).toFixed(1) : '0.0';
  const papg = final.length ? (pa / final.length).toFixed(1) : '0.0';
  let streak = 0, streakType = '';
  for (let i = final.length - 1; i >= 0; i--) {
    const w = final[i].us > final[i].them;
    if (i === final.length - 1) { streakType = w ? 'W' : 'L'; streak = 1; }
    else if ((w && streakType === 'W') || (!w && streakType === 'L')) streak++;
    else break;
  }
  return {
    wins, losses, pf, pa, ppg, papg, margin,
    homeRecord: `${homeW}–${homeGames.length - homeW}`,
    awayRecord: `${awayW}–${awayGames.length - awayW}`,
    streak: streak ? `${streakType}${streak}` : '—',
    gamesLeft: scheduled.length,
    record: `${wins}–${losses}`,
  };
}

const LEADERS = [
  { stat: 'Points', leaders: [{ name: 'Jordan Reeves', value: '18.4', team: 'Fairfax Hawks' }, { name: 'Tariq Singh', value: '16.2', team: 'Fairfax Hawks' }, { name: 'Devon Brooks', value: '14.8', team: 'Fairfax Hawks' }] },
  { stat: 'Rebounds', leaders: [{ name: 'Tariq Singh', value: '9.1', team: 'Fairfax Hawks' }, { name: 'Devon Brooks', value: '7.4', team: 'Fairfax Hawks' }, { name: 'Sam Whitaker', value: '6.8', team: 'Fairfax Hawks' }] },
  { stat: 'Assists', leaders: [{ name: 'Maya Chen', value: '6.3', team: 'Fairfax Hawks' }, { name: 'Alex Romero', value: '5.1', team: 'Fairfax Hawks' }, { name: 'Jordan Reeves', value: '4.7', team: 'Fairfax Hawks' }] },
];

export default function SeasonView({ games = [], team = 'Fairfax Hawks', division = 'Boys 5–6 House' }) {
  const s = computeStats(games);
  const [standings] = useStandings();
  const STANDINGS = standings[division] || INITIAL_STANDINGS[division];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Season summary banner */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{
          background: 'var(--court-navy)',
          color: '#fff',
          padding: '20px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 0,
          backgroundImage: 'radial-gradient(circle at 90% 20%, rgba(255,199,44,0.12), transparent 45%)',
        }}>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.10)', paddingRight: 24 }}>
            <Eyebrow color="rgba(255,255,255,0.55)">Season</Eyebrow>
            <Display size={28} color="#fff" style={{ marginTop: 6 }}>2025–26</Display>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>Boys 5–6 House</div>
          </div>
          <StatCell label="Record" value={s.record} sub="2nd in division" gold />
          <StatCell label="Points for" value={s.pf} sub={`${s.ppg} per game`} />
          <StatCell label="Points against" value={s.pa} sub={`${s.papg} per game`} />
          <StatCell label="Games left" value={s.gamesLeft} sub="remaining this season" />
        </div>
        <div style={{ padding: '12px 28px', background: 'var(--bone)', borderTop: '1px solid var(--border)', display: 'flex', gap: 20, fontSize: 13 }}>
          <span><strong>Current streak:</strong> {s.streak}</span>
          <span>·</span>
          <span><strong>Home record:</strong> {s.homeRecord}</span>
          <span>·</span>
          <span><strong>Away record:</strong> {s.awayRecord}</span>
          <span>·</span>
          <span><strong>Avg margin:</strong> {Number(s.margin) >= 0 ? '+' : ''}{s.margin}</span>
        </div>
      </Card>

      {/* Scoring trend */}
      {games.some(g => g.status === 'final') && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Display size={20}>Scoring trend</Display>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--fg-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--varsity-gold)', display: 'inline-block' }} /> Hawks</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#D1D5DB', display: 'inline-block' }} /> Opponent</span>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <ScoringChart games={games} />
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
        {/* Standings */}
        <Card padding={0}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Display size={20}>Division standings</Display>
            <Pill kind="navy">{division}</Pill>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bone)' }}>
                {['#', 'Team', 'W', 'L', 'PCT', 'GB', 'Str'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Team' ? 'left' : 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STANDINGS.map((row, i) => {
                const isUs = row.team === team;
                const displayRow = isUs ? { ...row, w: s.wins, l: s.losses, streak: s.streak } : row;
                const pct = displayRow.w + displayRow.l > 0
                  ? (displayRow.w / (displayRow.w + displayRow.l)).toFixed(3).replace(/^0/, '')
                  : '.000';
                const leader = STANDINGS[0];
                const leaderW = leader.team === team ? s.wins : leader.w;
                const leaderL = leader.team === team ? s.losses : leader.l;
                const gbVal = ((leaderW - displayRow.w) + (displayRow.l - leaderL)) / 2;
                const gb = i === 0 ? '—' : gbVal === 0 ? '—' : gbVal % 1 === 0 ? String(gbVal) : gbVal.toFixed(1);
                const isPlayoffCutoff = i === 3;
                return (
                  <>
                    <tr key={i} style={{ background: isUs ? 'rgba(255,199,44,0.08)' : '#fff', borderBottom: '1px solid var(--border)', fontWeight: isUs ? 700 : 400 }}>
                      <td style={{ padding: '11px 14px', textAlign: 'center', fontSize: 13, color: isUs ? 'var(--court-navy)' : 'var(--fg-muted)', fontWeight: 700 }}>{row.rank}</td>
                      <td style={{ padding: '11px 14px', fontSize: 13 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isUs && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
                          <span style={{ color: isUs ? 'var(--court-navy)' : 'var(--fg)' }}>{row.team}</span>
                        </div>
                      </td>
                      {[displayRow.w, displayRow.l, pct, gb].map((v, j) => (
                        <td key={j} style={{ padding: '11px 14px', textAlign: 'center', fontSize: 13, fontFamily: j >= 2 ? 'var(--font-mono)' : 'inherit', color: 'var(--fg)' }}>{v}</td>
                      ))}
                      <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: displayRow.streak.startsWith('W') ? 'rgba(31,138,91,0.12)' : 'rgba(200,16,46,0.10)', color: displayRow.streak.startsWith('W') ? 'var(--status-win)' : 'var(--foul-red)' }}>{displayRow.streak}</span>
                      </td>
                    </tr>
                    {isPlayoffCutoff && (
                      <tr key="cutoff">
                        <td colSpan={7} style={{ padding: 0, position: 'relative' }}>
                          <div style={{ borderTop: '2px dashed var(--status-warning)', margin: '0', position: 'relative' }}>
                            <span style={{ position: 'absolute', right: 14, top: -9, fontSize: 9, background: 'var(--status-warning)', color: '#fff', padding: '1px 7px', borderRadius: 999, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Playoff cutoff</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Team leaders */}
          <Card padding={0}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <Display size={20}>Team leaders</Display>
            </div>
            {LEADERS.map((cat, ci) => (
              <div key={ci} style={{ padding: '14px 18px', borderBottom: ci < LEADERS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <Eyebrow style={{ marginBottom: 10 }}>{cat.stat}</Eyebrow>
                {cat.leaders.map((l, li) => (
                  <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: li > 0 ? 6 : 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: li === 0 ? 'var(--varsity-gold)' : 'var(--bone)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: li === 0 ? 'var(--court-navy)' : 'var(--fg-muted)', flexShrink: 0 }}>{li + 1}</div>
                    <div style={{ flex: 1, fontSize: 13, fontWeight: li === 0 ? 700 : 400 }}>{l.name}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: li === 0 ? 'var(--court-navy)' : 'var(--fg-muted)' }}>{l.value}</div>
                  </div>
                ))}
              </div>
            ))}
          </Card>

          {/* Playoff picture */}
          <Card banner>
            <Eyebrow color="var(--varsity-gold)">Playoff picture</Eyebrow>
            <Display size={26} color="#fff" style={{ marginTop: 6, marginBottom: 10 }}>Top 4 advance</Display>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
                <span>Current record</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--varsity-gold)' }}>{s.record}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
                <span>Games remaining</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--varsity-gold)' }}>{s.gamesLeft}</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', margin: '4px 0' }} />
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                Top 4 teams advance. Currently 2nd in division — clinch a spot by winning 2 of the remaining {s.gamesLeft} games.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value, sub, gold }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
      <Eyebrow color="rgba(255,255,255,0.55)">{label}</Eyebrow>
      <Display size={36} color={gold ? 'var(--varsity-gold)' : '#fff'} style={{ marginTop: 4 }}>{value}</Display>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{sub}</div>
    </div>
  );
}
