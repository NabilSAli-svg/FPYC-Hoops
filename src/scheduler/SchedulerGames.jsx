import { useState } from 'react';
import { useGames } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';
import { GYMS } from './gyms.js';

const DAYS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BLANK_GAME = { date: '', time: '10:00', opponent: '', location: '', home: true, notes: '' };

function buildGameFromForm(f) {
  const d = new Date(f.date + 'T12:00:00');
  const [h, m] = f.time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour > 12 ? hour - 12 : hour || 12;
  return {
    id: 'g' + Date.now(),
    status: 'scheduled',
    month: MONTHS[d.getMonth()],
    date: d.getDate(),
    weekday: DAYS[d.getDay()],
    day: `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`,
    time: `${h12}:${m} ${ampm}`,
    opponent: f.opponent.trim(),
    location: f.location,
    home: f.home,
    note: f.notes.trim() || undefined,
    confirmed: 0,
  };
}

function gameToForm(g) {
  // Reconstruct ISO date from game fields (approximate — use Dec 2025 as base)
  const monthIdx = MONTHS.indexOf(g.month);
  const year = monthIdx >= 8 ? 2025 : 2026;
  const dateStr = `${year}-${String(monthIdx + 1).padStart(2,'0')}-${String(g.date).padStart(2,'0')}`;

  // Convert "10:00 AM" back to 24h
  const [timePart, ampm] = g.time.split(' ');
  const [hh, mm] = timePart.split(':').map(Number);
  let h24 = hh;
  if (ampm === 'PM' && hh !== 12) h24 = hh + 12;
  if (ampm === 'AM' && hh === 12) h24 = 0;
  const time24 = `${String(h24).padStart(2,'0')}:${mm}`;

  return { date: dateStr, time: time24, opponent: g.opponent, location: g.location || '', home: !!g.home, notes: g.note || '' };
}

export default function SchedulerGames() {
  const [games, setGames] = useGames();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK_GAME);
  const [errors, setErrors] = useState({});
  const [confirmCancel, setConfirmCancel] = useState(null);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  function openAdd() { setForm(BLANK_GAME); setEditId(null); setErrors({}); setShowModal(true); }
  function openEdit(g) { setForm(gameToForm(g)); setEditId(g.id); setErrors({}); setShowModal(true); }

  function validate() {
    const e = {};
    if (!form.date) e.date = 'Required';
    if (!form.opponent.trim()) e.opponent = 'Required';
    if (!form.location) e.location = 'Required';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) {
      setGames(prev => prev.map(g => {
        if (g.id !== editId) return g;
        const updated = buildGameFromForm(form);
        return { ...g, ...updated, id: g.id, status: g.status, us: g.us, them: g.them };
      }));
    } else {
      setGames(prev => [...prev, buildGameFromForm(form)]);
    }
    setShowModal(false);
  }

  function handleCancel(id) {
    setGames(prev => prev.map(g => g.id === id ? { ...g, status: 'cancelled' } : g));
    setConfirmCancel(null);
  }

  function handleUncancel(id) {
    setGames(prev => prev.map(g => g.id === id ? { ...g, status: 'scheduled' } : g));
  }

  function handleDelete(id) {
    setGames(prev => prev.filter(g => g.id !== id));
    setConfirmCancel(null);
  }

  const sorted = [...games].sort((a, b) => {
    const mA = MONTHS.indexOf(a.month), mB = MONTHS.indexOf(b.month);
    if (mA !== mB) return mA - mB;
    return (a.date || 0) - (b.date || 0);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1 }}>Games</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{games.filter(g => g.status !== 'cancelled').length} scheduled · {games.filter(g => g.status === 'final').length} played</div>
        </div>
        <AddBtn onClick={openAdd} label="Add game" />
      </div>

      {/* Game list */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 180px 120px 80px 100px', padding: '10px 20px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          {['Date', 'Opponent', 'Gym / Location', 'Time', 'H/A', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>{h}</div>
          ))}
        </div>

        {sorted.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No games yet — click "Add game" to get started.</div>
        )}

        {sorted.map((g, i) => {
          const isFinal     = g.status === 'final';
          const isCancelled = g.status === 'cancelled';
          const win = isFinal && g.us > g.them;
          return (
            <div key={g.id} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr 180px 120px 80px 100px',
              padding: '13px 20px', alignItems: 'center',
              borderBottom: i < sorted.length - 1 ? '1px solid #F3F4F6' : 'none',
              background: isCancelled ? '#FAFAFA' : 'transparent',
              opacity: isCancelled ? 0.6 : 1,
            }}>
              {/* Date */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: isCancelled ? '#9CA3AF' : '#111', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                  {g.day}
                </div>
                <StatusBadge status={g.status} win={win} us={g.us} them={g.them} />
              </div>

              {/* Opponent */}
              <div style={{ fontWeight: 600, fontSize: 14, color: isCancelled ? '#9CA3AF' : '#111' }}>
                {g.opponent}
                {g.note && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{g.note}</div>}
              </div>

              {/* Gym */}
              <div style={{ fontSize: 13, color: g.location ? '#374151' : '#EF4444', fontWeight: g.location ? 400 : 600 }}>
                {g.location || '⚠ No gym assigned'}
              </div>

              {/* Time */}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#374151' }}>{g.time}</div>

              {/* H/A */}
              <div>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 999,
                  background: g.home ? 'rgba(10,31,61,0.08)' : 'rgba(232,119,34,0.10)',
                  color: g.home ? 'var(--court-navy)' : 'var(--basketball-orange)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {g.home ? 'Home' : 'Away'}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                {!isFinal && !isCancelled && (
                  <IconBtn icon="edit-2" title="Edit" onClick={() => openEdit(g)} />
                )}
                {isCancelled ? (
                  <IconBtn icon="rotate-ccw" title="Restore" onClick={() => handleUncancel(g.id)} color="#059669" />
                ) : !isFinal ? (
                  <IconBtn icon="x-circle" title="Cancel game" onClick={() => setConfirmCancel({ id: g.id, action: 'cancel', label: g.opponent })} color="#DC2626" />
                ) : null}
                {isCancelled && (
                  <IconBtn icon="trash-2" title="Delete permanently" onClick={() => setConfirmCancel({ id: g.id, action: 'delete', label: g.opponent })} color="#DC2626" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <Modal title={editId ? 'Edit game' : 'Add game'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Date" required error={errors.date}>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inputSt(!!errors.date)} />
            </FormField>
            <FormField label="Tip-off time" required>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} style={inputSt()} />
            </FormField>
            <FormField label="Opponent" required error={errors.opponent} style={{ gridColumn: '1 / -1' }}>
              <input value={form.opponent} onChange={e => set('opponent', e.target.value)} placeholder="e.g. Vienna Storm" style={inputSt(!!errors.opponent)} />
            </FormField>
            <FormField label="Gym / Location" required error={errors.location} style={{ gridColumn: '1 / -1' }}>
              <select value={form.location} onChange={e => set('location', e.target.value)} style={inputSt(!!errors.location)}>
                <option value="">Select gym…</option>
                {GYMS.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                <option value="__other">Other / TBD</option>
              </select>
              {form.location === '__other' && (
                <input
                  value={form.locationOther || ''}
                  onChange={e => set('locationOther', e.target.value)}
                  placeholder="Enter location…"
                  style={{ ...inputSt(), marginTop: 8 }}
                />
              )}
            </FormField>
            <FormField label="Home or away">
              <div style={{ display: 'flex', gap: 10 }}>
                {[{ v: true, label: 'Home' }, { v: false, label: 'Away' }].map(o => (
                  <button key={String(o.v)} onClick={() => set('home', o.v)} style={{
                    flex: 1, padding: '10px', borderRadius: 8, border: `2px solid ${form.home === o.v ? 'var(--court-navy)' : '#E2E5EA'}`,
                    background: form.home === o.v ? 'rgba(10,31,61,0.06)' : '#fff',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                    color: form.home === o.v ? 'var(--court-navy)' : '#9CA3AF', cursor: 'pointer',
                  }}>{o.label}</button>
                ))}
              </div>
            </FormField>
            <FormField label="Notes (optional)">
              <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Carpool, jersey color, etc." style={inputSt()} />
            </FormField>
          </div>
          <ModalFooter onCancel={() => setShowModal(false)} onSave={handleSave} label={editId ? 'Save changes' : 'Add game'} />
        </Modal>
      )}

      {/* Cancel/Delete confirm */}
      {confirmCancel && (
        <Modal title={confirmCancel.action === 'delete' ? 'Delete game?' : 'Cancel game?'} onClose={() => setConfirmCancel(null)} width={420}>
          <p style={{ fontSize: 14, color: '#374151', margin: '0 0 20px', lineHeight: 1.55 }}>
            {confirmCancel.action === 'delete'
              ? <>This will permanently remove <strong>{confirmCancel.label}</strong> from the schedule.</>
              : <>Mark <strong>{confirmCancel.label}</strong> as cancelled? Families will see it flagged in the schedule.</>
            }
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <GhostBtn onClick={() => setConfirmCancel(null)}>Keep game</GhostBtn>
            <DangerBtn onClick={() => confirmCancel.action === 'delete' ? handleDelete(confirmCancel.id) : handleCancel(confirmCancel.id)}>
              {confirmCancel.action === 'delete' ? 'Delete' : 'Cancel game'}
            </DangerBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatusBadge({ status, win, us, them }) {
  if (status === 'cancelled') return <span style={badge('#9CA3AF', 'rgba(107,114,128,0.10)')}>Cancelled</span>;
  if (status === 'final') return <span style={badge(win ? '#059669' : '#DC2626', win ? 'rgba(5,150,105,0.10)' : 'rgba(220,38,38,0.08)')}>{win ? 'W' : 'L'} {us}–{them}</span>;
  if (status === 'live') return <span style={badge('#DC2626', 'rgba(220,38,38,0.10)')}>Live</span>;
  return null;
}

function badge(color, bg) {
  return { fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999, color, background: bg, display: 'inline-block', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.06em' };
}

function FormField({ label, required, error, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: error ? '#DC2626' : '#374151' }}>
        {label}{required && <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: 12, color: '#DC2626' }}>{error}</div>}
    </div>
  );
}

function inputSt(err = false) {
  return {
    padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${err ? '#DC2626' : '#E2E5EA'}`,
    fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none', background: err ? '#FFF5F5' : '#fff',
    width: '100%', boxSizing: 'border-box',
  };
}

function Modal({ title, onClose, children, width = 620 }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: width, boxShadow: '0 24px 64px rgba(0,0,0,0.20)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--court-navy)', textTransform: 'uppercase' }}>{title}</div>
          <button onClick={onClose} style={{ all: 'unset', cursor: 'pointer' }}><Icon name="x" size={20} color="#9CA3AF" /></button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, onSave, label }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid #F3F4F6' }}>
      <GhostBtn onClick={onCancel}>Cancel</GhostBtn>
      <SaveBtn onClick={onSave}>{label}</SaveBtn>
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: 'none',
      background: 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer',
    }}>
      <Icon name="plus" size={16} color="#fff" /> {label}
    </button>
  );
}

function IconBtn({ icon, title, onClick, color = '#6B7280' }) {
  return (
    <button onClick={onClick} title={title} style={{ all: 'unset', cursor: 'pointer', padding: '5px', borderRadius: 6, display: 'flex', alignItems: 'center', background: 'transparent' }}
      onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon name={icon} size={16} color={color} />
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '10px 18px', borderRadius: 9, border: '1.5px solid #E2E5EA', background: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

function SaveBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--court-navy)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

function DangerBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: '10px 18px', borderRadius: 9, border: 'none', background: '#DC2626', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer' }}>
      {children}
    </button>
  );
}
