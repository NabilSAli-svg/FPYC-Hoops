import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Icon from '../shared/Icon.jsx';
import SoccerSubNav from './SoccerSubNav.jsx';
import { SectionHead } from './Programs.jsx';

function scrollTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  window.location.href = `/#${id}`;
}

const RESOURCES = [
  { title: 'FPYC Curriculum — U5/U6', desc: 'Age-appropriate curriculum guide for our youngest players.' },
  { title: 'FPYC Curriculum — U7/U8', desc: 'Progression of skills and small-sided game concepts for U7-U8.' },
  { title: 'FPYC Formations', desc: 'Recommended formations by age group.' },
  { title: 'FPYC Soccer Season Plan Booklet', desc: 'Week-by-week practice planning booklet for the season.' },
  { title: 'FPYC Super Skills Library', desc: 'Library of individual skill-building activities and drills.' },
  { title: 'FPYC Competency Matrix', desc: 'Skill benchmarks by age group to help guide practice planning.' },
];

const PRACTICE_GROUPS = [
  {
    age: 'U5',
    activities: ['Dribbling through cones', 'Red light / green light with the ball', 'Sharks and minnows', 'Simple 3v3 small-sided games'],
  },
  {
    age: 'U6 – U8',
    activities: ['1v1 dribbling moves', 'Passing gates', 'Knockout / world cup dribbling games', '4v4 small-sided scrimmages'],
  },
  {
    age: 'U9 – U12',
    activities: ['Possession (keep-away) games', 'Passing & receiving under pressure', 'Shooting technique stations', '8v8 tactical work — width & depth'],
  },
  {
    age: 'U13+',
    activities: ['Transition (attack to defense) drills', 'Positional play & rondos', 'Set pieces (corners, free kicks)', '11v11 tactical shape and pressing'],
  },
];

const EXTERNAL_LINKS = [
  { label: 'MAYS Coaches — Session Plans', url: 'https://www.mayouthsoccer.org/coaches/session-plans/' },
  { label: 'US Youth Soccer — Coaching Resources', url: 'https://www.usyouthsoccer.org/coaching-resources/' },
];

export default function SoccerResources() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <SoccerSubNav active="resources" />
      <main>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 24px' }}>
          <SectionHead eyebrow="FPYC Soccer" title="Resources & training" sub="Curriculum, formations, and practice planning resources for FPYC Soccer coaches." />

          <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 28 }}>
            {RESOURCES.map(r => (
              <div key={r.title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', boxShadow: 'var(--shadow-1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Icon name="file-text" size={16} color="var(--basketball-orange)" />
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--court-navy)' }}>{r.title}</div>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--fg-soft)', margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--fg-muted)', marginTop: 14 }}>
            Contact your league director or field coordinator for access to these documents.
          </p>
        </section>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Icon name="clipboard-list" size={18} color="var(--basketball-orange)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--court-navy)' }}>Recommended practice plans & drills</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24 }}>Sample activities organized by age group — mix and match to build your weekly practice plan.</p>

          <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {PRACTICE_GROUPS.map(g => (
              <div key={g.age} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-1)' }}>
                <div style={{ background: 'var(--court-navy)', color: '#fff', padding: '10px 16px', fontWeight: 700, fontSize: 13 }}>{g.age}</div>
                <ul style={{ padding: '14px 16px 14px 36px', margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {g.activities.map((a, i) => (
                    <li key={i} style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--fg-soft)' }}>{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 96px' }}>
          <div style={{ background: 'var(--bone)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px 28px' }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)', marginBottom: 10 }}>More session plans</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EXTERNAL_LINKS.map(l => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--court-navy)', fontWeight: 700, fontSize: 13.5, textDecoration: 'none' }}>
                  <Icon name="external-link" size={14} />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
