import Icon from '../shared/Icon.jsx';

const NAV_ITEMS = [
  { id: 'programs',  label: 'Programs' },
  { id: 'schedule',  label: 'Schedule' },
  { id: 'news',      label: 'News' },
  { id: 'volunteer', label: 'Volunteer' },
  { id: 'contact',   label: 'Contact' },
];

export default function Header({ onJump }) {
  return (
    <header style={{
      background: 'rgba(10,31,61,0.94)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: '#fff',
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', gap: 24 }}>
        <a href="#top" onClick={(e) => { e.preventDefault(); onJump('top'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 44, objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>FPYC Basketball</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: 4 }}>Fairfax Police Youth Club</span>
          </div>
        </a>

        <nav style={{ display: 'flex', gap: 4, marginLeft: 24 }}>
          {NAV_ITEMS.map(it => (
            <a key={it.id} href={`#${it.id}`} onClick={(e) => { e.preventDefault(); onJump(it.id); }} style={{
              color: 'rgba(255,255,255,0.85)', textDecoration: 'none',
              fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14,
              padding: '8px 12px', borderRadius: 6,
            }}>{it.label}</a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <a href="/admin" style={{
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: '#fff',
          textDecoration: 'none', padding: '8px 12px', whiteSpace: 'nowrap',
        }}>Coach login</a>

        <a href="/register" style={{
          background: 'var(--varsity-gold)', color: 'var(--court-navy)',
          padding: '10px 16px', borderRadius: 8, textDecoration: 'none',
          fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>Register <Icon name="arrow-right" size={14} /></a>
      </div>
    </header>
  );
}
