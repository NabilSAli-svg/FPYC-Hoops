import { Icon, Avatar, Jersey } from '../shared/index.js';

const NAV_ITEMS = [
  { id: 'dashboard',   icon: 'layout-dashboard', label: 'Dashboard' },
  { id: 'roster',      icon: 'users',             label: 'Roster' },
  { id: 'schedule',    icon: 'calendar',          label: 'Schedule' },
  { id: 'officials',   icon: 'user-check',        label: 'Officials' },
  { id: 'lineup',      icon: 'clipboard-list',    label: 'Lineup' },
  { id: 'attendance',  icon: 'check-square',      label: 'Attendance' },
  { id: 'messages',    icon: 'message-square',    label: 'Messages', badge: 3 },
  { id: 'evaluations', icon: 'star',              label: 'Evaluations' },
];

const SECONDARY = [
  { id: 'draftboard', icon: 'shuffle', label: 'Draft Board' },
  { id: 'season',     icon: 'trophy',  label: 'Season' },
  { id: 'settings',   icon: 'settings',label: 'Settings' },
];

export default function Sidebar({ active, onNav, team }) {
  return (
    <aside style={{
      width: 248,
      background: 'var(--court-navy)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid rgba(0,0,0,0.2)',
      flexShrink: 0,
      minHeight: '100vh',
    }}>
      {/* Brand */}
      <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ width: 36, height: 36, objectFit: 'contain' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>FPYC Basketball</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Coach console</span>
        </div>
      </div>

      {/* Team switcher */}
      <button style={{
        margin: '14px 12px 6px',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        color: '#fff',
        textAlign: 'left',
      }}>
        <Jersey number={team.number} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>{team.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{team.division}</div>
        </div>
        <Icon name="chevrons-up-down" size={16} color="rgba(255,255,255,0.6)" />
      </button>

      <nav style={{ padding: '6px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(it => (
          <NavItem key={it.id} {...it} active={active === it.id} onClick={() => onNav(it.id)} />
        ))}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '10px 8px' }} />
        {SECONDARY.map(it => (
          <NavItem key={it.id} {...it} active={active === it.id} onClick={() => onNav(it.id)} />
        ))}
      </nav>

      {/* Coach footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name="Coach Davis" size={32} color="var(--varsity-gold)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Coach M. Davis</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Volunteer · 5–6 House</div>
        </div>
        <Icon name="log-out" size={16} color="rgba(255,255,255,0.5)" />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{
      background: active ? 'rgba(255,199,44,0.12)' : 'transparent',
      border: 'none',
      borderLeft: `3px solid ${active ? 'var(--varsity-gold)' : 'transparent'}`,
      color: active ? '#fff' : 'rgba(255,255,255,0.78)',
      padding: '9px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontWeight: active ? 700 : 500,
      fontSize: 14,
      textAlign: 'left',
      borderRadius: 6,
      transition: 'all 160ms cubic-bezier(0.2,0.8,0.2,1)',
      width: '100%',
    }}>
      <Icon name={icon} size={18} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge > 0 && (
        <span style={{ background: 'var(--basketball-orange)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 6px', minWidth: 18, textAlign: 'center' }}>
          {badge}
        </span>
      )}
    </button>
  );
}
