import { useState, useEffect } from 'react';
import { Card, Pill, Button, Icon, Jersey, EmptyState, Skeleton } from '../shared/index.js';
import { csvDownload } from '../shared/csvDownload.js';
import { printRoster } from '../shared/printSheet.js';
import { TEAM_INFO, TEAMS_INFO } from '../shared/store.js';

const GRADES    = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const POSITIONS = ['Guard', 'Forward', 'Center'];
const SCHOOLS   = ['Daniels Run ES', 'Providence ES', 'Lanier MS', 'Mosby Woods ES', 'Robinson Secondary', 'Fairfax HS', 'Other'];
const STATUSES  = ['active', 'pending', 'inactive'];

const PROGRAMS = ['3v3 Summer Cup', 'Unassigned'];

const DIVISIONS_BY_PROGRAM = {
  '3v3 Summer Cup': ['3v3 Summer Cup'],
  'Unassigned':     ['—'],
};

const TEAMS = [...Object.keys(TEAMS_INFO), 'Unassigned'];

const STATUS_KIND = { active: 'navy', pending: 'warn', neutral: 'neutral' };

function emptyForm() {
  return { firstName: '', lastName: '', number: '', grade: '5th', position: 'Guard', school: '', guardian: '', phone: '', status: 'active', waiver: false, program: '3v3 Summer Cup', division: '3v3 Summer Cup', team: TEAMS[0] };
}

function exportRosterCSV(players) {
  const headers = ['#', 'Name', 'Grade', 'School', 'Position', 'Guardian', 'Phone', 'Status', 'Waiver', 'Program', 'Division', 'Team'];
  const rows = players.map(p => [
    p.number, p.name, p.grade, p.school || '', p.position,
    p.guardian || '', p.phone || '', p.status,
    p.waiver ? 'Yes' : 'No', p.program || '', p.division || '', p.team || '',
  ]);
  csvDownload('fpyc-roster.csv', [headers, ...rows]);
}

export default function RosterView({ team, players, setPlayers }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', player }
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [toast, setToast] = useState('');

  const statusFiltered = filter === 'all' ? players : players.filter(p => p.status === filter);

  const term = search.trim().toLowerCase();
  const searched = term
    ? statusFiltered.filter(p =>
        (p.name || '').toLowerCase().includes(term) ||
        (p.school || '').toLowerCase().includes(term) ||
        (p.guardian || '').toLowerCase().includes(term) ||
        (p.team || '').toLowerCase().includes(term) ||
        String(p.number ?? '').includes(term)
      )
    : statusFiltered;

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filtered = !sortKey ? searched : [...searched].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (sortKey === 'number') { av = av ?? -Infinity; bv = bv ?? -Infinity; }
    else { av = (av ?? '').toString().toLowerCase(); bv = (bv ?? '').toString().toLowerCase(); }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function openAdd() {
    setForm(emptyForm());
    setErrors({});
    setConfirmRemove(false);
    setModal({ mode: 'add' });
  }

  function openEdit(p) {
    const [firstName, ...rest] = (p.name || '').split(' ');
    setForm({
      firstName,
      lastName: rest.join(' '),
      number: String(p.number),
      grade: p.grade,
      position: p.position,
      school: p.school || '',
      guardian: p.guardian || '',
      phone: p.phone || '',
      status: p.status,
      waiver: p.waiver,
      program: p.program || '3v3 Summer Cup',
      division: p.division || '3v3 Summer Cup',
      team: p.team || 'Unassigned',
    });
    setErrors({});
    setConfirmRemove(false);
    setModal({ mode: 'edit', player: p });
  }

  function closeModal() {
    setModal(null);
    setConfirmRemove(false);
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.number || isNaN(parseInt(form.number))) e.number = 'Required';
    const num = parseInt(form.number, 10);
    const taken = players.find(p => p.number === num && (!modal?.player || p.id !== modal.player.id));
    if (taken) e.number = `#${num} is already taken by ${taken.name}`;
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const updated = {
      id: modal.mode === 'edit' ? modal.player.id : 'p' + Date.now(),
      number: parseInt(form.number, 10),
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      grade: form.grade,
      position: form.position,
      school: form.school,
      guardian: form.guardian,
      phone: form.phone,
      status: form.status,
      waiver: form.waiver,
      program: form.program,
      division: form.division,
      team: form.team,
    };

    if (modal.mode === 'add') {
      setPlayers(ps => [...ps, updated]);
      showToast(`${updated.name} added to roster`);
    } else {
      setPlayers(ps => ps.map(p => p.id === updated.id ? updated : p));
      showToast(`${updated.name} updated`);
    }
    closeModal();
  }

  function handleRemove() {
    if (!confirmRemove) { setConfirmRemove(true); return; }
    setPlayers(ps => ps.filter(p => p.id !== modal.player.id));
    showToast(`${modal.player.name} removed from roster`);
    closeModal();
  }

  function cycleStatus(player) {
    const next = STATUSES[(STATUSES.indexOf(player.status) + 1) % STATUSES.length];
    setPlayers(ps => ps.map(p => p.id === player.id ? { ...p, status: next } : p));
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

  if (loading) return <RosterSkeleton players={players} filter={filter} setFilter={setFilter} />;

  return (
    <div className="skel-content" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'all',      label: `All · ${players.length}` },
            { id: 'active',   label: `Active · ${players.filter(p => p.status === 'active').length}` },
            { id: 'inactive', label: 'Inactive' },
            { id: 'pending',  label: 'Pending' },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: filter === t.id ? 'var(--court-navy)' : 'transparent',
              color: filter === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={14} color="var(--fg-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search players…"
            style={{
              padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid var(--border)',
              fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', minWidth: 200,
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" icon="printer" size="sm" onClick={() => printRoster(players, TEAM_INFO)}>Print</Button>
          <Button kind="ghost" icon="download" size="sm" onClick={() => exportRosterCSV(players)}>Export CSV</Button>
          <Button kind="gold" icon="user-plus" onClick={openAdd}>Add player</Button>
        </div>
      </div>

      {/* Table */}
      <Card padding={0}>
        <div style={{ overflowX: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.7fr auto',
          minWidth: 680,
          padding: '12px 18px',
          background: 'var(--bone)', borderBottom: '1px solid var(--border)',
          fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700,
        }}>
          <SortHeader label="#" sortKey="number" current={sortKey} dir={sortDir} onClick={toggleSort} />
          <SortHeader label="Player" sortKey="name" current={sortKey} dir={sortDir} onClick={toggleSort} />
          <SortHeader label="Grade" sortKey="grade" current={sortKey} dir={sortDir} onClick={toggleSort} />
          <SortHeader label="School" sortKey="school" current={sortKey} dir={sortDir} onClick={toggleSort} />
          <SortHeader label="Guardian" sortKey="guardian" current={sortKey} dir={sortDir} onClick={toggleSort} />
          <div>Waiver</div>
          <SortHeader label="Status" sortKey="status" current={sortKey} dir={sortDir} onClick={toggleSort} />
          <div />
        </div>

        {filtered.length === 0 && (
          <EmptyState icon="users" title="No players"
            message={search ? `No players match "${search}".` : filter === 'all' ? 'Add your first player to get started.' : `No ${filter} players.`}
            onAction={openAdd} actionLabel="Add player" />
        )}

        {filtered.map((p, i) => (
          <div key={p.id} style={{
            display: 'grid',
            gridTemplateColumns: '60px 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.7fr auto',
            padding: '12px 18px', alignItems: 'center', gap: 4,
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            transition: 'background 120ms',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,31,61,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Jersey number={p.number} size={32} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{p.position}{p.team && p.team !== 'Unassigned' ? ` · ${p.team}` : ''}</div>
            </div>
            <div style={{ fontSize: 14 }}>{p.grade}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)' }}>{p.school || '—'}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)' }}>
              <div>{p.guardian || '—'}</div>
              {p.phone && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{p.phone}</div>}
            </div>
            <div>
              {p.waiver
                ? <span style={{ color: 'var(--status-win)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700 }}><Icon name="check-circle-2" size={14} />On file</span>
                : <span style={{ color: 'var(--foul-red)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700 }}><Icon name="alert-circle" size={14} />Missing</span>
              }
            </div>
            {/* Clickable status pill cycles through statuses */}
            <button onClick={() => cycleStatus(p)} title="Click to cycle status" style={{ all: 'unset', cursor: 'pointer' }}>
              <Pill kind={p.status === 'active' ? 'navy' : p.status === 'pending' ? 'warn' : 'neutral'}>
                {p.status}
              </Pill>
            </button>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <button onClick={() => openEdit(p)} style={{
                all: 'unset', cursor: 'pointer', padding: '6px 8px', borderRadius: 6,
                color: 'var(--fg-muted)', transition: 'all 120ms',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bone)'; e.currentTarget.style.color = 'var(--court-navy)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-muted)'; }}
              >
                <Icon name="edit-2" size={15} color="currentColor" />
              </button>
            </div>
          </div>
        ))}
        </div>
      </Card>

      {/* Add / Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 560, boxShadow: 'var(--shadow-3)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {modal.mode === 'add' ? 'Add player' : `Edit — ${modal.player.name}`}
              </div>
              <button onClick={closeModal} style={{ all: 'unset', cursor: 'pointer' }}><Icon name="x" size={20} color="var(--fg-muted)" /></button>
            </div>

            {/* Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <F label="First name" required error={errors.firstName}>
                <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" style={inputStyle(errors.firstName)} />
              </F>
              <F label="Last name" required error={errors.lastName}>
                <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last name" style={inputStyle(errors.lastName)} />
              </F>
              <F label="Jersey #" required error={errors.number}>
                <input type="number" min="0" max="99" value={form.number} onChange={e => set('number', e.target.value)} placeholder="e.g. 23" style={inputStyle(errors.number)} />
              </F>
              <F label="Grade">
                <select value={form.grade} onChange={e => set('grade', e.target.value)} style={inputStyle()}>
                  {GRADES.map(g => <option key={g} value={g}>{g} grade</option>)}
                </select>
              </F>
              <F label="Position">
                <select value={form.position} onChange={e => set('position', e.target.value)} style={inputStyle()}>
                  {POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </F>
              <F label="School">
                <select value={form.school} onChange={e => set('school', e.target.value)} style={inputStyle()}>
                  <option value="">Select school…</option>
                  {SCHOOLS.map(s => <option key={s}>{s}</option>)}
                </select>
              </F>
              <F label="Guardian name">
                <input value={form.guardian} onChange={e => set('guardian', e.target.value)} placeholder="e.g. A. Reeves" style={inputStyle()} />
              </F>
              <F label="Guardian phone">
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(703) 555-0000" style={inputStyle()} />
              </F>
              <F label="Status">
                <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle()}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </F>
              <F label="Waiver">
                <button onClick={() => set('waiver', !form.waiver)} style={{
                  width: '100%', padding: '9px 14px', borderRadius: 7, cursor: 'pointer',
                  border: `1.5px solid ${form.waiver ? 'var(--status-win)' : 'var(--border)'}`,
                  background: form.waiver ? 'rgba(31,138,91,0.06)' : '#fff',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                  color: form.waiver ? 'var(--status-win)' : 'var(--fg-muted)',
                  display: 'flex', alignItems: 'center', gap: 8, transition: 'all 160ms',
                }}>
                  <Icon name={form.waiver ? 'check-circle-2' : 'circle'} size={15} color={form.waiver ? 'var(--status-win)' : 'var(--fg-muted)'} />
                  {form.waiver ? 'Waiver on file' : 'Waiver missing'}
                </button>
              </F>
            </div>

            {/* Transfer section */}
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Icon name="arrow-right-left" size={14} color="var(--basketball-orange)" />
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--basketball-orange)' }}>Team Assignment</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                <F label="Program">
                  <select value={form.program} onChange={e => {
                    const prog = e.target.value;
                    const divs = DIVISIONS_BY_PROGRAM[prog] || [];
                    set('program', prog);
                    setForm(f => ({ ...f, program: prog, division: divs[0] || '—' }));
                  }} style={inputStyle()}>
                    {PROGRAMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </F>
                <F label="Division">
                  <select value={form.division} onChange={e => set('division', e.target.value)} style={inputStyle()}>
                    {(DIVISIONS_BY_PROGRAM[form.program] || []).map(d => <option key={d}>{d}</option>)}
                  </select>
                </F>
                <F label="Team">
                  <select value={form.team} onChange={e => set('team', e.target.value)} style={inputStyle()}>
                    {TEAMS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </F>
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, gap: 8 }}>
              <div>
                {modal.mode === 'edit' && (
                  confirmRemove ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--foul-red)', fontWeight: 600 }}>Remove {modal.player.name}?</span>
                      <Button kind="danger" size="sm" onClick={handleRemove}>Confirm</Button>
                      <Button kind="ghost" size="sm" onClick={() => setConfirmRemove(false)}>Cancel</Button>
                    </div>
                  ) : (
                    <button onClick={handleRemove} style={{
                      all: 'unset', cursor: 'pointer', fontSize: 13, fontWeight: 700,
                      color: 'var(--foul-red)', display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <Icon name="trash-2" size={14} color="var(--foul-red)" /> Remove player
                    </button>
                  )
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button kind="ghost" onClick={closeModal}>Cancel</Button>
                <Button kind="gold" icon={modal.mode === 'add' ? 'user-plus' : 'check'} onClick={handleSave}>
                  {modal.mode === 'add' ? 'Add to roster' : 'Save changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--court-navy)', color: '#fff',
          padding: '12px 24px', borderRadius: 999, fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 300,
        }}>
          <Icon name="check-circle" size={16} color="var(--varsity-gold)" /> {toast}
        </div>
      )}
    </div>
  );
}

function SortHeader({ label, sortKey, current, dir, onClick }) {
  const active = current === sortKey;
  return (
    <button onClick={() => onClick(sortKey)} style={{
      all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 700,
      color: active ? 'var(--court-navy)' : 'var(--fg-muted)',
    }}>
      {label}
      <Icon name={active ? (dir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down'} size={12} color="currentColor" />
    </button>
  );
}

function F({ label, required, error, children }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: error ? 'var(--foul-red)' : 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--foul-red)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <div style={{ fontSize: 12, color: 'var(--foul-red)', marginTop: 4, fontWeight: 500 }}>{error}</div>}
    </div>
  );
}

const inputStyle = (error) => ({
  padding: '9px 12px', borderRadius: 7,
  border: `1.5px solid ${error ? 'var(--foul-red)' : 'var(--border)'}`,
  background: error ? '#FFF5F5' : '#fff',
  fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none',
  width: '100%', boxSizing: 'border-box', color: 'var(--fg)',
});

function RosterSkeleton({ players, filter, setFilter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {[
            { id: 'all', label: `All · ${players.length}` },
            { id: 'active', label: 'Active' },
            { id: 'inactive', label: 'Inactive' },
            { id: 'pending', label: 'Pending' },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              padding: '8px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: filter === t.id ? 'var(--court-navy)' : 'transparent',
              color: filter === t.id ? '#fff' : 'var(--fg-soft)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button kind="ghost" icon="download" size="sm">Export CSV</Button>
          <Button kind="gold" icon="user-plus">Add player</Button>
        </div>
      </div>
      <Card padding={0}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.7fr auto',
          padding: '12px 18px', background: 'var(--bone)', borderBottom: '1px solid var(--border)',
          fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700,
        }}>
          <div>#</div><div>Player</div><div>Grade</div><div>School</div>
          <div>Guardian</div><div>Waiver</div><div>Status</div><div />
        </div>
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '60px 1.2fr 0.7fr 0.7fr 1fr 0.6fr 0.7fr auto',
            padding: '13px 18px', alignItems: 'center', borderBottom: '1px solid var(--border)', gap: 4,
          }}>
            <Skeleton width={28} height={28} style={{ borderRadius: 4, margin: '0 auto' }} />
            <div><Skeleton width="75%" height={14} style={{ marginBottom: 5 }} /><Skeleton width="55%" height={11} /></div>
            <Skeleton width="60%" height={13} />
            <Skeleton width="70%" height={13} />
            <Skeleton width="80%" height={13} />
            <Skeleton width={52} height={20} style={{ borderRadius: 999 }} />
            <Skeleton width={60} height={20} style={{ borderRadius: 999 }} />
            <Skeleton width={24} height={24} style={{ borderRadius: 4, marginLeft: 'auto' }} />
          </div>
        ))}
      </Card>
    </div>
  );
}
