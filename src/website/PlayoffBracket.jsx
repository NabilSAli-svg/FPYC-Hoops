import { useBracket } from '../shared/store.js';
import { SectionHead } from './Programs.jsx';
import { useIsMobile } from '../shared/useIsMobile.js';

export default function PlayoffBracket() {
  const isMobile = useIsMobile();
  const [bracket] = useBracket();
  const { status, seeds, semis, final } = bracket;

  if (status === 'setup') return null;

  const champ = bracket.champion != null ? seeds[bracket.champion] : null;

  function TeamRow({ idx, score, isWinner, isLoser, label }) {
    const team = idx != null ? seeds[idx] : null;
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 14px', borderRadius: 8,
        background: isWinner ? 'rgba(255,199,44,0.12)' : isLoser ? 'rgba(0,0,0,0.03)' : '#fff',
        border: `1.5px solid ${isWinner ? 'var(--varsity-gold)' : 'var(--border)'}`,
        opacity: isLoser ? 0.45 : 1,
        transition: 'all 200ms',
      }}>
        {team ? (
          <>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', width: 16, flexShrink: 0 }}>#{team.seed}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {team.fpyc && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--varsity-gold)', flexShrink: 0 }} />}
                <span style={{ fontWeight: 700, fontSize: 14, color: isLoser ? 'var(--fg-muted)' : 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</span>
                {team.fpyc && <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 999, background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)', flexShrink: 0 }}>FPYC</span>}
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 1 }}>{team.record}</div>
            </div>
            {score != null && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: isWinner ? 'var(--court-navy)' : 'var(--fg-muted)', flexShrink: 0 }}>{score}</span>
            )}
            {isWinner && score != null && (
              <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)', flexShrink: 0 }}>ADV</span>
            )}
          </>
        ) : (
          <span style={{ flex: 1, fontSize: 13, color: 'var(--fg-muted)', fontStyle: 'italic' }}>{label || 'TBD'}</span>
        )}
      </div>
    );
  }

  function MatchupCard({ title, subtitle, topIdx, bottomIdx, scoreTop, scoreBottom, winner, label1, label2 }) {
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bone)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{title}</span>
          {subtitle && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{subtitle}</span>}
        </div>
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <TeamRow idx={topIdx}    score={scoreTop}    isWinner={winner === topIdx    && winner != null} isLoser={winner != null && winner !== topIdx}    label={label1} />
          <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--fg-muted)', letterSpacing: '0.06em' }}>VS</div>
          <TeamRow idx={bottomIdx} score={scoreBottom} isWinner={winner === bottomIdx && winner != null} isLoser={winner != null && winner !== bottomIdx} label={label2} />
        </div>
      </div>
    );
  }

  return (
    <section style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <SectionHead eyebrow={`${bracket.season} Playoffs`} title={`${bracket.division} · Bracket`} />
          {champ && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: 'var(--court-navy)', border: '2px solid var(--varsity-gold)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--varsity-gold)" strokeWidth="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              <span style={{ fontWeight: 800, fontSize: 13, color: '#fff' }}>Champion: {champ.name}</span>
            </div>
          )}
        </div>

        {/* Desktop: 3-column bracket */}
        {!isMobile ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr 60px 1fr', gap: 0, alignItems: 'center' }}>
            {/* Semis column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {semis.map((s, i) => (
                <MatchupCard
                  key={s.id}
                  title={`Semifinal ${i + 1}`}
                  subtitle={s.date}
                  topIdx={s.top}
                  bottomIdx={s.bottom}
                  scoreTop={s.scoreTop}
                  scoreBottom={s.scoreBottom}
                  winner={s.winner}
                />
              ))}
            </div>

            {/* Connector arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, height: '100%', justifyContent: 'center' }}>
              <div style={{ width: 2, height: 40, background: 'var(--border)' }} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              <div style={{ width: 2, height: 40, background: 'var(--border)' }} />
            </div>

            {/* Final column */}
            <MatchupCard
              title="Championship"
              subtitle={final.date}
              topIdx={final.top}
              bottomIdx={final.bottom}
              scoreTop={final.scoreTop}
              scoreBottom={final.scoreBottom}
              winner={final.winner}
              label1="Winner SF1"
              label2="Winner SF2"
            />

            {/* Connector arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </div>

            {/* Champion column */}
            <div style={{ background: 'var(--court-navy)', borderRadius: 12, overflow: 'hidden', border: champ ? '2px solid var(--varsity-gold)' : '1.5px dashed rgba(255,255,255,0.2)' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--varsity-gold)" strokeWidth="2.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Champion</span>
              </div>
              <div style={{ padding: '24px 16px', textAlign: 'center', minHeight: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {champ ? (
                  <>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', textTransform: 'uppercase', lineHeight: 1, letterSpacing: '0.02em' }}>{champ.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{champ.record} regular season</div>
                    {champ.fpyc && <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)', marginTop: 4 }}>FPYC TEAM</span>}
                  </>
                ) : (
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>To be decided</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Mobile: vertical rounds
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>Round 1 — Semifinals</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {semis.map((s, i) => (
                  <MatchupCard key={s.id} title={`Semifinal ${i + 1}`} subtitle={s.date} topIdx={s.top} bottomIdx={s.bottom} scoreTop={s.scoreTop} scoreBottom={s.scoreBottom} winner={s.winner} />
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>Round 2 — Championship</div>
              <MatchupCard title="Championship" subtitle={final.date} topIdx={final.top} bottomIdx={final.bottom} scoreTop={final.scoreTop} scoreBottom={final.scoreBottom} winner={final.winner} label1="Winner SF1" label2="Winner SF2" />
            </div>
            {champ && (
              <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '20px', textAlign: 'center', border: '2px solid var(--varsity-gold)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 6 }}>Champion</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', textTransform: 'uppercase' }}>{champ.name}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
