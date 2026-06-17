import { useState, useMemo } from 'react';
import { Card, Button, Icon, Display, Pill } from '../shared/index.js';
import { useGames, usePractices, useGymPermits, useBlackoutDates, TEAMS_INFO } from '../shared/store.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const SEASONS = [
  { id: 'fall',   label: 'Fall',   range: 'Aug – Nov', months: [7,8,9,10],  color: '#C8102E',                   defaultMonth: 9  },
  { id: 'winter', label: 'Winter', range: 'Dec – Mar', months: [11,0,1,2],  color: 'var(--court-navy)',         defaultMonth: 11 },
  { id: 'spring', label: 'Spring', range: 'Apr – Jun', months: [3,4,5],     color: '#1F8A5B',                   defaultMonth: 3  },
  { id: 'summer', label: 'Summer', range: 'Jul – Aug', months: [6,7],       color: 'var(--basketball-orange)',  defaultMonth: 6  },
];

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_MAP   = Object.fromEntries(MONTH_NAMES.map((m, i) => [m, i]));
const WEEK_DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const SPORT_COLORS = {
  basketball: { bg: 'rgba(234,88,12,0.12)', border: 'var(--basketball-orange)', text: 'var(--basketball-orange)' },
  soccer:     { bg: 'rgba(31,138,91,0.12)', border: '#1F8A5B',                  text: '#1F8A5B'                  },
  football:   { bg: 'rgba(200,16,46,0.12)', border: '#C8102E',                  text: '#C8102E'                  },
};

function makeId() { return 'sched-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

// ── Date helpers ──────────────────────────────────────────────────────────────

function startOfWeek(d) {
  const day = new Date(d);
  day.setDate(day.getDate() - day.getDay()); // back to Sunday
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatMonth(d) {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

// Parse a game's date (month: 'Jun', date: 16) into a JS Date
function parseGameDate(g) {
  if (!g.month || !g.date) return null;
  const mo = MONTH_MAP[g.month];
  if (mo == null) return null;
  const yr = new Date().getFullYear();
  return new Date(yr, mo, g.date);
}

// Parse a practice date string like "Mon, Jun 1"
function parsePracticeDate(p) {
  if (!p.date) return null;
  const m = p.date.match(/(\w{3}),\s+(\w{3})\s+(\d+)/);
  if (m) {
    const mo = MONTH_MAP[m[2]];
    if (mo == null) return null;
    return new Date(new Date().getFullYear(), mo, parseInt(m[3]));
  }
  // try YYYY-MM-DD
  const d = new Date(p.date);
  return isNaN(d) ? null : d;
}

// Detect sport from team name via TEAMS_INFO
function sportForTeam(teamName) {
  return TEAMS_INFO[teamName]?.sport || 'basketball';
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MasterSchedulerView() {
  const [games]         = useGames();
  const [practices]     = usePractices();
  const [permits, setPermits]   = useGymPermits();
  const [blackouts, setBlackouts] = useBlackoutDates();

  const currentMonth = new Date().getMonth();
  const defaultSeason = SEASONS.find(s => s.months.includes(currentMonth)) || SEASONS[2];
  const [season, setSeason] = useState(defaultSeason.id);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [tab, setTab] = useState('calendar');

  const activeSeason = SEASONS.find(s => s.id === season) || SEASONS[2];

  // Build array of 7 days for this week
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Collect all unique facility names from games + practices + permits
  const allFacilities = useMemo(() => {
    const names = new Set();
    games.forEach(g => { if (g.location && g.location !== 'TBD') names.add(g.location); });
    practices.forEach(p => { if (p.gym) names.add(p.gym); });
    permits.forEach(p => { if (p.gym_name) names.add(p.gym_name); });
    const sorted = [...names].sort();
    if (sorted.length === 0) sorted.push('TBD / Unassigned');
    return sorted;
  }, [games, practices, permits]);

  // Map blackout dates to a Set of ISO strings for O(1) lookup
  const blackoutSet = useMemo(() => new Set(blackouts.map(b => b.date)), [blackouts]);

  // Index events by isoDate → facility → list
  const eventsByDateFacility = useMemo(() => {
    const map = {};
    const key = (date, fac) => `${date}||${fac}`;
    const add = (iso, fac, event) => {
      const k = key(iso, fac);
      if (!map[k]) map[k] = [];
      map[k].push(event);
    };

    games.forEach(g => {
      const d = parseGameDate(g);
      if (!d) return;
      const iso = isoDate(d);
      const fac = (g.location && g.location !== 'TBD') ? g.location : 'TBD / Unassigned';
      add(iso, fac, { ...g, _kind: 'game', _sport: sportForTeam(g.team) });
    });

    practices.forEach(p => {
      const d = parsePracticeDate(p);
      if (!d) return;
      const iso = isoDate(d);
      const fac = p.gym || 'TBD / Unassigned';
      add(iso, fac, { ...p, _kind: 'practice', _sport: sportForTeam(p.team) });
    });

    return map;
  }, [games, practices]);

  // Permits indexed by gym_name → list
  const permitsByGym = useMemo(() => {
    const map = {};
    permits.forEach(p => {
      if (!map[p.gym_name]) map[p.gym_name] = [];
      map[p.gym_name].push(p);
    });
    return map;
  }, [permits]);

  // Check if a day falls within any permit for this gym in this season
  function isDayPermitted(gymName, date) {
    const perms = permitsByGym[gymName] || [];
    const dayName = WEEK_DAYS[date.getDay()];
    return perms.some(p =>
      p.season === season &&
      (p.days || []).includes(dayName) &&
      (!p.start_date || isoDate(date) >= p.start_date) &&
      (!p.end_date   || isoDate(date) <= p.end_date)
    );
  }

  const prevWeek = () => setWeekStart(d => addDays(d, -7));
  const nextWeek = () => setWeekStart(d => addDays(d,  7));
  const goToday  = () => setWeekStart(startOfWeek(new Date()));

  const weekLabel = `${formatMonth(weekDays[0])} – ${formatMonth(weekDays[6])}, ${weekDays[0].getFullYear()}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Season tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {SEASONS.map(s => (
          <button key={s.id} onClick={() => setSeason(s.id)} style={{
            padding: '8px 18px', borderRadius: 999,
            border: `2px solid ${season === s.id ? s.color : 'var(--border)'}`,
            background: season === s.id ? s.color : '#fff',
            color: season === s.id ? '#fff' : 'var(--fg)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          }}>
            {s.label}
            <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.75 }}>{s.range}</span>
          </button>
        ))}
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'calendar', label: 'Calendar', icon: 'calendar' },
          { id: 'permits',  label: 'Gym Permits', icon: 'key' },
          { id: 'blackouts',label: 'School Closings', icon: 'ban' },
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
          weekDays={weekDays}
          weekLabel={weekLabel}
          facilities={allFacilities}
          eventsByDateFacility={eventsByDateFacility}
          blackoutSet={blackoutSet}
          isDayPermitted={isDayPermitted}
          prevWeek={prevWeek}
          nextWeek={nextWeek}
          goToday={goToday}
          seasonColor={activeSeason.color}
        />
      )}

      {tab === 'permits' && (
        <PermitsTab
          season={season}
          seasonColor={activeSeason.color}
          permits={permits}
          setPermits={setPermits}
          facilities={allFacilities}
        />
      )}

      {tab === 'blackouts' && (
        <BlackoutsTab
          blackouts={blackouts}
          setBlackouts={setBlackouts}
          seasonColor={activeSeason.color}
        />
      )}
    </div>
  );
}

// ── Calendar tab ──────────────────────────────────────────────────────────────

function CalendarTab({ weekDays, weekLabel, facilities, eventsByDateFacility, blackoutSet, isDayPermitted, prevWeek, nextWeek, goToday, seasonColor }) {
  const today = isoDate(new Date());

  return (
    <div>
      {/* Week nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={prevWeek} style={navBtn}><Icon name="chevron-left" size={18} /></button>
        <button onClick={nextWeek} style={navBtn}><Icon name="chevron-right" size={18} /></button>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', color: 'var(--court-navy)' }}>{weekLabel}</span>
        <button onClick={goToday} style={{ ...navBtn, marginLeft: 8, padding: '5px 14px', fontSize: 12, fontWeight: 700 }}>Today</button>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
        <LegendItem color="rgba(31,138,91,0.18)" border="#1F8A5B" label="Gym permitted" />
        <LegendItem color="rgba(200,16,46,0.08)" border="#C8102E" label="School closing" />
        <LegendItem color="rgba(234,88,12,0.12)" border="var(--basketball-orange)" label="Game" />
        <LegendItem color="rgba(10,31,61,0.06)" border="var(--court-navy)" label="Practice" />
      </div>

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: 160 }} />
            {weekDays.map((_, i) => <col key={i} style={{ width: 'auto' }} />)}
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
                    ...thStyle,
                    background: isBlackout ? 'rgba(200,16,46,0.08)' : isToday ? 'rgba(255,199,44,0.15)' : '#F8F9FA',
                    color: isToday ? 'var(--court-navy)' : 'var(--fg-soft)',
                  }}>
                    <div style={{ fontWeight: 700 }}>{WEEK_DAYS[d.getDay()]}</div>
                    <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: isToday ? seasonColor : 'var(--court-navy)' }}>{d.getDate()}</div>
                    {isBlackout && <div style={{ fontSize: 9, color: '#C8102E', fontWeight: 700, marginTop: 2 }}>CLOSED</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {facilities.map(fac => (
              <tr key={fac}>
                <td style={{ ...tdStyle, fontWeight: 700, fontSize: 12, color: 'var(--court-navy)', verticalAlign: 'top', paddingTop: 10 }}>
                  <Icon name="map-pin" size={11} color="var(--fg-muted)" style={{ marginRight: 4 }} />
                  {fac}
                </td>
                {weekDays.map(d => {
                  const iso = isoDate(d);
                  const permitted = isDayPermitted(fac, d);
                  const isBlackout = blackoutSet.has(iso);
                  const events = eventsByDateFacility[`${iso}||${fac}`] || [];
                  return (
                    <td key={iso} style={{
                      ...tdStyle,
                      background: isBlackout
                        ? 'repeating-linear-gradient(45deg,rgba(200,16,46,0.04),rgba(200,16,46,0.04) 4px,transparent 4px,transparent 12px)'
                        : permitted ? 'rgba(31,138,91,0.06)' : 'transparent',
                      borderLeft: permitted ? '2px solid rgba(31,138,91,0.25)' : '1px solid var(--border)',
                      verticalAlign: 'top',
                    }}>
                      {events.map((ev, i) => <EventChip key={i} event={ev} />)}
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

function EventChip({ event }) {
  const isPractice = event._kind === 'practice';
  const sport = event._sport || 'basketball';
  const c = SPORT_COLORS[sport] || SPORT_COLORS.basketball;
  return (
    <div style={{
      background: isPractice ? 'rgba(10,31,61,0.07)' : c.bg,
      border: `1px solid ${isPractice ? 'rgba(10,31,61,0.18)' : c.border}`,
      borderRadius: 5, padding: '3px 6px', marginBottom: 3, fontSize: 11, lineHeight: 1.3,
    }}>
      <div style={{ fontWeight: 700, color: isPractice ? 'var(--court-navy)' : c.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {isPractice ? '🏋 ' : '🏆 '}{event.team || event.opponent || '—'}
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

const navBtn = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: 8,
  padding: '5px 9px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
};

const thStyle = {
  background: '#F8F9FA', border: '1px solid var(--border)', padding: '8px 6px',
  textAlign: 'center', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 600,
  color: 'var(--fg-soft)',
};

const tdStyle = {
  border: '1px solid var(--border)', padding: '6px 5px', minHeight: 60,
  minWidth: 90,
};

// ── Gym Permits tab ───────────────────────────────────────────────────────────

function PermitsTab({ season, seasonColor, permits, setPermits, facilities }) {
  const seasonPermits = permits.filter(p => p.season === season);
  const [form, setForm] = useState(null); // null = closed, {} = new, {...} = editing

  const activeSeason = SEASONS.find(s => s.id === season);

  function openNew() {
    setForm({ gym_name: '', season, year: new Date().getFullYear(), days: [], start_time: '', end_time: '', start_date: '', end_date: '', sport: '', notes: '' });
  }

  function openEdit(p) { setForm({ ...p }); }

  function handleSave() {
    if (!form.gym_name || form.days.length === 0) return;
    if (form.id) {
      setPermits(ps => ps.map(p => p.id === form.id ? { ...form } : p));
    } else {
      setPermits(ps => [...ps, { ...form, id: makeId() }]);
    }
    setForm(null);
  }

  function handleDelete(id) {
    setPermits(ps => ps.filter(p => p.id !== id));
  }

  function toggleDay(day) {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }));
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
        <Card>
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-muted)', fontSize: 14 }}>
            <Icon name="key" size={32} color="var(--border)" /><br /><br />
            No gym permits for this season yet.<br />Add one to track which facilities are available and on which days.
          </div>
        </Card>
      )}

      {seasonPermits.map(p => (
        <Card key={p.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)', marginBottom: 4 }}>
                <Icon name="map-pin" size={14} color={seasonColor} style={{ marginRight: 5 }} />
                {p.gym_name}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {(p.days || []).map(d => (
                  <span key={d} style={{ padding: '2px 10px', borderRadius: 999, background: `${seasonColor}18`, color: seasonColor, fontSize: 11, fontWeight: 700 }}>{d}</span>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {p.start_time && <span><Icon name="clock" size={11} /> {p.start_time} – {p.end_time}</span>}
                {p.start_date && <span><Icon name="calendar" size={11} /> {p.start_date} → {p.end_date}</span>}
                {p.sport && <span><Icon name="tag" size={11} /> {p.sport}</span>}
                {p.notes && <span style={{ fontStyle: 'italic' }}>{p.notes}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openEdit(p)} style={{ ...iconBtn }}><Icon name="edit-2" size={14} /></button>
              <button onClick={() => handleDelete(p.id)} style={{ ...iconBtn, color: '#C8102E' }}><Icon name="trash-2" size={14} color="#C8102E" /></button>
            </div>
          </div>
        </Card>
      ))}

      {form && (
        <Card>
          <Display size={16} style={{ marginBottom: 14 }}>{form.id ? 'Edit permit' : 'New gym permit'}</Display>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FieldRow label="Facility name">
              <input list="fac-list" value={form.gym_name} onChange={e => setForm(f => ({ ...f, gym_name: e.target.value }))} placeholder="e.g. Providence ES" style={inputStyle} />
              <datalist id="fac-list">{facilities.map(f => <option key={f} value={f} />)}</datalist>
            </FieldRow>

            <FieldRow label="Permitted days">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                  <button key={d} onClick={() => toggleDay(d)} style={{
                    padding: '5px 12px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                    border: `1.5px solid ${form.days.includes(d) ? seasonColor : 'var(--border)'}`,
                    background: form.days.includes(d) ? `${seasonColor}18` : '#fff',
                    color: form.days.includes(d) ? seasonColor : 'var(--fg)',
                  }}>{d}</button>
                ))}
              </div>
            </FieldRow>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <FieldRow label="Start time"><input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} style={inputStyle} /></FieldRow>
              <FieldRow label="End time"><input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} style={inputStyle} /></FieldRow>
              <FieldRow label="Permit start date"><input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} style={inputStyle} /></FieldRow>
              <FieldRow label="Permit end date"><input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} style={inputStyle} /></FieldRow>
            </div>

            <FieldRow label="Sport (optional)">
              <select value={form.sport} onChange={e => setForm(f => ({ ...f, sport: e.target.value }))} style={inputStyle}>
                <option value="">All sports</option>
                <option value="basketball">Basketball</option>
                <option value="soccer">Soccer</option>
                <option value="football">Football</option>
              </select>
            </FieldRow>

            <FieldRow label="Notes">
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" style={inputStyle} />
            </FieldRow>
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
  const [form, setForm] = useState(null);
  const sorted = [...blackouts].sort((a, b) => a.date.localeCompare(b.date));

  function openNew() {
    setForm({ date: '', reason: '', scope: 'all' });
  }

  function handleSave() {
    if (!form.date) return;
    if (form.id) {
      setBlackouts(bs => bs.map(b => b.id === form.id ? { ...form } : b));
    } else {
      setBlackouts(bs => [...bs, { ...form, id: makeId() }]);
    }
    setForm(null);
  }

  function handleDelete(id) {
    setBlackouts(bs => bs.filter(b => b.id !== id));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 600 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Display size={18}>School Closings & Blackout Dates</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 2 }}>Blocked dates are shown in red on the calendar</div>
        </div>
        <Button kind="gold" icon="plus" onClick={openNew}>Add closing</Button>
      </div>

      {sorted.length === 0 && !form && (
        <Card>
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--fg-muted)', fontSize: 14 }}>
            <Icon name="ban" size={32} color="var(--border)" /><br /><br />
            No blackout dates added yet.<br />Add school closings, holidays, or facility conflicts.
          </div>
        </Card>
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
                {b.reason || 'No reason specified'} · {b.scope === 'all' ? 'All facilities' : b.scope}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setForm({ ...b })} style={iconBtn}><Icon name="edit-2" size={14} /></button>
              <button onClick={() => handleDelete(b.id)} style={{ ...iconBtn }}><Icon name="trash-2" size={14} color="#C8102E" /></button>
            </div>
          </div>
        </Card>
      ))}

      {form && (
        <Card>
          <Display size={16} style={{ marginBottom: 14 }}>{form.id ? 'Edit date' : 'Add blackout date'}</Display>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FieldRow label="Date"><input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={inputStyle} /></FieldRow>
            <FieldRow label="Reason"><input value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} placeholder="e.g. School closed — spring break" style={inputStyle} /></FieldRow>
            <FieldRow label="Scope">
              <select value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))} style={inputStyle}>
                <option value="all">All facilities</option>
                <option value="schools">Schools only</option>
                <option value="parks">Parks only</option>
              </select>
            </FieldRow>
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

// ── Shared helpers ────────────────────────────────────────────────────────────

function FieldRow({ label, children }) {
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

const iconBtn = {
  background: 'transparent', border: '1px solid var(--border)', borderRadius: 6,
  padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
};
