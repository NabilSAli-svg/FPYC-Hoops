import { StepHeader, ContinueBtn, BackBtn } from './StepProgram.jsx';

export default function StepWaivers({ data, update, next, back }) {
  const w = data.waivers;
  const set = (k, v) => update('waivers', { ...w, [k]: v });
  const bothSigned = w.concussion && w.seasonal;

  return (
    <div>
      <StepHeader
        eyebrow="Step 4 of 6"
        title="Health & waivers"
        sub="These agreements are required before your child can participate in any FPYC activity."
      />

      {/* Concussion Agreement */}
      <WaiverCard
        title="CDC Concussion Agreement"
        badge="Required"
        icon="brain"
        checked={w.concussion}
        onCheck={v => set('concussion', v)}
        checkLabel="I have read and acknowledge the CDC Concussion Agreement"
      >
        <p style={pStyle}>
          As a condition of participation in FPYC activities, all parents and athletes must read and acknowledge
          that they have read the concussion information sheet prepared by the Centers for Disease Control (CDC).
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
          <DocLink
            href="https://www.cdc.gov/headsup/pdfs/custom/headsupconcussion_parent_athlete_info.pdf"
            label="CDC Concussion Info — Parents"
          />
          <DocLink
            href="https://www.cdc.gov/headsup/pdfs/custom/headsupconcussion_fact_sheet_for_athletes.pdf"
            label="CDC Concussion Info — Athletes"
          />
        </div>
      </WaiverCard>

      {/* Seasonal Waiver */}
      <WaiverCard
        title="Seasonal Participation Waiver"
        badge="Required"
        icon="shield"
        checked={w.seasonal}
        onCheck={v => set('seasonal', v)}
        checkLabel="I agree to the terms and conditions of the Seasonal Waiver"
      >
        <div style={{ maxHeight: 180, overflowY: 'auto', padding: '12px 16px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #E5E7EB' }}>
          <p style={{ ...pStyle, marginBottom: 12 }}>
            As parents/guardians of the child registered hereon, I/we hereby approve his/her participation in this activity.
            I/We acknowledge and assume the risks and hazards of such participation, including transport to and from the
            activity, and I/We recognize the inherent dangerousness of sporting activities.
          </p>
          <p style={{ ...pStyle, marginBottom: 12 }}>
            I/We authorize the coach or other FPYC adult volunteers to provide first aid assistance and request emergency
            medical assistance in the event of an injury to my/our child.
          </p>
          <p style={{ ...pStyle, marginBottom: 12 }}>
            I/We further agree to indemnify and hold harmless FPYC Inc., its directors, officers and agents for any fine,
            penalty or assessment issued against FPYC Inc., as a result of the conduct of my child, myself, or my child's
            other parent/guardian during participation in any sports activity sponsored by FPYC, Inc.
          </p>
          <p style={{ ...pStyle, color: '#DC2626', fontWeight: 600 }}>
            I/We acknowledge that at a minimum, a $50 handling fee will be deducted from ALL refunds.
          </p>
        </div>
      </WaiverCard>

      {/* Both complete notice */}
      {bothSigned && (
        <div style={{
          background: 'rgba(31,138,91,0.08)', border: '1px solid rgba(31,138,91,0.25)',
          borderRadius: 10, padding: '14px 18px',
          display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24,
          fontSize: 14, fontWeight: 600, color: '#065f46',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Both agreements signed — you're good to continue.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackBtn onClick={back} />
        <ContinueBtn disabled={!bothSigned} onClick={next} label="Continue to donation" />
      </div>
    </div>
  );
}

function WaiverCard({ title, badge, icon, checked, onCheck, checkLabel, children }) {
  return (
    <div style={{
      background: '#fff', border: `2px solid ${checked ? '#059669' : '#E2E5EA'}`,
      borderRadius: 14, overflow: 'hidden', marginBottom: 16,
      transition: 'border-color 200ms',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #F3F4F6',
        display: 'flex', alignItems: 'center', gap: 10,
        background: checked ? 'rgba(5,150,105,0.04)' : '#fff',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: checked ? 'rgba(5,150,105,0.12)' : '#F4F5F7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={checked ? '#059669' : '#6B7280'} strokeWidth="2">
            {icon === 'brain'
              ? <path d="M9.5 2a2.5 2.5 0 0 1 5 0v.1a7 7 0 0 1 5.4 5.9H22v1a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-1h2.1A7 7 0 0 1 9.5 2.1V2zM9 16v4m6-4v4M7 20h10"/>
              : <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            }
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>{title}</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase',
          padding: '3px 8px', borderRadius: 999,
          background: 'rgba(200,16,46,0.10)', color: 'var(--foul-red)',
        }}>{badge}</span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {children}
        <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginTop: 16 }}>
          <div
            onClick={() => onCheck(!checked)}
            style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              border: `2px solid ${checked ? '#059669' : '#D1D5DB'}`,
              background: checked ? '#059669' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 160ms',
            }}
          >
            {checked && <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', lineHeight: 1.5 }}>{checkLabel}</span>
        </label>
      </div>
    </div>
  );
}

function DocLink({ href, label }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: 'var(--court-navy)', fontWeight: 600, textDecoration: 'none',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </a>
  );
}

const pStyle = { fontSize: 13, lineHeight: 1.65, color: '#4B5563', margin: 0 };
