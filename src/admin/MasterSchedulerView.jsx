import { useState, useMemo } from 'react';
import { Card, Button, Icon, Display } from '../shared/index.js';
import { useGames, usePractices, useGymPermits, useBlackoutDates, TEAMS_INFO } from '../shared/store.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const SEASONS = [
  { id: 'fall',   label: 'Fall',   range: 'Aug – Nov', months: [7,8,9,10],  color: '#C8102E',                  jumpMonth: 8  },
  { id: 'winter', label: 'Winter', range: 'Dec – Mar', months: [11,0,1,2],  color: 'var(--court-navy)',         jumpMonth: 11 },
  { id: 'spring', label: 'Spring', range: 'Apr – May', months: [3,4],       color: '#1F8A5B',                  jumpMonth: 3  },
  { id: 'summer', label: 'Summer', range: 'Jun – Aug', months: [5,6,7],     color: 'var(--basketball-orange)',  jumpMonth: 5  },
];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_MAP   = Object.fromEntries(MONTH_NAMES.map((m, i) => [m, i]));
const WEEK_DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const ALL_TEAMS   = Object.keys(TEAMS_INFO);

const SPORT_COLORS = {
  basketball: { bg: 'rgba(234,88,12,0.13)', border: 'var(--basketball-orange)', text: 'var(--basketball-orange)' },
  soccer:     { bg: 'rgba(31,138,91,0.13)', border: '#1F8A5B',                  text: '#1F8A5B'                  },
  football:   { bg: 'rgba(200,16,46,0.13)', border: '#C8102E',                  text: '#C8102E'                  },
};

function makeId() { return 'ev-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// ── Date helpers ──────────────────────────────────────────────────────────────

function startOfWeek(d) {
  const day = new Date(d);
  day.setDate(day.getDate() - day.getDay());
  day.setHours(0, 0, 0, 0);
  return day;
}
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function isoDate(d)    { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function formatMonth(d){ return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`; }

function parseGameDate(g) {
  if (!g.month || !g.date) return null;
  const mo = MONTH_MAP[g.month];
  return mo == null ? null : new Date(new Date().getFullYear(), mo, g.date);
}
function parsePracticeDate(p) {
  if (!p.date) return null;
  const m = p.date.match(/\w{3},\s+(\w{3})\s+(\d+)/);
  if (m) { const mo = MONTH_MAP[m[1]]; return mo == null ? null : new Date(new Date().getFullYear(), mo, parseInt(m[2])); }
  const d = new Date(p.date); return isNaN(d) ? null : d;
}
function sportForTeam(t) { return TEAMS_INFO[t]?.sport || 'basketball'; }

function dayLabel(d) {
  return `${WEEK_DAYS[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MasterSchedulerView({ role, coachTeam }) {
  const isCoach = role === 'coach';
  const [games,    setGames]    = useGames();
  const [practices,setPractices]= usePractices();
  const [permits,  setPermits]  = useGymPermits();
  const [blackouts,setBlackouts]= useBlackoutDates();

  const currentMonth = new Date().getMonth();
  const defaultSeason = SEASONS.find(s => s.months.includes(currentMonth)) || SEASONS[2];
  const [season,    setSeason]   = useState(defaultSeason.id);
  const [weekStart, setWeekStart]= useState(() => startOfWeek(new Date()));
  const [tab,       setTab]      = useState('calendar');
  const [modal,     setModal]    = useState(null); // { mode:'create'|'edit', date, facility, event? }

  const activeSeason = SEASONS.find(s => s.id === season) || SEASONS[2];
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Visible teams: coaches only see their own
  const visibleTeams = isCoach && coachTeam ? [coachTeam] : ALL_TEAMS;

  // All unique facilities
  const allFacilities = useMemo(() => {
    const names = new Set();
    games.forEach(g    => { if (g.location && g.location !== 'TBD') names.add(g.location); });
    practices.forEach(p=> { if (p.gym) names.add(p.gym); });
    permits.forEach(p  => { if (p.gym_name) names.add(p.gym_name); });
    const sorted = [...names].sort();
    if (sorted.length === 0) sorted.push('TBD / Unassigned');
    return sorted;
  }, [games, practices, permits]);

  const blackoutSet = useMemo(() => new Set(blackouts.map(b => b.date)), [blackouts]);

  const eventsByDateFacility = useMemo(() => {
    const map = {};
    const add = (iso, fac, ev) => { const k = `${iso}||${fac}`; (map[k] = map[k] || []).push(ev); };
    games.forEach(g => {
      if (!visibleTeams.includes(g.team)) return;
      const d = parseGameDate(g); if (!d) return;
      add(isoDate(d), (g.location && g.location !== 'TBD') ? g.location : 'TBD / Unassigned',
        { ...g, _kind: 'game', _sport: sportForTeam(g.team) });
    });
    practices.forEach(p => {
      if (!visibleTeams.includes(p.team)) return;
      const d = parsePracticeDate(p); if (!d) return;
      add(isoDate(d), p.gym || 'TBD / Unassigned', { ...p, _kind: 'practice', _sport: sportForTeam(p.team) });
    });
    return map;
  }, [games, practices, visibleTeams]);

  const permitsByGym = useMemo(() => {
    const map = {};
    permits.forEach(p => { (map[p.gym_name] = map[p.gym_name] || []).push(p); });
    return map;
  }, [permits]);

  function isDayPermitted(gymName, date) {
    const perms = permitsByGym[gymName] || [];
    const dayName = WEEK_DAYS[date.getDay()];
    return perms.some(p =>
      p.season === season && (p.days || []).includes(dayName) &&
      (!p.start_date || isoDate(date) >= p.start_date) &&
      (!p.end_date   || isoDate(date) <= p.end_date)
    );
  }

  // ── Event CRUD ──────────────────────────────────────────────────────────────

  function openCreate(date, facility) {
    setModal({ mode: 'create', date, facility });
  }

  function openEdit(event) {
    setModal({ mode: 'edit', event });
  }

  function handleSaveEvent(ev) {
    if (ev._kind === 'game') {
      if (modal.mode === 'edit') {
        setGames(gs => gs.map(g => g.id === ev.id ? ev : g));
      } else {
        setGames(gs => [...gs, ev]);
      }
    } else {
      if (modal.mode === 'edit') {
        setPractices(ps => ps.map(p => p.id === ev.id ? ev : p));
      } else {
        setPractices(ps => [...ps, ev]);
      }
    }
    setModal(null);
  }

  function handleDeleteEvent(ev) {
    if (ev._kind === 'game') setGames(gs => gs.filter(g => g.id !== ev.id));
    else setPractices(ps => ps.filter(p => p.id !== ev.id));
    setModal(null);
  }

  const weekLabel = `${formatMonth(weekDays[0])} – ${formatMonth(weekDays[6])}, ${weekDays[0].getFullYear()}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Season tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SEASONS.map(s => (
          <button key={s.id} onClick={() => {
            setSeason(s.id);
            const now = new Date();
            const yr = (s.jumpMonth === 11 && now.getMonth() < 6) ? now.getFullYear() - 1 : now.getFullYear();
            setWeekStart(startOfWeek(new Date(yr, s.jumpMonth, 1)));
          }} style={{
            padding: '8px 18px', borderRadius: 999, cursor: 'pointer',
            border: `2px solid ${season === s.id ? s.color : 'var(--border)'}`,
            background: season === s.id ? s.color : '#fff',
            color: season === s.id ? '#fff' : 'var(--fg)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
          }}>
            {s.label} <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.75 }}>{s.range}</span>
          </button>
        ))}
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'calendar',     label: 'Calendar',        icon: 'calendar'   },
          ...(!isCoach ? [
            { id: 'permits',    label: 'Gym Permits',     icon: 'key'        },
            { id: 'blackouts',  label: 'School Closings', icon: 'ban'        },
            { id: 'availability', label: 'Availability',  icon: 'check-circle' },
          ] : []),
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
            borderBottom: `2px solid ${tab === t.id ? activeSeason.color : 'transparent'}`,
            color: tab === t.id ? 'var(--court-navy)' : 'var(--fg-muted)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: -1,
          }}>
            <Icon name={t.icon} size={15} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'calendar' && (
        <CalendarTab
          weekDays={weekDays} weekLabel={weekLabel}
          facilities={allFacilities}
          eventsByDateFacility={eventsByDateFacility}
          blackoutSet={blackoutSet}
          isDayPermitted={isDayPermitted}
          prevWeek={() => setWeekStart(d => addDays(d, -7))}
          nextWeek={() => setWeekStart(d => addDays(d,  7))}
          goToday={() => setWeekStart(startOfWeek(new Date()))}
          seasonColor={activeSeason.color}
          onCellClick={openCreate}
          onEventClick={openEdit}
        />
      )}
      {tab === 'permits' && (
        <PermitsTab season={season} seasonColor={activeSeason.color}
          permits={permits} setPermits={setPermits} facilities={allFacilities} />
      )}
      {tab === 'blackouts' && (
        <BlackoutsTab blackouts={blackouts} setBlackouts={setBlackouts} seasonColor={activeSeason.color} />
      )}
      {tab === 'availability' && (
        <GymAvailabilityTab permits={permits} blackouts={blackouts} season={season} seasonColor={activeSeason.color} games={games} practices={practices} />
      )}

      {modal && (
        <EventModal
          modal={modal}
          onClose={() => setModal(null)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          visibleTeams={visibleTeams}
          facilities={allFacilities}
          seasonColor={activeSeason.color}
        />
      )}
    </div>
  );
}

// ── Calendar tab ──────────────────────────────────────────────────────────────

function CalendarTab({ weekDays, weekLabel, facilities, eventsByDateFacility, blackoutSet, isDayPermitted, prevWeek, nextWeek, goToday, seasonColor, onCellClick, onEventClick }) {
  const today = isoDate(new Date());
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={prevWeek} style={navBtn}><Icon name="chevron-left"  size={18} /></button>
        <button onClick={nextWeek} style={navBtn}><Icon name="chevron-right" size={18} /></button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', color: 'var(--court-navy)' }}>{weekLabel}</span>
        <button onClick={goToday} style={{ ...navBtn, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>Today</button>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--fg-muted)' }}>Click any cell to add an event</span>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
        <LegendItem color="rgba(31,138,91,0.15)"  border="#1F8A5B"                  label="Permitted" />
        <LegendItem color="rgba(200,16,46,0.08)"  border="#C8102E"                  label="School closed" />
        <LegendItem color="rgba(234,88,12,0.13)"  border="var(--basketball-orange)" label="Game" />
        <LegendItem color="rgba(10,31,61,0.07)"   border="var(--court-navy)"        label="Practice" />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 150 }} />
            {weekDays.map((_, i) => <col key={i} />)}
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>Facility</th>
              {weekDays.map(d => {
                const iso = isoDate(d);
                const isToday = iso === today;
                const isBlackout = blackoutSet.has(iso);
                return (
                  <th key={iso} style={{
                    ...thStyle, textAlign: 'center',
                    background: isBlackout ? 'rgba(200,16,46,0.08)' : isToday ? 'rgba(255,199,44,0.18)' : '#F8F9FA',
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 11, color: 'var(--fg-muted)' }}>{WEEK_DAYS[d.getDay()]}</div>
                    <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', color: isToday ? seasonColor : 'var(--court-navy)', lineHeight: 1.2 }}>{d.getDate()}</div>
                    <div style={{ fontSize: 9, color: 'var(--fg-muted)' }}>{MONTH_NAMES[d.getMonth()]}</div>
                    {isBlackout && <div style={{ fontSize: 9, color: '#C8102E', fontWeight: 700, marginTop: 2 }}>CLOSED</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {facilities.map(fac => (
              <tr key={fac}>
                <td style={{ ...tdStyle, fontWeight: 700, fontSize: 11, color: 'var(--court-navy)', verticalAlign: 'top', paddingTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="map-pin" size={11} color="var(--fg-muted)" />
                    <span>{fac}</span>
                  </div>
                </td>
                {weekDays.map(d => {
                  const iso = isoDate(d);
                  const permitted = isDayPermitted(fac, d);
                  const isBlackout = blackoutSet.has(iso);
                  const events = eventsByDateFacility[`${iso}||${fac}`] || [];
                  return (
                    <td
                      key={iso}
                      onClick={() => !isBlackout && onCellClick(d, fac)}
                      style={{
                        ...tdStyle, verticalAlign: 'top', cursor: isBlackout ? 'not-allowed' : 'pointer',
                        background: isBlackout
                          ? 'repeating-linear-gradient(45deg,rgba(200,16,46,0.04),rgba(200,16,46,0.04) 4px,transparent 4px,transparent 12px)'
                          : permitted ? 'rgba(31,138,91,0.06)' : 'transparent',
                        borderLeft: permitted ? '2px solid rgba(31,138,91,0.3)' : undefined,
                        transition: 'background 100ms',
                      }}
                      onMouseEnter={e => { if (!isBlackout) e.currentTarget.style.background = permitted ? 'rgba(31,138,91,0.12)' : 'rgba(255,199,44,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = isBlackout ? 'repeating-linear-gradient(45deg,rgba(200,16,46,0.04),rgba(200,16,46,0.04) 4px,transparent 4px,transparent 12px)' : permitted ? 'rgba(31,138,91,0.06)' : 'transparent'; }}
                    >
                      {events.map((ev, i) => (
                        <EventChip key={ev.id || i} event={ev} onClick={e => { e.stopPropagation(); onEventClick(ev); }} />
                      ))}
                      {!isBlackout && (
                        <div style={{ textAlign: 'center', paddingTop: events.length ? 4 : 10, opacity: 0.25, pointerEvents: 'none' }}>
                          <Icon name="plus" size={12} color="var(--fg-muted)" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EventChip({ event, onClick }) {
  const isPractice = event._kind === 'practice';
  const c = SPORT_COLORS[event._sport] || SPORT_COLORS.basketball;
  return (
    <div onClick={onClick} style={{
      background: isPractice ? 'rgba(10,31,61,0.07)' : c.bg,
      border: `1px solid ${isPractice ? 'rgba(10,31,61,0.2)' : c.border}`,
      borderRadius: 5, padding: '3px 6px', marginBottom: 3, fontSize: 11, lineHeight: 1.3,
      cursor: 'pointer',
    }}>
      <div style={{ fontWeight: 700, color: isPractice ? 'var(--court-navy)' : c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {isPractice ? '🏋 ' : '🏆 '}{event.team || '—'}
      </div>
      <div style={{ color: 'var(--fg-muted)', fontSize: 10 }}>{event.time || ''}</div>
    </div>
  );
}

function LegendItem({ color, border, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
      <div style={{ width: 14, height: 14, borderRadius: 3, background: color, border: `1.5px solid ${border}` }} />
      <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
    </div>
  );
}

// ── Event modal (create / edit) ───────────────────────────────────────────────

const PRACTICE_TYPES = ['Regular', 'Player Development', 'Scrimmage', 'Walk-through', 'Conditioning', 'Skills Clinic'];

function EventModal({ modal, onClose, onSave, onDelete, visibleTeams, facilities, seasonColor }) {
  const isEdit = modal.mode === 'edit';
  const ev = modal.event || {};

  const defaultDate = modal.date ? isoDate(modal.date) : isoDate(new Date());
  const defaultFac  = modal.facility || '';

  const [kind,     setKind]     = useState(isEdit ? ev._kind : 'practice');
  const [team,     setTeam]     = useState(isEdit ? ev.team  : visibleTeams[0] || '');
  const [dateVal,  setDateVal]  = useState(isEdit ? (ev._kind === 'game' ? `${new Date().getFullYear()}-${String(MONTH_MAP[ev.month]+1).padStart(2,'0')}-${String(ev.date).padStart(2,'0')}` : isoDate(parsePracticeDate(ev) || new Date())) : defaultDate);
  const [time,     setTime]     = useState(isEdit ? (ev.time || '') : '');
  const [location, setLocation] = useState(isEdit ? (ev.location || ev.gym || '') : defaultFac);
  const [opponent, setOpponent] = useState(isEdit ? (ev.opponent || '') : '');
  const [practiceType, setPracticeType] = useState(isEdit ? (ev.type || 'Regular') : 'Regular');
  const [notes,    setNotes]    = useState(isEdit ? (ev.note || ev.notes || '') : '');
  const [home,     setHome]     = useState(isEdit ? (ev.home !== false) : true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function buildEvent() {
    const d = new Date(dateVal + 'T12:00:00');
    if (kind === 'game') {
      return {
        id: ev.id || makeId(),
        status: ev.status || 'scheduled',
        month: MONTH_NAMES[d.getMonth()],
        date: d.getDate(),
        weekday: WEEK_DAYS[d.getDay()],
        day: dayLabel(d),
        time, opponent, location, home, team,
        note: notes,
        us: ev.us, them: ev.them, quarter: ev.quarter,
        score_pin: ev.score_pin,
        _kind: 'game', _sport: sportForTeam(team),
      };
    } else {
      return {
        id: ev.id || makeId(),
        date: dayLabel(d),
        time, gym: location,
        type: practiceType,
        rsvp: ev.rsvp || 0,
        notes, team,
        _kind: 'practice', _sport: sportForTeam(team),
      };
    }
  }

  const canSave = team && dateVal && time && location;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 480, maxWidth: '95vw', boxShadow: 'var(--shadow-3)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <Display size={20}>{isEdit ? 'Edit event' : 'New event'}</Display>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
        </div>

        {/* Event type toggle (only when creating) */}
        {!isEdit && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {[{ id: 'practice', label: 'Practice', icon: 'dumbbell' }, { id: 'game', label: 'Game', icon: 'trophy' }].map(k => (
              <button key={k.id} onClick={() => setKind(k.id)} style={{
                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
                border: `2px solid ${kind === k.id ? seasonColor : 'var(--border)'}`,
                background: kind === k.id ? `${seasonColor}14` : '#fff',
                color: kind === k.id ? seasonColor : 'var(--fg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Icon name={k.icon} size={16} color={kind === k.id ? seasonColor : 'var(--fg-muted)'} />
                {k.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Team */}
          <MField label="Team">
            <select value={team} onChange={e => setTeam(e.target.value)} style={inputStyle}>
              <option value="">Select team…</option>
              {visibleTeams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </MField>

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <MField label="Date"><input type="date" value={dateVal} onChange={e => setDateVal(e.target.value)} style={inputStyle} /></MField>
            <MField label="Time (e.g. 6:30 PM)"><input value={time} onChange={e => setTime(e.target.value)} placeholder="6:30 PM – 7:30 PM" style={inputStyle} /></MField>
          </div>

          {/* Location */}
          <MField label="Facility / Location">
            <input list="fac-list-modal" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Providence ES" style={inputStyle} />
            <datalist id="fac-list-modal">{facilities.map(f => <option key={f} value={f} />)}</datalist>
          </MField>

          {/* Game-only fields */}
          {kind === 'game' && (
            <>
              <MField label="Opponent"><input value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="Team name or 'Week 1: …'" style={inputStyle} /></MField>
              <MField label="Home / Away">
                <div style={{ display: 'flex', gap: 8 }}>
                  {[true, false].map(v => (
                    <button key={String(v)} onClick={() => setHome(v)} style={{
                      flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                      border: `1.5px solid ${home === v ? seasonColor : 'var(--border)'}`,
                      background: home === v ? `${seasonColor}14` : '#fff',
                      color: home === v ? seasonColor : 'var(--fg)',
                    }}>{v ? 'Home' : 'Away'}</button>
                  ))}
                </div>
              </MField>
            </>
          )}

          {/* Practice-only fields */}
          {kind === 'practice' && (
            <MField label="Practice type">
              <select value={practiceType} onChange={e => setPracticeType(e.target.value)} style={inputStyle}>
                {PRACTICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </MField>
          )}

          {/* Notes */}
          <MField label="Notes (optional)">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          </MField>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {isEdit && !confirmDelete && (
              <Button kind="danger" icon="trash-2" onClick={() => setConfirmDelete(true)}>Delete</Button>
            )}
            {isEdit && confirmDelete && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600 }}>Delete this event?</span>
                <Button kind="danger" onClick={() => onDelete(ev)}>Yes, delete</Button>
                <Button kind="ghost" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            )}
          </div>
          {!confirmDelete && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button kind="ghost" onClick={onClose}>Cancel</Button>
              <Button kind="gold" icon="save" disabled={!canSave} onClick={() => onSave(buildEvent())}>
                {isEdit ? 'Save changes' : `Add ${kind}`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Gym Permits tab ───────────────────────────────────────────────────────────

function PermitsTab({ season, seasonColor, permits, setPermits, facilities }) {
  const seasonPermits = permits.filter(p => p.season === season);
  const activeSeason  = SEASONS.find(s => s.id === season);
  const [form, setForm] = useState(null);

  function openNew()  { setForm({ gym_name: '', season, year: new Date().getFullYear(), days: [], start_time: '', end_time: '', start_date: '', end_date: '', sport: '', notes: '' }); }
  function openEdit(p){ setForm({ ...p }); }
  function toggleDay(day){ setForm(f => ({ ...f, days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day] })); }

  function handleSave() {
    if (!form.gym_name || form.days.length === 0) return;
    if (form.id) setPermits(ps => ps.map(p => p.id === form.id ? form : p));
    else setPermits(ps => [...ps, { ...form, id: makeId() }]);
    setForm(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Display size={18}>{activeSeason?.label} Gym Permits</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>{activeSeason?.range} · {seasonPermits.length} permit{seasonPermits.length !== 1 ? 's' : ''}</div>
        </div>
        <Button kind="gold" icon="plus" onClick={openNew}>Add permit</Button>
      </div>

      {seasonPermits.length === 0 && !form && (
        <Card><div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-muted)', fontSize: 14 }}>
          <Icon name="key" size={32} color="var(--border)" /><br /><br />No permits for this season yet.
        </div></Card>
      )}

      {seasonPermits.map(p => (
        <Card key={p.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)', marginBottom: 6 }}>
                <Icon name="map-pin" size={13} color={seasonColor} style={{ marginRight: 5 }} />{p.gym_name}
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                {(p.days||[]).map(d => <span key={d} style={{ padding: '2px 10px', borderRadius: 999, background: `${seasonColor}18`, color: seasonColor, fontSize: 11, fontWeight: 700 }}>{d}</span>)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {p.start_time && <span><Icon name="clock" size={11} /> {p.start_time} – {p.end_time}</span>}
                {p.start_date && <span><Icon name="calendar" size={11} /> {p.start_date} → {p.end_date}</span>}
                {p.sport      && <span><Icon name="tag" size={11} /> {p.sport}</span>}
                {p.notes      && <span style={{ fontStyle: 'italic' }}>{p.notes}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openEdit(p)} style={iconBtn}><Icon name="edit-2" size={14} /></button>
              <button onClick={() => setPermits(ps => ps.filter(x => x.id !== p.id))} style={iconBtn}><Icon name="trash-2" size={14} color="#C8102E" /></button>
            </div>
          </div>
        </Card>
      ))}

      {form && (
        <Card>
          <Display size={16} style={{ marginBottom: 14 }}>{form.id ? 'Edit permit' : 'New gym permit'}</Display>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MField label="Facility name">
              <input list="fac-permit" value={form.gym_name} onChange={e => setForm(f => ({ ...f, gym_name: e.target.value }))} placeholder="e.g. Providence ES" style={inputStyle} />
              <datalist id="fac-permit">{facilities.map(f => <option key={f} value={f} />)}</datalist>
            </MField>
            <MField label="Permitted days">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {WEEK_DAYS.map(d => (
                  <button key={d} onClick={() => toggleDay(d)} style={{
                    padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    border: `1.5px solid ${form.days.includes(d) ? seasonColor : 'var(--border)'}`,
                    background: form.days.includes(d) ? `${seasonColor}18` : '#fff',
                    color: form.days.includes(d) ? seasonColor : 'var(--fg)',
                  }}>{d}</button>
                ))}
              </div>
            </MField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <MField label="Start time"><input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} style={inputStyle} /></MField>
              <MField label="End time"><input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} style={inputStyle} /></MField>
              <MField label="Permit start date"><input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} style={inputStyle} /></MField>
              <MField label="Permit end date"><input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} style={inputStyle} /></MField>
            </div>
            <MField label="Sport (optional)">
              <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))} style={inputStyle}>
                <option value="">All sports</option>
                <option value="basketball">Basketball</option>
                <option value="soccer">Soccer</option>
                <option value="football">Football</option>
              </select>
            </MField>
            <MField label="Notes"><input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional…" style={inputStyle} /></MField>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <Button kind="ghost" onClick={() => setForm(null)}>Cancel</Button>
            <Button kind="gold" icon="save" onClick={handleSave} disabled={!form.gym_name || form.days.length === 0}>Save permit</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Blackout Dates tab ────────────────────────────────────────────────────────

function BlackoutsTab({ blackouts, setBlackouts, seasonColor }) {
  const sorted = [...blackouts].sort((a, b) => a.date.localeCompare(b.date));
  const [form, setForm] = useState(null);

  function handleSave() {
    if (!form.date) return;
    if (form.id) setBlackouts(bs => bs.map(b => b.id === form.id ? form : b));
    else setBlackouts(bs => [...bs, { ...form, id: makeId() }]);
    setForm(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Display size={18}>School Closings & Blackout Dates</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>Blocked dates appear as red overlays on the calendar</div>
        </div>
        <Button kind="gold" icon="plus" onClick={() => setForm({ date: '', reason: '', scope: 'all' })}>Add closing</Button>
      </div>

      {sorted.length === 0 && !form && (
        <Card><div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-muted)', fontSize: 14 }}>
          <Icon name="ban" size={32} color="var(--border)" /><br /><br />No blackout dates yet.
        </div></Card>
      )}

      {sorted.map(b => (
        <Card key={b.id} style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>
                <Icon name="calendar-x" size={14} color="#C8102E" style={{ marginRight: 6 }} />
                {new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>
                {b.reason || 'No reason'} · {b.scope === 'all' ? 'All facilities' : b.scope}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setForm({ ...b })} style={iconBtn}><Icon name="edit-2" size={14} /></button>
              <button onClick={() => setBlackouts(bs => bs.filter(x => x.id !== b.id))} style={iconBtn}><Icon name="trash-2" size={14} color="#C8102E" /></button>
            </div>
          </div>
        </Card>
      ))}

      {form && (
        <Card>
          <Display size={16} style={{ marginBottom: 14 }}>{form.id ? 'Edit date' : 'Add blackout date'}</Display>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <MField label="Date"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} /></MField>
            <MField label="Reason"><input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. School closed — spring break" style={inputStyle} /></MField>
            <MField label="Scope">
              <select value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))} style={inputStyle}>
                <option value="all">All facilities</option>
                <option value="schools">Schools only</option>
                <option value="parks">Parks only</option>
              </select>
            </MField>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <Button kind="ghost" onClick={() => setForm(null)}>Cancel</Button>
            <Button kind="gold" icon="save" onClick={handleSave} disabled={!form.date}>Save</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Gym Availability tab ──────────────────────────────────────────────────────

const GYM_ABBR = {
  'Providence ES':         'PES',
  'Daniels Run ES Gym #1': 'DR1',
  'Daniels Run ES Gym #2': 'DR2',
  'KJMS #1':               'KJ1',
  'KJMS #2':               'KJ2',
  'Fairfax HS':            'FHS',
};

function gymAbbr(name) {
  return GYM_ABBR[name] || name.slice(0, 4);
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Returns Mon=0 … Sun=6 offset for calendar grid (ISO week starts Mon)
function calendarStartOffset(year, month) {
  const dow = new Date(year, month, 1).getDay(); // 0=Sun
  return (dow + 6) % 7; // convert so Mon=0
}

function GymAvailabilityTab({ permits, blackouts, season, seasonColor, games = [], practices = [] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedGyms, setSelectedGyms] = useState(null); // null = all

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // All unique gyms in permits
  const allGyms = useMemo(() => {
    const names = [...new Set(permits.map(p => p.gym_name).filter(Boolean))].sort();
    return names;
  }, [permits]);

  const activeGyms = selectedGyms ? allGyms.filter(g => selectedGyms.has(g)) : allGyms;

  const blackoutSet = useMemo(() => new Set(blackouts.map(b => b.date)), [blackouts]);

  const permitsByGym = useMemo(() => {
    const map = {};
    permits.forEach(p => { (map[p.gym_name] = map[p.gym_name] || []).push(p); });
    return map;
  }, [permits]);

  // Build set of "iso||gymName" combos that have a scheduled game or practice
  const bookedSet = useMemo(() => {
    const set = new Set();
    games.forEach(g => {
      const d = parseGameDate(g);
      if (!d || !g.location || g.location === 'TBD') return;
      set.add(`${isoDate(d)}||${g.location}`);
    });
    practices.forEach(p => {
      const d = parsePracticeDate(p);
      if (!d || !p.gym) return;
      set.add(`${isoDate(d)}||${p.gym}`);
    });
    return set;
  }, [games, practices]);

  function isPermitted(gymName, date) {
    const perms = permitsByGym[gymName] || [];
    const dayName = WEEK_DAYS[date.getDay()];
    const iso = isoDate(date);
    return perms.some(p =>
      p.season === season &&
      (p.days || []).includes(dayName) &&
      (!p.start_date || iso >= p.start_date) &&
      (!p.end_date   || iso <= p.end_date)
    );
  }

  function isBooked(gymName, date) {
    return bookedSet.has(`${isoDate(date)}||${gymName}`);
  }

  const numDays = daysInMonth(year, month);
  const offset  = calendarStartOffset(year, month); // Mon-based offset

  // Build 7-column grid cells (nulls for padding)
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= numDays; d++) cells.push(d);

  function prevMonth() { setViewDate(v => new Date(v.getFullYear(), v.getMonth() - 1, 1)); }
  function nextMonth() { setViewDate(v => new Date(v.getFullYear(), v.getMonth() + 1, 1)); }

  function toggleGym(gym) {
    setSelectedGyms(prev => {
      const base = prev ? new Set(prev) : new Set(allGyms);
      if (base.has(gym)) { base.delete(gym); } else { base.add(gym); }
      if (base.size === allGyms.length) return null; // all selected = reset to null
      return base;
    });
  }

  const todayIso = isoDate(today);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={prevMonth} style={navBtn}><Icon name="chevron-left"  size={18} /></button>
        <button onClick={nextMonth} style={navBtn}><Icon name="chevron-right" size={18} /></button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase', color: 'var(--court-navy)' }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))} style={{ ...navBtn, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>Today</button>
      </div>

      {/* Gym selector pills */}
      {allGyms.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 4 }}>Filter:</span>
          <button
            onClick={() => setSelectedGyms(null)}
            style={{
              padding: '4px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: `1.5px solid ${!selectedGyms ? 'var(--court-navy)' : 'var(--border)'}`,
              background: !selectedGyms ? 'var(--court-navy)' : '#fff',
              color: !selectedGyms ? '#fff' : 'var(--fg)',
              fontFamily: 'var(--font-body)',
            }}>All gyms</button>
          {allGyms.map(gym => {
            const active = !selectedGyms || selectedGyms.has(gym);
            return (
              <button key={gym} onClick={() => toggleGym(gym)} style={{
                padding: '4px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${active ? seasonColor : 'var(--border)'}`,
                background: active ? `${seasonColor}18` : '#fff',
                color: active ? seasonColor : 'var(--fg-muted)',
                fontFamily: 'var(--font-body)',
              }}>{gym}</button>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <LegendItem color="rgba(31,138,91,0.2)"    border="#1F8A5B"  label="Permitted & open" />
        <LegendItem color="rgba(255,199,44,0.25)"  border="#C97B00"  label="Permitted but booked" />
        <LegendItem color="rgba(180,180,180,0.2)"  border="#aaa"     label="No permit this day" />
        <LegendItem color="rgba(200,16,46,0.12)"   border="#C8102E"  label="Blackout / school closed" />
      </div>

      {/* Calendar grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 560 }}>
          {/* Day-of-week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 3 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)',
                textTransform: 'uppercase', letterSpacing: '0.07em', padding: '4px 0',
              }}>{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
            {cells.map((day, idx) => {
              if (!day) {
                return <div key={`pad-${idx}`} style={{ background: 'transparent', minHeight: 80 }} />;
              }
              const cellDate = new Date(year, month, day);
              const iso      = isoDate(cellDate);
              const isBlackout = blackoutSet.has(iso);
              const isToday    = iso === todayIso;

              const permittedGyms    = activeGyms.filter(g =>  isPermitted(g, cellDate) && !isBooked(g, cellDate));
              const bookedGyms      = activeGyms.filter(g =>  isPermitted(g, cellDate) &&  isBooked(g, cellDate));
              const unpermittedGyms = activeGyms.filter(g => !isPermitted(g, cellDate));

              return (
                <div key={iso} style={{
                  border: `1.5px solid ${isToday ? seasonColor : isBlackout ? '#C8102E' : 'var(--border)'}`,
                  borderRadius: 8,
                  padding: '6px 6px 5px',
                  minHeight: 80,
                  background: isBlackout
                    ? 'rgba(200,16,46,0.07)'
                    : isToday ? 'rgba(255,199,44,0.10)' : '#fff',
                  display: 'flex', flexDirection: 'column', gap: 3,
                  position: 'relative',
                }}>
                  {/* Day number */}
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 15,
                    color: isToday ? seasonColor : isBlackout ? '#C8102E' : 'var(--court-navy)',
                    fontWeight: isToday ? 900 : 700, lineHeight: 1, marginBottom: 3,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span>{day}</span>
                    {isBlackout && <span style={{ fontSize: 11, color: '#C8102E', fontWeight: 700 }}>✕</span>}
                  </div>

                  {/* Gym chips: open / booked / no permit */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {permittedGyms.map(g => (
                      <span key={g} title={`${g} — permitted & open`} style={{
                        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)',
                        padding: '1px 5px', borderRadius: 4,
                        background: 'rgba(31,138,91,0.18)', color: '#1F8A5B',
                        border: '1px solid rgba(31,138,91,0.35)',
                        whiteSpace: 'nowrap',
                      }}>{gymAbbr(g)}</span>
                    ))}
                    {bookedGyms.map(g => (
                      <span key={g} title={`${g} — permitted but already scheduled`} style={{
                        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)',
                        padding: '1px 5px', borderRadius: 4,
                        background: 'rgba(255,199,44,0.25)', color: '#C97B00',
                        border: '1px solid rgba(201,123,0,0.45)',
                        whiteSpace: 'nowrap',
                      }}>{gymAbbr(g)} ●</span>
                    ))}
                    {!isBlackout && unpermittedGyms.map(g => (
                      <span key={g} title={`${g} — no permit`} style={{
                        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-body)',
                        padding: '1px 5px', borderRadius: 4,
                        background: 'rgba(180,180,180,0.18)', color: '#999',
                        border: '1px solid rgba(180,180,180,0.35)',
                        whiteSpace: 'nowrap',
                      }}>{gymAbbr(g)}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {allGyms.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--fg-muted)', fontSize: 14 }}>
          <Icon name="check-circle" size={32} color="var(--border)" /><br /><br />
          No gym permits found. Add permits in the Gym Permits tab first.
        </div>
      )}
    </div>
  );
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function MField({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)',
  fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg)', outline: 'none',
  background: 'var(--bone)', boxSizing: 'border-box',
};
const navBtn = { background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' };
const thStyle = { background: '#F8F9FA', border: '1px solid var(--border)', padding: '8px 6px', fontSize: 12, fontFamily: 'var(--font-body)' };
const tdStyle = { border: '1px solid var(--border)', padding: '6px 5px', minWidth: 90, minHeight: 56 };
const iconBtn  = { background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
