import { Icon, Avatar, Jersey } from '../shared/index.js';
import { SPORTS } from '../shared/store.js';

const NAV_ITEMS = [
  { id: 'dashboard',     icon: 'layout-dashboard', label: 'Dashboard' },
  { id: 'roster',        icon: 'users',             label: 'Roster' },
  { id: 'schedule',      icon: 'calendar',          label: 'Schedule' },
  { id: 'lineup',        icon: 'clipboard-list',    label: 'Lineup' },
  { id: 'attendance',    icon: 'check-square',      label: 'Attendance' },
  { id: 'messages',      icon: 'message-square',    label: 'Messages', badge: 3 },
  { id: 'announcements', icon: 'megaphone',         label: 'Announcements' },
  { id: 'evaluations',   icon: 'star',              label: 'Evaluations' },
  { id: 'stats',         icon: 'bar-chart-2',       label: 'Stats' },
];

const SECONDARY = [
  { id: 'staff',     icon: 'shield-check', label: 'Staff & Volunteers' },
  { id: 'playoffs',  icon: 'trophy',   label: 'Playoffs'   },
  { id: 'draftboard',icon: 'shuffle',  label: 'Draft Board'},
  { id: 'season',    icon: 'bar-chart',label: 'Season'     },
  { id: 'settings',  icon: 'settings', label: 'Settings'   },
];

export default function Sidebar({ active, onNav, team, sport, onSportChange, isMobile, sidebarOpen, onClose }) {
  const activeSport = SPORTS.find(s => s.id === sport) || SPORTS[0];
  const asideStyle = isMobile ? {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 200,
    width: 280,
    background: 'var(--court-navy)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(0,0,0,0.2)',
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.35)' : 'none',
    transition: 'transform 240ms cubic-bezier(0.2,0.8,0.2,1)',
  } : {
    width: 248,
    background: 'var(--court-navy)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(0,0,0,0.2)',
    flexShrink: 0,
    minHeight: '100vh',
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 199,
          }}
        />
      )}
      <aside style={asideStyle}>
      {/* Brand */}
      <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src="/assets/logo-fpyc-basketball-v2.png" alt="FPYC" style={{ width: 48, height: 48, objectFit: 'contain' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{activeSport.tagline}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Coach console</span>
        </div>
      </div>

      {/* Sport switcher */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 12px 0' }}>
        {SPORTS.map(s => {
          const isActive = s.id === sport;
          return (
            <button key={s.id} onClick={() => onSportChange?.(s.id)} style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: 8,
              border: `1px solid ${isActive ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.10)'}`,
              background: isActive ? 'rgba(255,199,44,0.12)' : 'rgba(255,255,255,0.04)',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
              fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer',
            }}>
              <Icon name={s.icon} size={14} />
              {s.label}
            </button>
          );
        })}
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
    </>
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
