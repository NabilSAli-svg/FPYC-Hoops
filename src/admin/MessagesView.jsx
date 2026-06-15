import { useState, useEffect } from 'react';
import { Card, Button, Icon, Display, Pill, Avatar, EmptyState, Skeleton } from '../shared/index.js';
import { useMessages, usePlayers, TEAM_INFO } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';

const NOTIFICATIONS = [
  { id: 'n1', type: 'warning', icon: 'alert-triangle', title: 'Waiver missing', body: 'Ethan Park (P) is missing a signed waiver. Game day eligibility at risk.', time: '1h ago', read: false },
  { id: 'n2', type: 'info',    icon: 'calendar',       title: 'Game reminder',  body: 'Sat, Dec 7 vs. Vienna Storm at Robinson Secondary · Gym B — 4 days away.', time: '3h ago', read: false },
  { id: 'n3', type: 'success', icon: 'check-circle-2', title: 'RSVP update',    body: '11 of 12 players confirmed for Dec 7 game. 1 pending (Ethan Park).', time: '5h ago', read: true },
  { id: 'n4', type: 'info',    icon: 'users',           title: 'New registration', body: 'A new player Ethan Park has been added to your roster pending approval.', time: 'Yesterday', read: true },
  { id: 'n5', type: 'warning', icon: 'clock',           title: 'Registration deadline', body: 'Late fees begin November 15 — 3 days away. 1 player still pending.', time: '2 days ago', read: true },
];

const NOTIF_COLORS = {
  warning: { color: 'var(--status-warning)', bg: 'rgba(224,168,0,0.08)' },
  info:    { color: 'var(--status-info)',    bg: 'rgba(42,111,219,0.08)' },
  success: { color: 'var(--status-win)',     bg: 'rgba(31,138,91,0.08)' },
};

export default function MessagesView({ autoCompose = false, onAutoComposeUsed }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const [messages, setMessages] = useMessages();
  const [players] = usePlayers();
  const [tab, setTab] = useState('inbox');
  const sorted = [...messages].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  const [selected, setSelected] = useState(null);
  const [showCompose, setShowCompose] = useState(autoCompose);
  const [composeChannel, setComposeChannel] = useState('email');
  const [sentToast, setSentToast] = useState('');
  const [sending, setSending] = useState(false);

  function handleCloseCompose() {
    setShowCompose(false);
    onAutoComposeUsed?.();
  }

  async function handleSend(subject, body, channel, recipients) {
    setSending(true);
    try {
      let result;
      if (channel === 'email') {
        const { data, error } = await supabase.functions.invoke('send-email', {
          body: { to: recipients, subject: subject || '(No subject)', text: body },
        });
        result = { data, error };
      } else {
        const { data, error } = await supabase.functions.invoke('send-sms', {
          body: { to: recipients, body },
        });
        result = { data, error };
      }

      if (result.error || result.data?.error) {
        const detail = result.error?.message || JSON.stringify(result.data?.error);
        setSentToast(`Failed to send: ${detail}`);
      } else {
        setMessages(ms => [{
          id: 'm' + Date.now(),
          from: TEAM_INFO.coach,
          time: 'Just now',
          unread: true,
          target: TEAM_INFO.name,
          subject: subject || '(No subject)',
          body: body || '',
        }, ...ms]);
        setSentToast(channel === 'email'
          ? `Email sent to ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}!`
          : `Text sent to ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}!`);
        handleCloseCompose();
      }
    } catch (err) {
      setSentToast(`Failed to send: ${err.message}`);
    } finally {
      setSending(false);
      setTimeout(() => setSentToast(''), 4000);
    }
  }

  const thread = sorted.find(t => t.id === selected) || sorted[0];

  if (loading) return <MessagesSkeleton tab={tab} setTab={setTab} />;
  return (
    <div className="skel-content" style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 130px)', minHeight: 600 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'inbox',    label: 'Sent messages' },
            { id: 'notifications', label: 'Alerts',   icon: 'bell', count: NOTIFICATIONS.filter(n => !n.read).length },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'var(--court-navy)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', gap: 6, position: 'relative',
            }}>
              {t.label}
              {t.count > 0 && <span style={{ background: 'var(--basketball-orange)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '1px 6px' }}>{t.count}</span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" size="sm" icon="mail" onClick={() => { setComposeChannel('email'); setShowCompose(true); }}>Email team</Button>
          <Button kind="gold" size="sm" icon="message-circle" onClick={() => { setComposeChannel('text'); setShowCompose(true); }}>Text team</Button>
        </div>
      </div>

      {tab === 'notifications' ? (
        <NotificationsPanel />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, flex: 1, minHeight: 0 }}>
          {/* Message list */}
          <Card padding={0} style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {sorted.length === 0 && (
              <EmptyState icon="mail" title="No messages" message="Messages you send to families will appear here." />
            )}
            {sorted.map((t, i) => (
              <button key={t.id} onClick={() => setSelected(t.id)} style={{
                display: 'block', textAlign: 'left', width: '100%',
                padding: '14px 16px', border: 'none', cursor: 'pointer',
                borderLeft: `3px solid ${thread?.id === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
                background: thread?.id === t.id ? 'rgba(255,199,44,0.08)' : '#fff',
                borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Avatar name={t.from} size={34} color="var(--court-navy)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--court-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.from}</span>
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)', flexShrink: 0 }}>{t.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.body}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' }}>{t.target}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </Card>

          {/* Message detail */}
          {thread && (
            <Card style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <Display size={20}>{thread.subject}</Display>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, color: 'var(--fg-soft)' }}>
                    <Avatar name={thread.from} size={22} color="var(--court-navy)" />
                    <span>{thread.from}</span>
                    <span>·</span>
                    <span>To: {thread.target}</span>
                    <span>·</span>
                    <span>{thread.time}</span>
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--bone)', borderRadius: 8, padding: '20px 24px', fontSize: 14, lineHeight: 1.7, color: 'var(--fg)', whiteSpace: 'pre-wrap' }}>
                {thread.body}
              </div>
            </Card>
          )}
        </div>
      )}

      {showCompose && <ComposeModal channel={composeChannel} players={players} sending={sending} onClose={handleCloseCompose} onSend={handleSend} />}

      {sentToast && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'var(--court-navy)', color: '#fff', padding: '12px 24px', borderRadius: 999, fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 300 }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> {sentToast}
        </div>
      )}
    </div>
  );
}

function NotificationsPanel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ fontSize: 13, color: 'var(--fg-soft)' }}>{NOTIFICATIONS.filter(n => !n.read).length} unread alerts</div>
        <Button kind="quiet" size="sm">Mark all read</Button>
      </div>
      {NOTIFICATIONS.map(n => {
        const nc = NOTIF_COLORS[n.type];
        return (
          <div key={n.id} style={{ display: 'flex', gap: 14, padding: '14px 18px', background: n.read ? '#fff' : nc.bg, border: `1px solid ${n.read ? 'var(--border)' : nc.color}30`, borderRadius: 8 }}>
            <Icon name={n.icon} size={20} color={nc.color} style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 3, lineHeight: 1.5 }}>{n.body}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', flexShrink: 0 }}>{n.time}</div>
          </div>
        );
      })}
    </div>
  );
}

function ComposeModal({ channel, players, sending, onClose, onSend }) {
  const isEmail = channel === 'email';
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState([]);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 560, boxShadow: 'var(--shadow-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name={isEmail ? 'mail' : 'message-circle'} size={20} color={isEmail ? 'var(--court-navy)' : 'var(--basketball-orange)'} />
            <Display size={22}>New {isEmail ? 'email' : 'text message'}</Display>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <RecipientField channel={channel} players={players} onChange={setRecipients} />
          {isEmail && <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</div>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject line…" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: 'var(--bone)', boxSizing: 'border-box' }} />
          </div>}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</div>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder={isEmail ? 'Write your email…' : 'Write your SMS (160 chars per segment)…'} style={{ width: '100%', minHeight: isEmail ? 160 : 100, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, resize: 'vertical', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box', lineHeight: 1.6 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button kind="ghost" onClick={onClose}>Cancel</Button>
          <Button kind={isEmail ? 'primary' : 'gold'} icon="send" onClick={() => onSend(subject, body, channel, recipients)} disabled={!body.trim() || recipients.length === 0 || sending}>
            {sending ? 'Sending…' : `Send ${isEmail ? 'email' : 'text'} (${recipients.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessagesSkeleton({ tab, setTab }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 130px)', minHeight: 600 }}>
      {/* Toolbar — shown as-is */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'inbox',         label: 'Sent messages' },
            { id: 'notifications', label: 'Alerts',     icon: 'bell', count: NOTIFICATIONS.filter(n => !n.read).length },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: tab === t.id ? 'var(--court-navy)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              {t.label}
              {t.count > 0 && <span style={{ background: 'var(--basketball-orange)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '1px 6px' }}>{t.count}</span>}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" size="sm" icon="mail">Email team</Button>
          <Button kind="gold" size="sm" icon="message-circle">Text team</Button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16 }}>
        {/* Left: thread list skeleton */}
        <Card padding={0}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Skeleton width={34} height={34} style={{ borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Skeleton width="60%" height={13} style={{ marginBottom: 6 }} />
                <Skeleton width="85%" height={12} style={{ marginBottom: 5 }} />
                <Skeleton width="70%" height={11} />
              </div>
            </div>
          ))}
        </Card>

        {/* Right: empty state skeleton */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton width={48} height={48} style={{ borderRadius: '50%', margin: '64px auto 16px' }} />
          <Skeleton width={180} height={16} style={{ margin: '0 auto 8px' }} />
          <Skeleton width={120} height={13} style={{ margin: '0 auto' }} />
        </Card>
      </div>
    </div>
  );
}

function RecipientField({ channel, players, onChange }) {
  const teamPlayers = players.filter(p => p.team === TEAM_INFO.name);
  const activePlayers = teamPlayers.filter(p => p.status === 'active');

  const field = channel === 'email' ? 'guardian' : 'phone';
  const valueOf = p => (p[field] || '').trim();

  const groups = [
    { id: 'team', label: `Entire team (${teamPlayers.length})`, players: teamPlayers },
    { id: 'active', label: `Active players only (${activePlayers.length})`, players: activePlayers },
  ];

  const [selectedId, setSelectedId] = useState('team');

  useEffect(() => {
    const group = groups.find(g => g.id === selectedId) || groups[0];
    const recipients = [...new Set(group.players.map(valueOf).filter(Boolean))];
    onChange(recipients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, players, channel]);

  const recipientCount = (groups.find(g => g.id === selectedId) || groups[0]).players.filter(p => valueOf(p)).length;
  const totalCount = (groups.find(g => g.id === selectedId) || groups[0]).players.length;
  const missing = totalCount - recipientCount;

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>To</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {groups.map(g => (
          <button key={g.id} onClick={() => setSelectedId(g.id)} style={{
            padding: '7px 12px', borderRadius: 999, border: '1px solid var(--border)', cursor: 'pointer',
            background: selectedId === g.id ? 'var(--court-navy)' : 'var(--bone)', color: selectedId === g.id ? '#fff' : 'var(--fg)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
          }}>{g.label}</button>
        ))}
      </div>
      {missing > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--status-warning)' }}>
          {missing} guardian{missing === 1 ? '' : 's'} missing a {channel === 'email' ? 'email address' : 'phone number'} and won't receive this message.
        </div>
      )}
    </div>
  );
}
