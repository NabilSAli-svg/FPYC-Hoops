export default function Avatar({ name, size = 36, color = 'var(--court-navy)' }) {
  const initials = (name || '').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: size * 0.4,
      letterSpacing: '0.02em',
      flexShrink: 0,
    }}>{initials}</div>
  );
}
