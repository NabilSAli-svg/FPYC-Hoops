/* global React, lucide */
const { useState } = React;
const { createIcon } = window;

// -------- Button --------
window.Button = function Button({ kind = 'primary', size = 'md', icon, children, onClick, style }) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: size === 'sm' ? 13 : 14,
    lineHeight: 1,
    padding: size === 'sm' ? '8px 12px' : '11px 16px',
    borderRadius: 8,
    border: '1px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 160ms cubic-bezier(0.2,0.8,0.2,1)',
    whiteSpace: 'nowrap',
  };
  const kinds = {
    primary: { background: 'var(--court-navy)', color: '#fff' },
    gold:    { background: 'var(--varsity-gold)', color: 'var(--court-navy)' },
    ghost:   { background: 'transparent', color: 'var(--court-navy)', borderColor: 'var(--court-navy)' },
    quiet:   { background: 'transparent', color: 'var(--court-navy)' },
    danger:  { background: 'var(--foul-red)', color: '#fff' },
    onDark:  { background: 'rgba(255,255,255,0.10)', color: '#fff', borderColor: 'rgba(255,255,255,0.18)' },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...kinds[kind], ...style }}>
      {icon ? <Icon name={icon} size={16}/> : null}
      {children}
    </button>
  );
};

// -------- Lucide icon wrapper --------
// Uses data-lucide attribute + lucide.createIcons() scanner.
window.Icon = function Icon({ name, size = 18, color, style }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = `<i data-lucide="${name}" style="width:${size}px;height:${size}px;display:inline-flex"></i>`;
      window.lucide.createIcons({ attrs: { 'stroke-width': 2, width: size, height: size } });
    }
  }, [name, size]);
  return <span ref={ref} style={{ display: 'inline-flex', lineHeight: 0, color, width: size, height: size, ...style }} />;
};

// -------- Pill / Badge --------
window.Pill = function Pill({ kind = 'neutral', children, pulse }) {
  const kinds = {
    neutral: { background: '#fff', color: 'var(--court-navy)', border: '1px solid var(--border)' },
    navy:    { background: 'var(--court-navy)', color: '#fff' },
    gold:    { background: 'var(--varsity-gold)', color: 'var(--court-navy)' },
    live:    { background: 'var(--basketball-orange)', color: '#fff' },
    win:     { background: 'var(--status-win)', color: '#fff' },
    loss:    { background: 'var(--foul-red)', color: '#fff' },
    warn:    { background: 'var(--status-warning)', color: 'var(--court-navy)' },
  };
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
      borderRadius: 999,
      ...kinds[kind],
    }}>
      {pulse ? <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} /> : null}
      {children}
    </span>
  );
};

// -------- Card --------
window.Card = function Card({ children, padding = 18, style, banner }) {
  if (banner) {
    return (
      <div style={{
        background: 'var(--court-navy)',
        color: '#fff',
        borderRadius: 8,
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
      borderRadius: 8,
      boxShadow: 'var(--shadow-1)',
      padding,
      ...style,
    }}>{children}</div>
  );
};

// -------- Eyebrow --------
window.Eyebrow = function Eyebrow({ children, color = 'var(--fg-muted)', style }) {
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
};

// -------- Display heading --------
window.Display = function Display({ size = 32, children, color, style }) {
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
};

// -------- Avatar (initials) --------
window.Avatar = function Avatar({ name, size = 36, color = 'var(--court-navy)' }) {
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
};

// -------- Jersey number tile --------
window.Jersey = function Jersey({ number, size = 36 }) {
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
};
