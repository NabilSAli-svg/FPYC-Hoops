import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

// Fall 2026 Select open gym schedule (not tryouts) — updated 9/9/26.
// Each grade's sessions are numbered in the order they run; a session with
// no day/date/time/location is a closed week that's part of the count.
const GROUPS = [
  {
    gender: 'Boys',
    grades: [
      {
        grade: '5th', coach: 'Aidris Daud', email: 'aidris@keydmv.com', phone: '703-447-1184',
        sessions: [
          { day: 'Thursday', date: 'Sep 10', time: '7:30 – 9:00 p.m.', location: 'Providence ES' },
          { day: 'Friday',   date: 'Sep 11', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
          { closed: true,    date: 'Sep 17' },
          { day: 'Friday',   date: 'Sep 18', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Thursday', date: 'Sep 24', time: '7:30 – 9:00 p.m.', location: 'Providence ES' },
          { day: 'Friday',   date: 'Sep 25', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
        ],
      },
      {
        grade: '6th', coach: 'Thomas Schneider', email: 'schnet@gmail.com', phone: '603-809-2483',
        sessions: [
          { day: 'Tuesday',  date: 'Sep 8',  time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Thursday', date: 'Sep 10', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Tuesday',  date: 'Sep 15', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Thursday', date: 'Sep 17', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Tuesday',  date: 'Sep 22', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Thursday', date: 'Sep 24', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
        ],
      },
      {
        grade: '7th', coach: 'Tim Anderson', email: 'timjanderson7@gmail.com', phone: '915-474-8825',
        sessions: [],
      },
      {
        grade: '8th', coach: 'Mike Lee', email: 'michael.lee24@gmail.com', phone: '703-965-8104',
        sessions: [
          { day: 'Thursday', date: 'Sep 10', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Monday',   date: 'Sep 14', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Thursday', date: 'Sep 17', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
          { closed: true,    date: 'Sep 21' },
          { day: 'Thursday', date: 'Sep 24', time: '6:00 – 7:30 p.m.', location: 'Katherine Johnson MS' },
        ],
      },
    ],
  },
  {
    gender: 'Girls',
    grades: [
      {
        grade: '5th', coach: 'Fazle Taher', email: 'coachftaher@gmail.com', phone: '703-835-1552',
        sessions: [
          { closed: true,  date: 'Sep 9' },
          { day: 'Wednesday', date: 'Sep 16', time: '6:00 – 7:30 p.m.', location: 'Daniels Run ES' },
          { day: 'Wednesday', date: 'Sep 23', time: '6:00 – 7:30 p.m.', location: 'Daniels Run ES' },
        ],
      },
      {
        grade: '6th', coach: 'Michael Do', email: 'michaeldo82@gmail.com', phone: '571-328-8126',
        sessions: [
          { closed: true,  date: 'Sep 9' },
          { day: 'Monday',    date: 'Sep 14', time: '6:00 – 7:30 p.m.', location: 'Daniels Run ES' },
          { day: 'Wednesday', date: 'Sep 16', time: '6:00 – 7:30 p.m.', location: 'Providence ES' },
          { closed: true,  date: 'Sep 21' },
          { day: 'Wednesday', date: 'Sep 23', time: '6:00 – 7:30 p.m.', location: 'Providence ES' },
        ],
      },
      {
        grade: '7th', coach: 'Earnest Williams', email: 'williamssrearnest@gmail.com', phone: '571-682-9432',
        sessions: [
          { day: 'Thursday', date: 'Sep 10', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Friday',   date: 'Sep 11', time: '7:30 – 9:00 p.m.', location: 'Providence ES' },
          { day: 'Thursday', date: 'Sep 17', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Friday',   date: 'Sep 18', time: '7:30 – 9:00 p.m.', location: 'Providence ES' },
          { day: 'Thursday', date: 'Sep 24', time: '7:30 – 9:00 p.m.', location: 'Katherine Johnson MS' },
          { day: 'Friday',   date: 'Sep 25', time: '7:30 – 9:00 p.m.', location: 'Providence ES' },
        ],
      },
      {
        grade: '8th', coach: 'Brett Schmitz', email: 'brettschmitz@yahoo.com', phone: '',
        sessions: [],
      },
    ],
  },
];

function ContactLine({ email, phone }) {
  return (
    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {email && <a href={`mailto:${email}`} style={{ color: 'var(--varsity-gold)', textDecoration: 'none' }}>{email}</a>}
      {phone && <a href={`tel:${phone}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>{phone}</a>}
    </div>
  );
}

function GradeBlock({ grade, coach, email, phone, sessions }) {
  return (
    <div style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--varsity-gold)' }}>{grade} grade</span>
          <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.85)', marginLeft: 8, fontWeight: 700 }}>Coach {coach}</span>
        </div>
      </div>
      <ContactLine email={email} phone={phone} />

      {sessions.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {sessions.map((s, i) => s.closed ? (
            <span key={i} style={{
              fontSize: 11, padding: '5px 9px', borderRadius: 7,
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
              border: '1px dashed rgba(255,255,255,0.15)',
            }}>{s.date} · Closed</span>
          ) : (
            <span key={i} style={{
              fontSize: 11.5, padding: '5px 9px', borderRadius: 7,
              background: 'rgba(255,255,255,0.08)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              {s.date} ({s.day.slice(0, 3)}) · {s.time} · {s.location}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
          Check back — dates coming soon.
        </div>
      )}
    </div>
  );
}

export default function SelectOpenGyms() {
  return (
    <section id="open-gyms" style={{ maxWidth: 1200, margin: '0 auto', padding: '88px 24px 0' }}>
      <SectionHead
        eyebrow="Select · 5th – 8th grade"
        title="Open gyms"
        sub="Before Select tryouts, we run open gyms so players can get on the floor and coaches can see them play. They are the main input into how Select teams are chosen."
      />

      <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20, marginTop: 32 }}>
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
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 4 }}>
            Fall 2026 open gym schedule
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            Updated 9/9/26 · not tryouts. Questions about open gym or the team? Contact the coach for your age group.
          </div>

          {GROUPS.map(g => (
            <div key={g.gender} style={{ marginTop: 14 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)',
                borderBottom: '2px solid var(--basketball-orange)', paddingBottom: 6, marginBottom: 4,
              }}>{g.gender}</div>
              {g.grades.map(gr => <GradeBlock key={gr.grade} {...gr} />)}
            </div>
          ))}

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,199,44,0.15)', border: '1px solid rgba(255,199,44,0.3)', marginBottom: 14 }}>
              <Icon name="door-open" size={14} color="var(--varsity-gold)" />
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--varsity-gold)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Free · No registration
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Open gyms are drop-in for players considering Select — just turn up. Questions about
              whether Select is the right fit? Email{' '}
              <a href="mailto:fpycselect@gmail.com" style={{ color: 'var(--varsity-gold)', fontWeight: 700 }}>fpycselect@gmail.com</a>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const WHAT_TO_EXPECT = [
  { icon: 'dribbble',   title: 'Skill work and scrimmages', desc: 'Guided drills followed by live play, so coaches see players in game situations rather than lines.' },
  { icon: 'eye',        title: 'Coaches are watching',      desc: 'Select coaches attend to evaluate. Open gyms directly inform how teams are formed.' },
  { icon: 'users',      title: 'Play with your grade',      desc: 'Grouped by grade and gender so evaluation is fair and the competition is level.' },
  { icon: 'help-circle',title: 'Come with questions',       desc: 'A good chance to ask coaches what Select asks of a player before you commit to tryouts.' },
  { icon: 'door-open',  title: 'Just show up',              desc: 'No registration and nothing to sign up for — bring a ball, water and court shoes.' },
];
