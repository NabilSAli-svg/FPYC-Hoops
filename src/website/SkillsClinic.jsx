import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';
import { REGISTER_URL } from '../shared/store.js';

const LEVELS = [
  {
    name: 'Beginner',
    grades: '1st – 4th grade',
    time: '6:00 – 7:00 PM',
    color: 'var(--court-navy)',
    note: '',
  },
  {
    name: 'Intermediate',
    grades: '5th – 8th grade',
    time: '7:00 – 8:00 PM',
    color: 'var(--basketball-orange)',
    note: 'Includes house league 7th/8th players',
  },
  {
    name: 'Advanced',
    grades: 'High school',
    time: '8:00 – 9:00 PM',
    color: '#C8102E',
    note: 'Plus middle school AAU / Travel / Select players',
  },
];

const FOCUS = [
  { icon: 'target',      text: 'Traditional drills with creative twists — shooting, passing, ball handling' },
  { icon: 'activity',    text: 'Complementary body mechanics: footwork, core strength, using hips and shoulders' },
  { icon: 'brain',       text: 'Game IQ built through live-play drills' },
  { icon: 'users',       text: 'A community of local Fairfax-area basketball players' },
];

export default function SkillsClinic() {
  return (
    <section id="clinic" style={{ background: 'var(--bone)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <SectionHead
          eyebrow="Fall 2026 · Registration open"
          title="Player development clinics"
          sub="FPYC Basketball is offering a Fall player development program for Fairfax-area players of ALL levels — six one-hour sessions across three ability groups."
        />

        {/* Level cards */}
        <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
          {LEVELS.map(l => (
            <div key={l.name} style={{
              background: '#fff', border: '1px solid var(--border)', borderTop: `4px solid ${l.color}`,
              borderRadius: 12, padding: '22px 22px 20px', boxShadow: 'var(--shadow-1)',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, textTransform: 'uppercase', lineHeight: 1, color: 'var(--court-navy)' }}>
                  {l.name}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, color: l.color }}>$200</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginTop: 6 }}>
                {l.grades}
              </div>
              {l.note && (
                <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 8, lineHeight: 1.5 }}>{l.note}</div>
              )}
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
                <Row icon="clock" text={l.time} />
                <Row icon="calendar" text="6 Mondays · Sep 14 – Oct 26" />
                <Row icon="users" text="25 spots" />
              </div>
            </div>
          ))}
        </div>

        {/* Overview + logistics */}
        <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginTop: 20 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 26px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', margin: '0 0 12px', lineHeight: 1 }}>
              What the sessions cover
            </h3>
            <p style={{ fontSize: 14, color: 'var(--fg-soft)', lineHeight: 1.65, margin: '0 0 18px' }}>
              For young players, training must be game-skill oriented, comprehensive, and — most importantly —
              coherent to the players. These sessions offer an introduction to intensive, professional-level
              training in age-appropriate ways, in a genuinely conducive learning environment.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {FOCUS.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(232,119,34,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <Icon name={f.icon} size={13} color="var(--basketball-orange)" />
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--fg)', lineHeight: 1.55 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '24px 26px', color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)' }}>
              Logistics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              <Detail label="Dates" value="Sep 14, 21, 28 · Oct 5, 19, 26" />
              <Detail label="Times" value={'Beginner 6–7 PM\nIntermediate 7–8 PM\nAdvanced 8–9 PM'} />
              <Detail label="Location" value={'Providence Elementary School\nGym location may change'} />
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
              Not sure which group fits your player? Contact{' '}
              <a href="mailto:shaunali34@gmail.com" style={{ color: 'var(--varsity-gold)', fontWeight: 700 }}>Shaun Ali</a>.
            </div>
          </div>
        </div>

        {/* Coaches */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 26px', marginTop: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', color: 'var(--court-navy)', margin: '0 0 12px', lineHeight: 1 }}>
            Your coaches
          </h3>
          <p style={{ fontSize: 14, color: 'var(--fg-soft)', lineHeight: 1.65, margin: 0 }}>
            Sessions are led by <strong style={{ color: 'var(--fg)' }}>Nabil Ali</strong> and{' '}
            <strong style={{ color: 'var(--fg)' }}>Shaun Ali</strong>, lifelong FPYC players and coaches.
            Nabil has coached youth basketball for over 25 years. Shaun played and coached at Fairfax HS and
            currently leads our K–5th grade 3v3 league, with 20 years of coaching and player development
            experience including 10+ years as a varsity coach at Fairfax HS and other area high schools.
            Today he works alongside leading player development coaches worldwide, doing on-court and
            film-based development for NBA players, overseas professionals, and college and HS players across
            the country. They are joined by local HS coaches and standout players from the Fairfax area —
            including professional players and coaches.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 20, background: '#fff', border: '1px solid var(--border)', borderRadius: 12,
          padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 14, color: 'var(--fg)' }}>
            <strong>25 spots per group</strong> · $200 for six sessions
          </span>
          <a href={REGISTER_URL} target="_blank" rel="noreferrer" style={{
            background: 'var(--varsity-gold)', color: 'var(--court-navy)',
            padding: '10px 18px', borderRadius: 8, textDecoration: 'none',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            Register for the clinic →
          </a>
        </div>
      </div>
    </section>
  );
}

function Row({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Icon name={icon} size={13} color="var(--fg-muted)" />
      <span style={{ fontSize: 13, color: 'var(--fg-soft)' }}>{text}</span>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{value}</div>
    </div>
  );
}
