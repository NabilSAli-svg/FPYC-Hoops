import { useState } from 'react';
import { BackBtn } from './StepProgram.jsx';
import { usePlayers, useRegistrations } from '../shared/store.js';

const PROGRAM_PRICES  = { house: 195, clinic: 95, travel: 425 };
const PROGRAM_LABELS  = { house: 'House League', clinic: 'Skills Clinic', travel: 'Travel Select' };

const GRADE_RANK = { 'Kindergarten': 0, '1st Grade': 1, '2nd Grade': 2, '3rd Grade': 3, '4th Grade': 4, '5th Grade': 5, '6th Grade': 6, '7th Grade': 7, '8th Grade': 8 };

function gradeShort(g) { return g === 'Kindergarten' ? 'K' : g?.replace(' Grade', '') || '?'; }

function deriveDivision(gender, grade, programId) {
  if (programId === 'clinic') return 'Skills Clinic';
  const rank = GRADE_RANK[grade] ?? 5;
  const genderLabel = gender === 'Female' ? 'Girls' : 'Boys';
  if (rank <= 2) return `${genderLabel} K–2 House`;
  if (rank <= 4) return `${genderLabel} 3–4 House`;
  if (rank <= 6) return programId === 'travel' ? `${genderLabel} 5–6 Select` : `${genderLabel} 5–6 House`;
  return programId === 'travel' ? `${genderLabel} 7–8 Select` : `${genderLabel} 7–8 House`;
}

function formatCardNumber(val) {
  const digits = val.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, '$1 ');
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function StepReview({ data, back, isMobile }) {
  const [payMethod, setPayMethod] = useState('visa');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmNum] = useState(() => 'FPYC-' + Math.random().toString(36).slice(2, 8).toUpperCase());
  const [, setPlayers] = usePlayers();
  const [, setRegistrations] = useRegistrations();

  const prog   = data.program;
  const player = data.player;
  const p1     = data.parents?.p1 || {};
  const donation = data.donation;

  const basePrice     = prog ? PROGRAM_PRICES[prog.id] : 0;
  const siblingDiscount = player.sibling ? -(basePrice * 0.1) : 0;
  const donationAmt   = donation?.amount || 0;
  const total         = basePrice + siblingDiscount + donationAmt;

  const setCardField = (k, v) => setCard(c => ({ ...c, [k]: v }));

  const cardValid =
    card.name.trim().length > 1 &&
    card.number.replace(/\s/g, '').length >= 15 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    card.cvv.length >= 3;

  function handlePay() {
    if (!cardValid) return;
    setProcessing(true);
    setTimeout(() => {
      const division = deriveDivision(player.gender, player.grade, prog?.id || 'house');
      const waiverSigned = !!(data.waivers?.concussion && data.waivers?.seasonal);
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      let nextId;
      setPlayers(prev => {
        const ids = prev.map(p => parseInt(p.id.replace('p', ''), 10)).filter(n => !isNaN(n));
        nextId = 'p' + (Math.max(0, ...ids) + 1);
        const newPlayer = {
          id: nextId,
          number: Math.floor(Math.random() * 49) + 1,
          name: `${player.firstName} ${player.lastName}`,
          grade: gradeShort(player.grade),
          school: player.school || '',
          guardian: `${p1.firstName?.[0] || ''}. ${p1.lastName || ''}`.trim(),
          phone: p1.phone || '',
          position: 'Guard',
          status: 'pending',
          waiver: waiverSigned,
          program: prog ? PROGRAM_LABELS[prog.id] : 'House League',
          division,
          team: 'Unassigned',
          regDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          confirmNum,
        };
        return [...prev, newPlayer];
      });

      setRegistrations(prev => {
        const ids = prev.map(r => parseInt(r.id.replace('r', ''), 10)).filter(n => !isNaN(n));
        const regId = 'r' + (Math.max(0, ...ids) + 1);
        return [...prev, {
          id: regId,
          parent: `${p1.firstName?.[0] || ''}. ${p1.lastName || ''}`.trim(),
          player: `${player.firstName} ${player.lastName}`,
          grade: gradeShort(player.grade),
          division,
          date: dateStr,
          paid: true,
          waiver: waiverSigned,
          status: 'pending',
          playerId: nextId,
          confirmNum,
        }];
      });

      setProcessing(false);
      setSubmitted(true);
    }, 2200);
  }

  if (submitted) return <SuccessScreen player={player} prog={prog} email={p1.email} confirmNum={confirmNum} isMobile={isMobile} />;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)', marginBottom: 6 }}>Step 7 of 7</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1, marginBottom: 10 }}>Review & pay</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left: summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SummaryCard title="Registration summary">
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '2px 0 14px', borderBottom: '1px solid #F3F4F6' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--varsity-gold)',
              }}>
                {player.firstName?.[0]}{player.lastName?.[0]}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--court-navy)' }}>{player.firstName} {player.lastName}</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{player.dob} · {player.grade} · {player.gender}</div>
              </div>
            </div>
            <div style={{ paddingTop: 14 }}>
              <Row label="Program" value={prog ? PROGRAM_LABELS[prog.id] : '—'} />
              <Row label="Season" value="2025–26 Winter" />
              {player.school && <Row label="School" value={player.school} />}
            </div>
          </SummaryCard>

          <SummaryCard title="Parent / guardian">
            <Row label="Parent 1" value={`${p1.firstName || ''} ${p1.lastName || ''}`} />
            <Row label="Email" value={p1.email} mono />
            <Row label="Phone" value={p1.phone} mono />
            <Row label="Relationship" value={p1.relationship} />
          </SummaryCard>

          <SummaryCard title="Fee breakdown">
            <Row label={`${prog ? PROGRAM_LABELS[prog.id] : 'Program'} registration`} value={`$${basePrice.toFixed(2)}`} mono />
            {siblingDiscount < 0 && <Row label="Sibling discount (10%)" value={`-$${Math.abs(siblingDiscount).toFixed(2)}`} mono green />}
            {player.scholarship && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>
                <span>Scholarship application</span><span>Pending review</span>
              </div>
            )}
            {donationAmt > 0 && <Row label={`Donation (${donation.tier} tier)`} value={`$${donationAmt.toFixed(2)}`} mono />}
            <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 10, paddingTop: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>
                <span>Total due today</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>${total.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>$50 minimum fee deducted from any refund</div>
            </div>
          </SummaryCard>
        </div>

        {/* Right: payment */}
        <div style={{ position: isMobile ? 'static' : 'sticky', top: 100 }}>
          <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E5EA', fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>
              Payment method
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {[
                  { id: 'visa', label: 'Visa / MC / Disc' },
                  { id: 'amex', label: 'Amex' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer',
                      border: `2px solid ${payMethod === m.id ? 'var(--court-navy)' : '#E2E5EA'}`,
                      background: payMethod === m.id ? 'rgba(10,31,61,0.04)' : '#fff',
                      fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-body)',
                      color: payMethod === m.id ? 'var(--court-navy)' : '#6B7280',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    }}
                  >
                    <svg width="28" height="20" viewBox="0 0 32 22" fill="none">
                      <rect width="32" height="22" rx="3" fill={payMethod === m.id ? '#F0F4FF' : '#F9FAFB'} />
                      <rect y="6" width="32" height="5" fill={payMethod === m.id ? 'var(--court-navy)' : '#D1D5DB'} />
                      <rect x="3" y="14" width="8" height="3" rx="1" fill={payMethod === m.id ? 'var(--varsity-gold)' : '#E2E5EA'} />
                    </svg>
                    {m.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <CardField label="Cardholder name" placeholder="Full name on card"
                  value={card.name}
                  onChange={v => setCardField('name', v)} />
                <CardField label="Card number" placeholder="0000 0000 0000 0000"
                  value={card.number}
                  onChange={v => setCardField('number', formatCardNumber(v))} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <CardField label="Expiry" placeholder="MM/YY"
                    value={card.expiry}
                    onChange={v => setCardField('expiry', formatExpiry(v))} />
                  <CardField label="CVV" placeholder="•••"
                    value={card.cvv}
                    onChange={v => setCardField('cvv', v.replace(/\D/g, '').slice(0, payMethod === 'amex' ? 4 : 3))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, alignItems: 'center', margin: '14px 0', fontSize: 12, color: '#9CA3AF' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Payments are processed securely by OttoSport
              </div>

              <button
                onClick={handlePay}
                disabled={!cardValid || processing}
                style={{
                  width: '100%', padding: '15px', borderRadius: 10, border: 'none',
                  background: (!cardValid || processing) ? '#E2E5EA' : 'var(--court-navy)',
                  color: (!cardValid || processing) ? '#9CA3AF' : '#fff',
                  cursor: (!cardValid || processing) ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'background 200ms',
                }}
              >
                {processing ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    Pay ${total.toFixed(2)} & complete registration
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </>
                )}
              </button>

              {!cardValid && (
                <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#9CA3AF' }}>
                  Fill in your card details above to enable payment
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <BackBtn onClick={back} />
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SuccessScreen({ player, prog, email, confirmNum, isMobile }) {
  const programLabel = prog ? PROGRAM_LABELS[prog.id] : 'FPYC Basketball';
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: isMobile ? '0 0 40px' : '20px 0 60px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'rgba(5,150,105,0.10)', border: '2px solid #059669',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 36 : 44, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1, marginBottom: 14 }}>
          You&apos;re in!
        </div>
        <p style={{ fontSize: 17, color: '#374151', lineHeight: 1.55, margin: '0 0 8px' }}>
          <strong>{player.firstName} {player.lastName}</strong> is registered for{' '}
          <strong style={{ color: 'var(--court-navy)' }}>{programLabel}</strong> — Season 2025–26.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: '#F4F5F7', border: '1px solid #E2E5EA', marginTop: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#374151', fontFamily: 'var(--font-mono)' }}>{confirmNum}</span>
        </div>
        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 10 }}>
          Confirmation sent to <strong style={{ color: '#6B7280' }}>{email}</strong>
        </div>
      </div>

      {/* What happens next */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 15, color: 'var(--court-navy)' }}>
          What happens next
        </div>
        <div style={{ padding: '8px 0' }}>
          {[
            {
              icon: 'mail',
              title: 'Check your inbox',
              body: `A receipt and registration confirmation will arrive at ${email} within a few minutes.`,
              timing: 'Right now',
              color: '#2563EB',
            },
            {
              icon: 'users',
              title: 'Team placement',
              body: 'The commissioner will assign your player to a team. Expect an email by early November with your team name and coach contact.',
              timing: 'Early November',
              color: 'var(--basketball-orange)',
            },
            {
              icon: 'calendar',
              title: 'First practice',
              body: 'Your volunteer coach will reach out with practice location, time, and what to bring before the season kicks off in December.',
              timing: 'Late November',
              color: 'var(--court-navy)',
            },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 16, padding: '16px 24px',
              borderBottom: i < 2 ? '1px solid #F9FAFB' : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${step.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SuccessIcon name={step.icon} color={step.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3, lineHeight: 1.5 }}>{step.body}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: step.color, flexShrink: 0, whiteSpace: 'nowrap', marginTop: 2 }}>{step.timing}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="/family" style={{
          flex: 1, minWidth: 160,
          background: 'var(--court-navy)', color: '#fff',
          padding: '14px 20px', borderRadius: 10, textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <SuccessIcon name="layout" color="#fff" size={15} />
          View family portal
        </a>
        <a href="/" style={{
          flex: 1, minWidth: 160,
          background: '#fff', color: 'var(--court-navy)',
          border: '1.5px solid #E2E5EA',
          padding: '14px 20px', borderRadius: 10, textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Back to FPYC Basketball
        </a>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={() => window.location.reload()} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, color: '#9CA3AF', fontFamily: 'var(--font-body)',
          textDecoration: 'underline',
        }}>Register another player</button>
      </div>
    </div>
  );
}

function SuccessIcon({ name, color, size = 18 }) {
  const paths = {
    mail: <><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    layout: <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function SummaryCard({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>{title}</div>
      <div style={{ padding: '14px 18px' }}>{children}</div>
    </div>
  );
}

const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 13 };

function Row({ label, value, mono, green }) {
  return (
    <div style={rowStyle}>
      <span style={{ color: '#6B7280' }}>{label}</span>
      <span style={{ fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontWeight: 600, color: green ? '#059669' : '#111827' }}>{value}</span>
    </div>
  );
}

function CardField({ label, placeholder, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '10px 12px', borderRadius: 8,
          border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)',
          outline: 'none', color: '#111827',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--court-navy)'}
        onBlur={e => e.target.style.borderColor = '#E2E5EA'}
      />
    </div>
  );
}
