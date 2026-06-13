import Icon from '../shared/Icon.jsx';
import { StepHeader, ContinueBtn } from './StepProgram.jsx';

const SPORTS = [
  { id: 'basketball', title: 'Basketball', icon: 'circle-dot', color: 'var(--basketball-orange)', desc: 'House League, Skills Clinic, and Travel Select — Winter season.' },
  { id: 'soccer', title: 'Soccer', icon: 'circle', color: 'var(--court-navy)', desc: 'Mini & Mighty Academy, PowerRec Youth, and NCSL Rec — Spring season.' },
];

export default function StepSport({ data, update, next, isMobile }) {
  const selected = data.sport;

  return (
    <div>
      <StepHeader
        eyebrow="Step 1 of 7"
        title="Choose your sport"
        sub="Select the FPYC program you'd like to register for."
      />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
        {SPORTS.map(s => {
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => { update('sport', s.id); update('program', null); }}
              style={{
                all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                background: isSelected ? 'var(--court-navy)' : '#fff',
                border: isSelected ? '2px solid var(--court-navy)' : '2px solid #E2E5EA',
                borderRadius: 14, overflow: 'hidden',
                boxShadow: isSelected ? '0 8px 32px rgba(10,31,61,0.18)' : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 160ms ease',
              }}
            >
              <div style={{ height: 6, background: isSelected ? 'var(--varsity-gold)' : s.color }} />
              <div style={{ padding: '24px 24px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(10,31,61,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name={s.icon} size={22} color={isSelected ? 'var(--varsity-gold)' : s.color} />
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 26, textTransform: 'uppercase',
                    color: isSelected ? '#fff' : 'var(--court-navy)', lineHeight: 1,
                  }}>{s.title}</div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: isSelected ? 'rgba(255,255,255,0.82)' : '#4B5563', margin: 0 }}>{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ContinueBtn disabled={!selected} onClick={next} label="Continue to program" />
      </div>
    </div>
  );
}
