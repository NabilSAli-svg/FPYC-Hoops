import { useState, useEffect, useRef } from 'react';
import Icon from '../shared/Icon.jsx';

const MY_GAMES = [
  { id: 'g1', home: 'Fairfax Hawks',    away: 'Vienna Storm',     day: 'Sat Dec 7',  time: '10:00 AM', location: 'FPYC Gym A',        partner: 'Marcus Lee'   },
  { id: 'g3', home: 'Burke Lakers',     away: 'Fairfax Hawks',    day: 'Sat Dec 21', time: '9:00 AM',  location: 'Burke Lake Park Gym', partner: 'TBD'          },
  { id: 'g5', home: 'Springfield Bulls', away: 'Fairfax Hawks',   day: 'Sat Jan 11', time: '1:00 PM',  location: 'FPYC Gym A',        partner: 'TBD'          },
];

const QUARTER_SECS = 8 * 60;
const TEAM_FOUL_BONUS = 7;

function pad(n) { return String(n).padStart(2, '0'); }
function fmtTime(s) { return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }

export default function RefGameDayView() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    return <GameTracker game={activeGame} onExit={() => setActiveGame(null)} />;
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome strip */}
      <div style={{ background: 'rgba(255,199,44,0.10)', border: '1px solid rgba(255,199,44,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="whistle" size={20} color="var(--varsity-gold)" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>Welcome, James Park</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1 }}>VBOS Level 2 · 3 upcoming assignments</div>
        </div>
      </div>

      {/* Games */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>My assignments</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MY_GAMES.map((g, i) => (
            <div key={g.id} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Matchup */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.2 }}>
                      {g.home} <span style={{ color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>vs.</span> {g.away}
                    </div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="calendar" size={11} color="var(--fg-muted)" /> {g.day} · {g.time}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="map-pin" size={11} color="var(--fg-muted)" /> {g.location}
                      </span>
                    </div>
                  </div>
                  {i === 0 && (
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: 'rgba(31,138,91,0.10)', color: 'var(--status-win)', flexShrink: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Next up</span>
                  )}
                </div>

                {/* Partner + action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon name="user" size={13} color="var(--fg-muted)" />
                    <span style={{ fontSize: 12, color: g.partner === 'TBD' ? 'var(--foul-red)' : 'var(--fg-muted)', fontWeight: g.partner === 'TBD' ? 700 : 400 }}>
                      Partner: {g.partner === 'TBD' ? 'TBD — check with coordinator' : g.partner}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveGame(g)}
                    style={{
                      background: i === 0 ? 'var(--court-navy)' : 'var(--bone)',
                      color: i === 0 ? '#fff' : 'var(--court-navy)',
                      border: `1.5px solid ${i === 0 ? 'var(--court-navy)' : 'var(--border)'}`,
                      borderRadius: 8, padding: '7px 14px',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <Icon name="play-circle" size={14} color={i === 0 ? '#fff' : 'var(--court-navy)'} />
                    Start tracker
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick rules reference */}
      <QuickRules />
    </div>
  );
}

function QuickRules() {
  const [open, setOpen] = useState(false);
  const rules = [
    { label: 'Quarter length',     value: '8 minutes' },
    { label: 'Overtime',           value: '3 minutes' },
    { label: 'Team foul bonus',    value: '7 fouls/quarter → bonus free throws' },
    { label: 'Personal foul limit', value: '5 fouls → player disqualified' },
    { label: 'Shot clock',         value: 'None (youth house league)' },
    { label: 'Full-court press',   value: 'Not allowed (K–6 divisions)' },
    { label: 'Back-court violation', value: 'Yes, applies' },
    { label: '3-second lane',      value: 'Yes, offensive 3-in-the-key' },
  ];

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ all: 'unset', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="book-open" size={15} color="var(--court-navy)" />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--court-navy)' }}>FPYC Youth Rules — Quick Reference</span>
        </div>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color="var(--fg-muted)" />
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {rules.map((r, i) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 18px', background: i % 2 === 0 ? 'var(--bone)' : '#fff', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg-muted)' }}>{r.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg)' }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GameTracker({ game, onExit }) {
  const [quarter, setQuarter] = useState(1);
  const [scores, setScores] = useState({ home: 0, away: 0 });
  const [teamFouls, setTeamFouls] = useState({ home: 0, away: 0 });
  const [personalFouls, setPersonalFouls] = useState({ home: {}, away: {} });
  const [timerSecs, setTimerSecs] = useState(QUARTER_SECS);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState('scoreboard');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimerSecs(s => {
          if (s <= 0) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function endQuarter() {
    setRunning(false);
    setTimerSecs(QUARTER_SECS);
    setTeamFouls({ home: 0, away: 0 });
    if (quarter < 4) setQuarter(q => q + 1);
  }

  function adjustScore(side, delta) {
    setScores(s => ({ ...s, [side]: Math.max(0, s[side] + delta) }));
  }

  function adjustTeamFoul(side, delta) {
    setTeamFouls(f => ({ ...f, [side]: Math.max(0, f[side] + delta) }));
  }

  function adjustPersonalFoul(side, num, delta) {
    setPersonalFouls(pf => {
      const cur = pf[side][num] || 0;
      return { ...pf, [side]: { ...pf[side], [num]: Math.max(0, cur + delta) } };
    });
  }

  const quarterLabel = quarter <= 4 ? `Q${quarter}` : `OT${quarter - 4}`;
  const isBonus = (side) => teamFouls[side] >= TEAM_FOUL_BONUS;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Game header */}
      <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '16px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button onClick={onExit} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
            <Icon name="arrow-left" size={15} color="rgba(255,255,255,0.6)" /> My games
          </button>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{game.day} · {game.time}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 6 }}>
          {game.home} vs. {game.away}
        </div>

        {/* Scoreboard */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, alignItems: 'center', marginBottom: 14 }}>
          <ScorePanel label={game.home} score={scores.home} onInc={() => adjustScore('home', 1)} onDec={() => adjustScore('home', -1)} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--varsity-gold)', letterSpacing: '0.06em' }}>{quarterLabel}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, color: '#fff', fontWeight: 700, lineHeight: 1, marginTop: 4 }}>{fmtTime(timerSecs)}</div>
          </div>
          <ScorePanel label={game.away} score={scores.away} onInc={() => adjustScore('away', 1)} onDec={() => adjustScore('away', -1)} align="right" />
        </div>

        {/* Timer controls */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button
            onClick={() => setRunning(r => !r)}
            style={{ background: running ? 'rgba(200,16,46,0.85)' : 'var(--varsity-gold)', color: running ? '#fff' : 'var(--court-navy)', border: 'none', borderRadius: 8, padding: '9px 22px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Icon name={running ? 'pause' : 'play'} size={14} color={running ? '#fff' : 'var(--court-navy)'} />
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => { setRunning(false); setTimerSecs(QUARTER_SECS); }}
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Reset
          </button>
          <button
            onClick={endQuarter}
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            End {quarterLabel}
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
        {[{ id: 'scoreboard', label: 'Team fouls', icon: 'alert-triangle' }, { id: 'personal', label: 'Personal fouls', icon: 'user-x' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: tab === t.id ? 'var(--court-navy)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--fg-muted)', border: 'none', borderRadius: 7, padding: '9px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 140ms' }}>
            <Icon name={t.icon} size={14} color={tab === t.id ? '#fff' : 'var(--fg-muted)'} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Team fouls */}
      {tab === 'scoreboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['home', 'away']).map(side => (
            <div key={side} style={{ background: '#fff', border: `2px solid ${isBonus(side) ? 'var(--foul-red)' : 'var(--border)'}`, borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>{side === 'home' ? game.home : game.away}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', marginBottom: 8 }}>Team fouls</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: isBonus(side) ? 'var(--foul-red)' : 'var(--court-navy)', lineHeight: 1, marginBottom: 4 }}>{teamFouls[side]}</div>
              {isBonus(side) && (
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--foul-red)', letterSpacing: '0.06em', marginBottom: 8 }}>BONUS</div>
              )}
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 12 }}>{TEAM_FOUL_BONUS - teamFouls[side] > 0 ? `${TEAM_FOUL_BONUS - teamFouls[side]} until bonus` : 'In bonus'}</div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <CounterBtn onClick={() => adjustTeamFoul(side, -1)} label="−" />
                <CounterBtn onClick={() => adjustTeamFoul(side, 1)} label="+" primary />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Personal fouls */}
      {tab === 'personal' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['home', 'away']).map(side => (
            <div key={side} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bone)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--court-navy)' }}>{side === 'home' ? game.home : game.away}</div>
              </div>
              <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => {
                  const fouls = personalFouls[side][num] || 0;
                  const disq = fouls >= 5;
                  return (
                    <div key={num} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 7, background: disq ? 'rgba(200,16,46,0.07)' : 'transparent' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--fg-muted)', width: 20, flexShrink: 0 }}>#{num}</span>
                      <div style={{ flex: 1, display: 'flex', gap: 3 }}>
                        {Array.from({ length: 5 }, (_, f) => (
                          <div key={f} style={{ width: 10, height: 10, borderRadius: '50%', background: f < fouls ? (disq ? 'var(--foul-red)' : 'var(--basketball-orange)') : 'var(--border)', flexShrink: 0 }} />
                        ))}
                      </div>
                      {disq && <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--foul-red)', letterSpacing: '0.04em' }}>OUT</span>}
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button onClick={() => adjustPersonalFoul(side, num, -1)} style={tinyBtn}>−</button>
                        <button onClick={() => adjustPersonalFoul(side, num, 1)} style={{ ...tinyBtn, background: 'var(--court-navy)', color: '#fff', borderColor: 'var(--court-navy)' }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ScorePanel({ label, score, onInc, onDec, align = 'left' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start', gap: 4 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100 }}>{label}</span>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: '#fff', lineHeight: 1, letterSpacing: '-0.01em' }}>{score}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onDec} style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 6, width: 32, height: 32, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
        <button onClick={onInc} style={{ background: 'var(--varsity-gold)', border: 'none', color: 'var(--court-navy)', borderRadius: 6, width: 32, height: 32, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>+</button>
      </div>
    </div>
  );
}

function CounterBtn({ onClick, label, primary }) {
  return (
    <button onClick={onClick} style={{ width: 44, height: 44, borderRadius: 10, background: primary ? 'var(--court-navy)' : 'var(--bone)', color: primary ? '#fff' : 'var(--fg)', border: `1.5px solid ${primary ? 'var(--court-navy)' : 'var(--border)'}`, fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {label}
    </button>
  );
}

const tinyBtn = {
  width: 24, height: 24, borderRadius: 5, background: 'var(--bone)',
  color: 'var(--fg)', border: '1px solid var(--border)',
  fontSize: 14, fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'var(--font-body)', padding: 0,
};
