import Icon from '../shared/Icon.jsx';

export default function Programs() {
  return (
    <section id="programs" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px 24px' }}>
      <SectionHead eyebrow="Programs" title="Three ways to play" />
      <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
        <ProgramCard
          tag="Rec"
          title="Rec League"
          grades="K – 12th grade"
          price="$195"
          desc="Our flagship recreational program. Balanced teams, every player gets meaningful minutes, focus on fundamentals and fun."
          bullets={['K-3 3v3 through high school', 'Weekday practice at local schools', 'Boys and girls divisions 3/4 through 7/8']}
        />
        <ProgramCard
          tag="Competitive"
          title="Select"
          grades="5th – 8th grade"
          price="$425"
          desc="Tryout-based competitive teams playing in the Fairfax County Youth Basketball League (FCYBL). Two practices a week."
          bullets={['FCYBL games across NoVa', 'Tryouts in early September', 'Boys and girls, 5th through 8th']}
          featured
        />
        <ProgramCard
          tag="Clinic"
          title="Skills Clinic"
          grades="1st grade – high school"
          price="$200"
          desc="Six Monday-evening development sessions grouped by ability. Led by Nabil and Shaun Ali with local HS coaches and standout players."
          bullets={['6 Mondays, Sep 14 – Oct 26', 'Beginner 6–7 · Intermediate 7–8 · Advanced 8–9', 'Providence ES · gym may change']}
        />
      </div>
    </section>
  );
}

function ProgramCard({ tag, title, grades, price, desc, bullets, featured }) {
  return (
    <div style={{
      background: featured ? 'var(--court-navy)' : '#fff',
      color: featured ? '#fff' : 'var(--fg)',
      border: featured ? '1px solid var(--court-navy)' : '1px solid var(--border)',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: featured ? 'var(--shadow-3)' : 'var(--shadow-1)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 6, background: featured ? 'var(--varsity-gold)' : 'var(--border-strong)' }} />
      <div style={{ padding: '22px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: featured ? 'var(--varsity-gold)' : 'var(--fg-muted)',
          }}>{tag}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: featured ? 'var(--varsity-gold)' : 'var(--court-navy)', lineHeight: 1 }}>{price}</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 36, lineHeight: 1, margin: '12px 0 6px', color: featured ? '#fff' : 'var(--court-navy)' }}>{title}</div>
        <div style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,0.6)' : 'var(--fg-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{grades}</div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: featured ? 'rgba(255,255,255,0.82)' : 'var(--fg-soft)', marginTop: 14, marginBottom: 18 }}>{desc}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bullets.map(b => (
            <li key={b} style={{ display: 'flex', gap: 8, fontSize: 13, color: featured ? 'rgba(255,255,255,0.85)' : 'var(--fg)' }}>
              <Icon name="check" size={14} color="var(--varsity-gold)" style={{ marginTop: 3, flexShrink: 0 }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <a href="/register" style={{
          marginTop: 'auto',
          background: featured ? 'var(--varsity-gold)' : 'transparent',
          color: 'var(--court-navy)',
          border: featured ? 'none' : '1px solid var(--court-navy)',
          padding: '12px 16px', borderRadius: 8, textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
        }}>Sign up <Icon name="arrow-right" size={14} /></a>
      </div>
    </div>
  );
}

export function SectionHead({ eyebrow, title, sub }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--basketball-orange)' }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1, marginTop: 8, color: 'var(--court-navy)' }}>{title}</div>
      {sub && <p style={{ fontSize: 16, color: 'var(--fg-soft)', marginTop: 12, maxWidth: 640, lineHeight: 1.55 }}>{sub}</p>}
    </div>
  );
}
