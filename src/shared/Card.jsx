export default function Card({ children, padding = 18, style, banner }) {
  if (banner) {
    return (
      <div style={{
        background: 'var(--court-navy)',
        color: '#fff',
        borderRadius: 'var(--radius-md)',
        borderTop: '4px solid var(--varsity-gold)',
        padding,
        ...style,
      }}>{children}</div>
    );
  }
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-1)',
      padding,
      ...style,
    }}>{children}</div>
  );
}
