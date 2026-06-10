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
  { name: 'TBD', team: 'Rising 2nd-3rd Boys' },
  { name: 'TBD', team: 'Girls 3v3 (2nd-8th)' },
  { name: 'TBD', team: 'Rising 4th-5th Boys' },
  { name: 'TBD', team: 'Rising 6th-8th Boys' },
];

function PersonCard({ name, role }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%', margin: '0 auto 14px', background: 'var(--bone)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
      }}>
        <Icon name="user" size={32} color="var(--fg-muted)" />
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)' }}>{name}</div>
      <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 2 }}>{role}</div>
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
            <div className="mob-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {COACHES.map((p, i) => <PersonCard key={i} name={p.name} role={p.team} />)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-soft)', marginTop: 16 }}>
              Names, photos, and bios coming soon — check our Instagram for the latest coach intros.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
