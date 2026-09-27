import { useState, useRef } from 'react';
import { Card, Pill, Icon, Display, Eyebrow, Button } from '../shared/index.js';
import { csvDownload } from '../shared/csvDownload.js';
import { parseSignupFile } from '../shared/signupImport.js';
import { useRefSignups, useVolunteerSignups } from '../shared/store.js';
import { useIsMobile } from '../shared/useIsMobile.js';

const STATUSES = ['new', 'contacted', 'onboarded', 'declined'];
const STATUS_KIND = { new: 'gold', contacted: 'navy', onboarded: 'win', declined: 'neutral' };

const EXPERIENCE_LABEL = {
  none:      'New to officiating',
  some:      'Some experience',
  certified: 'Certified official',
};

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d) ? '—' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Review inbox for the public sign-up forms.
 * `tabs` limits which lists a role can see — Ref Director sees referees,
 * Community Director sees volunteers, Admin and Ops see both.
 */
const emptyAddForm = () => ({ name: '', email: '', phone: '', experience: 'none', availability: '', role: '', note: '' });

function makeSignupId() { return 'sig_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

export default function SignupsView({ tabs = ['refs', 'volunteers'] }) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState(tabs[0]);
  const [refs, setRefs]           = useRefSignups();
  const [volunteers, setVols]     = useVolunteerSignups();
  const [filter, setFilter]       = useState('all');
  const fileInputRef = useRef(null);
  const [importBusy, setImportBusy] = useState(false);
  const [toast, setToast]         = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [addForm, setAddForm]     = useState(emptyAddForm());

  const rows = tab === 'refs' ? refs : volunteers;
  const setRows = tab === 'refs' ? setRefs : setVols;

  const sorted = [...rows].sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  const shown = filter === 'all' ? sorted : sorted.filter(r => (r.status || 'new') === filter);
  const newCount = rows.filter(r => (r.status || 'new') === 'new').length;

  function setStatus(id, status) {
    setRows(list => list.map(r => (r.id === id ? { ...r, status } : r)));
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }

  function addRow(fields) {
    setRows(list => [...list, { id: makeSignupId(), created_at: new Date().toISOString(), status: 'new', ...fields }]);
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportBusy(true);
    try {
      const { rows: parsed, skipped, total } = await parseSignupFile(file);
      parsed.forEach(fields => addRow(tab === 'refs'
        ? { name: fields.name, email: fields.email, phone: fields.phone || '', experience: fields.experience || 'none', availability: fields.availability || '', note: fields.note || '' }
        : { name: fields.name, email: fields.email, role: fields.role || '', note: fields.note || '' }));
      showToast(`Imported ${parsed.length} of ${total} row${total === 1 ? '' : 's'}${skipped ? ` · ${skipped} skipped (missing name or email)` : ''}`);
    } catch (err) {
      showToast(err.message || 'Could not read that file');
    } finally {
      setImportBusy(false);
    }
  }

  function submitAdd() {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const fields = tab === 'refs'
      ? { name: addForm.name.trim(), email: addForm.email.trim(), phone: addForm.phone.trim(), experience: addForm.experience, availability: addForm.availability.trim(), note: addForm.note.trim() }
      : { name: addForm.name.trim(), email: addForm.email.trim(), role: addForm.role.trim(), note: addForm.note.trim() };
    addRow(fields);
    setShowAdd(false);
    setAddForm(emptyAddForm());
    showToast(`${fields.name} added`);
  }

  function exportCsv() {
    const headers = tab === 'refs'
      ? ['Name', 'Email', 'Phone', 'Experience', 'Availability', 'Note', 'Status', 'Received']
      : ['Name', 'Email', 'Role', 'Note', 'Status', 'Received'];
    const body = shown.map(r => tab === 'refs'
      ? [r.name, r.email, r.phone || '', EXPERIENCE_LABEL[r.experience] || r.experience || '', r.availability || '', r.note || '', r.status || 'new', fmtDate(r.created_at)]
      : [r.name, r.email, r.role || '', r.note || '', r.status || 'new', fmtDate(r.created_at)]);
    csvDownload(`fpyc-${tab}-signups.csv`, [headers, ...body]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tabs + filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {tabs.length > 1 && (
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t} onClick={() => { setTab(t); setFilter('all'); }} style={{
                padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer',
                borderBottom: `2px solid ${tab === t ? 'var(--court-navy)' : 'transparent'}`,
                color: tab === t ? 'var(--court-navy)' : 'var(--fg-muted)',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, marginBottom: -1,
              }}>
                {t === 'refs' ? 'Referees' : 'Volunteers'}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginLeft: tabs.length > 1 ? 'auto' : 0, flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${filter === f ? 'var(--court-navy)' : 'var(--border)'}`,
              background: filter === f ? 'var(--court-navy)' : '#fff',
              color: filter === f ? '#fff' : 'var(--fg-muted)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
              textTransform: 'capitalize',
            }}>{f}</button>
          ))}
          <button onClick={exportCsv} disabled={shown.length === 0} style={{
            padding: '5px 12px', borderRadius: 999, cursor: shown.length ? 'pointer' : 'not-allowed',
            border: '1px solid var(--border)', background: '#fff', color: 'var(--fg-muted)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
            display: 'inline-flex', alignItems: 'center', gap: 5, opacity: shown.length ? 1 : 0.5,
          }}>
            <Icon name="download" size={12} /> CSV
          </button>
          <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" style={{ display: 'none' }} onChange={handleFile} />
          <button onClick={() => fileInputRef.current?.click()} disabled={importBusy} style={{
            padding: '5px 12px', borderRadius: 999, cursor: importBusy ? 'default' : 'pointer',
            border: '1px solid var(--border)', background: '#fff', color: 'var(--fg-muted)',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
            display: 'inline-flex', alignItems: 'center', gap: 5, opacity: importBusy ? 0.6 : 1,
          }}>
            <Icon name="upload" size={12} /> {importBusy ? 'Importing…' : 'Upload CSV/XLS'}
          </button>
          <Button kind="gold" size="sm" icon="user-plus" onClick={() => { setAddForm(emptyAddForm()); setShowAdd(true); }}>
            Add
          </Button>
        </div>
      </div>

      {toast && (
        <div style={{ background: 'var(--court-navy)', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 13 }}>{toast}</div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12 }}>
        <Stat label="Total" value={rows.length} color="var(--court-navy)" />
        <Stat label="New"       value={newCount} color={newCount > 0 ? 'var(--basketball-orange)' : 'var(--fg-muted)'} />
        <Stat label="Contacted" value={rows.filter(r => r.status === 'contacted').length} color="var(--court-navy)" />
        <Stat label="Onboarded" value={rows.filter(r => r.status === 'onboarded').length} color="var(--status-win)" />
      </div>

      {shown.length === 0 ? (
        <Card padding="40px 24px">
          <div style={{ textAlign: 'center' }}>
            <Icon name="inbox" size={30} color="var(--border-strong)" />
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg)', marginTop: 12 }}>
              {rows.length === 0
                ? `No ${tab === 'refs' ? 'referee' : 'volunteer'} sign-ups yet`
                : `Nothing marked "${filter}"`}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>
              {rows.length === 0
                ? 'Submissions from the website appear here as they come in.'
                : 'Try a different filter.'}
            </div>
          </div>
        </Card>
      ) : (
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {shown.map((r, i) => (
            <div key={r.id} style={{
              padding: '14px 18px',
              borderBottom: i < shown.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1.6fr auto',
              gap: 12, alignItems: 'start',
            }}>
              {/* Who */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg)' }}>{r.name}</div>
                <a href={`mailto:${r.email}`} style={{ fontSize: 12, color: 'var(--court-navy)', textDecoration: 'none' }}>{r.email}</a>
                {r.phone && <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{r.phone}</div>}
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 4 }}>Received {fmtDate(r.created_at)}</div>
              </div>

              {/* Detail */}
              <div style={{ fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.55 }}>
                {tab === 'refs' ? (
                  <>
                    <div><strong style={{ color: 'var(--fg)' }}>{EXPERIENCE_LABEL[r.experience] || r.experience || '—'}</strong></div>
                    {r.availability && <div style={{ marginTop: 2 }}>Available: {r.availability}</div>}
                  </>
                ) : (
                  <div><strong style={{ color: 'var(--fg)' }}>{r.role || '—'}</strong></div>
                )}
                {r.note && <div style={{ marginTop: 4, fontStyle: 'italic' }}>“{r.note}”</div>}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifySelf: isMobile ? 'start' : 'end' }}>
                <Pill kind={STATUS_KIND[r.status || 'new']}>{r.status || 'new'}</Pill>
                <select
                  value={r.status || 'new'}
                  onChange={e => setStatus(r.id, e.target.value)}
                  style={{
                    fontSize: 12, padding: '5px 8px', borderRadius: 6,
                    border: '1px solid var(--border)', background: 'var(--surface)',
                    color: 'var(--fg)', fontFamily: 'var(--font-body)', cursor: 'pointer',
                  }}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </Card>
      )}

      {showAdd && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16 }}
          onClick={e => e.target === e.currentTarget && setShowAdd(false)}
        >
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, width: 440, maxWidth: '100%', boxShadow: 'var(--shadow-3)', maxHeight: '90vh', overflowY: 'auto' }}>
            <Display size={18} style={{ marginBottom: 16 }}>Add {tab === 'refs' ? 'referee' : 'volunteer'}</Display>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AddField label="Name"><input style={addInput} value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} /></AddField>
              <AddField label="Email"><input style={addInput} value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} /></AddField>
              {tab === 'refs' ? (
                <>
                  <AddField label="Phone"><input style={addInput} value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} /></AddField>
                  <AddField label="Experience">
                    <select style={addInput} value={addForm.experience} onChange={e => setAddForm({ ...addForm, experience: e.target.value })}>
                      {Object.entries(EXPERIENCE_LABEL).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                    </select>
                  </AddField>
                  <AddField label="Availability"><input style={addInput} value={addForm.availability} onChange={e => setAddForm({ ...addForm, availability: e.target.value })} placeholder="e.g. Weeknights, Saturdays" /></AddField>
                </>
              ) : (
                <AddField label="Role"><input style={addInput} value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })} placeholder="e.g. Scorekeeper, Team parent" /></AddField>
              )}
              <AddField label="Note"><textarea style={{ ...addInput, resize: 'vertical' }} rows={2} value={addForm.note} onChange={e => setAddForm({ ...addForm, note: e.target.value })} /></AddField>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: '#fff', color: 'var(--fg)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
              <Button kind="gold" onClick={submitAdd} disabled={!addForm.name.trim() || !addForm.email.trim()}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddField({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>
      {label}
      {children}
    </label>
  );
}

const addInput = {
  padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
  fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', width: '100%', boxSizing: 'border-box',
};

function Stat({ label, value, color }) {
  return (
    <Card padding="14px 16px">
      <Eyebrow>{label}</Eyebrow>
      <Display size={28} color={color} style={{ marginTop: 4 }}>{value}</Display>
    </Card>
  );
}
