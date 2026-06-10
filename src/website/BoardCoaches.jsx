import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Icon from '../shared/Icon.jsx';
import { SectionHead } from './Programs.jsx';

const BOARD = [
  { name: 'Nabil Ali', role: 'Basketball Director' },
  { name: 'TBD', role: 'Recreation Director' },
  { name: 'George Ragan', role: 'Select Director' },
  { name: 'TBD', role: 'Player Development Director' },
  { name: 'TBD', role: 'Operations Director' },
  { name: 'Russell Finelson', role: 'Referee Development Director' },
  { name: 'TBD', role: 'Community/Sponsorship Director' },
];

const COACHES = [
  { name: 'Nabil Ali', bio: '"In my over 25 years of coaching, the mission doesn\'t change: Develop players, build confidence, teach life through the game! Growing the next generation to be confident athletes and leaders."' },
  { name: 'Shaun Ali', bio: '"My experience coaching and playing across various levels developed a strong sense of community. I\'m committed to continuing to build and strengthen this for the next generation."' },
  { name: 'Margad Choijilsuren', bio: 'A member of the Mongolian National Team, a standout professional overseas, and a former Fairfax H.S. star, Margad brings his elite experience to develop the next generation of local hoopers!' },
  { name: 'Kesara Liyanage', bio: '"Real development comes from structure, fundamentals, and attention to detail — not just pick-up runs. I\'m excited to help the next generation sharpen their skills the right way!"' },
  { name: 'Aidris Daud', bio: '"I focus on helping players develop control, pace, and confidence with the ball. It\'s about mastering the details and building game-ready skills that translate when it matters most."' },
];

function initials(name) {
  if (name === 'TBD') return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ name, size = 64 }) {
  const filled = name !== 'TBD';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: filled ? 'linear-gradient(135deg, var(--court-navy), #1d3a63)' : 'var(--bone)',
      border: filled ? 'none' : '1px dashed var(--border)',
      color: filled ? 'var(--varsity-gold)' : 'var(--fg-muted)',
      fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
      fontSize: size * 0.32, fontWeight: 700,
    }}>
      {filled ? initials(name) : <Icon name="user" size={size * 0.4} color="var(--fg-muted)" />}
    </div>
  );
}

function BoardCard({ name, role }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 14,
      padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14,
      transition: 'transform 160ms, box-shadow 160ms',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <Avatar name={name} size={52} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name === 'TBD' ? 'Open position' : name}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--fg-soft)', marginTop: 2, fontWeight: 600, letterSpacing: '0.02em' }}>{role}</div>
      </div>
    </div>
  );
}

function CoachCard({ name, bio }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border)', borderRadius: 16,
      padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      transition: 'transform 160ms, box-shadow 160ms', height: '100%', boxSizing: 'border-box',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <Avatar name={name} size={84} />
      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--court-navy)', marginTop: 14 }}>{name}</div>
      <div style={{ width: 32, height: 3, borderRadius: 2, background: 'var(--varsity-gold)', margin: '10px 0 14px' }} />
      <div style={{ fontSize: 13.5, color: 'var(--fg-soft)', lineHeight: 1.6 }}>{bio}</div>
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
            background: 'var(--court-navy)', color: '#fff', padding: '10px 18px', borderRadius: 999,
            textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            transition: 'background 160ms',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d3a63'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--court-navy)'}
          >
            <Icon name="instagram" size={16} color="#fff" /> @fpychoops on Instagram
          </a>

          <div style={{ marginTop: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Icon name="users" size={18} color="var(--basketball-orange)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--court-navy)' }}>Board of Directors</div>
            </div>
            <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {BOARD.map((p, i) => <BoardCard key={i} name={p.name} role={p.role} />)}
            </div>
          </div>

          <div style={{ marginTop: 56, marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Icon name="clipboard-list" size={18} color="var(--basketball-orange)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--court-navy)' }}>Coaches</div>
            </div>
            <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {COACHES.map((p, i) => <CoachCard key={i} name={p.name} bio={p.bio} />)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 18, textAlign: 'center' }}>
              Photos coming soon — check our Instagram for the latest coach intros.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
