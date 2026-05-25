export default function Display({ size = 32, children, color, style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-display)',
      textTransform: 'uppercase',
      letterSpacing: '0.01em',
      lineHeight: 1,
      fontSize: size,
      color: color || 'var(--court-navy)',
      ...style,
    }}>{children}</div>
  );
}
