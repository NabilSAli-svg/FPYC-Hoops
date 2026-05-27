import { useState } from 'react';
import { SectionHead } from './Programs.jsx';

const STANDINGS_BY_DIVISION = {
  'Boys 5–6 House': [
    { rank: 1, team: 'Centreville Eagles', fpyc: false, w: 8, l: 1, pf: 524, pa: 398, streak: 'W3' },
    { rank: 2, team: 'Fairfax Hawks',       fpyc: true,  w: 6, l: 3, pf: 487, pa: 423, streak: 'W2' },
    { rank: 3, team: 'Vienna Storm',        fpyc: false, w: 5, l: 4, pf: 461, pa: 448, streak: 'L1' },
    { rank: 4, team: 'Reston Wolves',       fpyc: false, w: 5, l: 4, pf: 439, pa: 441, streak: 'W1' },
    { rank: 5, team: 'Oakton Patriots',     fpyc: false, w: 4, l: 5, pf: 412, pa: 459, streak: 'L2' },
    { rank: 6, team: 'McLean Mustangs',     fpyc: false, w: 3, l: 6, pf: 398, pa: 467, streak: 'L3' },
    { rank: 7, team: 'Burke Lakers',        fpyc: false, w: 2, l: 7, pf: 374, pa: 492, streak: 'L4' },
    { rank: 8, team: 'Springfield Bulls',   fpyc: false, w: 1, l: 8, pf: 352, pa: 520, streak: 'L5' },
  ],
  'Girls 5–6 House': [
    { rank: 1, team: 'Arlington Stars',     fpyc: false, w: 7, l: 2, pf: 498, pa: 412, streak: 'W4' },
    { rank: 2, team: 'McLean Cardinals',    fpyc: false, w: 6, l: 3, pf: 471, pa: 438, streak: 'W1' },
    { rank: 3, team: 'Vienna Rockets',      fpyc: false, w: 5, l: 4, pf: 449, pa: 441, streak: 'W2' },
    { rank: 4, team: 'Reston Blaze',        fpyc: false, w: 4, l: 5, pf: 422, pa: 449, streak: 'L1' },
    { rank: 5, team: 'Fairfax Wolves',      fpyc: true,  w: 4, l: 5, pf: 418, pa: 461, streak: 'L2' },
    { rank: 6, team: 'Herndon Thunder',     fpyc: false, w: 2, l: 7, pf: 378, pa: 501, streak: 'L3' },
  ],
  'Boys 7–8 Select': [
    { rank: 1, team: 'Fairfax Eagles',      fpyc: true,  w: 8, l: 1, pf: 612, pa: 489, streak: 'W5' },
    { rank: 2, team: 'McLean Select',       fpyc: false, w: 7, l: 2, pf: 588, pa: 511, streak: 'W2' },
    { rank: 3, team: 'Reston Select',       fpyc: false, w: 5, l: 4, pf: 562, pa: 534, streak: 'L1' },
    { rank: 4, team: 'Arlington Gold',      fpyc: false, w: 4, l: 5, pf: 531, pa: 558, streak: 'W1' },
    { rank: 5, team: 'Vienna Elite',        fpyc: false, w: 3, l: 6, pf: 501, pa: 587, streak: 'L4' },
    { rank: 6, team: 'Chantilly Force',     fpyc: false, w: 1, l: 8, pf: 467, pa: 612, streak: 'L5' },
  ],
  'Girls 3–4 House': [
    { rank: 1, team: 'Arlington Aces',      fpyc: false, w: 7, l: 2, pf: 312, pa: 278, streak: 'W3' },
    { rank: 2, team: 'Reston Stars',        fpyc: false, w: 6, l: 3, pf: 301, pa: 289, streak: 'L1' },
    { rank: 3, team: 'Vienna Flames',       fpyc: false, w: 5, l: 4, pf: 290, pa: 298, streak: 'W2' },
    { rank: 4, team: 'McLean Gems',         fpyc: false, w: 4, l: 5, pf: 276, pa: 309, streak: 'L2' },
    { rank: 5, team: 'Fairfax Cougars',     fpyc: true,  w: 3, l: 6, pf: 261, pa: 324, streak: 'L3' },
    { rank: 6, team: 'Herndon Comets',      fpyc: false, w: 1, l: 8, pf: 234, pa: 342, streak: 'L4' },
  ],
};

const PLAYOFF_SPOTS = 4;
const DIVISIONS = Object.keys(STANDINGS_BY_DIVISION);

export default function Standings() {
  const [activeDiv, setActiveDiv] = useState(DIVISIONS[0]);
  const rows = STANDINGS_BY_DIVISION[activeDiv];
  const gp = rows[0].w + rows[0].l;

  return (
    <section id="standings" style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
          <SectionHead eyebrow="2025–26 Season" title="Division Standings" />
          <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{gp} games played · Top {PLAYOFF_SPOTS} advance to playoffs</span>
        </div>

        {/* Division tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {DIVISIONS.map(div => (
            <button
              key={div}
              onClick={() => setActiveDiv(div)}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                border: `1.5px solid ${activeDiv === div ? 'var(--court-navy)' : 'var(--border)'}`,
                background: activeDiv === div ? 'var(--court-navy)' : '#fff',
                color: activeDiv === div ? '#fff' : 'var(--fg)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 160ms',
                fontFamily: 'var(--font-body)',
              }}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 56px 56px 56px 56px 64px 64px', gap: 0, padding: '10px 16px', background: 'var(--court-navy)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {['#', 'Team', 'W', 'L', 'PF', 'PA', '+/−', 'Streak'].map((h, i) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', textAlign: i > 1 ? 'center' : 'left' }}>{h}</span>
            ))}
          </div>

          {rows.map((row, i) => {
            const diff = row.pf - row.pa;
            const isPlayoff = row.rank <= PLAYOFF_SPOTS;
            const isBubble = row.rank === PLAYOFF_SPOTS;
            const streakWin = row.streak.startsWith('W');

            return (
              <div key={row.team}>
                {isBubble && i < rows.length - 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 56px 56px 56px 56px 64px 64px', padding: '0 16px' }}>
                    <div style={{ gridColumn: '1 / -1', height: 1, background: 'var(--varsity-gold)', opacity: 0.5, margin: '0 -16px' }} />
                  </div>
                )}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr 56px 56px 56px 56px 64px 64px',
                  padding: '12px 16px',
                  alignItems: 'center',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
                  background: row.fpyc ? 'rgba(255,199,44,0.04)' : 'transparent',
                  transition: 'background 120ms',
                }}>
                  {/* Rank */}
                  <span style={{ fontSize: 13, fontWeight: 700, color: isPlayoff ? 'var(--court-navy)' : 'var(--fg-muted)' }}>
                    {row.rank}
                  </span>

                  {/* Team name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    {isPlayoff && (
                      <div style={{ width: 3, height: 20, borderRadius: 2, background: 'var(--varsity-gold)', flexShrink: 0 }} />
                    )}
                    <span style={{ fontWeight: row.fpyc ? 700 : 500, fontSize: 14, color: 'var(--fg)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.team}
                    </span>
                    {row.fpyc && (
                      <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)', flexShrink: 0 }}>FPYC</span>
                    )}
                  </div>

                  {/* W */}
                  <span style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--status-win)' }}>{row.w}</span>

                  {/* L */}
                  <span style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--fg-muted)' }}>{row.l}</span>

                  {/* PF */}
                  <span style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg)' }}>{row.pf}</span>

                  {/* PA */}
                  <span style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)' }}>{row.pa}</span>

                  {/* Diff */}
                  <span style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, color: diff > 0 ? 'var(--status-win)' : diff < 0 ? 'var(--foul-red)' : 'var(--fg-muted)' }}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>

                  {/* Streak */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: streakWin ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)',
                      color: streakWin ? 'var(--status-win)' : 'var(--foul-red)',
                    }}>
                      {row.streak}
                    </span>
                  </div>
                </div>

                {/* Playoff cutoff line after last playoff spot */}
                {row.rank === PLAYOFF_SPOTS && i < rows.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 16px', background: 'rgba(255,199,44,0.06)' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--varsity-gold)', opacity: 0.4 }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--varsity-gold)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Playoff cutoff</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--varsity-gold)', opacity: 0.4 }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--varsity-gold)' }} />
            <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>Playoff position</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' }}>FPYC</span>
            <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>FPYC team</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>PF = Points For · PA = Points Against · +/− = Point differential</span>
          </div>
        </div>
      </div>
    </section>
  );
}
