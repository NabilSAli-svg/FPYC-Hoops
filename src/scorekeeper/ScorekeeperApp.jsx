import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { useGames, usePlayers, useStats } from '../shared/store.js';
import { useIsMobile } from '../shared/useIsMobile.js';

const CREDENTIALS = { username: 'scorekeeper', password: 'fpyc2025' };

// ── Helpers ──────────────────────────────────────────────────────────────────

function blankPlayerStats(playerIds) {
  const s = {};
  playerIds.forEach(id => { s[id] = { pts: '', reb: '', ast: '', fls: '' }; });
  return s;
}

function totalPts(playerStats) {
  return Object.values(playerStats).reduce((sum, s) => sum + (parseInt(s.pts) || 0), 0);
}

// ── Main app ──────────────────────────────────────────────────────────────────

export default function ScorekeeperApp() {
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    if (form.username === CREDENTIALS.username && form.password === CREDENTIALS.password) {
      setAuthed(true);
    } else {
      setError('Invalid credentials.');
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 28 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 44, objectFit: 'contain', marginBottom: 4 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', letterSpacing: '0.04em' }}>Scorekeeper</div>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>Post-game score & stat entry</div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <LoginField label="Username">
              <input value={form.username} onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setError(''); }}
                placeholder="scorekeeper" autoComplete="username" style={inputSt} />
            </LoginField>
            <LoginField label="Password">
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(''); }}
                  placeholder="••••••••" autoComplete="current-password" style={{ ...inputSt, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={17} color="#9CA3AF" />
                </button>
              </div>
            </LoginField>
            {error && (
              <div style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="alert-circle" size={14} color="var(--foul-red)" /> {error}
              </div>
            )}
            <button type="submit" style={{ marginTop: 4, padding: '12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15 }}>
              Sign in
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(10,31,61,0.05)', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Demo credentials</div>
            <div style={{ fontSize: 12, color: '#374151', fontFamily: 'var(--font-mono)' }}>scorekeeper · fpyc2025</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: 'var(--font-body)' }}>
      <header style={{ background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Scorekeeper</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', marginTop: 2 }}>FPYC Basketball · Season 2025–26</div>
            </div>
          </div>
          <button onClick={() => setAuthed(false)} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
            <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Sign out
          </button>
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <ScorekeeperMain />
      </div>
    </div>
  );
}

// ── Main scoring view ─────────────────────────────────────────────────────────

function ScorekeeperMain() {
  const [games, setGames] = useGames();
  const [players] = usePlayers();
  const [stats, setStats] = useStats();
  const [selectedId, setSelectedId] = useState(null);
  const [saved, setSaved] = useState(false);
  const isMobile = useIsMobile();

  const scheduled = games.filter(g => g.status === 'scheduled' || g.status === 'live').sort((a, b) => {
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    return (months[a.month] * 100 + (a.date || 0)) - (months[b.month] * 100 + (b.date || 0));
  });
  const finals = games.filter(g => g.status === 'final').sort((a, b) => {
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    return (months[b.month] * 100 + (b.date || 0)) - (months[a.month] * 100 + (a.date || 0));
  });

  const selectedGame = selectedId ? games.find(g => g.id === selectedId) : null;
  const gameTeam = selectedGame?.team || 'Fairfax Hawks';
  const rosterPlayers = players.filter(p => p.team === gameTeam && p.status !== 'inactive');

  function selectGame(game) {
    setSelectedId(game.id);
    setSaved(false);
    // Pre-populate player stats from existing data
    const existing = stats[game.id] || {};
    setPlayerStats(
      rosterPlayers.reduce((acc, p) => {
        acc[p.id] = existing[p.id]
          ? { pts: existing[p.id].pts ?? '', reb: existing[p.id].reb ?? '', ast: existing[p.id].ast ?? '', fls: existing[p.id].fls ?? '' }
          : { pts: '', reb: '', ast: '', fls: '' };
        return acc;
      }, {})
    );
    setScoreUs(game.us ?? '');
    setScoreThem(game.them ?? '');
  }

  const [scoreUs, setScoreUs] = useState('');
  const [scoreThem, setScoreThem] = useState('');
  const [playerStats, setPlayerStats] = useState({});
  const [scoreError, setScoreError] = useState('');

  function setPlayerStat(pid, field, val) {
    setPlayerStats(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: val } }));
  }

  function handleGoLive() {
    if (scoreUs === '' || scoreThem === '') { setScoreError('Enter both scores to push live.'); return; }
    const us = parseInt(scoreUs);
    const them = parseInt(scoreThem);
    if (isNaN(us) || isNaN(them) || us < 0 || them < 0) { setScoreError('Scores must be non-negative numbers.'); return; }
    setScoreError('');
    setGames(prev => prev.map(g => g.id === selectedId ? { ...g, status: 'live', us, them } : g));
    setSaved(false);
  }

  function handleSave() {
    if (scoreUs === '' || scoreThem === '') { setScoreError('Both scores are required.'); return; }
    const us = parseInt(scoreUs);
    const them = parseInt(scoreThem);
    if (isNaN(us) || isNaN(them) || us < 0 || them < 0) { setScoreError('Scores must be non-negative numbers.'); return; }
    setScoreError('');

    setGames(prev => prev.map(g => g.id === selectedId ? { ...g, status: 'final', us, them } : g));

    const gamePlayerStats = {};
    rosterPlayers.forEach(p => {
      const s = playerStats[p.id] || {};
      gamePlayerStats[p.id] = {
        pts: parseInt(s.pts) || 0,
        reb: parseInt(s.reb) || 0,
        ast: parseInt(s.ast) || 0,
        fls: parseInt(s.fls) || 0,
      };
    });
    setStats(prev => ({ ...prev, [selectedId]: gamePlayerStats }));

    setSaved(true);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '320px 1fr', gap: 24, alignItems: 'start' }}>

      {/* Game list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {scheduled.length > 0 && (
          <div>
            <SectionLabel icon="clock" label="Pending score entry" color="var(--basketball-orange)" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {scheduled.map(g => (
                <GameCard key={g.id} game={g} selected={selectedId === g.id} onClick={() => selectGame(g)} />
              ))}
            </div>
          </div>
        )}

        {finals.length > 0 && (
          <div>
            <SectionLabel icon="check-circle" label="Completed games" color="#059669" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {finals.map(g => (
                <GameCard key={g.id} game={g} selected={selectedId === g.id} onClick={() => selectGame(g)} />
              ))}
            </div>
          </div>
        )}

        {games.filter(g => g.status === 'cancelled').length > 0 && (
          <div style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', paddingTop: 4 }}>
            {games.filter(g => g.status === 'cancelled').length} cancelled game(s) not shown
          </div>
        )}
      </div>

      {/* Score entry panel */}
      <div>
        {!selectedGame ? (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '60px 24px', textAlign: 'center' }}>
            <Icon name="clipboard" size={40} color="#E5E7EB" />
            <div style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginTop: 16, marginBottom: 6 }}>Select a game to enter scores</div>
            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Choose from the list on the left to record the final score and individual stats.</div>
          </div>
        ) : (
          <ScoreEntryPanel
            game={selectedGame}
            rosterPlayers={rosterPlayers}
            scoreUs={scoreUs}
            scoreThem={scoreThem}
            setScoreUs={v => { setScoreUs(v); setScoreError(''); }}
            setScoreThem={v => { setScoreThem(v); setScoreError(''); }}
            playerStats={playerStats}
            setPlayerStat={setPlayerStat}
            scoreError={scoreError}
            onSave={handleSave}
            onGoLive={handleGoLive}
            saved={saved}
            setSaved={setSaved}
          />
        )}
      </div>
    </div>
  );
}

// ── Score entry panel ─────────────────────────────────────────────────────────

function ScoreEntryPanel({ game, rosterPlayers, scoreUs, scoreThem, setScoreUs, setScoreThem, playerStats, setPlayerStat, scoreError, onSave, onGoLive, saved, setSaved }) {
  const gameTeam = game?.team || 'Fairfax Hawks';
  const playerTotal = Object.values(playerStats).reduce((sum, s) => sum + (parseInt(s.pts) || 0), 0);
  const teamScore = parseInt(scoreUs) || 0;
  const ptsMismatch = teamScore > 0 && playerTotal !== teamScore;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Game header */}
      <div style={{ background: 'var(--court-navy)', borderRadius: 14, padding: '20px 24px', color: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
          {game.day} · {game.time}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: 4 }}>
          {game.home ? `vs. ${game.opponent}` : `@ ${game.opponent}`}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{game.location || 'Location TBD'}</div>
        {game.status === 'final' && (
          <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: game.us > game.them ? 'rgba(5,150,105,0.25)' : 'rgba(220,38,38,0.25)', borderRadius: 20, padding: '4px 12px' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: game.us > game.them ? '#6EE7B7' : '#FCA5A5' }}>
              {game.us > game.them ? 'WIN' : 'LOSS'} · {game.us}–{game.them} (previously recorded)
            </span>
          </div>
        )}
      </div>

      {/* Final score entry */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="hash" size={15} color="var(--court-navy)" /> Final Score
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {gameTeam} (Us)
            </label>
            <input
              type="number" min="0" max="200" value={scoreUs}
              onChange={e => setScoreUs(e.target.value)}
              placeholder="0"
              style={{ ...numInput, textAlign: 'center', fontSize: 32, fontFamily: 'var(--font-display)', height: 64, color: 'var(--court-navy)' }}
            />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#D1D5DB', paddingTop: 24 }}>–</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {game.opponent} (Them)
            </label>
            <input
              type="number" min="0" max="200" value={scoreThem}
              onChange={e => setScoreThem(e.target.value)}
              placeholder="0"
              style={{ ...numInput, textAlign: 'center', fontSize: 32, fontFamily: 'var(--font-display)', height: 64, color: '#6B7280' }}
            />
          </div>
        </div>

        {scoreError && (
          <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Icon name="alert-circle" size={14} color="#DC2626" /> {scoreError}
          </div>
        )}
      </div>

      {/* Player stats */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="users" size={15} color="var(--court-navy)" /> Player Stats
          </div>
          <div style={{ fontSize: 12, color: ptsMismatch ? '#DC2626' : '#9CA3AF', fontWeight: ptsMismatch ? 700 : 400 }}>
            {ptsMismatch ? `⚠ Player pts (${playerTotal}) ≠ team score (${teamScore})` : `Player total: ${playerTotal} pts`}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 60px', padding: '8px 20px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          {['Player', 'PTS', 'REB', 'AST', 'FLS'].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', textAlign: h === 'Player' ? 'left' : 'center' }}>{h}</div>
          ))}
        </div>

        {rosterPlayers.map((p, i) => {
          const s = playerStats[p.id] || { pts: '', reb: '', ast: '', fls: '' };
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 60px', padding: '8px 20px', alignItems: 'center', borderBottom: i < rosterPlayers.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>#{p.number} · {p.position}</div>
              </div>
              {['pts', 'reb', 'ast', 'fls'].map(field => (
                <input key={field} type="number" min="0" max="99" value={s[field]}
                  onChange={e => setPlayerStat(p.id, field, e.target.value)}
                  placeholder="0"
                  style={{ ...statInput, color: field === 'pts' ? 'var(--court-navy)' : '#374151' }}
                />
              ))}
            </div>
          );
        })}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 60px', padding: '10px 20px', background: '#F9FAFB', borderTop: '2px solid #E5E7EB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Totals</div>
          {['pts', 'reb', 'ast', 'fls'].map(field => {
            const total = rosterPlayers.reduce((sum, p) => sum + (parseInt((playerStats[p.id] || {})[field]) || 0), 0);
            return <div key={field} style={{ fontFamily: 'var(--font-display)', fontSize: 15, textAlign: 'center', color: '#111' }}>{total || '—'}</div>;
          })}
        </div>
      </div>

      {/* Save buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#059669', fontWeight: 700 }}>
            <Icon name="check-circle" size={15} color="#059669" /> Saved successfully
          </div>
        )}
        {game.status !== 'final' && (
          <button onClick={onGoLive} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, border: '1.5px solid var(--basketball-orange)', background: 'rgba(232,119,34,0.08)', color: 'var(--basketball-orange)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--basketball-orange)', flexShrink: 0 }} />
            Push to Scoreboard
          </button>
        )}
        <button onClick={onSave} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none', background: 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
          <Icon name="save" size={16} color="#fff" />
          {game.status === 'final' ? 'Update Score' : 'Submit Final Score'}
        </button>
      </div>
    </div>
  );
}

// ── Game card ─────────────────────────────────────────────────────────────────

function GameCard({ game, selected, onClick }) {
  const isFinal = game.status === 'final';
  const win = isFinal && game.us > game.them;
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box',
      background: selected ? 'var(--court-navy)' : '#fff',
      border: `${selected ? 2 : 1}px solid ${selected ? 'var(--court-navy)' : '#E5E7EB'}`,
      borderLeft: `4px solid ${isFinal ? (win ? '#059669' : '#DC2626') : 'var(--basketball-orange)'}`,
      borderRadius: '0 10px 10px 0',
      padding: '12px 14px',
      transition: 'all 140ms',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 12, color: selected ? 'rgba(255,255,255,0.65)' : '#9CA3AF', marginBottom: 2 }}>{game.day}</div>
          <div style={{ fontWeight: 700, fontSize: 14, color: selected ? '#fff' : '#111' }}>
            {game.home ? 'vs.' : '@'} {game.opponent}
          </div>
          <div style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.5)' : '#9CA3AF', marginTop: 2 }}>{game.time}</div>
        </div>
        {isFinal && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, lineHeight: 1, color: selected ? '#fff' : (win ? '#059669' : '#DC2626') }}>{game.us}–{game.them}</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: selected ? 'rgba(255,255,255,0.6)' : (win ? '#059669' : '#DC2626') }}>{win ? 'WIN' : 'LOSS'}</div>
          </div>
        )}
        {!isFinal && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: selected ? 'rgba(232,119,34,0.25)' : 'rgba(232,119,34,0.10)', color: selected ? '#FDE68A' : 'var(--basketball-orange)' }}>
            PENDING
          </span>
        )}
      </div>
    </button>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function SectionLabel({ icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon name={icon} size={13} color={color} />
      <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color }}>
        {label}
      </span>
    </div>
  );
}

function LoginField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}

const inputSt = { padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box' };

const numInput = { padding: '8px 12px', borderRadius: 10, border: '2px solid #E5E7EB', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', background: '#F9FAFB', width: '100%', boxSizing: 'border-box', fontWeight: 700 };

const statInput = { padding: '5px 4px', borderRadius: 6, border: '1.5px solid #E5E7EB', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none', background: '#F9FAFB', width: '100%', boxSizing: 'border-box', textAlign: 'center', fontWeight: 700 };
