import Icon from '../shared/Icon.jsx';
import { PAYMENTS, BALANCE, TEAM } from './data.js';

export default function PaymentsTab({ family }) {
  const allPaid = BALANCE.due === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Balance status card */}
      <div style={{
        background: allPaid ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
        border: `1.5px solid ${allPaid ? 'rgba(5,150,105,0.25)' : 'rgba(220,38,38,0.25)'}`,
        borderRadius: 14, padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: allPaid ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={allPaid ? 'check-circle-2' : 'alert-circle'} size={26} color={allPaid ? '#059669' : '#DC2626'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: allPaid ? '#065F46' : '#991B1B' }}>
            {allPaid ? "You're all paid up!" : `$${BALANCE.due.toFixed(2)} due`}
          </div>
          <div style={{ fontSize: 13, color: allPaid ? '#047857' : '#B91C1C', marginTop: 2 }}>
            {allPaid
              ? `Total paid: $${BALANCE.paid.toFixed(2)} · ${TEAM.name} 2025–26 season`
              : `Due by ${BALANCE.nextDue} to maintain eligibility`}
          </div>
        </div>
        {!allPaid && (
          <button style={{
            background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8,
            padding: '10px 16px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', flexShrink: 0,
          }}>Pay now</button>
        )}
      </div>

      {/* Registration summary */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>Registration summary</div>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(5,150,105,0.10)', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active</span>
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: 'var(--court-navy)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--varsity-gold)',
            }}>
              {family.child.number}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{family.child.name}</div>
              <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{family.child.grade} · {family.child.position} · {TEAM.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <SummaryRow label="Program" value="House League" />
            <SummaryRow label="Season" value="2025–26 Winter" />
            <SummaryRow label="Division" value={TEAM.division} />
            <SummaryRow label="Status" value="Registered & active" color="#059669" />
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>
          Payment history
        </div>
        <div>
          {PAYMENTS.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px',
              borderBottom: i < PAYMENTS.length - 1 ? '1px solid #F9FAFB' : 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                background: p.amount < 0 ? 'rgba(5,150,105,0.10)' : 'rgba(10,31,61,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={p.amount < 0 ? 'tag' : 'credit-card'} size={16} color={p.amount < 0 ? '#059669' : 'var(--court-navy)'} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.desc}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                  {p.date}{p.method ? ` · ${p.method}` : ''}{p.receipt ? ` · ${p.receipt}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 18,
                  color: p.amount < 0 ? '#059669' : '#111827',
                }}>
                  {p.amount < 0 ? `-$${Math.abs(p.amount).toFixed(2)}` : `$${p.amount.toFixed(2)}`}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, marginTop: 3, display: 'inline-block',
                  background: p.status === 'paid' ? 'rgba(5,150,105,0.10)' : 'rgba(10,31,61,0.08)',
                  color: p.status === 'paid' ? '#059669' : 'var(--court-navy)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>{p.status}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 18px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>Total paid</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--court-navy)' }}>${BALANCE.paid.toFixed(2)}</span>
        </div>
      </div>

      {/* Help section */}
      <div style={{ background: '#fff', border: '1px solid #E2E5EA', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,199,44,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="help-circle" size={18} color="var(--basketball-orange)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--court-navy)' }}>Questions about payments or refunds?</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>$50 minimum handling fee applies to all refunds · Season 2025–26</div>
        </div>
        <a href="mailto:basketball@fpycsports.com" style={{ all: 'unset', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--court-navy)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Icon name="mail" size={13} /> Email us
        </a>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
      <span style={{ color: '#6B7280' }}>{label}</span>
      <span style={{ fontWeight: 600, color: color || '#111827' }}>{value}</span>
    </div>
  );
}
