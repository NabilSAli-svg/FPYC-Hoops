import { useState } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Jersey, Pill } from '../shared/index.js';

const SKILLS = [
  { id: 'shooting',    label: 'Shooting',       icon: 'target' },
  { id: 'defense',     label: 'Defense',         icon: 'shield' },
  { id: 'dribbling',   label: 'Ball Handling',   icon: 'activity' },
  { id: 'passing',     label: 'Passing',          icon: 'send' },
  { id: 'rebounding',  label: 'Rebounding',       icon: 'arrow-up' },
  { id: 'effort',      label: 'Effort',           icon: 'zap' },
  { id: 'coachability',label: 'Coachability',     icon: 'heart' },
  { id: 'teamwork',    label: 'Teamwork',         icon: 'users' },
];

function initEvals(players) {
  const map = {};
  players.forEach(p => {
    map[p.id] = {};
    SKILLS.forEach(s => {
      map[p.id][s.id] = Math.floor(Math.random() * 3) + 3;
    });
  });
  return map;
}

export default function EvaluationsView({ players }) {
  const [selected, setSelected] = useState(players[0]?.id);
  const [evals, setEvals] = useState(() => initEvals(players));
  const [notes, setNotes] = useState({});

  const player = players.find(p => p.id === selected);
  const playerEvals = evals[selected] || {};

  const setRating = (skill, val) => {
    setEvals(prev => ({ ...prev, [selected]: { ...prev[selected], [skill]: val } }));
  };

  const avg = (pid) => {
    const vals = Object.values(evals[pid] || {});
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
  };

  const overall = parseFloat(avg(selected));
  const grade = overall >= 4.5 ? 'Elite' : overall >= 3.5 ? 'Strong' : overall >= 2.5 ? 'Developing' : 'Needs work';
  const gradeColor = overall >= 4.5 ? 'var(--varsity-gold)' : overall >= 3.5 ? 'var(--status-win)' : overall >= 2.5 ? 'var(--status-warning)' : 'var(--foul-red)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
      {/* Player list */}
      <Card padding={0} style={{ height: 'fit-content' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Display size={18}>Players</Display>
          <Button kind="ghost" size="sm" icon="download">Export</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {players.filter(p => p.status !== 'inactive').map((p, i) => {
            const a = avg(p.id);
            const isActive = selected === p.id;
            return (
              <button key={p.id} onClick={() => setSelected(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                background: isActive ? 'rgba(255,199,44,0.10)' : 'transparent',
                borderLeft: `3px solid ${isActive ? 'var(--varsity-gold)' : 'transparent'}`,
                border: 'none', borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', textAlign: 'left', width: '100%',
              }}>
                <Jersey number={p.number} size={30} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--court-navy)' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{p.grade} · {p.position}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: parseFloat(a) >= 4 ? 'var(--status-win)' : parseFloat(a) >= 3 ? 'var(--fg)' : 'var(--foul-red)' }}>{a}</div>
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
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, color: gradeColor }}>{avg(selected)}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: gradeColor, letterSpacing: '0.10em', textTransform: 'uppercase' }}>{grade}</div>
              </div>
              <Button kind="gold" icon="save">Save evaluation</Button>
            </div>
          </Card>

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
                        <Icon name={skill.icon} size={16} color="var(--fg-muted)" />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{skill.label}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: val >= 4 ? 'var(--status-win)' : val >= 3 ? 'var(--fg)' : 'var(--status-warning)' }}>{val}/5</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => setRating(skill.id, n)} style={{
                          flex: 1, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer',
                          background: n <= val ? 'var(--varsity-gold)' : 'var(--bone)',
                          transition: 'all 120ms',
                          position: 'relative',
                        }}>
                          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 14, color: n <= val ? 'var(--court-navy)' : 'var(--fg-muted)' }}>{n}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--fg-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      <span>Needs work</span><span>Elite</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <Display size={20} style={{ marginBottom: 12 }}>Coach notes</Display>
            <textarea
              value={notes[selected] || ''}
              onChange={e => setNotes(prev => ({ ...prev, [selected]: e.target.value }))}
              placeholder="Add private notes about this player's development, areas to focus on, attitude, etc."
              style={{ width: '100%', minHeight: 100, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', resize: 'vertical', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
