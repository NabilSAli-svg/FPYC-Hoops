import { SectionHead } from './Programs.jsx';

const TESTIMONIALS = [
  {
    quote: "Jordan's been in FPYC House League for three seasons. The coaches are incredible — they actually care about teaching fundamentals, not just winning. He's made lifelong friends and can't wait for games every Saturday.",
    name: 'Maria R.',
    role: 'Parent · Jordan, 6th grade · Hawks Boys 5–6',
    initials: 'MR',
    color: 'var(--court-navy)',
    season: '3rd season',
  },
  {
    quote: "I signed up to volunteer as an assistant coach thinking it'd be casual. Three seasons later, I'm a head coach. FPYC trains you, supports you, and connects you with an amazing network of parents who genuinely care about kids.",
    name: 'Coach M. Davis',
    role: 'Head Coach · Boys 5–6 House · Volunteer since 2022',
    initials: 'MD',
    color: 'var(--basketball-orange)',
    season: 'Volunteer coach',
  },
  {
    quote: "Maya was nervous her first day — she'd never played before. By game three she was running plays and cheering on teammates. That's FPYC. Every kid finds their place, no matter where they're starting from.",
    name: 'Lisa C.',
    role: 'Parent · Maya, 5th grade · Skills Clinic → House League',
    initials: 'LC',
    color: '#059669',
    season: '2nd season',
  },
];

export default function Testimonials() {
  return (
    <section style={{ background: 'var(--court-navy)', padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,199,44,0.08), transparent 50%), radial-gradient(circle at 80% 50%, rgba(232,119,34,0.06), transparent 50%)',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)', marginBottom: 10 }}>
            From our families
          </div>
          <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(36px, 4vw, 52px)', lineHeight: 1, color: '#fff' }}>
            What parents say
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 14,
              padding: '28px 26px',
              display: 'flex', flexDirection: 'column', gap: 20,
              backdropFilter: 'blur(8px)',
            }}>
              {/* Quote mark */}
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <path d="M0 24V14.4C0 10.4 1.06667 7.06667 3.2 4.4C5.33333 1.6 8.26667 0 12 0V4C9.73333 4 8 4.86667 6.8 6.6C5.73333 8.2 5.2 10.2 5.2 12.6H10.4V24H0ZM18 24V14.4C18 10.4 19.0667 7.06667 21.2 4.4C23.3333 1.6 26.2667 0 30 0V4C27.7333 4 26 4.86667 24.8 6.6C23.7333 8.2 23.2 10.2 23.2 12.6H28.4V24H18Z" fill="var(--varsity-gold)" opacity="0.3"/>
              </svg>

              {/* Quote */}
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.88)', margin: 0, flex: 1, fontStyle: 'italic' }}>
                "{t.quote}"
              </p>

              {/* Attribution */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 16, color: '#fff',
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '3px 8px', borderRadius: 999,
                    background: 'rgba(255,199,44,0.15)', color: 'var(--varsity-gold)',
                  }}>{t.season}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div style={{ marginTop: 48, display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          {[
            { value: '500+', label: 'kids playing this season' },
            { value: '4.9★', label: 'avg parent rating' },
            { value: '62yrs', label: 'serving Fairfax families' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--varsity-gold)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
