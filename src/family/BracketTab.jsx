import { useBracket } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';

export default function BracketTab({ childTeam }) {
  const [bracket] = useBracket();
  const { status, seeds, semis, final } = bracket;

  const champ = bracket.champion != null ? seeds[bracket.champion] : null;

  // ── Setup view ────────────────────────────────────────────────────────────
  if (status === 'setup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SectionLabel>Playoff Seeding</SectionLabel>

        {/* Empty-state notice */}
        <div style={{
          background: 'rgba(10,31,61,0.04)',
          border: '1.5px dashed rgba(10,31,61,0.18)',
          borderRadius: 12,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'rgba(10,31,61,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="clock" size={20} color="var(--court-navy)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>
              Bracket not yet published
            </div>
            <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>
              Playoff seedings are set — the bracket will be published once the regular season ends.
            </div>
          </div>
        </div>

        {/* Seed cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {seeds.map((seed) => {
            const isMyTeam = seed.name === childTeam;
            return (
              <div
                key={seed.seed}
                style={{
                  background: '#fff',
                  border: `1.5px solid ${isMyTeam ? 'var(--varsity-gold)' : '#E2E5EA'}`,
                  borderLeft: `4px solid ${isMyTeam ? 'var(--varsity-gold)' : '#E2E5EA'}`,
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: isMyTeam ? '0 2px 12px rgba(255,199,44,0.18)' : 'none',
                  transition: 'box-shadow 200ms',
                }}
              >
                {/* Seed rank badge */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: isMyTeam ? 'var(--varsity-gold)' : 'rgba(10,31,61,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: isMyTeam ? 'var(--court-navy)' : 'var(--court-navy)',
                    lineHeight: 1,
                  }}>
                    {seed.seed}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {seed.fpyc && (
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: 'var(--varsity-gold)', flexShrink: 0,
                      }} />
                    )}
                    <span style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: 'var(--court-navy)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {seed.name}
                    </span>
                    {seed.fpyc && (
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        padding: '1px 5px', borderRadius: 999,
                        background: 'rgba(10,31,61,0.08)',
                        color: 'var(--court-navy)', flexShrink: 0,
                      }}>
                        FPYC
                      </span>
                    )}
                    {isMyTeam && (
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        padding: '1px 6px', borderRadius: 999,
                        background: 'var(--varsity-gold)',
                        color: 'var(--court-navy)', flexShrink: 0,
                      }}>
                        YOUR TEAM
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3 }}>
                    {seed.record} regular season
                  </div>
                </div>

                {/* Seed ordinal label */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.04em' }}>
                    {ordinal(seed.seed)} seed
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active bracket (semis / finals / complete) ─────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Champion banner */}
      {champ && (
        <div style={{
          background: 'var(--court-navy)',
          backgroundImage: 'radial-gradient(circle at 90% 30%, rgba(255,199,44,0.18), transparent 55%)',
          borderRadius: 14,
          border: '2px solid var(--varsity-gold)',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'var(--varsity-gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--court-navy)" strokeWidth="2.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 3 }}>
              {bracket.season} Champion
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase', lineHeight: 1 }}>
              {champ.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
              {champ.record} regular season
              {champ.name === childTeam && (
                <span style={{
                  marginLeft: 8, fontSize: 9, fontWeight: 800,
                  padding: '2px 6px', borderRadius: 999,
                  background: 'var(--varsity-gold)', color: 'var(--court-navy)',
                }}>
                  YOUR TEAM
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section label */}
      <SectionLabel>{bracket.division} · {bracket.season} Playoffs</SectionLabel>

      {/* Semifinals */}
      <div>
        <RoundLabel>Semifinals</RoundLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {semis.map((s, i) => (
            <MatchupCard
              key={s.id}
              title={`Semifinal ${i + 1}`}
              subtitle={`${s.date} · ${s.time}`}
              seeds={seeds}
              topIdx={s.top}
              bottomIdx={s.bottom}
              scoreTop={s.scoreTop}
              scoreBottom={s.scoreBottom}
              winner={s.winner}
              childTeam={childTeam}
            />
          ))}
        </div>
      </div>

      {/* Championship */}
      <div>
        <RoundLabel>Championship</RoundLabel>
        <MatchupCard
          title="Championship Final"
          subtitle={`${final.date} · ${final.time}`}
          seeds={seeds}
          topIdx={final.top}
          bottomIdx={final.bottom}
          scoreTop={final.scoreTop}
          scoreBottom={final.scoreBottom}
          winner={final.winner}
          childTeam={childTeam}
          label1="Winner SF1"
          label2="Winner SF2"
        />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MatchupCard({ title, subtitle, seeds, topIdx, bottomIdx, scoreTop, scoreBottom, winner, childTeam, label1, label2 }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E5EA',
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #F3F4F6',
        background: '#F9FAFB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--court-navy)' }}>
          {title}
        </span>
        {subtitle && (
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>{subtitle}</span>
        )}
      </div>

      {/* Teams */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TeamRow
          team={topIdx != null ? seeds[topIdx] : null}
          score={scoreTop}
          isWinner={winner === topIdx && winner != null}
          isLoser={winner != null && winner !== topIdx}
          childTeam={childTeam}
          fallbackLabel={label1}
        />
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em' }}>
          VS
        </div>
        <TeamRow
          team={bottomIdx != null ? seeds[bottomIdx] : null}
          score={scoreBottom}
          isWinner={winner === bottomIdx && winner != null}
          isLoser={winner != null && winner !== bottomIdx}
          childTeam={childTeam}
          fallbackLabel={label2}
        />
      </div>
    </div>
  );
}

function TeamRow({ team, score, isWinner, isLoser, childTeam, fallbackLabel }) {
  const isMyTeam = team?.name === childTeam;

  if (!team) {
    return (
      <div style={{
        padding: '11px 14px',
        borderRadius: 8,
        background: '#F9FAFB',
        border: '1.5px solid #E2E5EA',
      }}>
        <span style={{ fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' }}>
          {fallbackLabel || 'TBD'}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 14px',
      borderRadius: 8,
      background: isWinner
        ? 'rgba(255,199,44,0.10)'
        : isLoser
          ? 'rgba(0,0,0,0.02)'
          : isMyTeam
            ? 'rgba(10,31,61,0.03)'
            : '#fff',
      border: `1.5px solid ${isWinner ? 'var(--varsity-gold)' : isMyTeam ? 'var(--court-navy)' : '#E2E5EA'}`,
      borderLeft: isMyTeam
        ? `4px solid ${isWinner ? 'var(--varsity-gold)' : 'var(--court-navy)'}`
        : `1.5px solid ${isWinner ? 'var(--varsity-gold)' : '#E2E5EA'}`,
      opacity: isLoser ? 0.42 : 1,
      transition: 'all 200ms',
    }}>
      {/* Seed number */}
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: isWinner ? 'var(--court-navy)' : '#9CA3AF',
        width: 16, flexShrink: 0,
      }}>
        #{team.seed}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {team.fpyc && (
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--varsity-gold)', flexShrink: 0,
            }} />
          )}
          <span style={{
            fontWeight: 700,
            fontSize: 14,
            color: isLoser ? '#9CA3AF' : 'var(--court-navy)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {team.name}
          </span>
          {team.fpyc && (
            <span style={{
              fontSize: 9, fontWeight: 800,
              padding: '1px 5px', borderRadius: 999,
              background: 'rgba(10,31,61,0.08)',
              color: 'var(--court-navy)', flexShrink: 0,
            }}>
              FPYC
            </span>
          )}
          {isMyTeam && (
            <span style={{
              fontSize: 9, fontWeight: 800,
              padding: '1px 6px', borderRadius: 999,
              background: isWinner ? 'var(--varsity-gold)' : 'var(--court-navy)',
              color: isWinner ? 'var(--court-navy)' : '#fff',
              flexShrink: 0,
            }}>
              YOUR TEAM
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>
          {team.record}
        </div>
      </div>

      {/* Score */}
      {score != null && (
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24, fontWeight: 700,
          color: isWinner ? 'var(--court-navy)' : '#9CA3AF',
          flexShrink: 0,
        }}>
          {score}
        </span>
      )}

      {/* ADV pill */}
      {isWinner && score != null && (
        <span style={{
          fontSize: 9, fontWeight: 800,
          padding: '2px 6px', borderRadius: 999,
          background: 'var(--varsity-gold)',
          color: 'var(--court-navy)',
          flexShrink: 0,
        }}>
          ADV
        </span>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#374151' }}>
      {children}
    </div>
  );
}

function RoundLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
