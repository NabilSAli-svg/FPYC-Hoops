const KINDS = {
  neutral: { background: '#fff', color: 'var(--court-navy)', border: '1px solid var(--border)' },
  navy:    { background: 'var(--court-navy)', color: '#fff', border: 'none' },
  gold:    { background: 'var(--varsity-gold)', color: 'var(--court-navy)', border: 'none' },
  live:    { background: 'var(--basketball-orange)', color: '#fff', border: 'none' },
  win:     { background: 'var(--status-win)', color: '#fff', border: 'none' },
  loss:    { background: 'var(--foul-red)', color: '#fff', border: 'none' },
  warn:    { background: 'var(--status-warning)', color: 'var(--court-navy)', border: 'none' },
};

export default function Pill({ kind = 'neutral', children, pulse }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.10em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      ...KINDS[kind],
    }}>
      {pulse && (
        <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
      )}
      {children}
    </span>
  );
}
