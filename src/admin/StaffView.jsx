import { useState, useEffect } from 'react';
import { Card, Button, Icon, Display, Eyebrow, Pill, Avatar } from '../shared/index.js';
import { useStaff, INITIAL_STAFF } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';

const PROGRAMS = ['Recreation', 'Select', 'Training', 'Operations'];

const BG_COLORS = {
  'Not Started': { bg: 'rgba(120,120,120,0.12)', fg: '#666' },
  'Pending':     { bg: 'rgba(232,179,34,0.14)', fg: '#a87b00' },
  'Cleared':     { bg: 'rgba(34,150,80,0.12)',  fg: '#1f8a4c' },
  'Expired':     { bg: 'rgba(220,60,40,0.12)',  fg: '#cc3a26' },
  'Failed':      { bg: 'rgba(220,60,40,0.12)',  fg: '#cc3a26' },
};

const EMPTY_FORM = { name: '', role: '', program: 'Recreation', team: '', email: '', phone: '' };

const AGE_GROUP_ORDER = ['K-3', '2/3', '3/4', '4/5', '5th', '6th', '7th', '8th', 'HS', 'Unassigned'];

// Team names already lead with the grade/age band (e.g. "5th Boys Select A",
// "3/4 Boys", "K-3 3v3") -- strip the Select/Boys/Girls/3v3 suffixes to get
// a grouping key shared by both the boys and girls teams for that grade.
function ageGroupOf(team) {
  if (!team || team === 'Unassigned') return 'Unassigned';
  return team
    .replace(/ Select( [A-C])?$/, '')
    .replace(/ (Boys|Girls)$/, '')
    .replace(/ 3v3$/, '')
    .trim() || 'Unassigned';
}

function groupByAgeGroup(people, program) {
  const groups = new Map();
  for (const person of people) {
    const a = person.assignments.find(x => x.program === program) || person.assignments[0];
    const key = ageGroupOf(a?.team);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(person);
  }
  return [...groups.entries()].sort(([a], [b]) => {
    const ia = AGE_GROUP_ORDER.indexOf(a), ib = AGE_GROUP_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

// Group staff rows by person (email, falling back to id for rows with no
// email) -- the same person often has one row per team/role (e.g. a Select
// coach who also trains), which otherwise reads as duplicates on this page.
function groupByPerson(staff) {
  const people = [];
  const seen = new Map();
  for (const s of staff) {
    const key = s.email ? s.email.toLowerCase() : `__noemail__${s.id}`;
    if (seen.has(key)) {
      const existing = seen.get(key);
      existing.ids.push(s.id);
      const already = existing.assignments.some(a => a.role === s.role && a.program === s.program && a.team === s.team);
      if (!already) existing.assignments.push({ role: s.role, program: s.program, team: s.team });
      if (!existing.programs.includes(s.program)) existing.programs.push(s.program);
    } else {
      const entry = {
        key, ids: [s.id], name: s.name, email: s.email || '', phone: s.phone,
        assignments: [{ role: s.role, program: s.program, team: s.team }],
        programs: s.program ? [s.program] : [],
        bgCheckStatus: s.bgCheckStatus, bgCheckDate: s.bgCheckDate,
      };
      seen.set(key, entry);
      people.push(entry);
    }
  }
  return people;
}

export default function StaffView() {
  const [staff, setStaff] = useStaff();

  // Seed any INITIAL_STAFF entries missing from Supabase (e.g. Select/Training coaches added after initial launch)
  useEffect(() => {
    if (staff.length === 0) return; // still loading
    const dbIds = new Set(staff.map(s => s.id));
    const missing = INITIAL_STAFF.filter(s => !dbIds.has(s.id));
    if (missing.length === 0) return;
    supabase.from('staff').upsert(missing).then(({ error }) => {
      if (error) { console.error('[staff seed]', error.message); return; }
      setStaff(prev => [...prev, ...missing]);
    });
  }, [staff.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const [activeProgram, setActiveProgram] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingPerson, setEditingPerson] = useState(null);
  const [toast, setToast] = useState('');
  const [bgBusyKey, setBgBusyKey] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const people = groupByPerson(staff);
  const filtered = activeProgram === 'All' ? people : people.filter(p => p.programs.includes(activeProgram));
  const groupedProgram = (activeProgram === 'Select' || activeProgram === 'Recreation') ? activeProgram : null;

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingPerson(null);
    setShowForm(true);
  }

  function openEdit(person) {
    const first = person.assignments[0];
    setForm({ name: person.name, role: first.role, program: first.program, team: first.team, email: person.email, phone: person.phone });
    setEditingPerson(person);
    setShowForm(true);
  }

  function saveForm() {
    if (!form.name.trim()) return;
    if (editingPerson) {
      // Contact info (name/email/phone) applies to every row for this
      // person; role/program/team stay as each row's own assignment.
      setStaff(prev => prev.map(s => editingPerson.ids.includes(s.id)
        ? { ...s, name: form.name, email: form.email, phone: form.phone }
        : s));
      showToast('Staff member updated');
    } else {
      const id = 'st' + Date.now();
      setStaff(prev => [...prev, { id, ...form, bgCheckStatus: 'Not Started', bgCheckDate: '' }]);
      showToast('Staff member added');
    }
    setShowForm(false);
  }

  function removePerson(person) {
    setStaff(prev => prev.filter(s => !person.ids.includes(s.id)));
    showToast(`${person.name} removed`);
  }

  async function runBackgroundCheck(person) {
    setBgBusyKey(person.key);
    try {
      const { data, error } = await supabase.functions.invoke('send-background-check', {
        body: { name: person.name, email: person.email },
      });
      if (error || !data?.success) throw error || new Error('Background check request failed');
      const today = new Date().toISOString().slice(0, 10);
      setStaff(prev => prev.map(s => person.ids.includes(s.id) ? { ...s, bgCheckStatus: 'Pending', bgCheckDate: today } : s));
      showToast(`Background check requested for ${person.name}`);
    } catch (err) {
      showToast(`Could not start background check: ${err.message || err}`);
    } finally {
      setBgBusyKey(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Display size={22}>Staff & Volunteers</Display>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 4 }}>Coaches, board members & volunteers across all leagues.</div>
        </div>
        <Button kind="gold" icon="plus" onClick={openAdd}>Add staff</Button>
      </div>

      {toast && (
        <div style={{ background: 'var(--court-navy)', color: '#fff', padding: '10px 16px', borderRadius: 8, fontSize: 13 }}>{toast}</div>
      )}

      {/* Program filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['All', ...PROGRAMS].map(p => (
          <button key={p} onClick={() => setActiveProgram(p)} style={{
            padding: '6px 14px',
            borderRadius: 999,
            border: '1px solid var(--border)',
            background: activeProgram === p ? 'var(--court-navy)' : 'transparent',
            color: activeProgram === p ? '#fff' : 'var(--fg)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}>{p}</button>
        ))}
      </div>

      {showForm && (
        <Card>
          <Eyebrow>{editingPerson ? 'Edit staff member' : 'Add staff member'}</Eyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 12 }}>
            <Field label="Name"><input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
            {!editingPerson && (
              <>
                <Field label="Role"><input style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Coach, Scorekeeper, etc." /></Field>
                <Field label="Program">
                  <select style={inputStyle} value={form.program} onChange={e => setForm({ ...form, program: e.target.value })}>
                    {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Team"><input style={inputStyle} value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} placeholder="Unassigned" /></Field>
              </>
            )}
            <Field label="Email"><input style={inputStyle} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone"><input style={inputStyle} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          </div>
          {editingPerson && editingPerson.assignments.length > 1 && (
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 10 }}>
              Name/email/phone apply to all of {editingPerson.name}'s roles. To change a specific role or team, remove and re-add that assignment.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <Button kind="quiet" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button kind="gold" onClick={saveForm}>{editingPerson ? 'Save changes' : 'Add staff member'}</Button>
          </div>
        </Card>
      )}

      {filtered.length === 0 && (
        <Card padding={0}>
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>No staff or volunteers in this program yet.</div>
        </Card>
      )}

      {filtered.length > 0 && (groupedProgram
        ? groupByAgeGroup(filtered, groupedProgram).map(([ageGroup, groupPeople]) => (
          <div key={ageGroup}>
            <Eyebrow>{ageGroup}</Eyebrow>
            <Card padding={0} style={{ marginTop: 8 }}>
              <PersonRows people={groupPeople} bgBusyKey={bgBusyKey} runBackgroundCheck={runBackgroundCheck} openEdit={openEdit} removePerson={removePerson} />
            </Card>
          </div>
        ))
        : (
          <Card padding={0}>
            <PersonRows people={filtered} bgBusyKey={bgBusyKey} runBackgroundCheck={runBackgroundCheck} openEdit={openEdit} removePerson={removePerson} />
          </Card>
        ))}
    </div>
  );
}

function PersonRows({ people, bgBusyKey, runBackgroundCheck, openEdit, removePerson }) {
  return people.map((person, i) => {
    const colors = BG_COLORS[person.bgCheckStatus] || BG_COLORS['Not Started'];
    return (
      <div key={person.key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderBottom: i < people.length - 1 ? '1px solid var(--border)' : 'none', flexWrap: 'wrap' }}>
        <Avatar name={person.name} size={36} color="var(--court-navy)" />
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{person.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 4 }}>
            {person.assignments.map((a, ai) => (
              <Pill key={ai} kind="neutral">{a.role} · {a.program}{a.team ? ` · ${a.team}` : ''}</Pill>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>{person.email} · {person.phone}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ background: colors.bg, color: colors.fg, fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '4px 10px' }}>
            Background check: {person.bgCheckStatus}{person.bgCheckDate ? ` (${person.bgCheckDate})` : ''}
          </span>
          <Button kind="quiet" size="sm" icon="shield-check" disabled={bgBusyKey === person.key} onClick={() => runBackgroundCheck(person)}>
            {bgBusyKey === person.key ? 'Requesting…' : 'Run check'}
          </Button>
          <Button kind="quiet" size="sm" icon="edit-2" onClick={() => openEdit(person)} />
          <Button kind="quiet" size="sm" icon="trash-2" onClick={() => removePerson(person)} />
        </div>
      </div>
    );
  });
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, fontWeight: 600, color: 'var(--fg-muted)' }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
};
