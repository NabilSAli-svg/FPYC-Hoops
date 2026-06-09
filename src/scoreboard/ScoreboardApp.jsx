import { useEffect, useState } from 'react';
import { useGames } from '../shared/store.js';

export default function ScoreboardApp() {
  const [games] = useGames();
  const [tick, setTick] = useState(0);

  // Re-render every 30s so the "updated" timestamp stays fresh
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const live      = games.filter(g => g.status === 'live').sort(byDate);
  const finals    = games.filter(g => g.status === 'final').sort(byDateDesc);
  const scheduled = games.filter(g => g.status === 'scheduled').sort(byDate);

  const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--court-navy)',
      fontFamily: 'var(--font-body)',
      color: '#fff',
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '3px solid var(--varsity-gold)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 36, objectFit: 'contain' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>
              Live Scoreboard
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>FPYC Basketball · Updates automatically</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Last updated {now}</span>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* LIVE games — most prominent */}
        {live.length > 0 && (
          <section>
            <SectionHead label="In Progress" live />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {live.map(g => <GameCard key={g.id} game={g} variant="live" />)}
            </div>
          </section>
        )}

        {/* Upcoming today */}
        {scheduled.length > 0 && (
          <section>
            <SectionHead label="Upcoming" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {scheduled.map(g => <GameCard key={g.id} game={g} variant="scheduled" />)}
            </div>
          </section>
        )}

        {/* Final results */}
        {finals.length > 0 && (
          <section>
            <SectionHead label="Final Results" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {finals.map(g => <GameCard key={g.id} game={g} variant="final" />)}
            </div>
          </section>
        )}

        {live.length === 0 && scheduled.length === 0 && finals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', marginBottom: 8 }}>No games today</div>
            <div style={{ fontSize: 14 }}>Check back on game day</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SectionHead({ label, live: isLive }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      {isLive && <PulseDot />}
      <span style={{
        fontSize: 11, fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: isLive ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.4)',
      }}>
        {label}
      </span>
      {isLive && (
        <span style={{
          fontSize: 9, fontWeight: 900,
          padding: '2px 7px', borderRadius: 999,
          background: 'var(--varsity-gold)', color: 'var(--court-navy)',
          letterSpacing: '0.08em',
        }}>
          LIVE
        </span>
      )}
    </div>
  );
}

function GameCard({ game: g, variant }) {
  const isLive      = variant === 'live';
  const isFinal     = variant === 'final';
  const isScheduled = variant === 'scheduled';

  const fpyc = g.team || 'FPYC';
  const opp  = g.opponent;

  const fpycScore = g.us   ?? null;
  const oppScore  = g.them ?? null;

  const fpycWin = isFinal && fpycScore != null && fpycScore > oppScore;
  const oppWin  = isFinal && oppScore  != null && oppScore  > fpycScore;

  return (
    <div style={{
      background: isLive
        ? 'rgba(255,199,44,0.07)'
        : 'rgba(255,255,255,0.04)',
      border: `1.5px solid ${isLive ? 'rgba(255,199,44,0.4)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Card top bar */}
      <div style={{
        padding: '10px 18px',
        borderBottom: `1px solid ${isLive ? 'rgba(255,199,44,0.15)' : 'rgba(255,255,255,0.06)'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isLive && <PulseDot />}
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: isLive ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.4)' }}>
            {isLive ? 'In Progress' : isFinal ? 'Final' : g.time}
          </span>
          {isLive && (
            <span style={{
              fontSize: 9, fontWeight: 900,
              padding: '2px 7px', borderRadius: 999,
              background: 'var(--varsity-gold)', color: 'var(--court-navy)',
              letterSpacing: '0.08em',
            }}>LIVE</span>
          )}
          {isScheduled && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>· {g.day}</span>
          )}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'right', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {g.location || 'Location TBD'}
        </span>
      </div>

      {/* Score body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TeamScoreRow
          name={fpyc}
          score={fpycScore}
          isWinner={fpycWin}
          isLoser={oppWin}
          isLive={isLive}
          isFpyc
        />
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
          VS
        </div>
        <TeamScoreRow
          name={opp}
          score={oppScore}
          isWinner={oppWin}
          isLoser={fpycWin}
          isLive={isLive}
        />
      </div>
    </div>
  );
}

function TeamScoreRow({ name, score, isWinner, isLoser, isLive, isFpyc }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 16px',
      borderRadius: 10,
      background: isWinner
        ? 'rgba(255,199,44,0.12)'
        : 'rgba(255,255,255,0.04)',
      border: `1.5px solid ${isWinner ? 'rgba(255,199,44,0.35)' : 'rgba(255,255,255,0.06)'}`,
      opacity: isLoser ? 0.45 : 1,
      transition: 'opacity 200ms',
    }}>
      {/* FPYC dot indicator */}
      {isFpyc && (
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />
      )}

      <span style={{
        flex: 1,
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        color: isWinner ? 'var(--varsity-gold)' : '#fff',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {name}
      </span>

      {score != null ? (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 40,
          fontWeight: 700,
          lineHeight: 1,
          color: isWinner ? 'var(--varsity-gold)' : isLoser ? 'rgba(255,255,255,0.4)' : '#fff',
          flexShrink: 0,
          minWidth: 48,
          textAlign: 'right',
        }}>
          {score}
        </span>
      ) : (
        <span style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.25)',
          fontStyle: 'italic',
          flexShrink: 0,
        }}>
          {isLive ? '–' : 'TBD'}
        </span>
      )}

      {isWinner && (
        <span style={{
          fontSize: 9, fontWeight: 900,
          padding: '3px 7px', borderRadius: 999,
          background: 'var(--varsity-gold)', color: 'var(--court-navy)',
          letterSpacing: '0.06em', flexShrink: 0,
        }}>
          W
        </span>
      )}
    </div>
  );
}

function PulseDot() {
  return (
    <span style={{ position: 'relative', width: 10, height: 10, flexShrink: 0, display: 'inline-block' }}>
      <span style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: '#EF4444',
        animation: 'pulse-ring 1.4s ease-out infinite',
      }} />
      <span style={{
        position: 'absolute', inset: '2px',
        borderRadius: '50%',
        background: '#EF4444',
      }} />
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </span>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const MONTH_IDX = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
const dateVal = g => (MONTH_IDX[g.month] ?? 0) * 100 + (g.date || 0);
const byDate     = (a, b) => dateVal(a) - dateVal(b);
const byDateDesc = (a, b) => dateVal(b) - dateVal(a);
