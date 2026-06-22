import { Fragment } from 'react';
import { useGames, useStandings, INITIAL_STANDINGS, PLAYOFF_SPOTS } from '../shared/store.js';
import { TEAM_INFO } from '../shared/store.js';
import { SectionHead } from './Programs.jsx';
import Icon from '../shared/Icon.jsx';
import { useIsMobile } from '../shared/useIsMobile.js';

export default function TeamSpotlight() {
  const isMobile = useIsMobile();
  const [games] = useGames();
  const [standings] = useStandings();
  const STANDINGS = standings[TEAM_INFO.division] || INITIAL_STANDINGS[TEAM_INFO.division] || [];

  const liveGame   = games.find(g => g.status === 'live');
  const nextGame   = games.find(g => g.status === 'scheduled');
  const recent     = [...games].filter(g => g.status === 'final').slice(-3).reverse();
  const wins       = games.filter(g => g.status === 'final' && g.us > g.them).length;
  const losses     = games.filter(g => g.status === 'final' && g.us < g.them).length;
  const leader     = STANDINGS[0];

  return (
    <section style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <SectionHead eyebrow="Season in progress" title={`${TEAM_INFO.name} · 2025–26`} />
          <a href="/family" style={{ fontSize: 13, fontWeight: 700, color: 'var(--court-navy)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Family portal <Icon name="arrow-right" size={13} color="var(--court-navy)" />
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.6fr 1.2fr', gap: 16, marginBottom: 20 }}>

          {/* Record card */}
          <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '24px 22px', color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Season record</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, color: 'var(--varsity-gold)', letterSpacing: '-0.01em' }}>
              {wins}–{losses}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(31,138,91,0.20)', color: '#4ade80' }}>
                  {TEAM_INFO.seed} seed
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{TEAM_INFO.division}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700 }}>
                <Icon name="trophy" size={13} color="var(--varsity-gold)" />
                <span style={{ color: '#4ade80' }}>In playoffs — top 4 advance</span>
              </div>
            </div>
          </div>

          {/* Live game card — replaces next game when a game is in progress */}
          {liveGame ? (
            <div style={{ background: 'var(--court-navy)', border: '2px solid #DC2626', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ background: '#DC2626', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1.2s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>
                  Live now{liveGame.quarter ? ` · Q${liveGame.quarter}` : ''}
                </span>
              </div>
              <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 0, flex: 1 }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 6 }}>Hawks</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 60px)', lineHeight: 1, color: '#fff' }}>{liveGame.us ?? 0}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'rgba(255,255,255,0.20)', padding: '0 8px' }}>–</div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>{liveGame.opponent}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 60px)', lineHeight: 1, color: 'rgba(255,255,255,0.65)' }}>{liveGame.them ?? 0}</div>
                </div>
              </div>
              <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, color: 'rgba(255,255,255,0.40)', textAlign: 'center' }}>
                {liveGame.location} · Updates live
              </div>
            </div>
          ) : nextGame ? (
            <div style={{ background: '#fff', border: '1.5px solid var(--court-navy)', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)' }}>
                ◆ Next game
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--court-navy)', textTransform: 'uppercase', lineHeight: 1.1 }}>
                  {nextGame.opponent.includes(' vs ') ? nextGame.opponent : `${nextGame.home ? 'vs.' : '@'} ${nextGame.opponent}`}
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="calendar" size={12} color="var(--fg-muted)" /> {nextGame.day}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="clock" size={12} color="var(--fg-muted)" /> {nextGame.time}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name="map-pin" size={12} color="var(--fg-muted)" /> {nextGame.location}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: nextGame.home ? 'rgba(10,31,61,0.08)' : 'rgba(232,119,34,0.10)', color: nextGame.home ? 'var(--court-navy)' : 'var(--basketball-orange)' }}>
                  {nextGame.home ? 'Home · Navy jerseys' : 'Away · White jerseys'}
                </span>
                {nextGame.confirmed > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                    {nextGame.confirmed} players confirmed
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--fg-muted)', fontSize: 14 }}>Season complete</span>
            </div>
          )}

          {/* Recent results */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Recent results</div>
            {recent.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>No results yet</div>
            )}
            {recent.map(g => {
              const win = g.us > g.them;
              return (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: win ? 'rgba(31,138,91,0.10)' : 'rgba(200,16,46,0.08)', color: win ? '#059669' : '#DC2626', minWidth: 20, textAlign: 'center' }}>
                    {win ? 'W' : 'L'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {g.opponent.includes(' vs ') ? g.opponent : `${g.home ? 'vs.' : '@'} ${g.opponent}`}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{g.day}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: win ? 'var(--court-navy)' : 'var(--fg-muted)', flexShrink: 0 }}>
                    {g.us}–{g.them}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compact standings */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{TEAM_INFO.division} Standings</div>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Top {PLAYOFF_SPOTS} advance to playoffs</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 340 }}>
              <thead>
                <tr style={{ background: 'var(--bone)' }}>
                  {['#', 'Team', 'W', 'L', 'PCT', 'GB'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: h === 'Team' ? 'left' : 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STANDINGS.map((row, i) => {
                  const pct = (row.w / (row.w + row.l)).toFixed(3).replace(/^0/, '');
                  const gbVal = ((leader.w - row.w) + (row.l - leader.l)) / 2;
                  const gb = i === 0 ? '—' : gbVal === 0 ? '—' : gbVal % 1 === 0 ? String(gbVal) : gbVal.toFixed(1);
                  const inPlayoffs = i < PLAYOFF_SPOTS;
                  return (
                    <Fragment key={row.rank}>
                      <tr style={{ background: row.fpyc ? 'rgba(255,199,44,0.07)' : '#fff', fontWeight: row.fpyc ? 700 : 400 }}>
                        <td style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontWeight: 700, color: inPlayoffs ? 'var(--status-win)' : 'var(--fg-muted)' }}>{row.rank}</td>
                        <td style={{ padding: '10px 14px', fontSize: 13 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {row.fpyc && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
                            <span style={{ color: row.fpyc ? 'var(--court-navy)' : 'var(--fg)' }}>{row.team}</span>
                            {row.fpyc && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' }}>FPYC</span>}
                          </div>
                        </td>
                        {[row.w, row.l, pct, gb].map((v, j) => (
                          <td key={j} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 13, fontFamily: j >= 2 ? 'var(--font-mono)' : 'inherit', color: 'var(--fg)' }}>{v}</td>
                        ))}
                      </tr>
                      {i === PLAYOFF_SPOTS - 1 && i < STANDINGS.length - 1 && (
                        <tr key="cutoff">
                          <td colSpan={6} style={{ padding: 0 }}>
                            <div style={{ borderTop: '2px dashed #f59e0b', position: 'relative' }}>
                              <span style={{ position: 'absolute', right: 14, top: -9, fontSize: 9, background: '#f59e0b', color: '#fff', padding: '1px 7px', borderRadius: 999, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Playoff cutoff</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
