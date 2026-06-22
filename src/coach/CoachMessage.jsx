import { useState } from 'react';
import { useMessages, usePlayers } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';

const TEMPLATES = [
  { label: 'Game reminder',   text: 'Reminder: game this Saturday at {time} vs {opponent}. Please arrive 30 min early for warm-ups. Wear {jerseyColor} jerseys.' },
  { label: 'Practice update', text: 'Practice this {day} is confirmed at {gym}, starting at 6:00 PM sharp. Bring water and sneakers.' },
  { label: 'Good game!',      text: 'Great effort today! Proud of the team\'s hustle out there. Next up: {opponent} on {date}.' },
  { label: 'Weather delay',   text: 'Important: {event} is delayed/rescheduled due to weather. Updated info to follow shortly.' },
];

export default function CoachMessage({ team }) {
  const [messages, setMessages] = useMessages();
  const [players] = usePlayers();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [view, setView] = useState('compose'); // 'compose' | 'history'

  const roster = players.filter(p => p.team === team.name && p.status === 'active');
  const sent_msgs = messages.filter(m => m.target === team.name);

  function applyTemplate(text) {
    setBody(text);
  }

  function handleSend() {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    const newMsg = {
      id: `m${Date.now()}`,
      from: team.coach,
      target: team.name,
      time: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      unread: true,
      subject: subject.trim(),
      body: body.trim(),
    };
    setMessages(prev => [newMsg, ...prev]);
    setSending(false);
    setSent(true);
    setSubject('');
    setBody('');
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Toggle */}
      <div style={{ display: 'flex', background: '#F4F5F7', borderRadius: 10, padding: 3, gap: 2 }}>
        {[{ id: 'compose', label: 'Compose' }, { id: 'history', label: 'Sent' }].map(t => (
          <button
            key={t.id}
            onClick={() => setView(t.id)}
            style={{
              flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: view === t.id ? '#fff' : 'transparent',
              boxShadow: view === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              fontFamily: 'var(--font-body)', fontWeight: view === t.id ? 700 : 600,
              fontSize: 13, color: view === t.id ? 'var(--court-navy)' : '#6B7280',
              transition: 'all 160ms',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'compose' && (
        <>
          {/* Recipients */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 10 }}>
              To: All Families ({roster.length} players)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {roster.map(p => (
                <span key={p.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px',
                  borderRadius: 999, background: '#F4F5F7', border: '1px solid #E5E7EB',
                  fontSize: 11, fontWeight: 600, color: '#374151',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--court-navy)' }}>#{p.number}</span>
                  {p.name.split(' ')[1] ?? p.name}
                </span>
              ))}
            </div>
          </div>

          {/* Templates */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '14px 18px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 10 }}>Quick Templates</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={() => applyTemplate(t.text)}
                  style={{
                    padding: '7px 13px', borderRadius: 8, border: '1px solid #E2E5EA',
                    background: '#F9FAFB', cursor: 'pointer',
                    fontSize: 12, fontWeight: 600, color: '#374151',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compose form */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 8 }}>Subject</div>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Message subject…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px', borderRadius: 8, border: '1.5px solid #E2E5EA',
                  fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                onBlur={e => e.target.style.borderColor = '#E2E5EA'}
              />
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 8 }}>Message</div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={`Type your message to all ${team.name} families…`}
                rows={6}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 14px', borderRadius: 8, border: '1.5px solid #E2E5EA',
                  fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', lineHeight: 1.55,
                  resize: 'none', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
                onBlur={e => e.target.style.borderColor = '#E2E5EA'}
              />
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6, textAlign: 'right' }}>
                {body.length} characters
              </div>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={!subject.trim() || !body.trim() || sending}
            style={{
              width: '100%', padding: '15px', borderRadius: 10, border: 'none',
              background: sent ? '#059669' : (!subject.trim() || !body.trim() || sending) ? '#E2E5EA' : 'var(--court-navy)',
              color: (!subject.trim() || !body.trim()) ? '#9CA3AF' : '#fff',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              cursor: (!subject.trim() || !body.trim() || sending) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 300ms',
            }}
          >
            {sending ? (
              <><Spinner />Sending to {roster.length} families…</>
            ) : sent ? (
              <><Icon name="check" size={16} color="#fff" />Message sent!</>
            ) : (
              <><Icon name="send" size={16} color={subject.trim() && body.trim() ? '#fff' : '#9CA3AF'} />Send to all {team.name} families</>
            )}
          </button>
        </>
      )}

      {view === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sent_msgs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#9CA3AF' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📬</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>No messages sent yet</div>
              <div style={{ fontSize: 13 }}>Messages you send will appear here.</div>
            </div>
          ) : sent_msgs.map(m => (
            <div key={m.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111', flex: 1, paddingRight: 8 }}>{m.subject}</div>
                <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{m.time}</span>
              </div>
              <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {m.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
