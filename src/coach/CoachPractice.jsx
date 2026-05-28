import { useState } from 'react';
import { usePractices, usePlayers } from '../shared/store.js';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import Icon from '../shared/Icon.jsx';

const TEAM = 'Fairfax Hawks';

const TYPE_COLOR = {
  Regular:      { bg: 'rgba(10,31,61,0.08)',   text: 'var(--court-navy)' },
  Scrimmage:    { bg: 'rgba(255,199,44,0.15)',  text: '#92660A' },
  Conditioning: { bg: 'rgba(232,119,34,0.12)',  text: '#B45309' },
};

export default function CoachPractice() {
  const [practices] = usePractices();
  const [players]   = usePlayers();
  const [attendance, setAttendance] = useLocalStorage('fpyc-attendance', {});
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const roster = players.filter(p => p.team === TEAM && p.status === 'active');
  const practice = practices.find(p => p.id === selected);

  function toggleAttendance(practiceId, playerId) {
    setAttendance(prev => {
      const key = `${practiceId}-${playerId}`;
      return { ...prev, [key]: !prev[key] };
    });
  }

  function isPresent(practiceId, playerId) {
    return !!attendance[`${practiceId}-${playerId}`];
  }

  function countPresent(practiceId) {
    return roster.filter(p => isPresent(practiceId, p.id)).length;
  }

  function saveNote() {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  if (selected && practice) {
    const presentCount = countPresent(practice.id);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Header */}
        <div>
          <button
            onClick={() => setSelected(null)}
            style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, fontWeight: 600, marginBottom: 14 }}
          >
            <Icon name="arrow-left" size={14} color="#6B7280" /> Back to schedule
          </button>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--court-navy)', lineHeight: 1, marginBottom: 6 }}>
            Attendance
          </div>
          <div style={{ fontSize: 13, color: '#6B7280' }}>{practice.date} · {practice.time}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{practice.gym}</div>
        </div>

        {/* Attendance summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <StatCard label="Present" value={presentCount} color="var(--court-navy)" />
          <StatCard label="Absent"  value={roster.length - presentCount} color="#DC2626" />
          <StatCard label="Roster"  value={roster.length} color="#6B7280" />
        </div>

        {/* Player list */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>
              Tap to mark attendance
            </div>
          </div>
          {roster.map((p, i) => {
            const present = isPresent(practice.id, p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleAttendance(practice.id, p.id)}
                style={{
                  all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
                  borderBottom: i < roster.length - 1 ? '1px solid #F9FAFB' : 'none',
                  background: present ? 'rgba(5,150,105,0.05)' : 'transparent',
                  transition: 'background 150ms',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                  background: present ? '#059669' : '#F4F5F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 150ms',
                }}>
                  {present
                    ? <Icon name="check" size={16} color="#fff" />
                    : <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: '#9CA3AF' }}>#{p.number}</span>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: present ? '#059669' : '#111' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.position} · {p.grade}</div>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 999,
                  background: present ? 'rgba(5,150,105,0.12)' : 'rgba(107,114,128,0.10)',
                  color: present ? '#059669' : '#9CA3AF',
                }}>
                  {present ? 'Present' : 'Absent'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Coach notes */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 12 }}>Practice Notes</div>
          <textarea
            value={note || practice.notes || ''}
            onChange={e => setNote(e.target.value)}
            placeholder="Focus areas, drill notes, player reminders…"
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 14px',
              borderRadius: 8, border: '1.5px solid #E2E5EA',
              fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', lineHeight: 1.5,
              resize: 'none', outline: 'none',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
            onBlur={e => e.target.style.borderColor = '#E2E5EA'}
          />
          <button
            onClick={saveNote}
            style={{
              marginTop: 10, padding: '10px 20px', borderRadius: 8, border: 'none',
              background: noteSaved ? '#059669' : 'var(--court-navy)', color: '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7, transition: 'background 300ms',
            }}
          >
            <Icon name={noteSaved ? 'check' : 'save'} size={14} color="#fff" />
            {noteSaved ? 'Saved!' : 'Save notes'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--court-navy)', lineHeight: 1, marginBottom: 4 }}>Practice Schedule</div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>{practices.length} sessions · Fairfax Hawks</div>
      </div>

      {practices.map(p => {
        const present = countPresent(p.id);
        const taken = present > 0;
        const typeStyle = TYPE_COLOR[p.type] || TYPE_COLOR.Regular;
        return (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            style={{
              all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14,
              padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0, background: '#F4F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="clipboard-list" size={20} color={taken ? '#059669' : '#9CA3AF'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{p.date}</span>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, ...typeStyle }}>{p.type}</span>
                {taken && (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, background: 'rgba(5,150,105,0.10)', color: '#059669' }}>
                    {present}/{roster.length}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', gap: 12 }}>
                <span>{p.time}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.gym}</span>
              </div>
              {p.notes && (
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.notes}</div>
              )}
            </div>
            <Icon name="chevron-right" size={16} color="#D1D5DB" />
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
    </div>
  );
}
