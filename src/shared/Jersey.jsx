export default function Jersey({ number, size = 36 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: 6,
      background: 'var(--court-navy)',
      color: 'var(--varsity-gold)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.55,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1,
      flexShrink: 0,
    }}>{String(number).padStart(2, '0')}</div>
  );
}
