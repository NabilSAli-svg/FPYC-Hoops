import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Icon from '../shared/Icon.jsx';
import SoccerSubNav from './SoccerSubNav.jsx';
import { SectionHead } from './Programs.jsx';

function scrollTo(id) {
  if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  window.location.href = `/#${id}`;
}

const BYLAWS_URL = 'https://cdn2.ottosport.ai/_deimos/_public_files/0vbqi1323b4m7/sports/soccer/fpyc-soccer-bylaws/FPYC-BYLAWS-2004.pdf?CacheKey=1474031008';

export default function SoccerBylaws() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <SoccerSubNav active="bylaws" />
      <main>
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 96px' }}>
          <SectionHead eyebrow="FPYC Soccer" title="Bylaws" sub="Official governing bylaws for FPYC Soccer." />

          <div style={{ marginTop: 28, background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 32px', boxShadow: 'var(--shadow-1)', maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icon name="file-text" size={20} color="var(--basketball-orange)" />
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--court-navy)' }}>FPYC Soccer Bylaws</div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--fg-soft)', marginBottom: 18 }}>
              View or download the full bylaws document (PDF).
            </p>
            <a href={BYLAWS_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--varsity-gold)', color: 'var(--court-navy)', padding: '12px 22px', borderRadius: 8,
              textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
            }}>
              <Icon name="download" size={14} /> Download bylaws (PDF)
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
