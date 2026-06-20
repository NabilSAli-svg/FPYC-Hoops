import { useState, useMemo } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill } from '../shared/index.js';
import { usePlayers, buildSnakeOrder } from '../shared/store.js';
import { useLocalStorage } from '../shared/useLocalStorage.js';

const TEAM_COLORS = ['#0A1F3D','#C8102E','#1F8A5B','#E87722','#7C3AED','#0F766E','#B45309','#1D4ED8'];

function uid() { return 'draft-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7); }

function teamAvg(pids, pool) {
  if (!pids || !pids.length) return null;
  return pids.reduce((s, id) => s + (pool.find(p => p.id === id)?.skill || 0), 0) / pids.length;
}

function buildDraftPool(players, evals, division) {
  return players
    .filter(p => division
      ? p.division?.toLowerCase().includes(division.toLowerCase())
      : true)
    .map(p => {
      const ev = evals[p.id] || {};
      const vals = Object.values(ev).filter(v => typeof v === 'number');
      const skill = vals.length
        ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
        : null;
      return { id: p.id, name: p.name, grade: p.grade, position: p.position || 'Guard', school: p.school || '', skill, division: p.division };
    });
}

function skillColor(s) {
  if (s === null || s === undefined) return 'var(--fg-muted)';
  if (s >= 4.5) return '#1F8A5B';
  if (s >= 3.5) return '#B45309';
  return 'var(--fg-muted)';
}

function buildOrder(format, teams, rounds) {
  const ids = teams.map(t => t.id);
  if (format === 'snake') return buildSnakeOrder(ids, rounds);
  if (format === 'linear') {
    const order = [];
    for (let r = 0; r < rounds; r++) order.push(...ids);
    return order;
  }
  return [];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--fg-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function ColorSwatch({ color, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 22, height: 22, borderRadius: '50%', background: color,
      border: selected ? '2px solid var(--fg)' : '2px solid transparent',
      cursor: 'pointer', padding: 0, outline: 'none',
    }} />
  );
}

function SortTabs({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 2, background: 'var(--bone)', borderRadius: 6, padding: 2 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: '3px 8px', borderRadius: 4, border: 'none', cursor: 'pointer',
          background: value === o.value ? 'var(--court-navy)' : 'transparent',
          color: value === o.value ? '#fff' : 'var(--fg-muted)',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    setup: { label: 'Setup', bg: 'var(--bone)', color: 'var(--fg-muted)' },
    open: { label: 'Open', bg: 'rgba(232,119,34,0.12)', color: '#B45309' },
    live: { label: 'Live', bg: 'rgba(31,138,91,0.12)', color: '#1F8A5B' },
    completed: { label: 'Done', bg: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' },
  };
  const s = map[status] || map.setup;
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: s.bg, color: s.color }}>{s.label}</span>;
}

// ── New Draft Form ─────────────────────────────────────────────────────────────

function NewDraftForm({ onSave, onCancel, initial }) {
  const [name, setName] = useState(initial?.name || '');
  const [division, setDivision] = useState(initial?.division || '');
  const [season, setSeason] = useState(initial?.season || '2026-27');
  const [format, setFormat] = useState(initial?.format || 'snake');
  const [rounds, setRounds] = useState(initial?.rounds || 4);
  const [teams, setTeams] = useState(initial?.teams || [
    { id: uid(), name: '', coach: '', color: TEAM_COLORS[0] },
    { id: uid(), name: '', coach: '', color: TEAM_COLORS[1] },
  ]);

  function addTeam() {
    setTeams(prev => [...prev, { id: uid(), name: '', coach: '', color: TEAM_COLORS[prev.length % TEAM_COLORS.length] }]);
  }
  function removeTeam(id) { setTeams(prev => prev.filter(t => t.id !== id)); }
  function updateTeam(id, field, val) { setTeams(prev => prev.map(t => t.id === id ? { ...t, [field]: val } : t)); }
  function randomizeOrder() { setTeams(prev => shuffle(prev)); }

  function save() {
    if (!name.trim()) { alert('Name is required'); return; }
    if (teams.length < 2) { alert('Need at least 2 teams'); return; }
    const draftOrder = teams.map(t => t.id);
    const roster = {};
    draftOrder.forEach(id => { roster[id] = []; });
    onSave({
      id: initial?.id || uid(),
      name: name.trim(),
      division: division.trim(),
      season: season.trim(),
      format,
      teams: teams.map(t => ({ ...t, name: t.name || 'Team', coach: t.coach || '' })),
      draftOrder,
      rounds: Number(rounds),
      currentPick: 0,
      roster,
      log: [],
      status: 'open',
      playerIds: [],
    });
  }

  const inp = { border: '1px solid var(--border)', borderRadius: 6, padding: '7px 10px', fontFamily: 'var(--font-body)', fontSize: 13, width: '100%', boxSizing: 'border-box', background: '#fff' };
  const lbl = { fontSize: 12, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <Card padding={24} style={{ maxWidth: 660 }}>
      <Display size={20} style={{ marginBottom: 20 }}>New Draft Session</Display>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={lbl}>Name *</label>
          <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Boys 4th-5th Rec Winter 2026" />
        </div>
        <div>
          <label style={lbl}>Division (filter players)</label>
          <input style={inp} value={division} onChange={e => setDivision(e.target.value)} placeholder="Boys 5–6 House" />
        </div>
        <div>
          <label style={lbl}>Season</label>
          <input style={inp} value={season} onChange={e => setSeason(e.target.value)} />
        </div>
        <div>
          <label style={lbl}>Format</label>
          <select style={inp} value={format} onChange={e => setFormat(e.target.value)}>
            <option value="snake">Snake — reverses each round</option>
            <option value="linear">Linear — same order every round</option>
            <option value="balanced">Balanced — auto-assign by skill</option>
          </select>
        </div>
        <div>
          <label style={lbl}>Rounds</label>
          <input style={inp} type="number" min={1} max={20} value={rounds} onChange={e => setRounds(e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Eyebrow>Teams ({teams.length})</Eyebrow>
        <Button size="sm" variant="ghost" onClick={randomizeOrder}>Randomize order</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
        {teams.map((t, i) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 11, color: '#fff', flexShrink: 0 }}>{i + 1}</div>
            <input style={{ ...inp, flex: 1 }} value={t.name} onChange={e => updateTeam(t.id, 'name', e.target.value)} placeholder="Team name" />
            <input style={{ ...inp, flex: 1 }} value={t.coach} onChange={e => updateTeam(t.id, 'coach', e.target.value)} placeholder="Coach" />
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              {TEAM_COLORS.map(c => (
                <ColorSwatch key={c} color={c} selected={t.color === c} onClick={() => updateTeam(t.id, 'color', c)} />
              ))}
            </div>
            <button onClick={() => removeTeam(t.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 4 }}>
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={addTeam} style={{ marginBottom: 20 }}>+ Add team</Button>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button onClick={save}>Save & Preview Pool</Button>
        {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </Card>
  );
}

// ── Open View ─────────────────────────────────────────────────────────────────

function OpenView({ draft, setDrafts, players, evals }) {
  const [sortBy, setSortBy] = useState('skill');
  const pool = useMemo(() => {
    const p = buildDraftPool(players, evals, draft.division);
    return p.sort((a, b) =>
      sortBy === 'skill' ? (b.skill ?? 0) - (a.skill ?? 0) :
      sortBy === 'name' ? a.name.localeCompare(b.name) :
      (a.grade || '').localeCompare(b.grade || ''));
  }, [players, evals, draft.division, sortBy]);

  const draftOrder = buildOrder(draft.format, draft.teams, draft.rounds);
  const gradeGroups = {};
  pool.forEach(p => { gradeGroups[p.grade] = (gradeGroups[p.grade] || 0) + 1; });
  const avgSkill = pool.length ? (pool.reduce((s, p) => s + (p.skill ?? 3), 0) / pool.length).toFixed(1) : '—';

  function startDraft() {
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : {
      ...d, status: 'live', playerIds: pool.map(p => p.id), currentPick: 0, draftOrder,
    }));
  }
  function backToSetup() {
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : { ...d, status: 'setup' }));
  }
  function randomizeOrder() {
    const newTeams = shuffle(draft.teams);
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : {
      ...d, teams: newTeams, draftOrder: buildOrder(draft.format, newTeams, draft.rounds),
    }));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 10, background: 'rgba(232,119,34,0.07)', border: '1px solid rgba(232,119,34,0.25)' }}>
        <Icon name="calendar" size={18} color="var(--basketball-orange)" />
        <span style={{ fontSize: 14, flex: 1 }}><strong>{draft.name}</strong> — {pool.length} players in pool. Review and start when ready.</span>
        <Button size="sm" variant="ghost" onClick={backToSetup}>← Back to setup</Button>
        <Button size="sm" onClick={startDraft}>{draft.format === 'balanced' ? 'Auto-Assign' : 'Start Draft'}</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <Card padding={16}>
          <Eyebrow style={{ marginBottom: 10 }}>Pool stats</Eyebrow>
          <Row label="Total players" value={pool.length} />
          <Row label="Avg skill" value={avgSkill} />
          {Object.entries(gradeGroups).sort().map(([g, c]) => <Row key={g} label={g} value={c} />)}
        </Card>
        <Card padding={16}>
          <Eyebrow style={{ marginBottom: 10 }}>Draft info</Eyebrow>
          <Row label="Format" value={draft.format} />
          <Row label="Teams" value={draft.teams.length} />
          <Row label="Rounds" value={draft.rounds} />
          <Row label="Total picks" value={draftOrder.length} />
        </Card>
        <Card padding={16}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <Eyebrow>Pick order</Eyebrow>
            <button onClick={randomizeOrder} style={{ fontSize: 11, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--basketball-orange)', fontWeight: 700 }}>Randomize</button>
          </div>
          {draft.teams.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', fontFamily: 'var(--font-display)' }}>{i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{t.name || 'Team'}</span>
              <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{t.coach}</span>
            </div>
          ))}
        </Card>
      </div>

      <Card padding={0}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Display size={15}>Player pool — {pool.length} players</Display>
          <SortTabs value={sortBy} onChange={setSortBy} options={[{value:'skill',label:'Skill'},{value:'name',label:'Name'},{value:'grade',label:'Grade'}]} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', maxHeight: 400, overflowY: 'auto' }}>
          {pool.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: '1px solid var(--border)', borderRight: (i + 1) % 3 !== 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: skillColor(p.skill) }}>{p.skill ?? '—'}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Live View ─────────────────────────────────────────────────────────────────

function LiveView({ draft, setDrafts, players, evals }) {
  const [sortBy, setSortBy] = useState('skill');
  const [search, setSearch] = useState('');
  const [logOpen, setLogOpen] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [balancedPreview, setBalancedPreview] = useState(null);

  const pool = useMemo(() => buildDraftPool(players, evals, draft.division), [players, evals, draft.division]);
  const poolMap = useMemo(() => Object.fromEntries(pool.map(p => [p.id, p])), [pool]);

  const drafted = new Set(Object.values(draft.roster).flat());
  let available = pool.filter(p => !drafted.has(p.id));
  if (search) available = available.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  available = [...available].sort((a, b) =>
    sortBy === 'skill' ? (b.skill ?? 0) - (a.skill ?? 0) :
    sortBy === 'name' ? a.name.localeCompare(b.name) :
    sortBy === 'grade' ? (a.grade || '').localeCompare(b.grade || '') :
    (a.position || '').localeCompare(b.position || '')
  );

  const { draftOrder, currentPick, teams, rounds, format } = draft;
  const done = currentPick >= draftOrder.length;
  const onClockId = done ? null : draftOrder[currentPick];
  const onClockTeam = teams.find(t => t.id === onClockId);
  const round = Math.floor(currentPick / teams.length) + 1;
  const remaining = pool.filter(p => !drafted.has(p.id)).length;

  function makePick(playerId) {
    if (done || !onClockId || format === 'balanced') return;
    const player = poolMap[playerId];
    const newPick = currentPick + 1;
    const completed = newPick >= draftOrder.length;
    const newRoster = { ...draft.roster, [onClockId]: [...(draft.roster[onClockId] || []), playerId] };
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : {
      ...d,
      roster: newRoster,
      currentPick: newPick,
      status: completed ? 'completed' : 'live',
      log: [...d.log, { pick: currentPick + 1, teamId: onClockId, playerName: player?.name || playerId, playerId }],
    }));
  }

  function undoLast() {
    if (!draft.log.length) return;
    const last = draft.log[draft.log.length - 1];
    setDrafts(prev => prev.map(d => {
      if (d.id !== draft.id) return d;
      const newRoster = { ...d.roster, [last.teamId]: d.roster[last.teamId].filter(id => id !== last.playerId) };
      return { ...d, roster: newRoster, currentPick: d.currentPick - 1, log: d.log.slice(0, -1), status: 'live' };
    }));
  }

  function endDraft() {
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : { ...d, status: 'completed' }));
    setConfirmEnd(false);
  }

  function autoAssign() {
    const sorted = [...pool].sort((a, b) => (b.skill ?? 0) - (a.skill ?? 0));
    const teamIds = teams.map(t => t.id);
    const order = buildSnakeOrder(teamIds, rounds);
    const roster = {};
    teamIds.forEach(id => { roster[id] = []; });
    sorted.slice(0, order.length).forEach((p, i) => { if (order[i]) roster[order[i]].push(p.id); });
    setBalancedPreview(roster);
  }

  function confirmBalance() {
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : { ...d, roster: balancedPreview, status: 'completed', currentPick: draftOrder.length }));
    setBalancedPreview(null);
  }

  const cols = teams.length <= 3 ? teams.length : teams.length <= 6 ? 3 : 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {!done && (
        <div style={{ borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'rgba(255,199,44,0.10)', border: '2px solid var(--varsity-gold)' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: onClockTeam?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, color: '#fff', flexShrink: 0 }}>
            {(onClockTeam?.name || '?')[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--court-navy)' }}>{onClockTeam?.name} on the clock</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Pick #{currentPick + 1} · Round {round} of {rounds} · {remaining} players left</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button size="sm" variant="ghost" onClick={undoLast} disabled={!draft.log.length}>Undo</Button>
            {!confirmEnd
              ? <Button size="sm" variant="ghost" onClick={() => setConfirmEnd(true)}>End early</Button>
              : <><Button size="sm" onClick={endDraft}>Confirm end</Button><Button size="sm" variant="ghost" onClick={() => setConfirmEnd(false)}>Cancel</Button></>
            }
          </div>
        </div>
      )}

      {format === 'balanced' && !done && (
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ flex: 1, fontSize: 14 }}>Balanced format: auto-assign players by skill evenly across teams.</span>
            <Button onClick={autoAssign}>Auto-Assign Players</Button>
          </div>
          {balancedPreview && (
            <div style={{ marginTop: 14 }}>
              <Eyebrow style={{ marginBottom: 10 }}>Preview assignments</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, marginBottom: 12 }}>
                {teams.map(team => (
                  <div key={team.id} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ background: team.color, color: '#fff', padding: '8px 12px', fontFamily: 'var(--font-display)', fontSize: 14 }}>{team.name}</div>
                    {(balancedPreview[team.id] || []).map(pid => {
                      const p = poolMap[pid];
                      return p ? <div key={pid} style={{ padding: '5px 12px', fontSize: 12, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}><span>{p.name}</span><span style={{ color: skillColor(p.skill) }}>{p.skill ?? '—'}</span></div> : null;
                    })}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={confirmBalance}>Confirm assignments</Button>
                <Button variant="ghost" onClick={() => setBalancedPreview(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 14 }}>
        <Card padding={0}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search players…"
              style={{ border: '1px solid var(--border)', borderRadius: 6, padding: '6px 10px', fontFamily: 'var(--font-body)', fontSize: 13, width: '100%', boxSizing: 'border-box' }}
            />
            <SortTabs value={sortBy} onChange={setSortBy} options={[{value:'skill',label:'Skill'},{value:'name',label:'Name'},{value:'grade',label:'Grade'},{value:'position',label:'Pos'}]} />
          </div>
          <div style={{ maxHeight: 520, overflowY: 'auto' }}>
            {available.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No players</div>}
            {available.map(p => (
              <button key={p.id} onClick={() => makePick(p.id)} disabled={done || format === 'balanced'} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', width: '100%',
                textAlign: 'left', border: 'none', borderBottom: '1px solid var(--border)',
                cursor: done || format === 'balanced' ? 'default' : 'pointer', background: 'transparent',
              }}
                onMouseEnter={e => { if (!done && format !== 'balanced') e.currentTarget.style.background = 'var(--bone)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position} · {p.school}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: skillColor(p.skill), flexShrink: 0 }}>{p.skill ?? '—'}</div>
                {!done && format !== 'balanced' && (
                  <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--varsity-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="plus" size={13} color="var(--court-navy)" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, alignContent: 'start' }}>
          {teams.map(team => {
            const pids = draft.roster[team.id] || [];
            const teamPlayers = pids.map(id => poolMap[id]).filter(Boolean);
            const avg = teamAvg(pids, pool);
            const isClock = team.id === onClockId;
            return (
              <div key={team.id} style={{ border: `${isClock ? 2 : 1}px solid ${isClock ? team.color : 'var(--border)'}`, borderRadius: 10, overflow: 'hidden', boxShadow: isClock ? `0 0 0 3px ${team.color}22` : 'none' }}>
                <div style={{ background: team.color, color: '#fff', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase' }}>{team.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>{isClock ? '⏱ On the clock' : team.coach ? `Coach ${team.coach}` : ''}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{teamPlayers.length}</div>
                    {avg !== null && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>avg {avg.toFixed(1)}</div>}
                  </div>
                </div>
                {teamPlayers.length === 0
                  ? <div style={{ padding: '12px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 12 }}>No picks yet</div>
                  : teamPlayers.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{p.name}</div>
                      <span style={{ fontSize: 10, color: 'var(--fg-muted)' }}>{p.position?.[0]}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: skillColor(p.skill) }}>{p.skill ?? '—'}</span>
                    </div>
                  ))
                }
                {avg !== null && (
                  <div style={{ height: 4, background: 'var(--bone)' }}>
                    <div style={{ height: '100%', background: team.color, width: `${Math.min(100, (avg / 5) * 100)}%`, opacity: 0.6 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {draft.log.length > 0 && (
        <Card padding={0}>
          <button onClick={() => setLogOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', borderBottom: logOpen ? '1px solid var(--border)' : 'none' }}>
            <Eyebrow>Pick log ({draft.log.length})</Eyebrow>
            <Icon name={logOpen ? 'chevron-up' : 'chevron-down'} size={14} color="var(--fg-muted)" />
          </button>
          {logOpen && (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {draft.log.map((entry, i) => {
                const team = teams.find(t => t.id === entry.teamId);
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)', width: '50%', boxSizing: 'border-box' }}>
                    <span style={{ fontSize: 11, color: 'var(--fg-muted)', minWidth: 22 }}>#{entry.pick}</span>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: team?.color }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: team?.color, minWidth: 52 }}>{team?.name}</span>
                    <span style={{ fontSize: 12 }}>{entry.playerName}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

// ── Completed View ────────────────────────────────────────────────────────────

function CompletedView({ draft, setDrafts, players, evals, setPlayers }) {
  const pool = useMemo(() => buildDraftPool(players, evals, draft.division), [players, evals, draft.division]);
  const poolMap = useMemo(() => Object.fromEntries(pool.map(p => [p.id, p])), [pool]);

  function finalizeTeams() {
    setPlayers(prev => prev.map(p => {
      for (const team of draft.teams) {
        if ((draft.roster[team.id] || []).includes(p.id)) {
          return { ...p, team: team.name, status: 'active' };
        }
      }
      return p;
    }));
  }

  function resetDraft() {
    const draftOrder = draft.teams.map(t => t.id);
    const roster = {};
    draftOrder.forEach(id => { roster[id] = []; });
    setDrafts(prev => prev.map(d => d.id !== draft.id ? d : { ...d, status: 'setup', currentPick: 0, roster, log: [], playerIds: [] }));
  }

  const avgs = draft.teams.map(t => ({ team: t, avg: teamAvg(draft.roster[t.id] || [], pool) }));
  const maxAvg = Math.max(...avgs.map(a => a.avg ?? 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 10, background: 'rgba(31,138,91,0.07)', border: '1px solid rgba(31,138,91,0.20)' }}>
        <Icon name="check-circle" size={18} color="#1F8A5B" />
        <span style={{ flex: 1, fontSize: 14 }}><strong>Draft complete</strong> — {draft.name}</span>
        <Button size="sm" variant="ghost" onClick={resetDraft}>Reset draft</Button>
        <Button size="sm" onClick={finalizeTeams}>Finalize Teams</Button>
      </div>

      <Card padding={16}>
        <Eyebrow style={{ marginBottom: 12 }}>Skill balance</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {avgs.map(({ team, avg }) => (
            <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: team.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, width: 100 }}>{team.name}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--bone)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: team.color, width: `${((avg ?? 0) / maxAvg) * 100}%` }} />
              </div>
              <span style={{ fontSize: 13, fontFamily: 'var(--font-display)', width: 32, textAlign: 'right', color: skillColor(avg) }}>{avg?.toFixed(1) ?? '—'}</span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {draft.teams.map(team => {
          const pids = draft.roster[team.id] || [];
          const teamPlayers = pids.map(id => poolMap[id]).filter(Boolean);
          const avg = teamAvg(pids, pool);
          const skills = teamPlayers.map(p => p.skill).filter(v => v !== null && v !== undefined);
          const minS = skills.length ? Math.min(...skills) : null;
          const maxS = skills.length ? Math.max(...skills) : null;
          return (
            <Card key={team.id} padding={0} style={{ overflow: 'hidden' }}>
              <div style={{ background: team.color, color: '#fff', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase' }}>{team.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{team.coach ? `Coach ${team.coach}` : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {avg !== null && <div style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{avg.toFixed(1)}</div>}
                  {minS !== null && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>{minS}–{maxS} range</div>}
                </div>
              </div>
              {teamPlayers.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: skillColor(p.skill) }}>{p.skill ?? '—'}</span>
                </div>
              ))}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DraftBoardView() {
  const [drafts, setDrafts] = useLocalStorage('fpyc-drafts', []);
  const [players, setPlayers] = usePlayers();
  const [evals] = useLocalStorage('fpyc-evals', {});
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const activeDraft = drafts.find(d => d.id === activeDraftId);

  function createDraft(draft) {
    setDrafts(prev => [...prev, draft]);
    setActiveDraftId(draft.id);
    setShowNewForm(false);
  }

  function deleteDraft(id) {
    if (!confirm('Delete this draft?')) return;
    setDrafts(prev => prev.filter(d => d.id !== id));
    if (activeDraftId === id) setActiveDraftId(null);
  }

  if (!activeDraft) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Display size={24}>Draft Board</Display>
          {!showNewForm && <Button onClick={() => setShowNewForm(true)}>+ New Draft</Button>}
        </div>

        {showNewForm && <NewDraftForm onSave={createDraft} onCancel={() => setShowNewForm(false)} />}

        {drafts.length === 0 && !showNewForm && (
          <Card padding={40} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏀</div>
            <Display size={18} style={{ marginBottom: 8 }}>No draft sessions yet</Display>
            <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 20 }}>Create a draft session to assign players to teams.</div>
            <Button onClick={() => setShowNewForm(true)}>+ New Draft</Button>
          </Card>
        )}

        {drafts.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', border: '1px solid var(--border)', borderRadius: 10, background: '#fff' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{d.season} · {d.format} · {d.teams.length} teams · {d.rounds} rounds</div>
            </div>
            <StatusPill status={d.status} />
            <Button size="sm" onClick={() => setActiveDraftId(d.id)}>Open</Button>
            <button onClick={() => deleteDraft(d.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--fg-muted)', padding: 4 }}>
              <Icon name="trash" size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setActiveDraftId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--basketball-orange)', fontWeight: 700, fontSize: 13, padding: 0 }}>← All drafts</button>
        <span style={{ color: 'var(--fg-muted)' }}>/</span>
        <span style={{ fontWeight: 700, fontSize: 15 }}>{activeDraft.name}</span>
        <StatusPill status={activeDraft.status} />
      </div>

      {activeDraft.status === 'setup' && (
        <NewDraftForm
          key={activeDraft.id}
          initial={activeDraft}
          onSave={updated => {
            setDrafts(prev => prev.map(d => d.id !== activeDraft.id ? d : { ...updated, id: activeDraft.id }));
          }}
          onCancel={null}
        />
      )}

      {activeDraft.status === 'open' && (
        <OpenView draft={activeDraft} setDrafts={setDrafts} players={players} evals={evals} />
      )}

      {activeDraft.status === 'live' && (
        <LiveView draft={activeDraft} setDrafts={setDrafts} players={players} evals={evals} />
      )}

      {activeDraft.status === 'completed' && (
        <CompletedView draft={activeDraft} setDrafts={setDrafts} players={players} evals={evals} setPlayers={setPlayers} />
      )}
    </div>
  );
}
