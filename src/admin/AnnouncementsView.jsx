import { useState } from 'react';
import { useAnnouncements, TEAMS_INFO } from '../shared/store.js';
import { Button, Icon } from '../shared/index.js';
import { supabase } from '../shared/supabase.js';

const TARGET_OPTIONS = [
  'All families',
  ...Object.keys(TEAMS_INFO),
];

const TYPE_META = {
  info:    { label: 'Info',    color: 'var(--court-navy)', bg: 'rgba(10,31,61,0.06)',   icon: 'info'         },
  general: { label: 'General', color: '#D97706',           bg: 'rgba(217,119,6,0.07)',  icon: 'megaphone'    },
  urgent:  { label: 'Urgent',  color: '#DC2626',           bg: 'rgba(220,38,38,0.06)',  icon: 'alert-circle' },
};

const TODAY = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function makeId() {
  return 'ann-' + Math.random().toString(36).slice(2, 9);
}

function getRecipients(players, target) {
  const active = players.filter(p => p.status !== 'inactive');
  const pool = target === 'All families' ? active : active.filter(p => p.team === target);
  const emails = [...new Set(pool.map(p => p.guardianEmail || p.email).filter(Boolean))];
  const phones = [...new Set(pool.map(p => p.guardianPhone || p.phone).filter(Boolean))];
  return { emails, phones, count: pool.length };
}

export default function AnnouncementsView({ players = [] }) {
  const [announcements, setAnnouncements] = useAnnouncements();
  const [composing, setComposing] = useState(false);
  const [editId, setEditId]       = useState(null);
  const [deleteId, setDeleteId]   = useState(null);
  const [draft, setDraft]         = useState(emptyDraft);
  const [sendEmail, setSendEmail] = useState(false);
  const [sendSms, setSendSms]     = useState(false);
  const [sending, setSending]     = useState(false);
  const [sendResult, setSendResult] = useState(null); // { ok, emailCount, smsCount, error }

  function emptyDraft() {
    return { type: 'info', title: '', body: '', target: 'All families', pinned: false };
  }

  function openNew() {
    setDraft(emptyDraft());
    setEditId(null);
    setSendEmail(false);
    setSendSms(false);
    setSendResult(null);
    setComposing(true);
  }

  function openEdit(a) {
    setDraft({ type: a.type, title: a.title, body: a.body, target: a.target, pinned: a.pinned });
    setEditId(a.id);
    setSendEmail(false);
    setSendSms(false);
    setSendResult(null);
    setComposing(true);
  }

  async function handleSave() {
    if (!draft.title.trim()) return;
    setSending(true);
    setSendResult(null);

    let emailCount = 0;
    let smsCount = 0;
    let errors = [];

    const { emails, phones } = getRecipients(players, draft.target);
    const subject = `[FPYC] ${draft.title}`;
    const text = draft.body ? `${draft.title}\n\n${draft.body}` : draft.title;

    if (sendEmail && emails.length > 0) {
      try {
        const { error } = await supabase.functions.invoke('send-email', {
          body: { to: emails, subject, html: `<p><strong>${draft.title}</strong></p>${draft.body ? `<p>${draft.body.replace(/\n/g, '<br>')}</p>` : ''}` },
        });
        if (error) throw error;
        emailCount = emails.length;
      } catch (e) {
        errors.push(`Email: ${e.message || e}`);
      }
    }

    if (sendSms && phones.length > 0) {
      try {
        const { error } = await supabase.functions.invoke('send-sms', {
          body: { to: phones, body: text },
        });
        if (error) throw error;
        smsCount = phones.length;
      } catch (e) {
        errors.push(`SMS: ${e.message || e}`);
      }
    }

    // Save to feed
    const sent = sendEmail || sendSms;
    if (editId) {
      setAnnouncements(prev => prev.map(a =>
        a.id === editId ? { ...a, ...draft, date: TODAY } : a
      ));
    } else {
      setAnnouncements(prev => [
        { id: makeId(), ...draft, date: TODAY, author: 'Commissioner', emailCount, smsCount },
        ...prev,
      ]);
    }

    setSending(false);
    if (sent) {
      setSendResult({ ok: errors.length === 0, emailCount, smsCount, error: errors.join(' · ') });
    } else {
      setComposing(false);
      setEditId(null);
    }
  }

  function closeSendResult() {
    setSendResult(null);
    setComposing(false);
    setEditId(null);
  }

  function handleDelete(id) {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    setDeleteId(null);
  }

  function togglePin(id) {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));
  }

  const recipients = getRecipients(players, draft.target);
  const pinned   = announcements.filter(a => a.pinned);
  const unpinned = announcements.filter(a => !a.pinned);

  return (
    <div style={{ maxWidth: 740, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
            {announcements.length} announcement{announcements.length !== 1 ? 's' : ''} · families see them in real time
          </div>
        </div>
        <Button kind="gold" icon="plus" onClick={openNew}>New announcement</Button>
      </div>

      {/* Compose / Edit panel */}
      {composing && (
        <div style={{ background: '#fff', border: '1.5px solid var(--court-navy)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ background: 'var(--court-navy)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="edit-3" size={15} color="var(--varsity-gold)" />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
              {editId ? 'Edit announcement' : 'New announcement'}
            </span>
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Type + Target row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <FieldGroup label="Type" style={{ minWidth: 130 }}>
                <select value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value }))} style={selectStyle}>
                  {Object.entries(TYPE_META).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </FieldGroup>
              <FieldGroup label="Audience" style={{ flex: 1, minWidth: 160 }}>
                <select value={draft.target} onChange={e => setDraft(d => ({ ...d, target: e.target.value }))} style={selectStyle}>
                  {TARGET_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FieldGroup>
              <FieldGroup label="" style={{ alignSelf: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--fg)' }}>
                  <input
                    type="checkbox"
                    checked={draft.pinned}
                    onChange={e => setDraft(d => ({ ...d, pinned: e.target.checked }))}
                    style={{ accentColor: 'var(--court-navy)', width: 15, height: 15 }}
                  />
                  Pin to top
                </label>
              </FieldGroup>
            </div>

            {/* Title */}
            <FieldGroup label="Title">
              <input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder="Short, clear subject line"
                style={inputStyle}
                maxLength={80}
              />
            </FieldGroup>

            {/* Body */}
            <FieldGroup label="Message">
              <textarea
                value={draft.body}
                onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
                placeholder="Full announcement details…"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
              />
            </FieldGroup>

            {/* Preview */}
            {draft.title && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Preview</div>
                <AnnouncementCard a={{ ...draft, date: TODAY, author: 'Commissioner' }} preview />
              </div>
            )}

            {/* Send options */}
            {!editId && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Also notify via
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <input type="checkbox" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)}
                      style={{ accentColor: 'var(--court-navy)', width: 15, height: 15 }} />
                    <Icon name="mail" size={14} color={sendEmail ? 'var(--court-navy)' : 'var(--fg-muted)'} />
                    Email
                    {sendEmail && <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 400 }}>({recipients.emails.length} addresses)</span>}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <input type="checkbox" checked={sendSms} onChange={e => setSendSms(e.target.checked)}
                      style={{ accentColor: 'var(--court-navy)', width: 15, height: 15 }} />
                    <Icon name="message-square" size={14} color={sendSms ? 'var(--court-navy)' : 'var(--fg-muted)'} />
                    SMS
                    {sendSms && <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 400 }}>({recipients.phones.length} numbers)</span>}
                  </label>
                  {(sendEmail || sendSms) && recipients.count === 0 && (
                    <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>
                      ⚠ No contact info found for this audience
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Send result */}
            {sendResult && (
              <div style={{
                background: sendResult.ok ? 'rgba(34,197,94,0.08)' : 'rgba(220,38,38,0.06)',
                border: `1px solid ${sendResult.ok ? '#22C55E' : '#DC2626'}55`,
                borderRadius: 8, padding: '10px 14px', fontSize: 13,
                color: sendResult.ok ? '#166534' : '#7F1D1D', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <Icon name={sendResult.ok ? 'check-circle' : 'alert-circle'} size={15} color={sendResult.ok ? '#22C55E' : '#DC2626'} />
                <span style={{ flex: 1 }}>
                  {sendResult.ok
                    ? `Sent! ${sendResult.emailCount > 0 ? `${sendResult.emailCount} email${sendResult.emailCount !== 1 ? 's' : ''}` : ''}${sendResult.emailCount > 0 && sendResult.smsCount > 0 ? ' · ' : ''}${sendResult.smsCount > 0 ? `${sendResult.smsCount} SMS` : ''} delivered.`
                    : `Partially failed: ${sendResult.error}`
                  }
                </span>
                <button onClick={closeSendResult} style={{ all: 'unset', cursor: 'pointer', color: 'var(--fg-muted)', fontSize: 12, fontWeight: 600 }}>Done</button>
              </div>
            )}

            {/* Actions */}
            {!sendResult && (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button onClick={() => setComposing(false)} style={{ ...ghostBtn }}>Cancel</button>
                <Button kind="gold" onClick={handleSave} disabled={!draft.title.trim() || sending}>
                  {sending ? 'Sending…' : editId ? 'Save changes' : (sendEmail || sendSms) ? 'Post & Send' : 'Post announcement'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ background: 'rgba(220,38,38,0.06)', border: '1.5px solid rgba(220,38,38,0.3)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Icon name="alert-circle" size={18} color="#DC2626" />
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#7F1D1D' }}>Delete this announcement? Families will no longer see it.</span>
          <button onClick={() => setDeleteId(null)} style={ghostBtn}>Keep it</button>
          <Button kind="danger" onClick={() => handleDelete(deleteId)}>Delete</Button>
        </div>
      )}

      {/* Pinned */}
      {pinned.length > 0 && (
        <Section label="Pinned">
          {pinned.map(a => (
            <AnnouncementCard key={a.id} a={a} onEdit={() => openEdit(a)} onDelete={() => setDeleteId(a.id)} onTogglePin={() => togglePin(a.id)} />
          ))}
        </Section>
      )}

      {/* All others */}
      {unpinned.length > 0 && (
        <Section label={pinned.length > 0 ? 'All others' : 'All announcements'}>
          {unpinned.map(a => (
            <AnnouncementCard key={a.id} a={a} onEdit={() => openEdit(a)} onDelete={() => setDeleteId(a.id)} onTogglePin={() => togglePin(a.id)} />
          ))}
        </Section>
      )}

      {announcements.length === 0 && !composing && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--fg-muted)' }}>
          <Icon name="megaphone" size={36} color="#CBD5E1" />
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 12, color: '#374151' }}>No announcements yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Post one — families see it instantly in the family portal.</div>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function AnnouncementCard({ a, onEdit, onDelete, onTogglePin, preview }) {
  const meta = TYPE_META[a.type] || TYPE_META.info;
  return (
    <div style={{
      background: preview ? meta.bg : '#fff',
      border: `1px solid ${meta.color}25`,
      borderLeft: `3px solid ${meta.color}`,
      borderRadius: '0 10px 10px 0',
      padding: '12px 14px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <Icon name={meta.icon} size={15} color={meta.color} style={{ flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{a.title}</span>
          {a.target !== 'All families' && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: `${meta.color}18`, color: meta.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{a.target}</span>
          )}
          {a.pinned && <Icon name="pin" size={11} color={meta.color} />}
        </div>
        {a.body && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>{a.body}</div>}
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          {a.date} · {a.author || 'Commissioner'}
          {a.emailCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon name="mail" size={10} color="#9CA3AF" />
              {a.emailCount}
            </span>
          )}
          {a.smsCount > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon name="message-square" size={10} color="#9CA3AF" />
              {a.smsCount}
            </span>
          )}
        </div>
      </div>
      {!preview && (
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <IconBtn name="pin" title={a.pinned ? 'Unpin' : 'Pin'} active={a.pinned} onClick={onTogglePin} />
          <IconBtn name="edit-2" title="Edit" onClick={onEdit} />
          <IconBtn name="trash-2" title="Delete" danger onClick={onDelete} />
        </div>
      )}
    </div>
  );
}

function IconBtn({ name, title, onClick, active, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        all: 'unset', cursor: 'pointer',
        width: 28, height: 28, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(10,31,61,0.10)' : danger ? 'transparent' : 'transparent',
        transition: 'background 120ms',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(220,38,38,0.08)' : 'rgba(10,31,61,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = active ? 'rgba(10,31,61,0.10)' : 'transparent'}
    >
      <Icon name={name} size={14} color={danger ? '#DC2626' : active ? 'var(--court-navy)' : '#6B7280'} />
    </button>
  );
}

function FieldGroup({ label, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...style }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>}
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '9px 12px', borderRadius: 8,
  border: '1.5px solid var(--border)',
  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--fg)',
  background: '#FAFAFA', outline: 'none',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30,
};

const ghostBtn = {
  padding: '8px 16px', borderRadius: 8, border: '1.5px solid var(--border)',
  background: '#fff', color: 'var(--fg)', fontFamily: 'var(--font-body)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer',
};
