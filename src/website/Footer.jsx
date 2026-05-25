export default function Footer() {
  return (
    <footer style={{ background: 'var(--court-navy)', color: 'rgba(255,255,255,0.78)', marginTop: 80, paddingTop: 56 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="" style={{ height: 52 }} />
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
}

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
