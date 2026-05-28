import { useState } from 'react';
import { useGames, usePractices } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';
import { findGymConflicts } from './gyms.js';

const MONTHS_ORDER = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
const MONTH_NAMES  = { Sep:'September',Oct:'October',Nov:'November',Dec:'December',Jan:'January',Feb:'February',Mar:'March' };

function monthYearOf(g) {
  const m = g.month || (g.date ? g.date.split(' ')[1] : '');
  const year = ['Sep','Oct','Nov'].includes(m) ? 2025 : 2026;
  return { month: m, year };
}

function dateOf(g) {
  const { month, year } = monthYearOf(g);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return new Date(year, months.indexOf(month), g.date || 1);
}

export default function SchedulerCalendar() {
  const [games]     = useGames();
  const [practices] = usePractices();
  const [filter, setFilter] = useState('all');

  const conflicts = findGymConflicts(games, practices);

  // Build list of all events sorted by date
  const allEvents = [];

  games.forEach(g => {
    if (g.status === 'cancelled') return;
    const d = dateOf(g);
    allEvents.push({ type: 'game', id: g.id, sortDate: d, day: g.day || `${g.weekday}, ${g.month} ${g.date}`, time: g.time, label: `${g.home ? 'vs.' : '@'} ${g.opponent}`, location: g.location, status: g.status, home: g.home, us: g.us, them: g.them, month: g.month || '' });
  });

  practices.forEach(p => {
    // Parse "Mon, Dec 2" style date
    const parts = p.date.split(', ');
    const [monthStr, dayStr] = (parts[1] || '').split(' ');
    const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
    const monthIdx = months[monthStr] ?? 11;
    const year = monthIdx >= 8 ? 2025 : 2026;
    const d = new Date(year, monthIdx, parseInt(dayStr) || 1);
    const month = monthStr || '';
    allEvents.push({ type: 'practice', id: p.id, sortDate: d, day: p.date, time: p.time, label: p.type, location: p.gym, status: 'scheduled', month });
  });

  allEvents.sort((a, b) => a.sortDate - b.sortDate);

  const filtered = filter === 'all' ? allEvents : allEvents.filter(e => e.type === filter);

  // Group by month
  const byMonth = {};
  filtered.forEach(e => {
    const key = e.month || 'Other';
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e);
  });

  const conflictIds = new Set(conflicts.flatMap(pair => pair.map(e => e.id)));

  const gamesCount     = games.filter(g => g.status !== 'cancelled').length;
  const practicesCount = practices.length;
  const finalCount     = games.filter(g => g.status === 'final').length;
  const noGymGames     = games.filter(g => g.status === 'scheduled' && !g.location).length;
  const noGymPractices = practices.filter(p => !p.gym || p.gym === 'TBD').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {[
          { label: 'Total games',      value: gamesCount,      icon: 'flag',           color: 'var(--court-navy)' },
          { label: 'Played',           value: finalCount,       icon: 'check-circle',   color: '#059669' },
          { label: 'Remaining',        value: gamesCount - finalCount, icon: 'calendar', color: 'var(--basketball-orange)' },
          { label: 'Practices',        value: practicesCount,  icon: 'clipboard-list', color: '#4F46E5' },
          { label: 'Gym conflicts',    value: conflicts.length, icon: 'alert-triangle', color: conflicts.length > 0 ? '#DC2626' : '#9CA3AF' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>{s.label}</div>
              <Icon name={s.icon} size={14} color={s.color} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Conflict alerts */}
      {conflicts.length > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '14px 18px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="alert-triangle" size={16} color="#DC2626" style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#991B1B', marginBottom: 8 }}>
                {conflicts.length} gym conflict{conflicts.length !== 1 ? 's' : ''} detected
              </div>
              {conflicts.map((pair, i) => (
                <div key={i} style={{ fontSize: 13, color: '#7F1D1D', marginBottom: 4, lineHeight: 1.5 }}>
                  <strong>{pair[0].location}</strong> · {pair[0].day} — booked for both{' '}
                  <em>{pair[0].label}</em> ({pair[0].time}) and <em>{pair[1].label}</em> ({pair[1].time})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Unassigned gym warnings */}
      {(noGymGames > 0 || noGymPractices > 0) && (
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 18px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <Icon name="info" size={15} color="#D97706" />
          <div style={{ fontSize: 13, color: '#92400E' }}>
            {[noGymGames > 0 && `${noGymGames} game${noGymGames > 1 ? 's' : ''} without a gym`, noGymPractices > 0 && `${noGymPractices} practice${noGymPractices > 1 ? 's' : ''} without a gym`].filter(Boolean).join(' · ')}
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ id: 'all', label: 'All events' }, { id: 'game', label: 'Games only' }, { id: 'practice', label: 'Practices only' }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: filter === f.id ? 'var(--court-navy)' : '#E5E7EB',
            color: filter === f.id ? '#fff' : '#6B7280',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, transition: 'all 160ms',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Month groups */}
      {MONTHS_ORDER.filter(m => byMonth[m]).map(m => (
        <div key={m}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, textTransform: 'uppercase', color: 'var(--court-navy)' }}>
              {MONTH_NAMES[m]}
            </div>
            <div style={{ height: 1, flex: 1, background: '#E5E7EB' }} />
            <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{byMonth[m].length} event{byMonth[m].length !== 1 ? 's' : ''}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {byMonth[m].map(e => {
              const isGame     = e.type === 'game';
              const isFinal    = e.status === 'final';
              const hasConflict = conflictIds.has(e.id);
              const win = isFinal && e.us > e.them;
              return (
                <div key={e.id} style={{
                  background: '#fff',
                  border: `1px solid ${hasConflict ? '#FECACA' : '#E5E7EB'}`,
                  borderLeft: `4px solid ${isGame ? (isFinal ? (win ? '#059669' : '#DC2626') : 'var(--court-navy)') : '#4F46E5'}`,
                  borderRadius: '0 10px 10px 0',
                  padding: '12px 16px',
                  display: 'grid', gridTemplateColumns: '130px 1fr 200px 120px',
                  alignItems: 'center', gap: 16,
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{e.day}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#6B7280', marginTop: 2 }}>{e.time}</div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.06em',
                        background: isGame ? 'rgba(10,31,61,0.08)' : 'rgba(79,70,229,0.10)',
                        color: isGame ? 'var(--court-navy)' : '#4F46E5',
                      }}>
                        {isGame ? (e.home ? 'Home game' : 'Away game') : e.label}
                      </span>
                      {isFinal && (
                        <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: win ? 'rgba(5,150,105,0.10)' : 'rgba(220,38,38,0.08)', color: win ? '#059669' : '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {win ? 'W' : 'L'} {e.us}–{e.them}
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>{e.label}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {hasConflict && <Icon name="alert-triangle" size={13} color="#DC2626" />}
                    <span style={{ fontSize: 13, color: e.location ? '#374151' : '#EF4444', fontWeight: e.location ? 400 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {e.location || '⚠ No gym'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!isFinal && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: '#F4F5F7', color: '#9CA3AF' }}>
                        {isGame ? (e.home ? 'Home' : 'Away') : 'Practice'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9CA3AF' }}>
          <Icon name="calendar" size={40} color="#E5E7EB" />
          <div style={{ fontWeight: 700, fontSize: 15, color: '#374151', marginTop: 16, marginBottom: 6 }}>No events to show</div>
          <div style={{ fontSize: 13 }}>Use the Games and Practices tabs to add events to the schedule.</div>
        </div>
      )}
    </div>
  );
}
