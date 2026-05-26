import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { useIsMobile } from '../shared/useIsMobile.js';
import StepProgram from './StepProgram.jsx';
import StepPlayer from './StepPlayer.jsx';
import StepParents from './StepParents.jsx';
import StepWaivers from './StepWaivers.jsx';
import StepDonation from './StepDonation.jsx';
import StepReview from './StepReview.jsx';

const STEPS = [
  { id: 'program',  label: 'Program',  icon: 'layout-grid' },
  { id: 'player',   label: 'Player',   icon: 'user' },
  { id: 'parents',  label: 'Parents',  icon: 'users' },
  { id: 'waivers',  label: 'Waivers',  icon: 'shield-check' },
  { id: 'donation', label: 'Support',  icon: 'heart' },
  { id: 'review',   label: 'Pay',      icon: 'credit-card' },
];

export default function RegisterApp() {
  const [step, setStep] = useState(0);
  const isMobile = useIsMobile();
  const [data, setData] = useState({
    program: null,
    player: {},
    parents: { p1: {}, p2: {} },
    waivers: { concussion: false, seasonal: false },
    donation: null,
  });

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const stepProps = { data, update, next, back, isMobile };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--court-navy)',
        borderBottom: '3px solid var(--varsity-gold)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>FPYC Basketball</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Registration 2025–26</div>
            </div>
          </a>
          <a href="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="x" size={14} /> Cancel
          </a>
        </div>
      </header>

      {/* Step progress — desktop */}
      {!isMobile && (
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E5EA' }}>
          <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'stretch' }}>
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <button
                    key={s.id}
                    onClick={() => done && setStep(i)}
                    disabled={!done}
                    style={{
                      flex: 1, padding: '14px 8px', background: 'none', border: 'none',
                      cursor: done ? 'pointer' : 'default',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      borderBottom: active ? '3px solid var(--varsity-gold)' : done ? '3px solid var(--court-navy)' : '3px solid transparent',
                      transition: 'border-color 200ms',
                      position: 'relative',
                    }}
                  >
                    {i > 0 && (
                      <div style={{
                        position: 'absolute', left: 0, top: 29, width: '50%', height: 1,
                        background: i <= step ? 'var(--court-navy)' : '#E2E5EA',
                      }} />
                    )}
                    {i < STEPS.length - 1 && (
                      <div style={{
                        position: 'absolute', right: 0, top: 29, width: '50%', height: 1,
                        background: i < step ? 'var(--court-navy)' : '#E2E5EA',
                      }} />
                    )}
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', zIndex: 1,
                      background: active ? 'var(--court-navy)' : done ? 'var(--court-navy)' : '#E2E5EA',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 200ms',
                    }}>
                      {done
                        ? <Icon name="check" size={14} color="#fff" />
                        : <Icon name={s.icon} size={14} color={active ? '#fff' : '#9CA3AF'} />
                      }
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                      color: active ? 'var(--court-navy)' : done ? 'var(--court-navy)' : '#9CA3AF',
                      textTransform: 'uppercase',
                    }}>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step progress — mobile */}
      {isMobile && (
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E5EA', padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={STEPS[step].icon} size={15} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--basketball-orange)' }}>
                Step {step + 1} of {STEPS.length}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--court-navy)', lineHeight: 1.1 }}>
                {STEPS[step].label === 'Pay' ? 'Review & Pay' : STEPS[step].label}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{
                  width: i === step ? 20 : 6, height: 6, borderRadius: 999,
                  background: i < step ? 'var(--court-navy)' : i === step ? 'var(--varsity-gold)' : '#E2E5EA',
                  transition: 'all 300ms',
                }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: isMobile ? '24px 16px 60px' : '40px 24px 80px' }}>
        {step === 0 && <StepProgram {...stepProps} />}
        {step === 1 && <StepPlayer {...stepProps} />}
        {step === 2 && <StepParents {...stepProps} />}
        {step === 3 && <StepWaivers {...stepProps} />}
        {step === 4 && <StepDonation {...stepProps} />}
        {step === 5 && <StepReview {...stepProps} />}
      </div>
    </div>
  );
}
