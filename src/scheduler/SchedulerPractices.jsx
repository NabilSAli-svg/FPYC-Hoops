import { useState } from 'react';
import { usePractices } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';
import { GYMS } from './gyms.js';

const TYPES = ['Regular', 'Scrimmage', 'Conditioning'];
const BLANK = { date: '', startTime: '18:00', endTime: '19:30', type: 'Regular', gym: '', notes: '' };

function fmt24to12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function practiceToForm(p) {
  // Parse "6:00–7:30 PM" style time range
  const match = p.time.match(/^(\d+:\d+)–(\d+:\d+)\s*(AM|PM)?$/);
  let startTime = '18:00', endTime = '19:30';
  if (match) {
    const [, start, end, ampm] = match;
    const toH24 = (t, meridiem) => {
      let [h, m] = t.split(':').map(Number);
      if (meridiem === 'PM' && h !== 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    };
    startTime = toH24(start, ampm);
    endTime   = toH24(end, ampm);
  }
  return { date: p.date, startTime, endTime, type: p.type || 'Regular', gym: p.gym || '', notes: p.notes || '' };
}

function buildPractice(f, existingId) {
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let dateLabel = f.date;
  // If f.date looks like ISO (YYYY-MM-DD), convert to "Mon, Dec 2"
  if (/^\d{4}-\d{2}-\d{2}$/.test(f.date)) {
    const d = new Date(f.date + 'T12:00:00');
    dateLabel = `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
  }
  const startFmt = fmt24to12(f.startTime);
  const endFmt   = fmt24to12(f.endTime);
  const ampm = endFmt.includes('PM') ? 'PM' : 'AM';
  const timeRange = `${startFmt.replace(/ (AM|PM)/, '')}–${endFmt.replace(/ (AM|PM)/, '')} ${ampm}`;
  return {
    id: existingId || 'pr' + Date.now(),
    date: dateLabel,
    time: timeRange,
    gym: f.gym === '__other' ? (f.gymOther || 'TBD') : (f.gym || 'TBD'),
    type: f.type,
    rsvp: 0,
    notes: f.notes.trim(),
  };
}

export default function SchedulerPractices() {
  const [practices, setPractices] = usePractices();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [confirmDel, setConfirmDel] = useState(null);

  const setF = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  function openAdd() { setForm(BLANK); setEditId(null); setErrors({}); setShowModal(true); }
  function openEdit(p) {
    const f = practiceToForm(p);
    setForm(f);
    setEditId(p.id);
    setErrors({});
    setShowModal(true);
  }

  function validate() {
    const e = {};
    if (!form.date) e.date = 'Required';
    if (!form.gym) e.gym = 'Required';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) {
      setPractices(prev => prev.map(p => p.id === editId ? { ...buildPractice(form, editId), rsvp: p.rsvp } : p));
    } else {
      setPractices(prev => [...prev, buildPractice(form)]);
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    setPractices(prev => prev.filter(p => p.id !== id));
    setConfirmDel(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1 }}>Practices</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{practices.length} sessions scheduled</div>
        </div>
        <AddBtn onClick={openAdd} label="Add practice" />
      </div>

      {/* List */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 200px 120px 80px', padding: '10px 20px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
          {['Date', 'Type / Notes', 'Gym', 'Time', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF' }}>{h}</div>
          ))}
        </div>

        {practices.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>No practices yet.</div>
        )}

        {practices.map((p, i) => {
          const noGym = !p.gym || p.gym === 'TBD';
          const typeColor = { Regular: 'var(--court-navy)', Scrimmage: '#92660A', Conditioning: '#B45309' }[p.type] || '#6B7280';
          const typeBg    = { Regular: 'rgba(10,31,61,0.07)', Scrimmage: 'rgba(255,199,44,0.15)', Conditioning: 'rgba(232,119,34,0.12)' }[p.type] || 'rgba(107,114,128,0.10)';
          return (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '140px 1fr 200px 120px 80px',
              padding: '12px 20px', alignItems: 'center',
              borderBottom: i < practices.length - 1 ? '1px solid #F3F4F6' : 'none',
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#111' }}>{p.date}</div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: typeBg, color: typeColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {p.type}
                </span>
                {p.notes && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>{p.notes}</div>}
              </div>
              <div style={{ fontSize: 13, color: noGym ? '#EF4444' : '#374151', fontWeight: noGym ? 600 : 400 }}>
                {noGym ? '⚠ No gym assigned' : p.gym}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#374151' }}>{p.time}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <IconBtn icon="edit-2" title="Edit" onClick={() => openEdit(p)} />
                <IconBtn icon="trash-2" title="Delete" onClick={() => setConfirmDel({ id: p.id, label: `${p.date} ${p.type}` })} color="#DC2626" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <Modal title={editId ? 'Edit practice' : 'Add practice'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <FormField label="Date" required error={errors.date}>
              <input type="date" value={/^\d{4}-\d{2}-\d{2}$/.test(form.date) ? form.date : ''} onChange={e => setF('date', e.target.value)} style={inputSt(!!errors.date)} />
            </FormField>
            <FormField label="Practice type">
              <select value={form.type} onChange={e => setF('type', e.target.value)} style={inputSt()}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Start time">
              <input type="time" value={form.startTime} onChange={e => setF('startTime', e.target.value)} style={inputSt()} />
            </FormField>
            <FormField label="End time">
              <input type="time" value={form.endTime} onChange={e => setF('endTime', e.target.value)} style={inputSt()} />
            </FormField>
            <FormField label="Gym" required error={errors.gym} style={{ gridColumn: '1 / -1' }}>
              <select value={form.gym} onChange={e => setF('gym', e.target.value)} style={inputSt(!!errors.gym)}>
                <option value="">Select gym…</option>
                {GYMS.map(g => <option key={g.id} value={g.name}>{g.name}{g.notes ? ` · ${g.notes}` : ''}</option>)}
                <option value="__other">Other / TBD</option>
              </select>
              {form.gym === '__other' && (
                <input value={form.gymOther || ''} onChange={e => setF('gymOther', e.target.value)} placeholder="Enter gym name…" style={{ ...inputSt(), marginTop: 8 }} />
              )}
            </FormField>
            <FormField label="Notes (optional)" style={{ gridColumn: '1 / -1' }}>
              <input value={form.notes} onChange={e => setF('notes', e.target.value)} placeholder="Focus area, special instructions…" style={inputSt()} />
            </FormField>
          </div>
          <ModalFooter onCancel={() => setShowModal(false)} onSave={handleSave} label={editId ? 'Save changes' : 'Add practice'} />
        </Modal>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <Modal title="Delete practice?" onClose={() => setConfirmDel(null)} width={420}>
          <p style={{ fontSize: 14, color: '#374151', margin: '0 0 20px', lineHeight: 1.55 }}>
            Remove <strong>{confirmDel.label}</strong> from the schedule permanently?
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <GhostBtn onClick={() => setConfirmDel(null)}>Keep it</GhostBtn>
            <DangerBtn onClick={() => handleDelete(confirmDel.id)}>Delete</DangerBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

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
  return { padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${err ? '#DC2626' : '#E2E5EA'}`, fontSize: 14, fontFamily: 'var(--font-body)', color: '#111', outline: 'none', background: err ? '#FFF5F5' : '#fff', width: '100%', boxSizing: 'border-box' };
}

function Modal({ title, onClose, children, width = 580 }) {
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
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 10, border: 'none', background: 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
      <Icon name="plus" size={16} color="#fff" /> {label}
    </button>
  );
}

function IconBtn({ icon, title, onClick, color = '#6B7280' }) {
  return (
    <button onClick={onClick} title={title} style={{ all: 'unset', cursor: 'pointer', padding: '5px', borderRadius: 6, display: 'flex', alignItems: 'center' }}
      onMouseEnter={e => e.currentTarget.style.background = '#F3F4F6'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon name={icon} size={16} color={color} />
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return <button onClick={onClick} style={{ padding: '10px 18px', borderRadius: 9, border: '1.5px solid #E2E5EA', background: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#374151', cursor: 'pointer' }}>{children}</button>;
}

function SaveBtn({ onClick, children }) {
  return <button onClick={onClick} style={{ padding: '10px 20px', borderRadius: 9, border: 'none', background: 'var(--court-navy)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer' }}>{children}</button>;
}

function DangerBtn({ onClick, children }) {
  return <button onClick={onClick} style={{ padding: '10px 18px', borderRadius: 9, border: 'none', background: '#DC2626', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: '#fff', cursor: 'pointer' }}>{children}</button>;
}
