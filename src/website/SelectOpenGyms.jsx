import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

// Fill these in once the schedule is set. Leaving the array empty renders the
// "dates announced soon" state rather than inventing a schedule.
const SESSIONS = [];

const WHAT_TO_EXPECT = [
  { icon: 'dribbble',   title: 'Skill work and scrimmages', desc: 'Guided drills followed by live play, so coaches see players in game situations rather than lines.' },
  { icon: 'eye',        title: 'Coaches are watching',      desc: 'Select coaches attend to evaluate. Open gyms directly inform how teams are formed.' },
  { icon: 'users',      title: 'Play with your grade',      desc: 'Grouped by grade and gender so evaluation is fair and the competition is level.' },
  { icon: 'help-circle',title: 'Come with questions',       desc: 'A good chance to ask coaches what Select asks of a player before you commit to tryouts.' },
  { icon: 'door-open',  title: 'Just show up',              desc: 'No registration and nothing to sign up for — bring a ball, water and court shoes.' },
];

export default function SelectOpenGyms() {
  return (
    <section id="open-gyms" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 0' }}>
      <SectionHead
        eyebrow="Select · 5th – 8th grade"
        title="Open gyms"
        sub="Before Select tryouts, we run open gyms so players can get on the floor and coaches can see them play. They are the main input into how Select teams are chosen."
      />

      <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 20, marginTop: 32 }}>
        {/* What to expect */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {WHAT_TO_EXPECT.map(w => (
            <div key={w.title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 13 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(10,31,61,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={w.icon} size={16} color="var(--court-navy)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)', marginBottom: 3 }}>{w.title}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-soft)', lineHeight: 1.55 }}>{w.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule */}
        <div style={{ background: 'var(--court-navy)', borderRadius: 12, padding: '24px 26px', color: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)' }}>
            Schedule
          </div>

          {SESSIONS.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
              {SESSIONS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0',
                  borderBottom: i < SESSIONS.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
                }}>
                  <div style={{ minWidth: 68 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--varsity-gold)', lineHeight: 1 }}>{s.date}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{s.day}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.group}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.time} · {s.location}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: 16, padding: '18px 18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Icon name="calendar" size={15} color="var(--varsity-gold)" />
                <span style={{ fontWeight: 700, fontSize: 14 }}>Dates announced soon</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Open gyms run at Providence ES, Daniels Run ES, and Johnson Middle School.
                Watch this page or the family portal — we post the schedule as soon as gym times are confirmed.
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,199,44,0.15)', border: '1px solid rgba(255,199,44,0.3)', marginBottom: 14 }}>
              <Icon name="door-open" size={14} color="var(--varsity-gold)" />
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--varsity-gold)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Free · No registration
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Open gyms are drop-in for players considering Select — just turn up. Questions about
              whether Select is the right fit? Email{' '}
              <a href="mailto:basketball@fpycsports.com" style={{ color: 'var(--varsity-gold)', fontWeight: 700 }}>basketball@fpycsports.com</a>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
