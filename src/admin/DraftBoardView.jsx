import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Jersey, Pill } from '../shared/index.js';
import { useDraftState, DRAFT_PLAYERS, DRAFT_TEAMS, buildSnakeOrder } from '../shared/store.js';

const MY_TEAM_ID = 'hawks';

function getSnakeOrder(draft) {
  return buildSnakeOrder(draft.draftOrder, draft.totalRounds);
}

function teamAvg(pids) {
  if (!pids.length) return null;
  return pids.reduce((s, id) => s + (DRAFT_PLAYERS.find(p => p.id === id)?.skill || 0), 0) / pids.length;
}

export default function DraftBoardView() {
  const [draft, setDraft] = useDraftState();
  const [sortBy, setSortBy] = useState('skill');

  const snakeOrder = getSnakeOrder(draft);
  const totalPicks = snakeOrder.length;
  const done = draft.currentPick >= totalPicks;
  const onClockTeamId = done ? null : snakeOrder[draft.currentPick];
  const onClockTeam = DRAFT_TEAMS.find(t => t.id === onClockTeamId);
  const isMyTurn = onClockTeamId === MY_TEAM_ID;
  const myTeam = DRAFT_TEAMS.find(t => t.id === MY_TEAM_ID);

  const drafted = new Set(Object.values(draft.roster).flat());
  const pool = DRAFT_PLAYERS.filter(p => !drafted.has(p.id));
  const sorted = [...pool].sort((a, b) =>
    sortBy === 'skill' ? b.skill - a.skill :
    sortBy === 'name'  ? a.name.localeCompare(b.name) :
    a.position.localeCompare(b.position)
  );

  // My upcoming picks
  const myPicks = snakeOrder
    .map((tid, i) => ({ pickNum: i + 1, round: Math.floor(i / draft.draftOrder.length) + 1, teamId: tid }))
    .filter(p => p.teamId === MY_TEAM_ID);

  function makePick(playerId) {
    if (!isMyTurn || draft.status !== 'live') return;
    const player = DRAFT_PLAYERS.find(p => p.id === playerId);
    const newPick = draft.currentPick + 1;
    setDraft(prev => ({
      ...prev,
      roster: { ...prev.roster, [MY_TEAM_ID]: [...(prev.roster[MY_TEAM_ID] || []), playerId] },
      currentPick: newPick,
      status: newPick >= snakeOrder.length ? 'completed' : 'live',
      log: [...prev.log, { pick: prev.currentPick + 1, team: MY_TEAM_ID, player: player.name }],
    }));
  }

  // ── Status: Setup ──
  if (draft.status === 'setup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
        <StatusBanner icon="clock" color="var(--fg-muted)" bg="var(--bone)" border="var(--border)">
          The commissioner is setting up the draft for <strong>{draft.division}</strong>. You'll be notified when it opens.
        </StatusBanner>
        <Card padding={22}>
          <Eyebrow style={{ marginBottom: 14 }}>Draft overview</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="Division" value={draft.division} />
            <Row label="Season" value={draft.season} />
            <Row label="Teams" value={`${draft.draftOrder.length} teams`} />
            <Row label="Players in pool" value={`${DRAFT_PLAYERS.length} players`} />
            <Row label="Rounds" value={`${draft.totalRounds} rounds (${draft.totalRounds * draft.draftOrder.length} total picks)`} />
            <Row label="Your team" value={`${myTeam?.name} — Coach ${myTeam?.coach}`} />
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
          Draft is open — the commissioner will start it shortly. Here's your pick schedule.
        </StatusBanner>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* My picks */}
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 14 }}>Your pick slots · {myTeam?.name}</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myPicks.map(p => (
                <div key={p.pickNum} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--varsity-gold)', flexShrink: 0 }}>
                    {p.pickNum}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Pick #{p.pickNum}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Round {p.round}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Draft order */}
          <Card padding={20}>
            <Eyebrow style={{ marginBottom: 14 }}>Draft order · Round 1</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {draft.draftOrder.map((tid, i) => {
                const team = DRAFT_TEAMS.find(t => t.id === tid);
                return (
                  <div key={tid} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: team?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, color: '#fff', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: tid === MY_TEAM_ID ? 800 : 600, fontSize: 14, color: tid === MY_TEAM_ID ? 'var(--court-navy)' : 'var(--fg)' }}>
                      {team?.name} {tid === MY_TEAM_ID && '← you'}
                    </span>
                  </div>
                );
              })}
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>Snake draft — order reverses each round</div>
            </div>
          </Card>
        </div>

        {/* Player pool preview */}
        <Card padding={0}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)' }}>
            <Display size={18}>Player pool preview — {DRAFT_PLAYERS.length} players</Display>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {DRAFT_PLAYERS.map((p, i) => (
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
            const players = pids.map(id => DRAFT_PLAYERS.find(p => p.id === id)).filter(Boolean);
            const avg = teamAvg(pids);
            const isMe = team.id === MY_TEAM_ID;
            return (
              <Card key={team.id} padding={0} style={{ border: isMe ? `2px solid ${team.color}` : '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ background: team.color, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase' }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Coach {team.coach}{isMe ? ' · Your team' : ''}</div>
                  </div>
                  {avg !== null && <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'rgba(255,255,255,0.90)' }}>{avg.toFixed(1)}</div>}
                </div>
                {players.map(p => (
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
      <div style={{ borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: isMyTurn ? 'rgba(255,199,44,0.12)' : 'rgba(10,31,61,0.06)', border: `1.5px solid ${isMyTurn ? 'var(--varsity-gold)' : 'var(--border)'}` }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: onClockTeam?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff', flexShrink: 0 }}>
          {onClockTeam?.name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--court-navy)' }}>
            {isMyTurn ? '🏀 Your pick!' : `${onClockTeam?.name} on the clock`}
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            Pick #{draft.currentPick + 1} · Round {round} of {draft.totalRounds} · {pool.length} players remaining
          </div>
        </div>
        {!isMyTurn && (
          <Pill kind="neutral">{pool.length} in pool</Pill>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMyTurn ? '300px 1fr' : '1fr', gap: 16 }}>
        {/* Player pool — only shown when it's your turn */}
        {isMyTurn && (
          <Card padding={0}>
            <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Display size={16}>Select your pick</Display>
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
                }}>
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
        )}

        {/* Team rosters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {DRAFT_TEAMS.map(team => {
            const pids = draft.roster[team.id] || [];
            const players = pids.map(id => DRAFT_PLAYERS.find(p => p.id === id)).filter(Boolean);
            const avg = teamAvg(pids);
            const isMe = team.id === MY_TEAM_ID;
            const isClock = team.id === onClockTeamId;
            return (
              <div key={team.id} style={{ background: '#fff', border: `${isClock ? 2 : 1}px solid ${isClock ? team.color : isMe ? team.color : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden', boxShadow: isClock ? `0 0 0 3px ${team.color}22` : 'var(--shadow-1)' }}>
                <div style={{ background: team.color, color: '#fff', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase' }}>{team.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
                      {isClock ? '⏱ On the clock' : isMe ? 'Your team' : `Coach ${team.coach}`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1 }}>{players.length}</div>
                    {avg !== null && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>avg {avg.toFixed(1)}</div>}
                  </div>
                </div>
                <div style={{ minHeight: 48 }}>
                  {players.length === 0 && (
                    <div style={{ padding: '14px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 12 }}>No picks yet</div>
                  )}
                  {players.map(p => (
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
