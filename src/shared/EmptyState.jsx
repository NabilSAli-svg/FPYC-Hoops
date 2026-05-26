import Icon from './Icon.jsx';
import Button from './Button.jsx';

export default function EmptyState({ icon = 'inbox', title, message, action, onAction, actionLabel }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '56px 24px', textAlign: 'center', gap: 14,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--bone)', border: '1.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={24} color="var(--fg-muted)" />
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, textTransform: 'uppercase', color: 'var(--court-navy)', letterSpacing: '0.02em' }}>{title}</div>
        {message && <p style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 300, lineHeight: 1.55, margin: '6px auto 0' }}>{message}</p>}
      </div>
      {onAction && actionLabel && (
        <Button kind="gold" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
