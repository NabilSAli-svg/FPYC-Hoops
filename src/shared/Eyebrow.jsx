export default function Eyebrow({ children, color = 'var(--fg-muted)', style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color,
      ...style,
    }}>{children}</div>
  );
}
