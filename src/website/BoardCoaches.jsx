import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

const BOARD = [
  { name: 'TBD', role: 'President' },
  { name: 'TBD', role: 'Vice President' },
  { name: 'TBD', role: 'Treasurer' },
  { name: 'TBD', role: 'Secretary' },
];

const COACHES = [
  { name: 'Nabil Ali', bio: '"In my over 25 years of coaching, the mission doesn\'t change: Develop players, build confidence, teach life through the game! Growing the next generation to be confident athletes and leaders."' },
  { name: 'Shaun Ali', bio: '"My experience coaching and playing across various levels developed a strong sense of community. I\'m committed to continuing to build and strengthen this for the next generation."' },
  { name: 'Margad Choijilsuren', bio: 'A member of the Mongolian National Team, a standout professional overseas, and a former Fairfax H.S. star, Margad brings his elite experience to develop the next generation of local hoopers!' },
  { name: 'Kesara Liyanage', bio: '"Real development comes from structure, fundamentals, and attention to detail — not just pick-up runs. I\'m excited to help the next generation sharpen their skills the right way!"' },
  { name: 'Aidris Daud', bio: '"I focus on helping players develop control, pace, and confidence with the ball. It\'s about mastering the details and building game-ready skills that translate when it matters most."' },
];

function PersonCard({ name, role, bio }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%', margin: '0 auto 14px', background: 'var(--bone)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
      }}>
        <Icon name="user" size={32} color="var(--fg-muted)" />
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)' }}>{name}</div>
      {role && <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 2 }}>{role}</div>}
      {bio && <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 10, lineHeight: 1.5 }}>{bio}</div>}
    </div>
  );
}

function scrollTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  window.location.href = `/#${id}`;
}

export default function BoardCoaches() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <main>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 24px 24px' }}>
          <SectionHead
            eyebrow="Who's involved"
            title="Board & Coaches"
            sub="Meet the volunteers who run FPYC Basketball. Follow along and see season highlights on Instagram."
          />

          <a href="https://www.instagram.com/fpychoops/" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24,
            background: 'var(--court-navy)', color: '#fff', padding: '10px 18px', borderRadius: 8,
            textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          }}>
            <Icon name="instagram" size={16} color="#fff" /> @fpychoops on Instagram
          </a>

          <div style={{ marginTop: 48 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, textTransform: 'uppercase', color: 'var(--court-navy)', marginBottom: 16 }}>Board</div>
            <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {BOARD.map((p, i) => <PersonCard key={i} name={p.name} role={p.role} />)}
            </div>
          </div>

          <div style={{ marginTop: 48, marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, textTransform: 'uppercase', color: 'var(--court-navy)', marginBottom: 16 }}>Coaches</div>
            <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {COACHES.map((p, i) => <PersonCard key={i} name={p.name} bio={p.bio} />)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 16 }}>
              Photos coming soon — check our Instagram for the latest coach intros.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
