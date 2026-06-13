import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { usePlayers, useStats } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function totalPts(playerStats) {
  return Object.values(playerStats).reduce((sum, s) => sum + (parseInt(s.pts) || 0), 0);
}

// ── Main app ──────────────────────────────────────────────────────────────────

export default function ScorekeeperApp() {
  const [game, setGame] = useState(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handlePinSubmit(e) {
    e.preventDefault();
    if (pin.length !== 4) { setPinError('PIN must be 4 digits.'); return; }
    setLoading(true); setPinError('');
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('score_pin', pin.trim())
      .neq('status', 'cancelled')
      .single();
    setLoading(false);
    if (error || !data) { setPinError('No game found for that PIN. Check with the commissioner.'); return; }
    setGame(data);
  }

  function handleSignOut() {
    setGame(null);
    setPin('');
    setPinError('');
  }

  if (!game) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', padding: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 380, boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 28 }}>
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 44, objectFit: 'contain', marginBottom: 4 }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', letterSpacing: '0.04em' }}>Scorekeeper</div>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>Enter game PIN to begin</div>
          </div>

          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Game PIN</label>
              <input
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                placeholder="4-digit PIN"
                inputMode="numeric"
                maxLength={4}
                style={{ ...inputSt, fontSize: 28, textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'var(--font-display)' }}
              />
            </div>
            {pinError && (
              <div style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="alert-circle" size={14} color="var(--foul-red)" /> {pinError}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ marginTop: 4, padding: '12px', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><Spinner /> Checking…</> : <><Icon name="unlock" size={16} color="#fff" /> Access Game</>}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'rgba(10,31,61,0.05)', border: '1px solid #E5E7EB' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>How to get your PIN</div>
            <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>Ask the commissioner for the 4-digit PIN assigned to today's game.</div>
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
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>Scorekeeper</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em', marginTop: 2 }}>
                {game.home ? 'vs.' : '@'} {game.opponent} · {game.day}
              </div>
            </div>
          </div>
          <button onClick={handleSignOut} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>
            <Icon name="log-out" size={15} color="rgba(255,255,255,0.55)" /> Exit
          </button>
        </div>
      </header>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        <ScorekeeperMain game={game} setGame={setGame} pin={pin} />
      </div>
    </div>
  );
}

// ── Main scoring view ─────────────────────────────────────────────────────────

function ScorekeeperMain({ game, setGame, pin }) {
  const [players] = usePlayers();
  const [stats, setStats] = useStats();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const rosterPlayers = players.filter(p => p.team === (game.team || 'Fairfax Hawks') && p.status !== 'inactive');

  const [scoreUs, setScoreUs] = useState(game.us != null ? String(game.us) : '');
  const [scoreThem, setScoreThem] = useState(game.them != null ? String(game.them) : '');
  const [playerStats, setPlayerStats] = useState(() => {
    const existing = stats[game.id] || {};
    return rosterPlayers.reduce((acc, p) => {
      acc[p.id] = existing[p.id]
        ? { pts: existing[p.id].pts ?? '', reb: existing[p.id].reb ?? '', ast: existing[p.id].ast ?? '', fls: existing[p.id].fls ?? '' }
        : { pts: '', reb: '', ast: '', fls: '' };
      return acc;
    }, {});
  });
  const [scoreError, setScoreError] = useState('');

  function setPlayerStat(pid, field, val) {
    setPlayerStats(prev => ({ ...prev, [pid]: { ...prev[pid], [field]: val } }));
  }

  async function callRpc(us, them, status, quarter = null) {
    const { data } = await supabase.rpc('update_game_score', {
      p_game_id: game.id,
      p_pin: pin,
      p_us: us,
      p_them: them,
      p_status: status,
      p_quarter: quarter,
    });
    return data;
  }

  async function handleGoLive() {
    const us = scoreUs !== '' ? parseInt(scoreUs) : 0;
    const them = scoreThem !== '' ? parseInt(scoreThem) : 0;
    if (isNaN(us) || isNaN(them) || us < 0 || them < 0) { setScoreError('Scores must be non-negative numbers.'); return; }
    setScoreError(''); setSaving(true);
    const result = await callRpc(us, them, 'live');
    setSaving(false);
    if (!result?.ok) { setSaveError(result?.error || 'Failed to push score.'); return; }
    setGame(g => ({ ...g, status: 'live', us, them }));
    setScoreUs(String(us));
    setScoreThem(String(them));
    setSaved(false);
  }

  async function handleIncrement(team, delta) {
    const newUs   = team === 'us'   ? Math.max(0, (game.us   ?? 0) + delta) : (game.us   ?? 0);
    const newThem = team === 'them' ? Math.max(0, (game.them ?? 0) + delta) : (game.them ?? 0);
    setSaving(true);
    const result = await callRpc(newUs, newThem, 'live');
    setSaving(false);
    if (!result?.ok) return;
    setGame(g => ({ ...g, us: newUs, them: newThem }));
    setScoreUs(String(newUs));
    setScoreThem(String(newThem));
  }

  async function handleSave() {
    if (scoreUs === '' || scoreThem === '') { setScoreError('Both scores are required.'); return; }
    const us = parseInt(scoreUs);
    const them = parseInt(scoreThem);
    if (isNaN(us) || isNaN(them) || us < 0 || them < 0) { setScoreError('Scores must be non-negative numbers.'); return; }
    setScoreError(''); setSaving(true); setSaveError('');

    const result = await callRpc(us, them, 'final');
    setSaving(false);
    if (!result?.ok) { setSaveError(result?.error || 'Failed to save score. Check PIN.'); return; }

    setGame(g => ({ ...g, status: 'final', us, them }));

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
    setStats(prev => ({ ...prev, [game.id]: gamePlayerStats }));
    setSaved(true);
  }

  return (
    <ScoreEntryPanel
      game={game}
      rosterPlayers={rosterPlayers}
      scoreUs={scoreUs}
      scoreThem={scoreThem}
      setScoreUs={v => { setScoreUs(v); setScoreError(''); }}
      setScoreThem={v => { setScoreThem(v); setScoreError(''); }}
      playerStats={playerStats}
      setPlayerStat={setPlayerStat}
      scoreError={scoreError}
      saveError={saveError}
      onSave={handleSave}
      onGoLive={handleGoLive}
      onIncrement={handleIncrement}
      saved={saved}
      saving={saving}
    />
  );
}

// ── Score entry panel ─────────────────────────────────────────────────────────

function ScoreEntryPanel({ game, rosterPlayers, scoreUs, scoreThem, setScoreUs, setScoreThem, playerStats, setPlayerStat, scoreError, saveError, onSave, onGoLive, onIncrement, saved, saving }) {
  const gameTeam = game?.team || 'Fairfax Hawks';
  const isLive = game.status === 'live';
  const playerTotal = Object.values(playerStats).reduce((sum, s) => sum + (parseInt(s.pts) || 0), 0);
  const teamScore = parseInt(scoreUs) || 0;
  const ptsMismatch = teamScore > 0 && playerTotal !== teamScore;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Game header */}
      <div style={{ background: 'var(--court-navy)', borderRadius: 14, padding: '20px 24px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          {isLive && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--basketball-orange)', flexShrink: 0, boxShadow: '0 0 0 3px rgba(232,119,34,0.3)' }} />}
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: isLive ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.5)' }}>
            {isLive ? 'Live now' : `${game.day} · ${game.time}`}
          </span>
          {isLive && <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)', letterSpacing: '0.08em' }}>LIVE</span>}
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

      {/* Live score increment UI */}
      {isLive && (
        <div style={{ background: '#fff', border: '2px solid rgba(232,119,34,0.3)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--basketball-orange)', flexShrink: 0 }} />
            Live Score
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' }}>
            <LiveScoreColumn label={`${gameTeam} (Us)`} score={parseInt(scoreUs) || 0} team="us" onIncrement={onIncrement} color="var(--court-navy)" saving={saving} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#D1D5DB', userSelect: 'none' }}>–</div>
            <LiveScoreColumn label={`${game.opponent} (Them)`} score={parseInt(scoreThem) || 0} team="them" onIncrement={onIncrement} color="#6B7280" saving={saving} />
          </div>
        </div>
      )}

      {/* Post-game score entry */}
      {!isLive && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#111', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="hash" size={15} color="var(--court-navy)" /> Final Score
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{gameTeam} (Us)</label>
              <input type="number" min="0" max="200" value={scoreUs} onChange={e => setScoreUs(e.target.value)} placeholder="0"
                style={{ ...numInput, textAlign: 'center', fontSize: 32, fontFamily: 'var(--font-display)', height: 64, color: 'var(--court-navy)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#D1D5DB', paddingTop: 24 }}>–</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{game.opponent} (Them)</label>
              <input type="number" min="0" max="200" value={scoreThem} onChange={e => setScoreThem(e.target.value)} placeholder="0"
                style={{ ...numInput, textAlign: 'center', fontSize: 32, fontFamily: 'var(--font-display)', height: 64, color: '#6B7280' }} />
            </div>
          </div>
          {scoreError && (
            <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Icon name="alert-circle" size={14} color="#DC2626" /> {scoreError}
            </div>
          )}
        </div>
      )}

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
        {saveError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#DC2626', fontWeight: 700 }}>
            <Icon name="alert-circle" size={15} color="#DC2626" /> {saveError}
          </div>
        )}
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#059669', fontWeight: 700 }}>
            <Icon name="check-circle" size={15} color="#059669" /> Saved successfully
          </div>
        )}
        {game.status !== 'final' && (
          <button onClick={onGoLive} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, border: '1.5px solid var(--basketball-orange)', background: 'rgba(232,119,34,0.08)', color: 'var(--basketball-orange)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--basketball-orange)', flexShrink: 0 }} />
            Push to Scoreboard
          </button>
        )}
        <button onClick={onSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 10, border: 'none', background: saving ? '#9CA3AF' : 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? <><Spinner /> Saving…</> : <><Icon name="save" size={16} color="#fff" />{game.status === 'final' ? 'Update Score' : 'Submit Final Score'}</>}
        </button>
      </div>
    </div>
  );
}

// ── Live score column ─────────────────────────────────────────────────────────

function LiveScoreColumn({ label, score, team, onIncrement, color, saving }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color, fontWeight: 700, minWidth: 64, textAlign: 'center' }}>{score}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => onIncrement(team, n)} disabled={saving} style={{
            width: 44, height: 44, borderRadius: 10, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            background: color === 'var(--court-navy)' ? 'var(--court-navy)' : '#6B7280',
            color: '#fff', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: saving ? 0.5 : 1,
          }}>+{n}</button>
        ))}
      </div>
      <button onClick={() => onIncrement(team, -1)} disabled={saving} style={{
        padding: '4px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', cursor: saving ? 'not-allowed' : 'pointer',
        background: '#F9FAFB', color: '#6B7280', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)', opacity: saving ? 0.5 : 1,
      }}>−1 Undo</button>
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

const inputSt = { padding: '10px 12px', borderRadius: 8, border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box' };

const numInput = { padding: '8px 12px', borderRadius: 10, border: '2px solid #E5E7EB', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', background: '#F9FAFB', width: '100%', boxSizing: 'border-box', fontWeight: 700 };

const statInput = { padding: '5px 4px', borderRadius: 6, border: '1.5px solid #E5E7EB', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none', background: '#F9FAFB', width: '100%', boxSizing: 'border-box', textAlign: 'center', fontWeight: 700 };
