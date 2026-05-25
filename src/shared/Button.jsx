import Icon from './Icon.jsx';

const KINDS = {
  primary: { background: 'var(--court-navy)', color: '#fff', border: '1px solid transparent' },
  gold:    { background: 'var(--varsity-gold)', color: 'var(--court-navy)', border: '1px solid transparent' },
  ghost:   { background: 'transparent', color: 'var(--court-navy)', border: '1px solid var(--court-navy)' },
  quiet:   { background: 'transparent', color: 'var(--court-navy)', border: '1px solid transparent' },
  danger:  { background: 'var(--foul-red)', color: '#fff', border: '1px solid transparent' },
  onDark:  { background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' },
};

export default function Button({ kind = 'primary', size = 'md', icon, children, onClick, style }) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: size === 'sm' ? 13 : 14,
    lineHeight: 1,
    padding: size === 'sm' ? '8px 12px' : '11px 16px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all var(--dur-base) var(--ease-out)',
    whiteSpace: 'nowrap',
    ...KINDS[kind],
    ...style,
  };
  return (
    <button onClick={onClick} style={base}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
