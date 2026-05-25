import Icon from '../shared/Icon.jsx';

export default function Hero({ onRegister }) {
  return (
    <section id="hero" style={{ background: 'var(--court-navy)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,199,44,0.16), transparent 50%), radial-gradient(circle at 10% 90%, rgba(232,119,34,0.12), transparent 55%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', right: -120, bottom: -60, opacity: 0.06, pointerEvents: 'none' }}>
        <img src="/assets/court-half.svg" alt="" style={{ width: 800 }} />
      </div>

      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '80px 24px 96px',
        display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, alignItems: 'center', position: 'relative',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,199,44,0.14)', color: 'var(--varsity-gold)',
            padding: '6px 12px', borderRadius: 999,
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, background: 'var(--varsity-gold)', borderRadius: '50%' }} />
            2025–26 Season · Now open
          </div>

          <div style={{
            fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.01em',
            fontSize: 'clamp(40px, 5.5vw, 72px)', lineHeight: 1, marginBottom: 18,
          }}>
            Get in the game.<br />
            <span style={{ color: 'var(--varsity-gold)' }}>Register today.</span>
          </div>

          <p style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.82)', maxWidth: 560, marginBottom: 28 }}>
            House League and Select Travel for grades K through 8. Volunteer-coached, community-rooted, and built around hard work, sportsmanship, and having fun.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <a
              href="https://fpycsports.ottosport.ai/sports/basketball"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'var(--varsity-gold)', color: 'var(--court-navy)', padding: '14px 22px', borderRadius: 8,
                textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >Register for 2025–26 <Icon name="arrow-right" size={16} /></a>
            <a href="#register" onClick={(e) => { e.preventDefault(); onRegister(); }} style={{
              background: 'rgba(255,255,255,0.08)', color: '#fff', padding: '14px 22px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}><Icon name="info" size={16} /> How it works</a>
          </div>

          <div style={{ display: 'flex', gap: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
            <Fact value="K–8" label="Grades" />
            <Fact value="$195" label="Reg fee" />
            <Fact value="10+" label="Games / season" />
            <Fact value="62" label="Years in Fairfax" />
          </div>
        </div>

        {/* Registration card */}
        <div style={{ background: '#fff', color: 'var(--fg)', borderRadius: 14, padding: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.30)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -1, left: 24, right: 24, height: 4, background: 'var(--varsity-gold)', borderRadius: '0 0 4px 4px' }} />
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)' }}>
            Walk-in registration
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, textTransform: 'uppercase', lineHeight: 1, margin: '8px 0 14px', color: 'var(--court-navy)' }}>
            Sept 27 &amp; Oct 11
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-soft)', lineHeight: 1.55, marginBottom: 18 }}>
            Saturdays, 10:00 AM – 12:00 PM<br />
            FPYC Office, 3955 Pickett Rd, Fairfax VA
          </div>
          <div style={{ background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Icon name="alert-triangle" size={14} color="var(--status-warning)" />
              <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--court-navy)' }}>Late fees</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)' }}>Begin November 15. Register early.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: 20 }}>
            <CheckLine text="Scholarships available — apply during registration" />
            <CheckLine text="Sibling discount: 10% off second child" />
            <CheckLine text="Volunteer credit reduces next-season fee" />
          </div>
          <a
            href="https://fpycsports.ottosport.ai/sports/basketball"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--court-navy)', color: '#fff',
              padding: '13px 16px', borderRadius: 8, textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            }}
          >
            Begin registration <Icon name="external-link" size={14} />
          </a>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--fg-muted)' }}>
            Powered by OttoSport · Secure payment
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, color: 'var(--varsity-gold)' }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>{label}</div>
    </div>
  );
}

function CheckLine({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Icon name="check" size={14} color="var(--status-win)" />
      <span style={{ color: 'var(--fg-soft)' }}>{text}</span>
    </div>
  );
}
