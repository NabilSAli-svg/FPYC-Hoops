/* global React, lucide */

// Reuse pattern: icons via Lucide.
window.WIcon = function WIcon({ name, size = 18, color, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
      window.lucide.createIcons({ attrs: { 'stroke-width': 2, width: size, height: size } });
    }
  }, [name, size]);
  return <span ref={ref} style={{ display: 'inline-flex', lineHeight: 0, color, ...style }} />;
};

window.Header = function Header({ onJump }) {
  const items = [
    { id: 'programs',   label: 'Programs' },
    { id: 'schedule',   label: 'Schedule' },
    { id: 'news',       label: 'News' },
    { id: 'volunteer',  label: 'Volunteer' },
    { id: 'contact',    label: 'Contact' },
  ];
  return (
    <header style={{
      background: 'rgba(10,31,61,0.94)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: '#fff',
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 72, display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); onJump('top'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <img src="../../assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 44, objectFit: 'contain' }}/>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>FPYC Basketball</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: 4 }}>Fairfax Police Youth Club</span>
          </div>
        </a>
        <nav style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`} onClick={(e) => { e.preventDefault(); onJump(it.id); }} style={{
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14,
              padding: '8px 12px', borderRadius: 6,
            }}>{it.label}</a>
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <a href="#programs" onClick={(e) => { e.preventDefault(); onJump('programs'); }} style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#fff',
          textDecoration: 'none', padding: '8px 12px', whiteSpace: 'nowrap',
        }}>Sign in</a>
        <a href="#register" onClick={(e) => { e.preventDefault(); onJump('hero'); }} style={{
          background: 'var(--varsity-gold)', color: 'var(--court-navy)',
          padding: '10px 16px', borderRadius: 8, textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>Register <WIcon name="arrow-right" size={14}/></a>
      </div>
    </header>
  );
};

window.Footer = function Footer() {
  return (
    <footer style={{ background: 'var(--court-navy)', color: 'rgba(255,255,255,0.78)', marginTop: 80, paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <img src="../../assets/logo-fpyc-basketball.png" alt="" style={{ height: 52 }}/>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase', fontSize: 20, letterSpacing: '0.04em', color: '#fff' }}>FPYC Basketball</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>est. 1963 · Fairfax, Virginia</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.62)', maxWidth: 360 }}>
            FPYC is a completely volunteer-based organization, serving Fairfax kids since 1963. We need volunteers to coach and run our leagues.
          </p>
        </div>
        <FooterCol title="Play" items={['House League', 'Select / Travel', 'Skills Clinic', 'Schedules', 'Standings']} />
        <FooterCol title="Help" items={['Registration', 'Scholarships', 'Refund policy', 'FAQs', 'Volunteer']} />
        <FooterCol title="FPYC" items={['About FPYC', 'Other sports', 'Board', 'Sponsors', 'Contact']} />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 48, padding: '20px 24px', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>© 2025 Fairfax Police Youth Club. A 501(c)(3) nonprofit.</span>
        <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,0.5)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Code of Conduct</a>
        </div>
      </div>
    </footer>
  );
};

function FooterCol({ title, items }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--varsity-gold)', marginBottom: 14 }}>{title}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(it => <li key={it}><a href="#" style={{ color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: 13 }}>{it}</a></li>)}
      </ul>
    </div>
  );
}
