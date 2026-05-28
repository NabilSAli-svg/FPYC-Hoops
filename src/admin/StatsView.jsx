import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow } from '../shared/index.js';
import { useStats, useGames, usePlayers } from '../shared/store.js';
import { useIsMobile } from '../shared/useIsMobile.js';

const STAT_COLS = [
  { key: 'gp',  label: 'GP',  title: 'Games played',  mono: true },
  { key: 'pts', label: 'PTS', title: 'Total points',   mono: true },
  { key: 'ast', label: 'AST', title: 'Total assists',  mono: true },
  { key: 'reb', label: 'REB', title: 'Total rebounds', mono: true },
  { key: 'fls', label: 'FLS', title: 'Total fouls',    mono: true },
  { key: 'ppg', label: 'PPG', title: 'Points per game',  mono: true },
  { key: 'rpg', label: 'RPG', title: 'Rebounds per game', mono: true },
  { key: 'apg', label: 'APG', title: 'Assists per game',  mono: true },
];

function computeSeasonStats(players, stats, games) {
  const finalGames = games.filter(g => g.status === 'final');
  return players.map(p => {
    let pts = 0, ast = 0, reb = 0, fls = 0, gp = 0;
    finalGames.forEach(g => {
      const gs = stats[g.id]?.[p.id];
      if (gs) { pts += gs.pts; ast += gs.ast; reb += gs.reb; fls += gs.fls; gp++; }
    });
    return {
      ...p,
      gp,
      pts, ast, reb, fls,
      ppg: gp ? (pts / gp).toFixed(1) : '—',
      rpg: gp ? (reb / gp).toFixed(1) : '—',
      apg: gp ? (ast / gp).toFixed(1) : '—',
      ppgNum: gp ? pts / gp : 0,
    };
  });
}

export default function StatsView({ teamFilter }) {
  const isMobile = useIsMobile();
  const [stats, setStats] = useStats();
  const [games]   = useGames();
  const [players] = usePlayers();
  const [sortKey, setSortKey] = useState('pts');
  const [sortDir, setSortDir] = useState('desc');
  const [logModal, setLogModal] = useState(false);
  const [logGameId, setLogGameId] = useState('');
  const [logDraft, setLogDraft] = useState({});

  const activePlayers = players.filter(p => p.status !== 'inactive' && (!teamFilter || p.team === teamFilter));
  const teamGames     = games.filter(g => !teamFilter || !g.team || g.team === teamFilter);
  const finalGames    = teamGames.filter(g => g.status === 'final');

  const seasonStats = computeSeasonStats(activePlayers, stats, teamGames);

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...seasonStats].sort((a, b) => {
    const av = parseFloat(a[sortKey]) || 0;
    const bv = parseFloat(b[sortKey]) || 0;
    return sortDir === 'desc' ? bv - av : av - bv;
  });

  // Leaders
  const withGames = seasonStats.filter(p => p.gp > 0);
  const leaders = {
    pts: withGames.reduce((best, p) => p.pts > (best?.pts ?? -1) ? p : best, null),
    reb: withGames.reduce((best, p) => p.reb > (best?.reb ?? -1) ? p : best, null),
    ast: withGames.reduce((best, p) => p.ast > (best?.ast ?? -1) ? p : best, null),
    ppg: withGames.filter(p => p.gp >= 2).reduce((best, p) => p.ppgNum > (best?.ppgNum ?? -1) ? p : best, null),
  };

  // Log modal helpers
  function openLog(gameId) {
    const existing = stats[gameId] || {};
    const draft = {};
    activePlayers.forEach(p => {
      draft[p.id] = { pts: existing[p.id]?.pts ?? '', ast: existing[p.id]?.ast ?? '', reb: existing[p.id]?.reb ?? '', fls: existing[p.id]?.fls ?? '' };
    });
    setLogGameId(gameId);
    setLogDraft(draft);
    setLogModal(true);
  }

  function saveLog() {
    const cleaned = {};
    activePlayers.forEach(p => {
      const d = logDraft[p.id] || {};
      cleaned[p.id] = {
        pts: parseInt(d.pts) || 0,
        ast: parseInt(d.ast) || 0,
        reb: parseInt(d.reb) || 0,
        fls: parseInt(d.fls) || 0,
      };
    });
    setStats(s => ({ ...s, [logGameId]: cleaned }));
    setLogModal(false);
  }

  function setDraftField(pid, field, val) {
    setLogDraft(d => ({ ...d, [pid]: { ...d[pid], [field]: val } }));
  }

  const logGame = games.find(g => g.id === logGameId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Leaders strip */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: 'zap',      label: 'Points leader',    player: leaders.pts, stat: leaders.pts?.pts,   unit: 'PTS' },
          { icon: 'activity', label: 'Rebounds leader',  player: leaders.reb, stat: leaders.reb?.reb,   unit: 'REB' },
          { icon: 'git-merge',label: 'Assists leader',   player: leaders.ast, stat: leaders.ast?.ast,   unit: 'AST' },
          { icon: 'trending-up', label: 'Top scorer/gm', player: leaders.ppg, stat: leaders.ppg?.ppg,   unit: 'PPG' },
        ].map(({ icon, label, player, stat, unit }) => (
          <Card key={label} padding="18px 20px">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <Eyebrow>{label}</Eyebrow>
              <Icon name={icon} size={15} color="var(--fg-muted)" />
            </div>
            {player ? (
              <>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--court-navy)', lineHeight: 1 }}>{stat}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>{unit}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)', marginTop: 8 }}>
                  #{player.number} {player.name.split(' ')[0]}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>No data yet</div>
            )}
          </Card>
        ))}
      </div>

      {/* Season totals table */}
      <Card padding={0} style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <Display size={18}>Season Stats</Display>
          <Button kind="gold" size="sm" icon="plus-circle" onClick={() => setLogModal(true)}>Log game stats</Button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
            <thead>
              <tr style={{ background: 'var(--bone)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Player</th>
                {STAT_COLS.map(col => (
                  <th key={col.key}
                    onClick={() => handleSort(col.key)}
                    title={col.title}
                    style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: sortKey === col.key ? 'var(--court-navy)' : 'var(--fg-muted)', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      {col.label}
                      {sortKey === col.key && (
                        <Icon name={sortDir === 'desc' ? 'chevron-down' : 'chevron-up'} size={11} color="var(--court-navy)" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 22, textAlign: 'right' }}>#{p.number}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)', lineHeight: 1.2 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position} · {p.grade}</div>
                      </div>
                    </div>
                  </td>
                  {STAT_COLS.map(col => (
                    <td key={col.key} style={{ padding: '11px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: sortKey === col.key ? 700 : 400, color: sortKey === col.key ? 'var(--court-navy)' : p.gp === 0 ? 'var(--fg-muted)' : 'var(--fg)' }}>
                      {p.gp === 0 && col.key !== 'gp' ? '—' : p[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Per-game breakdown */}
      {finalGames.length > 0 && (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Display size={18}>Game Log</Display>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontWeight: 600 }}>{finalGames.length} games logged</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {finalGames.map((g, gi) => {
              const gameStats = stats[g.id] || {};
              const hasStats  = Object.keys(gameStats).length > 0;
              const win = g.us > g.them;
              return (
                <div key={g.id} style={{ borderBottom: gi < finalGames.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  {/* Game header row */}
                  <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bone)' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, padding: '3px 9px', borderRadius: 999, background: win ? 'rgba(31,138,91,0.12)' : 'rgba(200,16,46,0.10)', color: win ? 'var(--status-win)' : 'var(--foul-red)' }}>
                      {win ? 'W' : 'L'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>
                        {g.home ? 'vs.' : '@'} {g.opponent}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 8 }}>{g.day}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: win ? 'var(--court-navy)' : 'var(--fg-muted)' }}>{g.us}–{g.them}</span>
                    <Button kind="ghost" size="sm" icon="edit-2" onClick={() => openLog(g.id)}>
                      {hasStats ? 'Edit' : 'Log stats'}
                    </Button>
                  </div>

                  {/* Per-player stats rows */}
                  {hasStats && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 460 }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '7px 20px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Player</th>
                            {['PTS','AST','REB','FLS'].map(h => (
                              <th key={h} style={{ padding: '7px 14px', textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activePlayers
                            .filter(p => gameStats[p.id])
                            .sort((a, b) => (gameStats[b.id]?.pts ?? 0) - (gameStats[a.id]?.pts ?? 0))
                            .map((p, pi, arr) => {
                              const gs = gameStats[p.id];
                              return (
                                <tr key={p.id} style={{ borderBottom: pi < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                  <td style={{ padding: '8px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 22, textAlign: 'right' }}>#{p.number}</span>
                                      <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg)' }}>{p.name}</span>
                                    </div>
                                  </td>
                                  {[gs.pts, gs.ast, gs.reb, gs.fls].map((v, vi) => (
                                    <td key={vi} style={{ padding: '8px 14px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg)' }}>{v}</td>
                                  ))}
                                </tr>
                              );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Log stats modal */}
      {logModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 16px', overflowY: 'auto' }}
          onClick={e => e.target === e.currentTarget && setLogModal(false)}
        >
          <div style={{ background: '#fff', borderRadius: 14, width: '100%', maxWidth: 680, boxShadow: '0 24px 64px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            {/* Modal header */}
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Display size={20}>Log Game Stats</Display>
              <button onClick={() => setLogModal(false)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Icon name="x" size={20} color="var(--fg-muted)" />
              </button>
            </div>

            {/* Game picker */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bone)' }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Game</label>
              <select
                value={logGameId}
                onChange={e => openLog(e.target.value)}
                style={{ padding: '9px 12px', borderRadius: 8, border: '1.5px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', background: '#fff', outline: 'none', width: '100%', cursor: 'pointer' }}
              >
                <option value="">Select a game…</option>
                {finalGames.map(g => (
                  <option key={g.id} value={g.id}>{g.day} · {g.home ? 'vs.' : '@'} {g.opponent} ({g.us}–{g.them})</option>
                ))}
              </select>
            </div>

            {/* Stats entry grid */}
            {logGameId && (
              <div style={{ padding: '0 0 0', overflowY: 'auto', maxHeight: '60vh' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr style={{ background: 'var(--court-navy)' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>Player</th>
                      {['PTS','AST','REB','FLS'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', width: 80 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activePlayers.map((p, i) => {
                      const d = logDraft[p.id] || {};
                      return (
                        <tr key={p.id} style={{ borderBottom: i < activePlayers.length - 1 ? '1px solid var(--border)' : 'none', background: i % 2 === 0 ? '#fff' : 'var(--bone)' }}>
                          <td style={{ padding: '10px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', width: 22, textAlign: 'right' }}>#{p.number}</span>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--fg)' }}>{p.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</div>
                              </div>
                            </div>
                          </td>
                          {['pts','ast','reb','fls'].map(field => (
                            <td key={field} style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={d[field] ?? ''}
                                onChange={e => setDraftField(p.id, field, e.target.value)}
                                placeholder="0"
                                style={{ width: 54, padding: '7px 8px', borderRadius: 6, border: '1.5px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 14, textAlign: 'center', outline: 'none', color: 'var(--fg)', background: '#fff', boxSizing: 'border-box' }}
                                onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Team totals preview */}
                {(() => {
                  const totals = { pts: 0, ast: 0, reb: 0, fls: 0 };
                  activePlayers.forEach(p => {
                    const d = logDraft[p.id] || {};
                    totals.pts += parseInt(d.pts) || 0;
                    totals.ast += parseInt(d.ast) || 0;
                    totals.reb += parseInt(d.reb) || 0;
                    totals.fls += parseInt(d.fls) || 0;
                  });
                  const gamePts = logGame?.us ?? 0;
                  const diff = totals.pts - gamePts;
                  return (
                    <div style={{ padding: '14px 20px', borderTop: '2px solid var(--border)', background: 'var(--bone)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                      <Eyebrow>Team totals</Eyebrow>
                      {[['PTS', totals.pts], ['AST', totals.ast], ['REB', totals.reb], ['FLS', totals.fls]].map(([label, val]) => (
                        <span key={label} style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--court-navy)' }}>
                          {label}: <span style={{ color: label === 'PTS' && gamePts > 0 && diff !== 0 ? 'var(--basketball-orange)' : 'var(--court-navy)' }}>{val}</span>
                        </span>
                      ))}
                      {logGame && gamePts > 0 && diff !== 0 && (
                        <span style={{ fontSize: 11, color: 'var(--basketball-orange)', fontWeight: 700 }}>
                          {diff > 0 ? `+${diff}` : diff} vs. final score ({gamePts})
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Modal footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button kind="ghost" onClick={() => setLogModal(false)}>Cancel</Button>
              <Button kind="gold" icon="save" onClick={saveLog} disabled={!logGameId}>Save stats</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
