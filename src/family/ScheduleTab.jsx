import { useState, useEffect } from 'react';
import Icon from '../shared/Icon.jsx';
import Skeleton from '../shared/Skeleton.jsx';
import { useGames, usePractices, deriveEvents, TEAM_INFO, useRsvps, useOfficialAssignments } from '../shared/store.js';

const MONTH_NUM = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };

function mapsLink(location) {
  return `https://maps.google.com/?q=${encodeURIComponent(location + ', Fairfax VA')}`;
}

function gCalLink(e) {
  const mo = MONTH_NUM[e.month] || '12';
  const d  = String(e.dayNum).padStart(2, '0');
  const ds = `2025${mo}${d}`;
  const [time, ampm] = e.time.split(' ');
  let [hh, mm] = time.split(':').map(Number);
  if (ampm === 'PM' && hh !== 12) hh += 12;
  const s = `${ds}T${String(hh).padStart(2,'0')}${String(mm).padStart(2,'0')}00`;
  const eh = `${ds}T${String(hh + 1).padStart(2,'0')}${String(mm).padStart(2,'0')}00`;
  return `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent('Hawks ' + e.label)}&dates=${s}/${eh}&location=${encodeURIComponent(e.location + ', Fairfax VA')}&details=${encodeURIComponent('FPYC Basketball')}`;
}

export default function ScheduleTab({ familyKey, childTeam = 'Fairfax Hawks' }) {
  const [games] = useGames();
  const [practices] = usePractices();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [rsvps, setRsvps] = useRsvps();
  const [assignmentMap] = useOfficialAssignments();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const myRsvp = (gameId) => rsvps[gameId]?.[familyKey];
  const setMyRsvp = (gameId, val) =>
    setRsvps(r => ({ ...r, [gameId]: { ...(r[gameId] || {}), [familyKey]: val } }));

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <ScheduleSkeleton filter={filter} setFilter={setFilter} />;

  const teamEvents = deriveEvents(games, practices).filter(e => !e.team || e.team === childTeam);
  const EVENTS    = teamEvents;
  const filtered  = EVENTS.filter(e => filter === 'all' || e.type === filter);

  const live      = filtered.filter(e => e.status === 'live');
  const upcoming  = filtered.filter(e => e.status === 'upcoming');
  const past      = filtered.filter(e => e.status === 'final');

  const liveGame  = EVENTS.find(e => e.type === 'game' && e.status === 'live') || null;
  const nextGame  = EVENTS.find(e => e.type === 'game' && e.status === 'upcoming') || null;

  const teamGames = games.filter(g => !g.team || g.team === childTeam);
  const wins   = teamGames.filter(g => g.status === 'final' && g.us > g.them).length;
  const losses = teamGames.filter(g => g.status === 'final' && g.us < g.them).length;

  return (
    <div className="skel-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {selectedEvent && (
        <GameDetailSheet
          event={selectedEvent}
          officials={assignmentMap[selectedEvent.id]}
          rsvp={myRsvp(selectedEvent.id)}
          onRsvp={val => setMyRsvp(selectedEvent.id, val)}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* Live game hero — takes priority over next game banner */}
      {liveGame && filter === 'all' && <LiveGameBanner game={liveGame} />}

      {/* Next game hero banner */}
      {!liveGame && nextGame && filter === 'all' && (
        <NextGameBanner
          game={nextGame}
          rsvp={myRsvp(nextGame.id)}
          onRsvp={val => setMyRsvp(nextGame.id, val)}
          totalYes={Object.values(rsvps[nextGame.id] || {}).filter(v => v === 'yes').length}
        />
      )}

      {/* Season record + filter chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, flex: 1 }}>
          {[
            { id: 'all',      label: 'All events' },
            { id: 'game',     label: 'Games' },
            { id: 'practice', label: 'Practices' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: filter === f.id ? 'var(--court-navy)' : '#E2E5EA',
              color: filter === f.id ? '#fff' : '#6B7280',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              transition: 'all 160ms',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--court-navy)', background: 'rgba(10,31,61,0.07)', padding: '5px 12px', borderRadius: 999 }}>
          {wins}–{losses} · {TEAM_INFO.seed} seed
        </div>
      </div>

      {/* Live games */}
      {live.length > 0 && (
        <div>
          <SectionLabel>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--foul-red)', display: 'inline-block' }} />
              Live now
            </span>
          </SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {live.map(e => <EventCard key={e.id} event={e} onClick={() => setSelectedEvent(e)} />)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <SectionLabel>Upcoming</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(e => (
              <EventCard
                key={e.id}
                event={e}
                rsvp={myRsvp(e.id)}
                onRsvp={val => setMyRsvp(e.id, val)}
                onClick={() => setSelectedEvent(e)}
              />
            ))}
          </div>
        </div>
      )}

      {upcoming.length === 0 && past.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="calendar" size={24} color="#9CA3AF" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>No {filter !== 'all' ? filter + 's' : 'events'} scheduled</div>
          <div style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 260, lineHeight: 1.5 }}>Check back once the schedule is posted by your coach.</div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <SectionLabel>Past results</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map(e => <EventCard key={e.id} event={e} onClick={() => setSelectedEvent(e)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Live Game Hero ───────────────────────────────────────────────────────────

function LiveGameBanner({ game: e }) {
  const us      = e.us   ?? 0;
  const them    = e.them ?? 0;
  const leading = us > them;
  const tied    = us === them;

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '2px solid #DC2626' }}>
      {/* Live indicator bar */}
      <div style={{ background: '#DC2626', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff' }}>
          Live now{e.quarter ? ` · Q${e.quarter}` : ''}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.70)', fontWeight: 600 }}>{e.location}</span>
      </div>

      {/* Scoreboard */}
      <div style={{ background: 'var(--court-navy)', padding: '24px 18px', display: 'flex', alignItems: 'center' }}>
        {/* Hawks */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 8 }}>Fairfax Hawks</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 14vw, 80px)', lineHeight: 1, color: (leading || tied) ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'color 300ms' }}>
            {us}
          </div>
        </div>

        {/* Dash */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'rgba(255,255,255,0.20)', padding: '0 8px', flexShrink: 0 }}>–</div>

        {/* Opponent */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', marginBottom: 8 }}>{e.opponent}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 14vw, 80px)', lineHeight: 1, color: (!leading && !tied) ? '#fff' : 'rgba(255,255,255,0.45)', transition: 'color 300ms' }}>
            {them}
          </div>
        </div>
      </div>

      {/* Status footer */}
      <div style={{ background: 'rgba(10,31,61,0.96)', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: tied ? 'rgba(255,255,255,0.55)' : leading ? 'var(--varsity-gold)' : '#DC2626' }}>
          {tied ? 'Tied' : leading ? 'Hawks leading' : 'Opponent leading'}
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>·</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)' }}>Score updates automatically</span>
      </div>
    </div>
  );
}

// ─── Next Game Hero ───────────────────────────────────────────────────────────

function NextGameBanner({ game: e, rsvp, onRsvp, totalYes = 0 }) {
  const jerseyColor = e.home ? '#0A1F3D' : '#fff';
  const jerseyText  = e.home ? '#fff'    : '#0A1F3D';
  const jerseyLabel = e.home ? 'Navy (home)' : 'White (away)';

  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid var(--court-navy)', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: 'var(--court-navy)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 4 }}>Next game</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.1 }}>
            {e.label}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{e.date} · {e.time}</div>
        </div>
        {/* Jersey swatch */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: jerseyColor, border: '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shirt" size={18} color={jerseyText} />
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textAlign: 'center', letterSpacing: '0.04em', lineHeight: 1.2 }}>{jerseyLabel}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Location row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="map-pin" size={14} color="var(--fg-muted)" />
            <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 600 }}>{e.location}</span>
          </div>
          <a
            href={mapsLink(e.location)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--court-navy)', textDecoration: 'none', background: 'rgba(10,31,61,0.07)', padding: '5px 11px', borderRadius: 999 }}
          >
            <Icon name="navigation" size={12} color="var(--court-navy)" /> Directions
          </a>
        </div>

        {/* Confirmed RSVP count */}
        {totalYes > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--fg-muted)' }}>
            <Icon name="users" size={13} color="var(--status-win)" />
            <span><span style={{ fontWeight: 700, color: 'var(--status-win)' }}>{totalYes}</span> player{totalYes !== 1 ? 's' : ''} confirmed</span>
          </div>
        )}

        {/* Coach note */}
        {e.note && (
          <div style={{ background: 'rgba(255,199,44,0.10)', border: '1px solid rgba(255,199,44,0.30)', borderRadius: 8, padding: '9px 12px', display: 'flex', gap: 8 }}>
            <Icon name="message-circle" size={14} color="var(--varsity-gold)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--fg)', lineHeight: 1.5 }}>{e.note}</span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 2 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'yes', icon: 'check', label: "We're going", c: '#059669', bg: 'rgba(5,150,105,0.10)' },
              { id: 'no',  icon: 'x',    label: "Can't make it", c: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
            ].map(opt => (
              <button key={opt.id} onClick={() => onRsvp(opt.id)} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
                border: `1.5px solid ${rsvp === opt.id ? opt.c : '#E2E5EA'}`,
                background: rsvp === opt.id ? opt.bg : '#fff',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
                color: rsvp === opt.id ? opt.c : '#9CA3AF',
                transition: 'all 120ms',
              }}>
                <Icon name={opt.icon} size={12} /> {opt.label}
              </button>
            ))}
          </div>
          <a
            href={gCalLink(e)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textDecoration: 'none' }}
          >
            <Icon name="calendar-plus" size={13} color="var(--fg-muted)" /> Add to calendar
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function EventCard({ event: e, rsvp, onRsvp, onClick }) {
  const isGame    = e.type === 'game';
  const isPractice = e.type === 'practice';
  const isFinal   = e.status === 'final';
  const isLive    = e.status === 'live';
  const win       = isFinal && e.us > e.them;

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: isLive ? '1.5px solid #DC2626' : '1px solid #E2E5EA',
        borderRadius: 12, overflow: 'hidden', opacity: isFinal ? 0.78 : 1,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Date tile */}
        <div style={{
          width: 64, flexShrink: 0,
          background: isLive ? '#DC2626' : isFinal ? '#F9FAFB' : isGame ? 'var(--court-navy)' : '#F0F4FF',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 8px',
          borderRight: '1px solid #E2E5EA',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isLive ? 'rgba(255,255,255,0.75)' : isFinal ? '#9CA3AF' : isGame ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>
            {(e.date || '').split(',')[0]}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, marginTop: 2, color: (isLive || isGame) && !isFinal ? '#fff' : isFinal ? '#9CA3AF' : 'var(--court-navy)' }}>
            {(e.date || '').split(' ').slice(-1)[0]}
          </div>
          <div style={{ fontSize: 10, color: isLive ? 'rgba(255,255,255,0.65)' : isFinal ? '#9CA3AF' : isGame ? 'rgba(255,255,255,0.55)' : '#9CA3AF', marginTop: 2 }}>
            {(e.date || '').split(' ').slice(1, 2)[0]}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase',
              background: isGame ? 'rgba(10,31,61,0.08)' : isPractice && e.practiceType === 'Scrimmage' ? 'rgba(232,119,34,0.10)' : 'rgba(99,102,241,0.10)',
              color: isGame ? 'var(--court-navy)' : isPractice && e.practiceType === 'Scrimmage' ? 'var(--basketball-orange)' : '#4F46E5',
            }}>
              {isGame ? (e.home ? 'Home' : 'Away') : (e.practiceType || 'Practice')}
            </span>
            {isGame && !isFinal && !isLive && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: e.home ? 'rgba(10,31,61,0.06)' : 'rgba(232,119,34,0.08)', color: e.home ? 'var(--court-navy)' : 'var(--basketball-orange)' }}>
                {e.home ? 'Navy jerseys' : 'White jerseys'}
              </span>
            )}
            {isLive && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: '#DC2626', color: '#fff', letterSpacing: '0.06em' }}>
                <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                LIVE {e.quarter ? `· Q${e.quarter}` : ''}
              </span>
            )}
            {isFinal && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: win ? 'rgba(5,150,105,0.10)' : 'rgba(220,38,38,0.08)', color: win ? '#059669' : '#DC2626' }}>
                {win ? 'Win' : 'Loss'}
              </span>
            )}
          </div>

          <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', lineHeight: 1.2 }}>{e.label}</div>

          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>{isPractice ? e.timeRange || e.time : e.time}</span>
            <span>·</span>
            <span>{e.location}</span>
          </div>

          {/* Practice notes */}
          {isPractice && e.notes && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#4F46E5', display: 'flex', alignItems: 'flex-start', gap: 5, background: 'rgba(99,102,241,0.06)', borderRadius: 6, padding: '5px 9px' }}>
              <Icon name="clipboard" size={11} color="#4F46E5" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ lineHeight: 1.4 }}>{e.notes}</span>
            </div>
          )}

          {/* Directions + Calendar links for upcoming game cards */}
          {isGame && !isFinal && !isLive && (
            <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
              <a
                href={mapsLink(e.location)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--court-navy)', textDecoration: 'none' }}
              >
                <Icon name="navigation" size={11} color="var(--court-navy)" /> Directions
              </a>
              {e.month && (
                <a
                  href={gCalLink(e)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textDecoration: 'none' }}
                >
                  <Icon name="calendar-plus" size={11} color="#9CA3AF" /> Add to calendar
                </a>
              )}
            </div>
          )}
        </div>

        {/* Score or RSVP */}
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', minWidth: 70, flexShrink: 0 }}>
          {isLive && isGame ? (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1, color: '#DC2626', textAlign: 'right' }}>
                {e.us ?? 0}–{e.them ?? 0}
              </div>
              <div style={{ fontSize: 11, color: '#DC2626', textAlign: 'right', marginTop: 2, fontWeight: 700 }}>Live</div>
            </div>
          ) : isFinal && isGame ? (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: win ? 'var(--court-navy)' : '#9CA3AF', textAlign: 'right' }}>
                {e.us}–{e.them}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 2 }}>Final</div>
            </div>
          ) : onRsvp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { id: 'yes', icon: 'check', label: 'Going',  c: '#059669', bg: 'rgba(5,150,105,0.10)'  },
                { id: 'no',  icon: 'x',     label: "Can't",  c: '#DC2626', bg: 'rgba(220,38,38,0.08)'  },
              ].map(opt => (
                <button key={opt.id} onClick={() => onRsvp(opt.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                  border: `1.5px solid ${rsvp === opt.id ? opt.c : '#E2E5EA'}`,
                  background: rsvp === opt.id ? opt.bg : '#fff',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11,
                  color: rsvp === opt.id ? opt.c : '#9CA3AF',
                  transition: 'all 120ms',
                }}>
                  <Icon name={opt.icon} size={11} /> {opt.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Game Detail Sheet ────────────────────────────────────────────────────────

function GameDetailSheet({ event: e, officials, rsvp, onRsvp, onClose }) {
  const isGame     = e.type === 'game';
  const isPractice = e.type === 'practice';
  const isFinal    = e.status === 'final';
  const isLive     = e.status === 'live';
  const win        = isFinal && e.us > e.them;
  const loss       = isFinal && e.them > e.us;

  const assignedRefs = officials?.refs?.filter(r => r !== 'TBD') ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100 }}
      />
      {/* Sheet */}
      <div style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 101,
        background: '#fff', borderRadius: '20px 20px 0 0',
        maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#E2E5EA' }} />
        </div>

        {/* Header */}
        <div style={{ background: isLive ? '#DC2626' : isFinal ? '#F9FAFB' : 'var(--court-navy)', padding: '16px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                {isLive && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.25)', color: '#fff', letterSpacing: '0.08em' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                    LIVE{e.quarter ? ` · Q${e.quarter}` : ''}
                  </span>
                )}
                {isFinal && (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: win ? 'rgba(5,150,105,0.12)' : 'rgba(220,38,38,0.10)', color: win ? '#059669' : '#DC2626', letterSpacing: '0.08em' }}>
                    {win ? 'Win' : loss ? 'Loss' : 'Tie'} · Final
                  </span>
                )}
                {isGame && !isFinal && !isLive && (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', color: '#fff', letterSpacing: '0.08em' }}>
                    {e.home ? 'Home' : 'Away'}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1.1, color: isFinal ? '#111827' : '#fff' }}>
                {e.label}
              </div>
              <div style={{ fontSize: 13, color: isFinal ? '#6B7280' : 'rgba(255,255,255,0.70)', marginTop: 4 }}>
                {e.date} · {e.time}
              </div>
            </div>
            <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
              <Icon name="x" size={20} color={isFinal ? '#6B7280' : 'rgba(255,255,255,0.7)'} />
            </button>
          </div>

          {/* Live or final score */}
          {(isLive || isFinal) && isGame && (
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: isLive ? 'rgba(255,255,255,0.65)' : '#9CA3AF', marginBottom: 4 }}>Hawks</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color: isLive ? '#fff' : win ? 'var(--court-navy)' : '#9CA3AF' }}>{e.us ?? 0}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: isLive ? 'rgba(255,255,255,0.3)' : '#D1D5DB' }}>–</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: isLive ? 'rgba(255,255,255,0.65)' : '#9CA3AF', marginBottom: 4 }}>{e.opponent}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color: isLive ? '#fff' : loss ? 'var(--court-navy)' : '#9CA3AF' }}>{e.them ?? 0}</div>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Location */}
          <DetailRow icon="map-pin" label="Location">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{e.location}</span>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(e.location + ', Fairfax VA')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={ev => ev.stopPropagation()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--court-navy)', textDecoration: 'none', background: 'rgba(10,31,61,0.07)', padding: '5px 12px', borderRadius: 999, flexShrink: 0 }}
              >
                <Icon name="navigation" size={12} color="var(--court-navy)" /> Directions
              </a>
            </div>
          </DetailRow>

          {/* Jersey color — upcoming games only */}
          {isGame && !isFinal && !isLive && (
            <DetailRow icon="shirt" label="Jerseys">
              <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{e.home ? 'Navy (home game)' : 'White (away game)'}</span>
            </DetailRow>
          )}

          {/* Coach note */}
          {e.note && (
            <DetailRow icon="message-circle" label="Coach note">
              <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{e.note}</span>
            </DetailRow>
          )}

          {/* Practice notes */}
          {isPractice && e.notes && (
            <DetailRow icon="clipboard" label="Notes">
              <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{e.notes}</span>
            </DetailRow>
          )}

          {/* Officials */}
          {isGame && assignedRefs.length > 0 && (
            <DetailRow icon="user-check" label="Officials">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {assignedRefs.map((name, i) => (
                  <span key={i} style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'rgba(10,31,61,0.07)', color: 'var(--court-navy)' }}>{name}</span>
                ))}
              </div>
            </DetailRow>
          )}

          {/* RSVP — upcoming games */}
          {isGame && !isFinal && !isLive && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>RSVP</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { id: 'yes', icon: 'check', label: "We're going",   c: '#059669', bg: 'rgba(5,150,105,0.10)'  },
                  { id: 'no',  icon: 'x',     label: "Can't make it", c: '#DC2626', bg: 'rgba(220,38,38,0.08)'  },
                ].map(opt => (
                  <button key={opt.id} onClick={() => onRsvp(opt.id)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '11px 16px', borderRadius: 10, cursor: 'pointer',
                    border: `1.5px solid ${rsvp === opt.id ? opt.c : '#E2E5EA'}`,
                    background: rsvp === opt.id ? opt.bg : '#fff',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                    color: rsvp === opt.id ? opt.c : '#9CA3AF',
                    transition: 'all 120ms',
                  }}>
                    <Icon name={opt.icon} size={14} /> {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to calendar — upcoming games */}
          {isGame && !isFinal && !isLive && e.month && (
            <a
              href={gCalLink(e)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={ev => ev.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', borderRadius: 10, border: '1px solid #E2E5EA', color: '#6B7280', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}
            >
              <Icon name="calendar-plus" size={16} color="#9CA3AF" /> Add to calendar
            </a>
          )}
        </div>
      </div>
    </>
  );
}

function DetailRow({ icon, label, children }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <Icon name={icon} size={13} color="#9CA3AF" />
        <span style={{ fontSize: 11, fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ScheduleSkeleton({ filter, setFilter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Hero skeleton */}
      <Skeleton width="100%" height={180} style={{ borderRadius: 16 }} />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ id: 'all', label: 'All events' }, { id: 'game', label: 'Games' }, { id: 'practice', label: 'Practices' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: filter === f.id ? 'var(--court-navy)' : '#E2E5EA',
            color: filter === f.id ? '#fff' : '#6B7280',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, transition: 'all 160ms',
          }}>{f.label}</button>
        ))}
      </div>

      <Skeleton width={80} height={11} style={{ marginBottom: 8 }} />
      {[0, 1, 2].map(i => (
        <div key={i} style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14, padding: '16px 18px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width={50} height={22} style={{ borderRadius: 999 }} />
            <Skeleton width={70} height={22} style={{ borderRadius: 999 }} />
          </div>
          <Skeleton width="70%" height={20} style={{ margin: '10px 0 4px' }} />
          <div style={{ display: 'flex', gap: 16 }}>
            <Skeleton width={100} height={13} />
            <Skeleton width={80} height={13} />
          </div>
        </div>
      ))}
    </div>
  );
}
