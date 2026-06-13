import { useState } from 'react';
import { StepHeader, ContinueBtn, BackBtn, FormCard, Field, Input, Select } from './StepProgram.jsx';

const GRADES = ['Kindergarten','1st Grade','2nd Grade','3rd Grade','4th Grade','5th Grade','6th Grade','7th Grade','8th Grade'];
const GENDERS = ['Male','Female','Prefer not to say'];
const SCHOOLS = ['Daniels Run ES','Providence ES','Lanier MS','Mosby Woods ES','Robinson Secondary','Fairfax HS','Other'];

export default function StepPlayer({ data, update, next, back, isMobile }) {
  const p = data.player;
  const set = (k, v) => update('player', { ...p, [k]: v });
  const [showErrors, setShowErrors] = useState(false);

  const validate = () => ({
    firstName: !p.firstName?.trim() ? 'First name is required' : null,
    lastName:  !p.lastName?.trim()  ? 'Last name is required'  : null,
    dob:       !p.dob               ? 'Date of birth is required' : null,
    gender:    !p.gender            ? 'Please select a gender'    : null,
    grade:     !p.grade             ? 'Please select a grade'     : null,
  });

  const errs = showErrors ? validate() : {};

  function handleContinue() {
    setShowErrors(true);
    if (!Object.values(validate()).some(Boolean)) next();
  }

  return (
    <div>
      <StepHeader
        eyebrow="Step 3 of 7"
        title="Your player"
        sub="Tell us about the child you're registering."
      />

      <FormCard>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 32, alignItems: 'flex-start' }}>
          {!isMobile && (
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 88, height: 88, borderRadius: 14,
                background: '#F4F5F7', border: '2px dashed #D1D5DB',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', gap: 6,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>Photo</span>
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF' }}>Optional</span>
            </div>
          )}

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
            <Field label="First name" required error={errs.firstName}>
              <Input value={p.firstName} onChange={v => set('firstName', v)} placeholder="First name" error={!!errs.firstName} />
            </Field>
            <Field label="Last name" required error={errs.lastName}>
              <Input value={p.lastName} onChange={v => set('lastName', v)} placeholder="Last name" error={!!errs.lastName} />
            </Field>
            <Field label="Date of birth" required hint="Used for age-division placement" error={errs.dob}>
              <Input type="date" value={p.dob} onChange={v => set('dob', v)} error={!!errs.dob} />
            </Field>
            <Field label="Gender" required error={errs.gender}>
              <Select value={p.gender} onChange={v => set('gender', v)} error={!!errs.gender}>
                <option value="">Select…</option>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </Field>
            <Field label="School grade" required error={errs.grade}>
              <Select value={p.grade} onChange={v => set('grade', v)} error={!!errs.grade}>
                <option value="">Select grade…</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </Field>
            <Field label="School">
              <Select value={p.school} onChange={v => set('school', v)}>
                <option value="">Select school…</option>
                {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        </div>
      </FormCard>

      <div style={{
        background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)', marginBottom: 14 }}>Discounts & scholarships</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CheckRow
            checked={!!p.scholarship}
            onChange={v => set('scholarship', v)}
            label="Apply for a need-based scholarship"
            sub="The Commissioner will follow up by email. No documentation required upfront."
          />
          <CheckRow
            checked={!!p.sibling}
            onChange={v => set('sibling', v)}
            label="Sibling discount (10% off — 2nd+ child in household)"
            sub="Applied automatically at checkout."
          />
          <CheckRow
            checked={!!p.volunteer}
            onChange={v => set('volunteer', v)}
            label="Volunteer credit from prior season"
            sub="Reduces your registration fee. Amount confirmed by the commissioner."
          />
        </div>
        <div style={{ marginTop: 16, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
          <Field label="Discount code" hint="Enter a promo or discount code if you have one">
            <Input value={p.discountCode} onChange={v => set('discountCode', v)} placeholder="e.g. COACH2025" />
          </Field>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackBtn onClick={back} />
        <ContinueBtn onClick={handleContinue} label="Continue to parent info" />
      </div>
    </div>
  );
}

function CheckRow({ checked, onChange, label, sub }) {
  return (
    <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 20, height: 20, borderRadius: 5, flexShrink: 0, marginTop: 2,
          border: `2px solid ${checked ? 'var(--court-navy)' : '#D1D5DB'}`,
          background: checked ? 'var(--court-navy)' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 160ms',
        }}
      >
        {checked && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{sub}</div>
      </div>
    </label>
  );
}
