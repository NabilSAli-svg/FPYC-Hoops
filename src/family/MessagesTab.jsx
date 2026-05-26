import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { MESSAGES } from './data.js';

export default function MessagesTab({ readIds = new Set(), onMarkRead }) {
  const [open, setOpen] = useState(null);
  const messages = MESSAGES.map(m => ({ ...m, unread: m.unread && !readIds.has(m.id) }));

  if (open) return <ThreadView msg={open} onBack={() => setOpen(null)} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
        From your coaching staff
      </div>
      {messages.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="inbox" size={24} color="#9CA3AF" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>No messages yet</div>
          <div style={{ fontSize: 13, color: '#9CA3AF', maxWidth: 260, lineHeight: 1.5 }}>Your coaching staff hasn't sent any messages yet. Check back closer to the season.</div>
        </div>
      )}
      {messages.map((m, i) => (
        <button key={m.id} onClick={() => { setOpen(m); if (m.unread) onMarkRead(m.id); }} style={{
          all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
          background: m.unread ? '#fff' : '#FAFAFA',
          border: '1px solid #E2E5EA',
          borderRadius: 12, padding: '14px 16px', marginBottom: 8,
          display: 'flex', gap: 12, alignItems: 'flex-start',
          borderLeft: m.unread ? '4px solid var(--varsity-gold)' : '4px solid transparent',
        }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--varsity-gold)' }}>
            {m.from[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <div style={{ fontWeight: m.unread ? 800 : 600, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.from}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
                {m.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--basketball-orange)', display: 'inline-block' }} />}
                {m.time}
              </div>
            </div>
            <div style={{ fontWeight: m.unread ? 700 : 500, fontSize: 14, color: m.unread ? '#111827' : '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{m.subject}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.body.split('\n')[0]}
            </div>
          </div>
        </button>
      ))}

      <div style={{ textAlign: 'center', marginTop: 8, padding: '12px', fontSize: 12, color: '#9CA3AF' }}>
        Messages are read-only. Reply by contacting your coach directly.
      </div>
    </div>
  );
}

function ThreadView({ msg, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Back button */}
      <button onClick={onBack} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: 'var(--court-navy)', marginBottom: 16 }}>
        <Icon name="arrow-left" size={16} /> Back to messages
      </button>

      {/* Thread header */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--varsity-gold)', flexShrink: 0 }}>
            {msg.from[0]}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{msg.from}</div>
            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{msg.time}</div>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 17, color: '#111827', marginBottom: 14, lineHeight: 1.3 }}>{msg.subject}</div>
        <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{msg.body}</div>
      </div>

      {/* Reply nudge */}
      <div style={{ background: 'rgba(255,199,44,0.08)', border: '1px solid rgba(255,199,44,0.25)', borderRadius: 10, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <Icon name="info" size={16} color="var(--basketball-orange)" />
        <div style={{ fontSize: 13, color: '#374151' }}>
          To reply, contact coach directly at <strong>coach.davis@fpycsports.org</strong>
        </div>
      </div>
    </div>
  );
}
