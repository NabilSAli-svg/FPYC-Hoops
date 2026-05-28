import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import SchedulerGames from './SchedulerGames.jsx';
import SchedulerPractices from './SchedulerPractices.jsx';
import SchedulerCalendar from './SchedulerCalendar.jsx';

const TABS = [
  { id: 'calendar',  label: 'Calendar',   icon: 'calendar' },
  { id: 'games',     label: 'Games',      icon: 'flag' },
  { id: 'practices', label: 'Practices',  icon: 'clipboard-list' },
];

export default function SchedulerApp() {
  const [tab, setTab] = useState('calendar');

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', fontFamily: 'var(--font-body)' }}>

      {/* Header */}
      <header style={{ background: 'var(--court-navy)', borderBottom: '3px solid var(--varsity-gold)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1 }}>FPYC Basketball</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Scheduler</div>
            </div>
          </div>

          {/* Tab bar in header */}
          <div style={{ display: 'flex', gap: 2 }}>
            {TABS.map(t => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13,
                  transition: 'all 160ms',
                  borderBottom: active ? '2px solid var(--varsity-gold)' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                }}>
                  <Icon name={t.icon} size={15} color="currentColor" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Season 2025–26</div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px 60px' }}>
        {tab === 'calendar'  && <SchedulerCalendar />}
        {tab === 'games'     && <SchedulerGames />}
        {tab === 'practices' && <SchedulerPractices />}
      </div>
    </div>
  );
}
