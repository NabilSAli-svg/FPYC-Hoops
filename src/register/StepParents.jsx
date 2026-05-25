import { useState } from 'react';
import { StepHeader, ContinueBtn, BackBtn, FormCard, Field, Input, Select } from './StepProgram.jsx';

const RELATIONSHIPS = ['Mother','Father','Guardian','Grandparent','Other'];

function ParentForm({ title, data, onChange, required }) {
  const set = (k, v) => onChange({ ...data, [k]: v });
  return (
    <FormCard title={title}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <button
          onClick={() => onChange({ ...data, _mode: 'existing' })}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
            background: (!data._mode || data._mode === 'existing') ? 'var(--court-navy)' : '#F4F5F7',
            color: (!data._mode || data._mode === 'existing') ? '#fff' : '#6B7280',
            border: 'none', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)',
            transition: 'all 160ms',
          }}
        >Select existing member</button>
        <button
          onClick={() => onChange({ ...data, _mode: 'new' })}
          style={{
            flex: 1, padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
            background: data._mode === 'new' ? 'var(--court-navy)' : '#F4F5F7',
            color: data._mode === 'new' ? '#fff' : '#6B7280',
            border: 'none', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)',
            transition: 'all 160ms',
          }}
        >Create new member</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="First name" required={required}>
          <Input value={data.firstName} onChange={v => set('firstName', v)} placeholder="First name" />
        </Field>
        <Field label="Last name" required={required}>
          <Input value={data.lastName} onChange={v => set('lastName', v)} placeholder="Last name" />
        </Field>
        <Field label="Email address" required={required} hint="Used for schedules, updates & household login">
          <Input type="email" value={data.email} onChange={v => set('email', v)} placeholder="email@example.com" />
        </Field>
        <Field label="Phone number" required={required}>
          <Input type="tel" value={data.phone} onChange={v => set('phone', v)} placeholder="(703) 555-0000" />
        </Field>
        <Field label="Relationship to player" required={required}>
          <Select value={data.relationship} onChange={v => set('relationship', v)}>
            <option value="">Select…</option>
            {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
      </div>
    </FormCard>
  );
}

export default function StepParents({ data, update, next, back }) {
  const [hasP2, setHasP2] = useState(!!(data.parents.p2?.firstName));
  const parents = data.parents;

  const setP1 = v => update('parents', { ...parents, p1: v });
  const setP2 = v => update('parents', { ...parents, p2: v });

  const p1 = parents.p1 || {};
  const p1Valid = p1.firstName && p1.lastName && p1.email && p1.phone && p1.relationship;

  return (
    <div>
      <StepHeader
        eyebrow="Step 3 of 6"
        title="Parent & guardian"
        sub="Both parents/guardians with a valid email will receive household login access and all team communications."
      />

      {/* Info banner */}
      <div style={{
        background: 'rgba(255,199,44,0.10)', border: '1px solid rgba(255,199,44,0.30)',
        borderRadius: 10, padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20,
        fontSize: 13, color: '#374151',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--basketball-orange)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span><strong>Parent 1 and Parent 2</strong> will each be given admin login access to this household with a valid email address.</span>
      </div>

      <ParentForm title="Parent 1" data={p1} onChange={setP1} required />

      {!hasP2 ? (
        <button
          onClick={() => setHasP2(true)}
          style={{
            all: 'unset', cursor: 'pointer', width: '100%', boxSizing: 'border-box',
            border: '2px dashed #D1D5DB', borderRadius: 14, padding: '18px 24px',
            display: 'flex', alignItems: 'center', gap: 10,
            color: '#6B7280', fontSize: 14, fontWeight: 600, marginBottom: 24,
            transition: 'border-color 160ms',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--court-navy)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#D1D5DB'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Add a second parent or guardian (optional)
        </button>
      ) : (
        <div style={{ position: 'relative' }}>
          <ParentForm title="Parent 2 (optional)" data={parents.p2 || {}} onChange={setP2} required={false} />
          <button
            onClick={() => { setHasP2(false); setP2({}); }}
            style={{
              position: 'absolute', top: 16, right: 24,
              all: 'unset', cursor: 'pointer', fontSize: 12, color: '#9CA3AF',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Remove
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackBtn onClick={back} />
        <ContinueBtn disabled={!p1Valid} onClick={next} label="Continue to waivers" />
      </div>
    </div>
  );
}
