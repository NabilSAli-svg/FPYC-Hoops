import Icon from '../shared/Icon.jsx';
import { useIsMobile } from '../shared/useIsMobile.js';

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer style={{ background: 'var(--court-navy)', color: 'rgba(255,255,255,0.78)', marginTop: 80, paddingTop: 56 }}>
      {/* Portal CTA strip */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 40px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="/family" style={{
          flex: 1, minWidth: 220,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '16px 20px', textDecoration: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 14,
          transition: 'background 160ms',
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,199,44,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="users" size={20} color="var(--varsity-gold)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Family portal</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>View schedule, messages & roster</div>
          </div>
          <Icon name="arrow-right" size={16} color="rgba(255,255,255,0.4)" style={{ marginLeft: 'auto' }} />
        </a>

        <a href="/register" style={{
          flex: 1, minWidth: 220,
          background: 'var(--varsity-gold)', border: '1px solid transparent',
          borderRadius: 12, padding: '16px 20px', textDecoration: 'none', color: 'var(--court-navy)',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(10,31,61,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="clipboard-list" size={20} color="var(--court-navy)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Register for 2025–26</div>
            <div style={{ fontSize: 12, color: 'rgba(10,31,61,0.6)', marginTop: 2 }}>Spots still available · $195</div>
          </div>
          <Icon name="arrow-right" size={16} color="rgba(10,31,61,0.5)" style={{ marginLeft: 'auto' }} />
        </a>
      </div>

      {/* Columns */}
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : '2fr 1fr 1fr 1fr',
        gap: isMobile ? '28px 20px' : 40,
      }}>
        {!isMobile && (
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
        )}
        <FooterCol title="Play" items={[
          { label: 'House League',    href: '/register' },
          { label: 'Select / Travel', href: '/register' },
          { label: 'Skills Clinic',   href: '/register' },
          { label: 'Schedules',       href: '/#schedule' },
          { label: 'Standings',       href: '/#season' },
          { label: 'Live scoreboard', href: '/scoreboard' },
        ]} />
        <FooterCol title="Help" items={[
          { label: 'Registration',  href: '/register' },
          { label: 'Scholarships',  href: '/#contact' },
          { label: 'Refund policy', href: '#' },
          { label: 'FAQs',          href: '/#contact' },
          { label: 'Volunteer',     href: '/#volunteer' },
        ]} />
        <FooterCol title="Account" items={[
          { label: 'Family portal', href: '/family' },
          { label: 'Coach login',   href: '/admin' },
          { label: 'About FPYC',   href: 'https://fpycsports.org', external: true },
          { label: 'Other sports', href: 'https://fpycsports.org', external: true },
          { label: 'Contact',      href: '/#contact' },
        ]} />
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 48, padding: '20px 24px', maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: 12 }}>
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
        {items.map(it => (
          <li key={it.label}>
            <a
              href={it.href}
              {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              style={{ color: 'rgba(255,255,255,0.78)', textDecoration: 'none', fontSize: 13 }}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
