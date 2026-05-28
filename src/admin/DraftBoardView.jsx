import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Jersey, Pill } from '../shared/index.js';
import { useDraftState, DRAFT_PLAYERS, DRAFT_TEAMS, buildSnakeOrder, usePlayers } from '../shared/store.js';
import { useLocalStorage } from '../shared/useLocalStorage.js';

// Team name mapping for writing back to fpyc-players on draft completion
const TEAM_NAMES = { hawks: 'Fairfax Hawks', wolves: 'Fairfax Wolves', eagles: 'Fairfax Eagles', cougars: 'Fairfax Cougars' };

function getSnakeOrder(draft) {
  return buildSnakeOrder(draft.draftOrder, draft.totalRounds);
}

function teamAvg(pids, pool) {
  if (!pids.length) return null;
  return pids.reduce((s, id) => s + (pool.find(p => p.id === id)?.skill || 0), 0) / pids.length;
}

function buildDraftPool(players, evals, division) {
  // Real registered players: matching division, unassigned (TBD or pending)
  const real = players
    .filter(p => p.division === division && (p.team === 'TBD' || p.status === 'pending') && p.status !== 'inactive')
    .map(p => {
      const ev = evals[p.id] || {};
      const vals = Object.values(ev).filter(v => typeof v === 'number');
      const skill = vals.length ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 3.0;
      return { id: p.id, number: p.number, name: p.name, grade: p.grade, position: p.position || 'Guard', school: p.school || '', skill, isReal: true };
    });
  // Fall back to seed data if no real unassigned players exist
  return real.length > 0 ? real : DRAFT_PLAYERS.map(p => ({ ...p, isReal: false }));
}

export default function DraftBoardView() {
  const [draft, setDraft] = useDraftState();
  const [players, setPlayers] = usePlayers();
  const [evals] = useLocalStorage('fpyc-evals', {});
  const [sortBy, setSortBy] = useState('skill');

  const draftPool = buildDraftPool(players, evals, draft.division);

  const snakeOrder = getSnakeOrder(draft);
  const totalPicks = snakeOrder.length;
  const done = draft.currentPick >= totalPicks;
  const onClockTeamId = done ? null : snakeOrder[draft.currentPick];
  const onClockTeam = DRAFT_TEAMS.find(t => t.id === onClockTeamId);

  const drafted = new Set(Object.values(draft.roster).flat());
  const pool = draftPool.filter(p => !drafted.has(p.id));
  const sorted = [...pool].sort((a, b) =>
    sortBy === 'skill' ? b.skill - a.skill :
    sortBy === 'name'  ? a.name.localeCompare(b.name) :
    a.position.localeCompare(b.position)
  );

  // For setup screen: show pick schedule by team
  const teamPickMap = {};
  snakeOrder.forEach((tid, i) => {
    if (!teamPickMap[tid]) teamPickMap[tid] = [];
    teamPickMap[tid].push({ pickNum: i + 1, round: Math.floor(i / draft.draftOrder.length) + 1 });
  });

  function makePick(playerId) {
    if (draft.status !== 'live' || !onClockTeamId) return;
    const player = draftPool.find(p => p.id === playerId);
    const newPick = draft.currentPick + 1;
    const completed = newPick >= snakeOrder.length;
    const newRoster = { ...draft.roster, [onClockTeamId]: [...(draft.roster[onClockTeamId] || []), playerId] };

    setDraft(prev => ({
      ...prev,
      roster: newRoster,
      currentPick: newPick,
      status: completed ? 'completed' : 'live',
      log: [...prev.log, { pick: prev.currentPick + 1, team: onClockTeamId, player: player?.name || playerId }],
    }));

    // On completion, write team assignments back to fpyc-players for real player IDs
    if (completed) {
      setPlayers(prev => prev.map(p => {
        for (const [teamId, pids] of Object.entries(newRoster)) {
          if (pids.includes(p.id)) {
            return { ...p, team: TEAM_NAMES[teamId] || p.team, status: 'active' };
          }
        }
        return p;
      }));
    }
  }

  // ── Status: Setup ──
  if (draft.status === 'setup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
        <StatusBanner icon="clock" color="var(--fg-muted)" bg="var(--bone)" border="var(--border)">
          Draft is in setup for <strong>{draft.division}</strong>. The commissioner will open it once evaluations are complete.
        </StatusBanner>
        <Card padding={22}>
          <Eyebrow style={{ marginBottom: 14 }}>Draft overview</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="Division" value={draft.division} />
            <Row label="Season" value={draft.season} />
            <Row label="Teams" value={`${draft.draftOrder.length} teams`} />
            <Row label="Players in pool" value={`${draftPool.length} players${draftPool[0]?.isReal === false ? ' (seed data)' : ' (registered)'}`} />
            <Row label="Rounds" value={`${draft.totalRounds} rounds · ${draft.totalRounds * draft.draftOrder.length} total picks`} />
            <Row label="Format" value="Snake draft — order reverses each round" />
          </div>
        </Card>
      </div>
    );
  }

  // ── Status: Open ──
  if (draft.status === 'open') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <StatusBanner icon="calendar" color="var(--basketball-orange)" bg="rgba(232,119,34,0.07)" border="rgba(232,119,34,0.25)">
          Draft is open — ready to go live. {draftPool.length} players in the pool.
        </StatusBanner>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Pick schedule by team */}
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 14 }}>Pick schedule</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {draft.draftOrder.map((tid, i) => {
                const team = DRAFT_TEAMS.find(t => t.id === tid);
                const picks = teamPickMap[tid] || [];
                return (
                  <div key={tid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: team?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{team?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Coach {team?.coach}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600 }}>
                      Picks {picks.map(p => `#${p.pickNum}`).join(', ')}
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>Snake draft — order reverses each round</div>
            </div>
          </Card>

          {/* Pool summary */}
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 14 }}>Pool · {draftPool.length} players</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Guard','Forward','Center'].map(pos => {
                const count = draftPool.filter(p => p.position === pos).length;
                return (
                  <div key={pos} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-muted)', fontWeight: 600 }}>{pos}</span>
                    <span style={{ fontWeight: 700 }}>{count}</span>
                  </div>
                );
              })}
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
                Avg skill: {draftPool.length ? (draftPool.reduce((s, p) => s + p.skill, 0) / draftPool.length).toFixed(1) : '—'}
              </div>
            </div>
          </Card>
        </div>

        {/* Player pool preview */}
        <Card padding={0}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
            <Display size={18}>Player pool — {draftPool.length} players</Display>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {draftPool.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--border)', borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--border)' : 'none' }}>
                <Jersey number={p.number} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg-muted)' }}>{p.skill}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ── Status: Completed ──
  if (draft.status === 'completed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <StatusBanner icon="check-circle" color="var(--status-win)" bg="rgba(31,138,91,0.07)" border="rgba(31,138,91,0.20)">
          Draft complete — teams have been finalized for <strong>{draft.division}</strong>.
        </StatusBanner>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {DRAFT_TEAMS.map(team => {
            const pids = draft.roster[team.id] || [];
            const teamPlayers = pids.map(id => draftPool.find(p => p.id === id)).filter(Boolean);
            const avg = teamAvg(pids, draftPool);
            return (
              <Card key={team.id} padding={0} style={{ border: `1px solid var(--border)`, overflow: 'hidden' }}>
                <div style={{ background: team.color, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase' }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Coach {team.coach}</div>
                  </div>
                  {avg !== null && <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'rgba(255,255,255,0.90)' }}>{avg.toFixed(1)}</div>}
                </div>
                {teamPlayers.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
                    <Jersey number={p.number} size={24} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg-muted)' }}>{p.skill}</span>
                  </div>
                ))}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Status: Live ──
  const round = Math.floor(draft.currentPick / draft.draftOrder.length) + 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* On the clock banner */}
      <div style={{ borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'rgba(255,199,44,0.10)', border: '1.5px solid var(--varsity-gold)' }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: onClockTeam?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff', flexShrink: 0 }}>
          {onClockTeam?.name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--court-navy)' }}>
            {onClockTeam?.name} on the clock
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            Pick #{draft.currentPick + 1} · Round {round} of {draft.totalRounds} · {pool.length} players remaining
          </div>
        </div>
        <Pill kind="neutral">{pool.length} in pool</Pill>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        {/* Player pool — always shown during live draft */}
        <Card padding={0}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Display size={16}>{onClockTeam?.name} picks</Display>
            <div style={{ display: 'flex', gap: 3, background: 'var(--bone)', borderRadius: 6, padding: 2 }}>
              {['skill', 'name', 'pos'].map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{
                  padding: '3px 7px', borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: sortBy === s ? 'var(--court-navy)' : 'transparent',
                  color: sortBy === s ? '#fff' : 'var(--fg-muted)',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ maxHeight: 480, overflowY: 'auto' }}>
            {sorted.map(p => (
              <button key={p.id} onClick={() => makePick(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                width: '100%', textAlign: 'left', border: 'none',
                borderBottom: '1px solid var(--border)', cursor: 'pointer',
                background: 'transparent', transition: 'background 120ms',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bone)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Jersey number={p.number} size={26} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position} · {p.school}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg)' }}>{p.skill}</div>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="plus" size={14} color="var(--court-navy)" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Team rosters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {DRAFT_TEAMS.map(team => {
            const pids = draft.roster[team.id] || [];
            const teamPlayers = pids.map(id => draftPool.find(p => p.id === id)).filter(Boolean);
            const avg = teamAvg(pids, draftPool);
            const isClock = team.id === onClockTeamId;
            return (
              <div key={team.id} style={{ background: '#fff', border: `${isClock ? 2 : 1}px solid ${isClock ? team.color : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden', boxShadow: isClock ? `0 0 0 3px ${team.color}22` : 'var(--shadow-1)' }}>
                <div style={{ background: team.color, color: '#fff', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase' }}>{team.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{isClock ? '⏱ On the clock' : `Coach ${team.coach}`}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1 }}>{teamPlayers.length}</div>
                    {avg !== null && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>avg {avg.toFixed(1)}</div>}
                  </div>
                </div>
                <div style={{ minHeight: 48 }}>
                  {teamPlayers.length === 0 && <div style={{ padding: '14px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 12 }}>No picks yet</div>}
                  {teamPlayers.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border)' }}>
                      <Jersey number={p.number} size={22} />
                      <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                      <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{p.position[0]}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: p.skill >= 4 ? 'var(--status-win)' : 'var(--fg-muted)' }}>{p.skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pick log */}
      {draft.log.length > 0 && (
        <Card padding={0}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
            <Eyebrow>Pick log</Eyebrow>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
            {draft.log.map((entry, i) => {
              const team = DRAFT_TEAMS.find(t => t.id === entry.team);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', width: '50%', boxSizing: 'border-box' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', minWidth: 24 }}>#{entry.pick}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: team?.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: team?.color, minWidth: 52 }}>{team?.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--fg)' }}>{entry.player}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

function StatusBanner({ icon, color, bg, border, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 10, background: bg, border: `1px solid ${border}` }}>
      <Icon name={icon} size={18} color={color} />
      <span style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{value}</span>
    </div>
  );
}
