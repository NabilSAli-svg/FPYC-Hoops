import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

const STEPS = [
  {
    num: '01',
    icon: 'user-plus',
    title: 'Create an account',
    sub: 'Sign in or register',
    desc: 'Head to the FPYC portal and sign in with your existing account. New family? Create a free account — takes under a minute.',
    tip: 'Already registered a child before? Use the same household login.',
  },
  {
    num: '02',
    icon: 'clipboard-list',
    title: 'Select order type',
    sub: 'Step 1.3',
    desc: 'Choose "Register a Participant / Player." You can also register as Team Staff / Volunteer or make a donation from this same screen.',
    tip: 'Registering multiple kids? You\'ll return here to add each one.',
  },
  {
    num: '03',
    icon: 'users',
    title: 'Identify your player',
    sub: 'Step 2.1',
    desc: 'Pick from your saved household members. First time? Select "Create New Member" and enter your child\'s name, birthdate, gender, and phone.',
    tip: 'Birthdate is used for age-division placement — enter it carefully.',
  },
  {
    num: '04',
    icon: 'calendar',
    title: 'Choose a season',
    sub: 'Step 2.2',
    desc: 'Select the open registration season for your child: House League, Skills Clinics (Player Development), or Travel Select. Football seasons also appear here.',
    tip: 'Not sure which to pick? House League is the right start for most kids.',
  },
  {
    num: '05',
    icon: 'user-check',
    title: 'Add parent info',
    sub: 'Step 2.3',
    desc: 'Provide Parent 1 and optionally Parent 2 contact details — name, email, phone, and relationship. Both parents with valid emails get household login access.',
    tip: 'A valid parent email is required to receive game schedules and team updates.',
  },
  {
    num: '06',
    icon: 'file-text',
    title: 'Registration form',
    sub: 'Step 2.4',
    desc: 'Select your child\'s school grade and acknowledge the CDC Concussion Agreement. Enter a discount code if you have one (sibling discount, volunteer credit, etc.).',
    tip: 'Scholarship? Ask the commissioner — no separate form needed.',
  },
  {
    num: '07',
    icon: 'eye',
    title: 'Review & confirm',
    sub: 'Step 2.5',
    desc: 'Check the fee summary before paying. Some programs show WAITLISTED — your spot is reserved once you complete checkout. Discounts are applied at this stage.',
    tip: '$50 minimum handling fee is deducted from all refunds per FPYC policy.',
  },
  {
    num: '08',
    icon: 'shield-check',
    title: 'Sign waiver & pay',
    sub: 'Step 2.6',
    desc: 'Read and accept the Seasonal Waiver, then complete secure payment. You\'ll receive a confirmation email instantly. Team placement follows after registration closes.',
    tip: 'Keep your confirmation email — it has your receipt and next steps.',
  },
];

export default function HowToRegister() {
  return (
    <section id="register" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
        <SectionHead
          eyebrow="Registration"
          title="How to sign up"
          sub="Eight steps, about 10 minutes. All registration is handled through the FPYC OttoSport portal."
        />
        <a
          href="/register"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'var(--varsity-gold)', color: 'var(--court-navy)',
            padding: '14px 22px', borderRadius: 8, textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
            display: 'inline-flex', alignItems: 'center', gap: 8,
            boxShadow: 'var(--shadow-2)', flexShrink: 0,
          }}
        >
          Begin registration <Icon name="external-link" size={16} />
        </a>
      </div>

      {/* Step grid — 4 columns × 2 rows */}
      <style>{`@media(max-width:639px){.reg-grid{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      <div className="reg-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px',
            boxShadow: 'var(--shadow-1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            position: 'relative',
          }}>
            {/* Connector line (not on last in each row) */}
            {i % 4 !== 3 && i < STEPS.length - 1 && (
              <div style={{
                position: 'absolute', top: 30, right: -9, width: 18,
                height: 2, background: 'var(--border)', zIndex: 1,
              }} />
            )}

            {/* Step number watermark */}
            <div style={{
              position: 'absolute', top: 12, right: 14,
              fontFamily: 'var(--font-display)', fontSize: 48,
              color: 'rgba(10,31,61,0.05)', lineHeight: 1, pointerEvents: 'none',
              userSelect: 'none',
            }}>{s.num}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--court-navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name={s.icon} size={16} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase', color: 'var(--court-navy)', lineHeight: 1.1 }}>{s.title}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>

            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-soft)', margin: 0 }}>{s.desc}</p>

            <div style={{
              marginTop: 'auto',
              background: 'rgba(255,199,44,0.10)',
              border: '1px solid rgba(255,199,44,0.28)',
              borderRadius: 7,
              padding: '8px 10px',
              display: 'flex', gap: 7, alignItems: 'flex-start',
            }}>
              <Icon name="lightbulb" size={13} color="var(--basketball-orange)" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--fg)', lineHeight: 1.5 }}>{s.tip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Waiver callout */}
      <div style={{
        marginTop: 20,
        background: 'var(--bone)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <Icon name="alert-circle" size={20} color="var(--basketball-orange)" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)', marginBottom: 4 }}>About the Seasonal Waiver</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--fg-soft)', margin: 0 }}>
            All families must sign the FPYC Seasonal Waiver and acknowledge the CDC Concussion Agreement before participation. The waiver covers transport to/from activities, the inherent risks of sporting participation, and authorizes FPYC coaches to provide first aid. A <strong>$50 minimum handling fee</strong> is deducted from all refunds.
          </p>
        </div>
      </div>

      {/* Bottom CTA banner */}
      <div style={{
        marginTop: 20,
        background: 'var(--court-navy)',
        backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(255,199,44,0.12), transparent 50%)',
        borderRadius: 14,
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>Ready to register?</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', margin: '8px 0 0' }}>
            Questions? Call <strong style={{ color: '#fff' }}>(703) 425-7000</strong> or email <strong style={{ color: '#fff' }}>basketball@fpycsports.com</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="/register"
            
            style={{
              background: 'var(--varsity-gold)', color: 'var(--court-navy)',
              padding: '12px 20px', borderRadius: 8, textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            Go to registration portal <Icon name="arrow-right" size={16} />
          </a>
          <a
            href="#contact"
            style={{
              background: 'rgba(255,255,255,0.10)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.20)',
              padding: '12px 20px', borderRadius: 8, textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <Icon name="mail" size={16} /> Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
