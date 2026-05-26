import { useState } from 'react';
import { Card, Button, Icon, Display, Pill, Avatar, EmptyState } from '../shared/index.js';

const THREADS = [
  {
    id: 't1', channel: 'email', unread: true, from: 'Commissioner Patel', avatar: 'CP',
    subject: 'Late fees begin November 15',
    preview: 'Reminder for all coaches: please confirm your roster by Nov 14...',
    time: '2h ago', tag: 'league',
    body: `Dear Coaches,\n\nThis is a reminder that late registration fees of $45 will begin on November 15th. Please ensure all your roster players have completed registration by November 14th.\n\nIf any players are having financial difficulties, please have them reach out to the Commissioner's office directly — scholarships are available.\n\nThank you for your continued service as volunteer coaches.\n\nCommissioner Patel\nFPYC Basketball`,
  },
  {
    id: 't2', channel: 'text', unread: true, from: "A. Reeves (Jordan's parent)", avatar: 'AR',
    subject: 'Dec 7 game - Jordan absent',
    preview: 'Hi Coach, Jordan will be late to the Dec 7 game...',
    time: '4h ago', tag: 'parent',
    body: `Hi Coach Davis,\n\nJust wanted to give you a heads up — Jordan will be arriving about 20 minutes late to the Dec 7 game due to a prior commitment. He should be there by 10:20 AM.\n\nThanks for understanding!\n\nA. Reeves`,
  },
  {
    id: 't3', channel: 'email', unread: false, from: 'Skills Clinic', avatar: 'SC',
    subject: 'Clinic moved to Robinson HS Gym B',
    preview: 'Due to a scheduling conflict at Lanier MS...',
    time: 'Yesterday', tag: 'league',
    body: `Coaches,\n\nDue to a scheduling conflict at Lanier MS, this Saturday's K–2 skills clinic will be held at Robinson Secondary School, Gym B from 9:00–10:30 AM.\n\nPlease update any families who may have already communicated the original location.\n\nSkills Clinic Coordinator`,
  },
  {
    id: 't4', channel: 'text', unread: false, from: "L. Chen (Maya's parent)", avatar: 'LC',
    subject: 'Uniform question',
    preview: 'Should Maya bring both jersey colors to practice?',
    time: 'Mon', tag: 'parent',
    body: `Hi Coach! Quick question — should Maya bring both the navy and white jerseys to Saturday's game, or just one? And which color will you be wearing?\n\nThanks!\nL. Chen`,
  },
  {
    id: 't5', channel: 'email', unread: false, from: 'Director\'s Office', avatar: 'DO',
    subject: 'Volunteers needed — scorekeeping Dec 7–8',
    preview: 'We are in need of volunteers for scorekeeping...',
    time: 'Mon', tag: 'league',
    body: `All Coaches,\n\nWe need volunteers for scorekeeping duties on the Dec 7–8 weekend. If you or a team parent can help, please reply to this email. One game of scorekeeping = one volunteer credit toward next season's fee reduction.\n\nThank you,\nFPYC Director's Office`,
  },
];

const NOTIFICATIONS = [
  { id: 'n1', type: 'warning', icon: 'alert-triangle', title: 'Waiver missing', body: 'Ethan Park (P) is missing a signed waiver. Game day eligibility at risk.', time: '1h ago', read: false },
  { id: 'n2', type: 'info',    icon: 'calendar',       title: 'Game reminder',  body: 'Sat, Dec 7 vs. Vienna Storm at Robinson Secondary · Gym B — 4 days away.', time: '3h ago', read: false },
  { id: 'n3', type: 'success', icon: 'check-circle-2', title: 'RSVP update',    body: '11 of 12 players confirmed for Dec 7 game. 1 pending (Ethan Park).', time: '5h ago', read: true },
  { id: 'n4', type: 'info',    icon: 'users',           title: 'New registration', body: 'A new player Ethan Park has been added to your roster pending approval.', time: 'Yesterday', read: true },
  { id: 'n5', type: 'warning', icon: 'clock',           title: 'Registration deadline', body: 'Late fees begin November 15 — 3 days away. 1 player still pending.', time: '2 days ago', read: true },
];

const TAG_COLORS = {
  league: { bg: 'rgba(10,31,61,0.08)', color: 'var(--court-navy)' },
  parent: { bg: 'rgba(255,199,44,0.15)', color: '#8a6500' },
};

const NOTIF_COLORS = {
  warning: { color: 'var(--status-warning)', bg: 'rgba(224,168,0,0.08)' },
  info:    { color: 'var(--status-info)',    bg: 'rgba(42,111,219,0.08)' },
  success: { color: 'var(--status-win)',     bg: 'rgba(31,138,91,0.08)' },
};

export default function MessagesView({ autoCompose = false, onAutoComposeUsed }) {
  const [tab, setTab] = useState('inbox');
  const [selected, setSelected] = useState(THREADS[0].id);
  const [showCompose, setShowCompose] = useState(autoCompose);
  const [composeChannel, setComposeChannel] = useState('email');

  function handleCloseCompose() {
    setShowCompose(false);
    onAutoComposeUsed?.();
  }

  const thread = THREADS.find(t => t.id === selected);
  const filtered = tab === 'inbox' ? THREADS : THREADS.filter(t => t.channel === tab);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: 'calc(100vh - 130px)', minHeight: 600 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'inbox',    label: 'All',           count: THREADS.filter(t => t.unread).length },
            { id: 'email',    label: 'Email',         icon: 'mail' },
            { id: 'text',     label: 'Text / SMS',    icon: 'message-circle' },
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
          {/* Thread list */}
          <Card padding={0} style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {filtered.length === 0 && (
              <EmptyState icon="mail" title="No messages" message="Your inbox is empty for this filter." />
            )}
            {filtered.map((t, i) => (
              <button key={t.id} onClick={() => setSelected(t.id)} style={{
                display: 'block', textAlign: 'left', width: '100%',
                padding: '14px 16px', border: 'none', cursor: 'pointer',
                borderLeft: `3px solid ${selected === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
                background: selected === t.id ? 'rgba(255,199,44,0.08)' : t.unread ? 'rgba(10,31,61,0.03)' : '#fff',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Avatar name={t.avatar} size={34} color={t.channel === 'text' ? 'var(--basketball-orange)' : 'var(--court-navy)'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4, marginBottom: 2 }}>
                      <span style={{ fontWeight: t.unread ? 700 : 500, fontSize: 13, color: 'var(--court-navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.from}</span>
                      <span style={{ fontSize: 11, color: 'var(--fg-muted)', flexShrink: 0 }}>{t.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <Icon name={t.channel === 'email' ? 'mail' : 'message-circle'} size={11} color="var(--fg-muted)" />
                      <span style={{ fontWeight: t.unread ? 700 : 500, fontSize: 12, color: 'var(--fg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</span>
                      {t.unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--basketball-orange)', flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.preview}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.08em', ...TAG_COLORS[t.tag] }}>{t.tag}</span>
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
                    <Avatar name={thread.avatar} size={22} color={thread.channel === 'text' ? 'var(--basketball-orange)' : 'var(--court-navy)'} />
                    <span>{thread.from}</span>
                    <span>·</span>
                    <Icon name={thread.channel === 'email' ? 'mail' : 'message-circle'} size={13} />
                    <span style={{ textTransform: 'capitalize' }}>{thread.channel}</span>
                    <span>·</span>
                    <span>{thread.time}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button kind="ghost" size="sm" icon="reply">Reply</Button>
                  <Button kind="ghost" size="sm" icon="forward">Forward</Button>
                  <Button kind="ghost" size="sm" icon="archive">Archive</Button>
                </div>
              </div>
              <div style={{ background: 'var(--bone)', borderRadius: 8, padding: '20px 24px', fontSize: 14, lineHeight: 1.7, color: 'var(--fg)', whiteSpace: 'pre-wrap', fontFamily: thread.channel === 'text' ? 'var(--font-body)' : 'inherit' }}>
                {thread.body}
              </div>
              {/* Quick reply */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <textarea placeholder={`Reply via ${thread.channel}…`} style={{ width: '100%', minHeight: 80, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, resize: 'vertical', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <Button kind={thread.channel === 'email' ? 'primary' : 'gold'} icon="send">Send {thread.channel === 'email' ? 'email' : 'text'}</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {showCompose && <ComposeModal channel={composeChannel} onClose={handleCloseCompose} />}
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

function ComposeModal({ channel, onClose }) {
  const isEmail = channel === 'email';
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
          <RecipientField />
          {isEmail && <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Subject</div>
            <input placeholder="Subject line…" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: 'var(--bone)', boxSizing: 'border-box' }} />
          </div>}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Message</div>
            <textarea placeholder={isEmail ? 'Write your email…' : 'Write your SMS (160 chars per segment)…'} style={{ width: '100%', minHeight: isEmail ? 160 : 100, padding: '12px', borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'var(--font-body)', fontSize: 14, resize: 'vertical', outline: 'none', background: 'var(--bone)', boxSizing: 'border-box', lineHeight: 1.6 }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button kind="ghost" onClick={onClose}>Cancel</Button>
          <Button kind={isEmail ? 'primary' : 'gold'} icon="send">Send {isEmail ? 'email' : 'text'}</Button>
        </div>
      </div>
    </div>
  );
}

function RecipientField() {
  const options = ['Entire team (12)', 'Parents only', 'Active players only', 'Custom…'];
  const [val, setVal] = useState('Entire team (12)');
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-soft)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>To</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o} onClick={() => setVal(o)} style={{
            padding: '7px 12px', borderRadius: 999, border: '1px solid var(--border)', cursor: 'pointer',
            background: val === o ? 'var(--court-navy)' : 'var(--bone)', color: val === o ? '#fff' : 'var(--fg)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}
