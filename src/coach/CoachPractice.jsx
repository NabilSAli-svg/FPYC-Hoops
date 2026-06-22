import { useState, useEffect, useCallback } from 'react';
import { usePractices, usePlayers } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';
import Icon from '../shared/Icon.jsx';

const TYPE_COLOR = {
  Regular:      { bg: 'rgba(10,31,61,0.08)',   text: 'var(--court-navy)' },
  Scrimmage:    { bg: 'rgba(255,199,44,0.15)',  text: '#92660A' },
  Conditioning: { bg: 'rgba(232,119,34,0.12)',  text: '#B45309' },
};

export default function CoachPractice({ team }) {
  const [practices] = usePractices();
  const [players]   = usePlayers();
  const [selected, setSelected] = useState(null);

  const roster        = players.filter(p => p.team === team.name && p.status === 'active');
  const teamPractices = practices.filter(p => !p.team || p.team === team.name);
  const practice      = teamPractices.find(p => p.id === selected);

  if (selected && practice) {
    return (
      <PracticeDetail
        practice={practice}
        roster={roster}
        teamId={team._teamId || team.id}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--court-navy)', lineHeight: 1, marginBottom: 4 }}>Practice Schedule</div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>{teamPractices.length} sessions · {team.name}</div>
      </div>

      {teamPractices.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
          <Icon name="clipboard-list" size={36} color="#E2E5EA" />
          <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginTop: 12 }}>No practices scheduled yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>The commissioner will add sessions here.</div>
        </div>
      )}

      {teamPractices.map(p => (
        <PracticeCard
          key={p.id}
          practice={p}
          roster={roster}
          teamId={team._teamId || team.id}
          onSelect={() => setSelected(p.id)}
        />
      ))}
    </div>
  );
}

function PracticeCard({ practice: p, roster, teamId, onSelect }) {
  const [presentCount, setPresentCount] = useState(0);

  useEffect(() => {
    supabase
      .from('practice_attendance')
      .select('player_id')
      .eq('practice_id', p.id)
      .eq('team_id', teamId)
      .eq('present', true)
      .then(({ data }) => { if (data) setPresentCount(data.length); });
  }, [p.id, teamId]);

  const taken = presentCount > 0;
  const typeStyle = TYPE_COLOR[p.type] || TYPE_COLOR.Regular;

  return (
    <button
      onClick={onSelect}
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
              {presentCount}/{roster.length}
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
}

function PracticeDetail({ practice, roster, teamId, onBack }) {
  const [attendance, setAttendance] = useState({}); // { playerId: boolean }
  const [notes, setNotes] = useState('');
  const [loadingAtt, setLoadingAtt] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);

  // Load attendance + notes from Supabase
  useEffect(() => {
    setLoadingAtt(true);
    Promise.all([
      supabase.from('practice_attendance').select('player_id, present').eq('practice_id', practice.id).eq('team_id', teamId),
      supabase.from('practice_notes').select('notes').eq('practice_id', practice.id).single(),
    ]).then(([{ data: attData }, { data: noteData }]) => {
      if (attData) {
        const map = {};
        attData.forEach(r => { map[r.player_id] = r.present; });
        setAttendance(map);
      }
      if (noteData?.notes) setNotes(noteData.notes);
      setLoadingAtt(false);
    });
  }, [practice.id, teamId]);

  const toggleAttendance = useCallback(async (playerId) => {
    const newVal = !attendance[playerId];
    setAttendance(prev => ({ ...prev, [playerId]: newVal }));
    await supabase.from('practice_attendance').upsert({
      practice_id: practice.id,
      player_id: playerId,
      team_id: teamId,
      present: newVal,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'practice_id,player_id' });
  }, [attendance, practice.id, teamId]);

  async function saveNotes() {
    setSavingNote(true);
    await supabase.from('practice_notes').upsert({
      practice_id: practice.id,
      team_id: teamId,
      notes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'practice_id' });
    setSavingNote(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <button
          onClick={onBack}
          style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, fontWeight: 600, marginBottom: 14 }}
        >
          <Icon name="arrow-left" size={14} color="#6B7280" /> Back to schedule
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--court-navy)', lineHeight: 1, marginBottom: 6 }}>Attendance</div>
        <div style={{ fontSize: 13, color: '#6B7280' }}>{practice.date} · {practice.time}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF' }}>{practice.gym}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <StatCard label="Present" value={presentCount}              color="var(--court-navy)" />
        <StatCard label="Absent"  value={roster.length - presentCount} color="#DC2626" />
        <StatCard label="Roster"  value={roster.length}             color="#6B7280" />
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #F3F4F6' }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>
            {loadingAtt ? 'Loading…' : 'Tap to mark attendance'}
          </div>
        </div>
        {roster.map((p, i) => {
          const present = !!attendance[p.id];
          return (
            <button
              key={p.id}
              onClick={() => toggleAttendance(p.id)}
              disabled={loadingAtt}
              style={{
                all: 'unset', cursor: loadingAtt ? 'default' : 'pointer',
                width: '100%', boxSizing: 'border-box',
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

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 12 }}>Practice Notes</div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
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
          onClick={saveNotes}
          disabled={savingNote}
          style={{
            marginTop: 10, padding: '10px 20px', borderRadius: 8, border: 'none',
            background: noteSaved ? '#059669' : 'var(--court-navy)', color: '#fff',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            cursor: savingNote ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 7, transition: 'background 300ms',
          }}
        >
          <Icon name={noteSaved ? 'check' : 'save'} size={14} color="#fff" />
          {savingNote ? 'Saving…' : noteSaved ? 'Saved!' : 'Save notes'}
        </button>
      </div>
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
