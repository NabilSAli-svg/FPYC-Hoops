import { useState, useEffect } from 'react';
import { Card, Pill, Button, Icon, Eyebrow, Display, Skeleton } from '../shared/index.js';
import { usePractices, useAnnouncements } from '../shared/store.js';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import { useIsMobile } from '../shared/useIsMobile.js';

export default function DashboardView({ team, players, games, onGo }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <DashboardSkeleton />;
  return <div className="skel-content"><DashboardContent team={team} players={players} games={games} onGo={onGo} /></div>;
}

function DashboardContent({ team, players, games, onGo }) {
  const [practices]     = usePractices();
  const [announcements] = useAnnouncements();
  const [attendance]    = useLocalStorage('fpyc-attendance', {});
  const isMobile        = useIsMobile();

  const next   = games.find(g => g.status === 'scheduled');
  const countdown = next?.countdown ?? (() => {
    if (!next?.month || !next?.date) return '—';
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    const now = new Date();
    let gameDate = new Date(now.getFullYear(), months[next.month], next.date);
    if (gameDate < now && now - gameDate > 1000 * 60 * 60 * 24 * 180) gameDate.setFullYear(gameDate.getFullYear() + 1);
    return Math.max(0, Math.ceil((gameDate - now) / (1000 * 60 * 60 * 24)));
  })();
  const recent = games.filter(g => g.status === 'final').slice(0, 3);

  // Compute real attendance per practice session
  const activePlayers = players.filter(p => p.status === 'active');
  const recentPractices = [...practices].slice(-4);
  const practiceAttendance = recentPractices.map(p => {
    const present = activePlayers.filter(pl => (attendance[pl.id]?.[p.id] ?? 'none') === 'present').length;
    return { label: p.date.split(', ')[1] || p.date, value: present, id: p.id };
  });
  const avgAtt = practiceAttendance.length
    ? Math.round(practiceAttendance.reduce((s, p) => s + p.value, 0) / practiceAttendance.length)
    : 0;
  const attPct = activePlayers.length ? Math.round((avgAtt / activePlayers.length) * 100) : 0;

  // Live stats
  const finalGames = games.filter(g => g.status === 'final');
  const wins = finalGames.filter(g => g.us > g.them).length;
  const ppg  = finalGames.length ? (finalGames.reduce((s, g) => s + g.us, 0) / finalGames.length).toFixed(1) : '—';

  // Commissioner announcements (all-families or no target)
  const leagueAnnouncements = announcements.filter(a => a.target === 'All families').slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Season quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Record',        value: `${wins}–${finalGames.length - wins}`, icon: 'bar-chart-2',   color: 'var(--court-navy)'        },
          { label: 'Avg score',     value: ppg,                                   icon: 'trending-up',   color: 'var(--status-win)'        },
          { label: 'Roster',        value: activePlayers.length,                  icon: 'users',         color: 'var(--court-navy)'        },
          { label: 'Avg attendance',value: `${attPct}%`,                          icon: 'check-square',  color: attPct >= 80 ? 'var(--status-win)' : 'var(--basketball-orange)' },
        ].map(s => (
          <Card key={s.label} padding="14px 16px">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Eyebrow>{s.label}</Eyebrow>
              <Icon name={s.icon} size={14} color={s.color} />
            </div>
            <Display size={28} color={s.color}>{s.value}</Display>
          </Card>
        ))}
      </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
      {/* Next game hero */}
      {!next ? (
        <Card padding="32px 26px" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
          <Icon name="calendar" size={32} color="var(--border)" />
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 12, color: 'var(--fg)' }}>No upcoming games scheduled</div>
          <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 4, marginBottom: 16 }}>Add games to the schedule to see the next matchup here.</div>
          <Button kind="gold" icon="plus" onClick={() => onGo('schedule')}>Add a game</Button>
        </Card>
      ) : (
      <Card padding={0} style={{ overflow: 'hidden', gridColumn: '1 / -1' }}>
        <div style={{
          background: 'var(--court-navy)',
          color: '#fff',
          padding: '22px 26px',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
          gap: isMobile ? 16 : 28,
          alignItems: 'center',
          backgroundImage: 'radial-gradient(circle at 92% 10%, rgba(255,199,44,0.12), transparent 50%), radial-gradient(circle at 8% 90%, rgba(232,119,34,0.10), transparent 55%)',
        }}>
          <div>
            <Eyebrow color="var(--varsity-gold)">Next game · {next.day}</Eyebrow>
            <Display size={40} color="#fff" style={{ marginTop: 6 }}>{next.opponent}</Display>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="map-pin" size={14} />{next.location}
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="clock" size={14} />{next.time}
              </span>
            </div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '0 24px', borderLeft: '1px solid rgba(255,255,255,0.10)', borderRight: '1px solid rgba(255,255,255,0.10)',
          }}>
            <Eyebrow color="rgba(255,255,255,0.5)">Tip-off in</Eyebrow>
            <Display size={56} color="var(--varsity-gold)">{countdown}</Display>
            <Eyebrow color="rgba(255,255,255,0.5)">days</Eyebrow>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <Pill kind="gold">Home · {team.division}</Pill>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', textAlign: 'right' }}>
              {next.confirmed} of {players.length} players confirmed
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="gold" icon="clipboard-list" onClick={() => onGo('lineup')}>Set lineup</Button>
              <Button kind="onDark" icon="send" onClick={() => onGo('messages:compose')}>Notify team</Button>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 26px', display: 'flex', gap: 28, alignItems: 'center', background: 'var(--bone)', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {next.note && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="bus" size={16} color="var(--fg-muted)" />
              <span style={{ fontSize: 13 }}>{next.note}</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="shirt" size={16} color="var(--fg-muted)" />
            <span style={{ fontSize: 13 }}>Jerseys: <strong>{next.home ? 'Navy (home)' : 'White (away)'}</strong></span>
          </div>
          {next.refs && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="user-check" size={16} color="var(--fg-muted)" />
              <span style={{ fontSize: 13 }}>Refs: <strong>{next.refs}</strong></span>
            </div>
          )}
        </div>
      </Card>
      )}

      {/* Recent results */}
      <Card>
        <SectionHeader title="Recent results" link="See all" onLink={() => onGo('schedule')} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          {recent.map(g => <ResultRow key={g.id} game={g} />)}
        </div>
      </Card>

      {/* Practice attendance */}
      <Card>
        <SectionHeader title="Practice attendance" subtitle="Last 4 sessions" />
        <div style={{ display: 'flex', gap: 18, marginTop: 14, alignItems: 'flex-end' }}>
          {practiceAttendance.length > 0 ? practiceAttendance.map((b, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <Display size={28}>{b.value}</Display>
              <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${activePlayers.length ? (b.value / activePlayers.length) * 100 : 0}%`, height: '100%', background: 'var(--varsity-gold)', transition: 'width 600ms' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{b.label}</div>
            </div>
          )) : (
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', fontStyle: 'italic' }}>No practices logged yet</div>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}>Avg {attPct}% · {activePlayers.length} active players</span>
          <Button kind="ghost" size="sm" icon="plus" onClick={() => onGo('schedule:practices')}>Log practice</Button>
        </div>
      </Card>

      {/* League announcements */}
      <Card style={{ gridColumn: '1 / -1' }}>
        <SectionHeader title="Commissioner announcements" link={`${announcements.length} posted`} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
          {leagueAnnouncements.length > 0 ? leagueAnnouncements.map(a => (
            <Announce
              key={a.id}
              from="Commissioner" time={a.date}
              title={a.title} body={a.body}
              warn={a.type === 'urgent'} pinned={a.pinned}
              type={a.type}
            />
          )) : (
            <div style={{ padding: '16px 0', fontSize: 13, color: 'var(--fg-muted)', fontStyle: 'italic' }}>
              No commissioner announcements yet.
            </div>
          )}
        </div>
      </Card>
    </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, link, onLink }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 4 }}>
      <div>
        <Display size={22}>{title}</Display>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      {link && (
        <button onClick={onLink} style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--court-navy)', display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>{link} <Icon name="arrow-right" size={14} /></button>
      )}
    </div>
  );
}

function ResultRow({ game }) {
  const win = game.us > game.them;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8 }}>
      <Pill kind={win ? 'win' : 'loss'}>{win ? 'W' : 'L'}</Pill>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>vs. {game.opponent}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{game.day} · {game.location}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1, fontVariantNumeric: 'tabular-nums', color: win ? 'var(--court-navy)' : 'var(--fg-muted)' }}>
        {game.us}<span style={{ color: 'var(--fg-muted)', margin: '0 6px' }}>–</span>{game.them}
      </div>
    </div>
  );
}

function Announce({ from, time, title, body, warn, pinned, type }) {
  const kindLabel = type === 'urgent' ? 'Urgent' : type === 'info' ? 'Info' : 'Notice';
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
        {warn ? <Pill kind="warn">{kindLabel}</Pill> : <Pill kind="neutral">{kindLabel}</Pill>}
        {pinned && <Pill kind="navy">Pinned</Pill>}
        <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{from} · {time}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
      {/* Hero card skeleton */}
      <Card padding={0} style={{ overflow: 'hidden', gridColumn: '1 / -1' }}>
        <div style={{
          background: 'var(--court-navy)',
          padding: '22px 26px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 28,
          alignItems: 'center',
        }}>
          {/* Left col */}
          <div>
            <Skeleton dark width={80} height={11} />
            <Skeleton dark width={240} height={38} style={{ marginTop: 8 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <Skeleton dark width={130} height={13} />
              <Skeleton dark width={130} height={13} />
            </div>
          </div>
          {/* Center col */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 24px', borderLeft: '1px solid rgba(255,255,255,0.10)', borderRight: '1px solid rgba(255,255,255,0.10)' }}>
            <Skeleton dark width={80} height={11} />
            <Skeleton dark width={56} height={56} />
            <Skeleton dark width={40} height={11} />
          </div>
          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <Skeleton dark width={120} height={26} style={{ borderRadius: 999 }} />
            <Skeleton dark width={170} height={13} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Skeleton dark width={120} height={36} style={{ borderRadius: 8 }} />
              <Skeleton dark width={120} height={36} style={{ borderRadius: 8 }} />
            </div>
          </div>
        </div>
        {/* Bottom strip */}
        <div style={{ padding: '14px 26px', display: 'flex', gap: 28, alignItems: 'center', background: 'var(--bone)', borderTop: '1px solid var(--border)' }}>
          <Skeleton width={150} height={13} />
          <Skeleton width={150} height={13} />
          <Skeleton width={150} height={13} />
        </div>
      </Card>

      {/* Recent results card skeleton */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Skeleton width={120} height={16} />
          <Skeleton width={60} height={13} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <Skeleton width={32} height={32} style={{ borderRadius: 6, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Skeleton width="100%" height={14} />
              </div>
              <Skeleton width={50} height={22} style={{ borderRadius: 999 }} />
            </div>
          ))}
        </div>
      </Card>

      {/* Practice attendance card skeleton */}
      <Card>
        <Skeleton width={160} height={16} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Skeleton width={26} height={26} style={{ borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Skeleton height={14} />
              </div>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2, 3, 4, 5].map(j => (
                  <Skeleton key={j} width={18} height={18} style={{ borderRadius: 3 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
