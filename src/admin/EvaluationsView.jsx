import { useState } from 'react';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import { Card, Button, Icon, Display, Eyebrow, Jersey } from '../shared/index.js';
import { csvDownload } from '../shared/csvDownload.js';

const SKILLS = [
  { id: 'shooting',     label: 'Shooting',      icon: 'target'    },
  { id: 'defense',      label: 'Defense',        icon: 'shield'    },
  { id: 'dribbling',    label: 'Handling',       icon: 'activity'  },
  { id: 'passing',      label: 'Passing',        icon: 'send'      },
  { id: 'rebounding',   label: 'Rebounding',     icon: 'arrow-up'  },
  { id: 'effort',       label: 'Effort',         icon: 'zap'       },
  { id: 'coachability', label: 'Coachability',   icon: 'heart'     },
  { id: 'teamwork',     label: 'Teamwork',       icon: 'users'     },
];

const EVAL_SEED = {
  p1:  { shooting: 5, defense: 4, dribbling: 4, passing: 5, rebounding: 3, effort: 5, coachability: 5, teamwork: 5 },
  p2:  { shooting: 4, defense: 5, dribbling: 5, passing: 5, rebounding: 3, effort: 5, coachability: 5, teamwork: 5 },
  p3:  { shooting: 4, defense: 4, dribbling: 3, passing: 3, rebounding: 5, effort: 4, coachability: 4, teamwork: 4 },
  p4:  { shooting: 3, defense: 3, dribbling: 3, passing: 4, rebounding: 4, effort: 5, coachability: 5, teamwork: 5 },
  p5:  { shooting: 3, defense: 4, dribbling: 2, passing: 3, rebounding: 5, effort: 4, coachability: 4, teamwork: 4 },
  p6:  { shooting: 4, defense: 3, dribbling: 4, passing: 4, rebounding: 3, effort: 3, coachability: 3, teamwork: 4 },
  p7:  { shooting: 4, defense: 4, dribbling: 4, passing: 4, rebounding: 3, effort: 4, coachability: 5, teamwork: 5 },
  p8:  { shooting: 3, defense: 4, dribbling: 3, passing: 3, rebounding: 4, effort: 5, coachability: 5, teamwork: 5 },
  p9:  { shooting: 2, defense: 3, dribbling: 2, passing: 3, rebounding: 3, effort: 3, coachability: 4, teamwork: 4 },
  p10: { shooting: 3, defense: 3, dribbling: 4, passing: 3, rebounding: 3, effort: 4, coachability: 4, teamwork: 4 },
  p11: { shooting: 3, defense: 4, dribbling: 3, passing: 3, rebounding: 5, effort: 4, coachability: 4, teamwork: 3 },
};

function initEvals(players) {
  const map = {};
  players.forEach(p => {
    const seed = EVAL_SEED[p.id];
    map[p.id] = seed
      ? { ...seed }
      : Object.fromEntries(SKILLS.map(s => [s.id, 3]));
  });
  return map;
}

function exportEvalsCSV(players, evals, notes) {
  const headers = ['Name', '#', 'Grade', 'Position', 'Overall', ...SKILLS.map(s => s.label), 'Notes'];
  const rows = players.map(p => {
    const e = evals[p.id] || {};
    const vals = SKILLS.map(s => e[s.id] || 0);
    const overall = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '0.0';
    return [p.name, p.number, p.grade, p.position, overall, ...vals, notes[p.id] || ''];
  });
  csvDownload('fpyc-evaluations.csv', [headers, ...rows]);
}

function avg(evalsMap, pid) {
  const vals = Object.values(evalsMap[pid] || {});
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
}

function RadarChart({ evals, teamAvg, size = 220 }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.34;
  const n = SKILLS.length;
  const angle = i => (2 * Math.PI * i / n) - Math.PI / 2;
  const pt = (i, val) => {
    const a = angle(i);
    const d = (val / 5) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  };
  const makePath = pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + ' Z';

  const gridPath = level => makePath(SKILLS.map((_, i) => pt(i, level)));
  const playerPath = makePath(SKILLS.map((s, i) => pt(i, evals[s.id] || 0)));
  const teamPath = teamAvg ? makePath(SKILLS.map((s, i) => pt(i, teamAvg[s.id] || 0))) : null;
  const playerPts = SKILLS.map((s, i) => pt(i, evals[s.id] || 0));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {[1, 2, 3, 4, 5].map(lv => (
        <path key={lv} d={gridPath(lv)} fill="none" stroke="var(--border)" strokeWidth={lv === 5 ? 1.5 : 1} />
      ))}
      {SKILLS.map((_, i) => {
        const [x, y] = pt(i, 5);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
      })}
      {teamPath && (
        <path d={teamPath} fill="rgba(10,31,61,0.07)" stroke="rgba(10,31,61,0.28)" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" />
      )}
      <path d={playerPath} fill="rgba(255,199,44,0.22)" stroke="var(--varsity-gold)" strokeWidth="2" strokeLinejoin="round" />
      {playerPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill="var(--varsity-gold)" />
      ))}
      {SKILLS.map((s, i) => {
        const a = angle(i);
        const lr = r + 22;
        const lx = cx + lr * Math.cos(a);
        const ly = cy + lr * Math.sin(a);
        return (
          <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 9, fontWeight: 700, fill: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {s.label.slice(0, 5)}
          </text>
        );
      })}
    </svg>
  );
}

export default function EvaluationsView({ players }) {
  const [selected, setSelected] = useState(players[0]?.id);
  const [evals, setEvals] = useLocalStorage('fpyc-evals', () => initEvals(players));
  const [savedEvals, setSavedEvals] = useState(evals);
  const [notes, setNotes] = useLocalStorage('fpyc-notes', {});
  const [savedNotes, setSavedNotes] = useState(notes);
  const [justSaved, setJustSaved] = useState(false);

  const active = players.filter(p => p.status !== 'inactive');
  const sortedPlayers = [...active].sort((a, b) => parseFloat(avg(evals, b.id)) - parseFloat(avg(evals, a.id)));

  const teamAvgEvals = SKILLS.reduce((acc, s) => {
    const vals = active.map(p => evals[p.id]?.[s.id]).filter(Boolean);
    acc[s.id] = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return acc;
  }, {});

  const player = players.find(p => p.id === selected);
  const playerEvals = evals[selected] || {};

  const isDirty = selected && (
    JSON.stringify(evals[selected]) !== JSON.stringify(savedEvals[selected]) ||
    (notes[selected] || '') !== (savedNotes[selected] || '')
  );

  const setRating = (skill, val) =>
    setEvals(prev => ({ ...prev, [selected]: { ...prev[selected], [skill]: val } }));

  const handleSave = () => {
    setSavedEvals(prev => ({ ...prev, [selected]: { ...evals[selected] } }));
    setSavedNotes(prev => ({ ...prev, [selected]: notes[selected] || '' }));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const overall = parseFloat(avg(evals, selected));
  const grade = overall >= 4.5 ? 'Elite' : overall >= 3.5 ? 'Strong' : overall >= 2.5 ? 'Developing' : 'Needs work';
  const gradeColor = overall >= 4.5 ? 'var(--varsity-gold)' : overall >= 3.5 ? 'var(--status-win)' : overall >= 2.5 ? 'var(--status-warning)' : 'var(--foul-red)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
      {/* Player list */}
      <Card padding={0} style={{ height: 'fit-content' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Display size={18}>Players</Display>
          <Button kind="ghost" size="sm" icon="download" onClick={() => exportEvalsCSV(active, evals, notes)}>Export</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sortedPlayers.map((p, i) => {
            const a = avg(evals, p.id);
            const isActive = selected === p.id;
            const dirty = JSON.stringify(evals[p.id]) !== JSON.stringify(savedEvals[p.id]) ||
              (notes[p.id] || '') !== (savedNotes[p.id] || '');
            const ratingColor = parseFloat(a) >= 4 ? 'var(--status-win)' : parseFloat(a) >= 3 ? 'var(--fg)' : 'var(--foul-red)';
            return (
              <button key={p.id} onClick={() => setSelected(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                background: isActive ? 'rgba(255,199,44,0.10)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--varsity-gold)' : 'transparent'}`,
                border: 'none', borderBottom: i < sortedPlayers.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <div style={{ width: 18, fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textAlign: 'center', flexShrink: 0 }}>{i + 1}</div>
                <Jersey number={p.number} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--court-navy)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {p.name.split(' ')[1]}
                    {dirty && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--basketball-orange)', display: 'inline-block', flexShrink: 0 }} />}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.position}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: ratingColor }}>{a}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Eval form */}
      {player && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header card */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <Jersey number={player.number} size={52} />
              <div style={{ flex: 1 }}>
                <Display size={28}>{player.name}</Display>
                <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>{player.grade} · {player.position} · {player.school}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, color: gradeColor }}>{avg(evals, selected)}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: gradeColor, letterSpacing: '0.10em', textTransform: 'uppercase' }}>{grade}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                {isDirty && !justSaved && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--basketball-orange)' }}>Unsaved changes</span>
                )}
                {justSaved && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-win)' }}>Saved!</span>
                )}
                <Button kind="gold" icon={justSaved ? 'check' : 'save'} onClick={handleSave}>
                  {justSaved ? 'Saved' : 'Save evaluation'}
                </Button>
              </div>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
            {/* Skills */}
            <Card>
              <Display size={20} style={{ marginBottom: 20 }}>Skill ratings</Display>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {SKILLS.map(skill => {
                  const val = playerEvals[skill.id] || 0;
                  return (
                    <div key={skill.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Icon name={skill.icon} size={15} color="var(--fg-muted)" />
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{skill.label}</span>
                        </div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: val >= 4 ? 'var(--status-win)' : val >= 3 ? 'var(--fg)' : 'var(--status-warning)' }}>{val}/5</span>
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setRating(skill.id, n)} style={{
                            flex: 1, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
                            background: n <= val ? 'var(--varsity-gold)' : 'var(--bone)',
                            transition: 'all 120ms', position: 'relative',
                          }}>
                            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 13, color: n <= val ? 'var(--court-navy)' : 'var(--fg-muted)' }}>{n}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Radar + notes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 260 }}>
              <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Eyebrow>Skill profile</Eyebrow>
                <RadarChart evals={playerEvals} teamAvg={teamAvgEvals} size={220} />
                <div style={{ display: 'flex', gap: 14, fontSize: 10, color: 'var(--fg-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 12, height: 3, background: 'var(--varsity-gold)', borderRadius: 2, display: 'inline-block' }} /> Player
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 12, height: 2, borderTop: '2px dashed rgba(10,31,61,0.35)', display: 'inline-block' }} /> Team avg
                  </span>
                </div>
              </Card>
              <Card>
                <Display size={16} style={{ marginBottom: 10 }}>Coach notes</Display>
                <textarea
                  value={notes[selected] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [selected]: e.target.value }))}
                  placeholder="Development focus, attitude, areas to watch…"
                  style={{ width: '100%', minHeight: 88, padding: '10px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg)', resize: 'vertical', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box', lineHeight: 1.5 }}
                />
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
