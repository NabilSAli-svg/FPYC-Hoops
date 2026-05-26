import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { EVENTS } from './data.js';

export default function ScheduleTab() {
  const [filter, setFilter] = useState('all');
  const [rsvps, setRsvps] = useState({});

  const filtered = EVENTS.filter(e => filter === 'all' || e.type === filter);

  const upcoming = filtered.filter(e => e.status === 'upcoming');
  const past = filtered.filter(e => e.status === 'final');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { id: 'all', label: 'All events' },
          { id: 'game', label: 'Games' },
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

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <SectionLabel>Upcoming</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(e => (
              <EventCard key={e.id} event={e} rsvp={rsvps[e.id] ?? e.rsvp}
                onRsvp={val => setRsvps(r => ({ ...r, [e.id]: val }))} />
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
            {past.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 10 }}>
      {children}
    </div>
  );
}

function EventCard({ event: e, rsvp, onRsvp }) {
  const isGame = e.type === 'game';
  const isFinal = e.status === 'final';
  const win = isFinal && e.us > e.them;

  return (
    <div style={{
      background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12,
      overflow: 'hidden', opacity: isFinal ? 0.75 : 1,
    }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Date tile */}
        <div style={{
          width: 64, flexShrink: 0, background: isFinal ? '#F9FAFB' : isGame ? 'var(--court-navy)' : '#F0F4FF',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 8px',
          borderRight: '1px solid #E2E5EA',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: isFinal ? '#9CA3AF' : isGame ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>
            {e.date.split(',')[0]}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, marginTop: 2, color: isFinal ? '#9CA3AF' : isGame ? '#fff' : 'var(--court-navy)' }}>
            {e.date.split(' ').slice(-1)[0]}
          </div>
          <div style={{ fontSize: 10, color: isFinal ? '#9CA3AF' : isGame ? 'rgba(255,255,255,0.55)' : '#9CA3AF', marginTop: 2 }}>
            {e.date.split(' ').slice(1, 2)[0]}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase',
              background: isGame ? 'rgba(10,31,61,0.08)' : 'rgba(99,102,241,0.10)',
              color: isGame ? 'var(--court-navy)' : '#4F46E5',
            }}>
              {isGame ? (e.home ? 'Home game' : 'Away game') : 'Practice'}
            </span>
            {isFinal && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: win ? 'rgba(5,150,105,0.10)' : 'rgba(220,38,38,0.08)', color: win ? '#059669' : '#DC2626' }}>
                {win ? 'Win' : 'Loss'}
              </span>
            )}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', lineHeight: 1.2 }}>{e.label}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, display: 'flex', gap: 10 }}>
            <span>{e.time}</span>
            <span>·</span>
            <span>{e.location}</span>
          </div>
        </div>

        {/* Score or RSVP */}
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', minWidth: 70 }}>
          {isFinal && isGame ? (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, color: win ? 'var(--court-navy)' : '#9CA3AF', textAlign: 'right' }}>
                {e.us}–{e.them}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'right', marginTop: 2 }}>Final</div>
            </div>
          ) : onRsvp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[{ id: 'yes', icon: 'check', label: 'Going', c: '#059669', bg: 'rgba(5,150,105,0.10)' },
                { id: 'no', icon: 'x', label: 'Skip', c: '#DC2626', bg: 'rgba(220,38,38,0.08)' }].map(opt => (
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
