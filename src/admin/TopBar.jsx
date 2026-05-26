import { Icon, Display } from '../shared/index.js';
import { useIsMobile } from '../shared/useIsMobile.js';

export default function TopBar({ title, breadcrumb, action, onMenuToggle }) {
  const isMobile = useIsMobile();

  return (
    <header style={{
      height: 64,
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      padding: isMobile ? '0 16px' : '0 28px',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? 12 : 18,
      flexShrink: 0,
    }}>
      {isMobile && (
        <button
          onClick={onMenuToggle}
          style={{
            width: 36,
            height: 36,
            border: '1px solid var(--border)',
            background: 'var(--bone)',
            borderRadius: 8,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="menu" size={16} />
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {breadcrumb && (
          <div style={{ fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 700, marginBottom: 2 }}>
            {breadcrumb}
          </div>
        )}
        <Display size={22} style={{ letterSpacing: '0.02em' }}>{title}</Display>
      </div>

      {!isMobile && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--bone)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '7px 12px',
          width: 280,
        }}>
          <Icon name="search" size={16} color="var(--fg-muted)" />
          <input
            placeholder="Search players, games…"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--fg)',
              flex: 1,
            }}
          />
        </div>
      )}

      <button style={{
        position: 'relative',
        width: 36,
        height: 36,
        border: '1px solid var(--border)',
        background: 'var(--bone)',
        borderRadius: 8,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="bell" size={16} />
        <span style={{
          position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%',
          background: 'var(--basketball-orange)', border: '2px solid var(--bone)',
        }} />
      </button>

      {action}
    </header>
  );
}
