const TABS = [
  { id: '',          label: 'Overview',  href: '/sports/soccer' },
  { id: 'age-groups', label: 'Age Groups', href: '/sports/soccer/age-groups' },
  { id: 'fields',     label: 'Fields & Calendars', href: '/sports/soccer/fields' },
  { id: 'resources',  label: 'Resources & Training', href: '/sports/soccer/resources' },
  { id: 'bylaws',     label: 'Bylaws', href: '/sports/soccer/bylaws' },
];

export default function SoccerSubNav({ active }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', position: 'sticky', top: 72, zIndex: 10 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
        {TABS.map(t => (
          <a key={t.id} href={t.href} style={{
            padding: '14px 16px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
            color: active === t.id ? 'var(--court-navy)' : 'var(--fg-muted)',
            borderBottom: `2px solid ${active === t.id ? 'var(--varsity-gold)' : 'transparent'}`,
          }}>{t.label}</a>
        ))}
      </div>
    </div>
  );
}
