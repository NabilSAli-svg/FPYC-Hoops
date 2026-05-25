import Icon from './Icon.jsx';

const KINDS = {
  primary: { background: 'var(--court-navy)', color: '#fff', border: '1px solid transparent' },
  gold:    { background: 'var(--varsity-gold)', color: 'var(--court-navy)', border: '1px solid transparent' },
  ghost:   { background: 'transparent', color: 'var(--court-navy)', border: '1px solid var(--court-navy)' },
  quiet:   { background: 'transparent', color: 'var(--court-navy)', border: '1px solid transparent' },
  danger:  { background: 'var(--foul-red)', color: '#fff', border: '1px solid transparent' },
  onDark:  { background: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)' },
};

export default function Button({ kind = 'primary', size = 'md', icon, children, onClick, style, disabled }) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: size === 'sm' ? 13 : 14,
    lineHeight: 1,
    padding: size === 'sm' ? '8px 12px' : '11px 16px',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all var(--dur-base) var(--ease-out)',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.45 : 1,
    ...KINDS[kind],
    ...style,
  };
  return (
    <button onClick={onClick} style={base} disabled={disabled}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}
