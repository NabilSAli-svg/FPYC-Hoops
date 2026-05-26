import { useState } from 'react';
import { StepHeader, ContinueBtn, BackBtn } from './StepProgram.jsx';

const TIERS = [
  {
    id: 'platinum',
    label: 'Platinum',
    icon: '🏅',
    desc: 'Set your own amount',
    custom: true,
    bg: 'linear-gradient(135deg, #E8EDF2 0%, #CBD5E1 100%)',
    border: '#94A3B8',
    textColor: '#1E3A5F',
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: '🏆',
    desc: '$100 donation',
    amount: 100,
    bg: 'linear-gradient(135deg, #FFC72C 0%, #F59E0B 100%)',
    border: '#D97706',
    textColor: '#1E3A5F',
  },
  {
    id: 'silver',
    label: 'Silver',
    icon: '🥈',
    desc: '$50 or $75',
    amounts: [50, 75],
    bg: 'linear-gradient(135deg, #D1D5DB 0%, #9CA3AF 100%)',
    border: '#6B7280',
    textColor: '#1F2937',
  },
  {
    id: 'bronze',
    label: 'Bronze',
    icon: '🥉',
    desc: '$5, $10, or $25',
    amounts: [5, 10, 25],
    bg: 'linear-gradient(135deg, #E87722 0%, #C2652A 100%)',
    border: '#B45309',
    textColor: '#fff',
  },
];

export default function StepDonation({ data, update, next, back, isMobile }) {
  const donation = data.donation || {};
  const [customAmt, setCustomAmt] = useState('');
  const [remarks, setRemarks] = useState('');

  const setDonation = (tier, amount) => update('donation', { tier, amount, remarks });
  const skip = () => { update('donation', null); next(); };

  return (
    <div>
      <StepHeader
        eyebrow="Step 5 of 6 · Optional"
        title="Support FPYC"
        sub="FPYC is a 501(c)3 non-profit. Your donation funds scholarships, uniforms, gym maintenance, and field development for all kids in our community."
      />

      {/* Mission statement */}
      <div style={{
        background: 'var(--court-navy)',
        backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,199,44,0.12), transparent 55%)',
        borderRadius: 14, padding: '20px 24px', marginBottom: 24,
        display: 'flex', gap: 16, alignItems: 'flex-start',
      }}>
        <div style={{ fontSize: 32, flexShrink: 0 }}>🏀</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase', lineHeight: 1, marginBottom: 8 }}>Every dollar stays local</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
            Based in the City of Fairfax, FPYC is a not-for-profit, 501(c)3 charitable organization. Donations go directly to
            registration scholarships, uniforms, equipment, gym and field maintenance for FPYC participants.
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {TIERS.map(tier => {
          const isSelected = donation.tier === tier.id;
          return (
            <div
              key={tier.id}
              style={{
                borderRadius: 14, overflow: 'hidden',
                border: `2px solid ${isSelected ? tier.border : '#E2E5EA'}`,
                boxShadow: isSelected ? `0 6px 24px rgba(0,0,0,0.15)` : '0 1px 3px rgba(0,0,0,0.06)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                transition: 'all 160ms ease',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (tier.amounts) setDonation(tier.id, tier.amounts[0]);
                else if (tier.amount) setDonation(tier.id, tier.amount);
                else setDonation(tier.id, null);
              }}
            >
              {/* Gradient header */}
              <div style={{
                background: tier.bg, padding: '20px 16px 16px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{ fontSize: 32 }}>{tier.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: tier.textColor, textTransform: 'uppercase', lineHeight: 1 }}>{tier.label}</div>
                <div style={{ fontSize: 12, color: tier.textColor === '#fff' ? 'rgba(255,255,255,0.75)' : 'rgba(30,58,95,0.65)', fontWeight: 600 }}>{tier.desc}</div>
              </div>

              {/* Amount selector */}
              <div style={{ background: '#fff', padding: '14px 12px' }}>
                {tier.custom && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18, color: '#374151', fontWeight: 700 }}>$</span>
                    <input
                      type="number"
                      min="1" max="5000"
                      value={customAmt}
                      onChange={e => {
                        setCustomAmt(e.target.value);
                        setDonation(tier.id, parseFloat(e.target.value) || null);
                      }}
                      placeholder="Amount"
                      style={{
                        flex: 1, padding: '8px 10px', borderRadius: 7,
                        border: '1.5px solid #E2E5EA', fontSize: 14,
                        fontFamily: 'var(--font-body)', outline: 'none',
                        color: '#111827',
                      }}
                    />
                  </div>
                )}
                {tier.amount && (
                  <div style={{
                    textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 28,
                    color: isSelected ? 'var(--court-navy)' : '#6B7280',
                  }}>${tier.amount}</div>
                )}
                {tier.amounts && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {tier.amounts.map(amt => (
                      <button
                        key={amt}
                        onClick={e => { e.stopPropagation(); setDonation(tier.id, amt); }}
                        style={{
                          padding: '7px 10px', borderRadius: 7, cursor: 'pointer',
                          background: donation.tier === tier.id && donation.amount === amt ? 'var(--court-navy)' : '#F4F5F7',
                          color: donation.tier === tier.id && donation.amount === amt ? '#fff' : '#374151',
                          border: 'none', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-body)',
                          transition: 'all 120ms',
                        }}
                      >${amt}.00</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remarks */}
      {donation.tier && (
        <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Donation remarks (optional)</label>
          <textarea
            value={remarks}
            onChange={e => { setRemarks(e.target.value); update('donation', { ...data.donation, remarks: e.target.value }); }}
            placeholder="Any notes for FPYC about your donation…"
            rows={2}
            style={{
              width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 8,
              border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)',
              resize: 'vertical', outline: 'none', color: '#111827',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BackBtn onClick={back} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={skip}
            style={{
              background: 'transparent', color: '#6B7280', border: '1px solid #E2E5EA',
              borderRadius: 10, padding: '14px 20px', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
            }}
          >Skip for now</button>
          <button
            onClick={next}
            disabled={!donation.tier || (donation.tier === 'platinum' && !donation.amount)}
            style={{
              background: (!donation.tier || (donation.tier === 'platinum' && !donation.amount)) ? '#E2E5EA' : 'var(--court-navy)',
              color: (!donation.tier || (donation.tier === 'platinum' && !donation.amount)) ? '#9CA3AF' : '#fff',
              border: 'none', borderRadius: 10, padding: '14px 28px',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            Review order
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
