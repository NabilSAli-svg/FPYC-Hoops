import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import { useMessages, useGames } from '../shared/store.js';
import Icon from '../shared/Icon.jsx';
import FamilyLogin from './FamilyLogin.jsx';
import HomeTab from './HomeTab.jsx';
import ScheduleTab from './ScheduleTab.jsx';
import RosterTab from './RosterTab.jsx';
import MessagesTab from './MessagesTab.jsx';
import PaymentsTab from './PaymentsTab.jsx';
import StatsTab from './StatsTab.jsx';
import BracketTab from './BracketTab.jsx';
import { FAMILIES } from './data.js';

async function requestAndNotify(games) {
  if (!('Notification' in window)) return 'unsupported';
  let perm = Notification.permission;
  if (perm === 'default') perm = await Notification.requestPermission();
  if (perm !== 'granted') return perm;

  const next = games.find(g => g.status === 'scheduled');
  const sw = await navigator.serviceWorker?.ready.catch(() => null);
  if (sw) {
    sw.showNotification('🏀 FPYC Hawks', {
      body: next
        ? `Next game: ${next.day} at ${next.time} · ${next.opponent}`
        : 'Notifications are on — you\'ll be the first to know!',
      icon: '/assets/logo-fpyc-basketball.png',
      badge: '/assets/logo-fpyc-basketball.png',
      tag: 'fpyc-test',
      data: { url: '/family' },
    });
  }
  return 'granted';
}

const TABS = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar' },
  { id: 'stats',    label: 'Stats',    icon: 'bar-chart-2' },
  { id: 'bracket',  label: 'Bracket',  icon: 'trophy' },
  { id: 'roster',   label: 'Team',     icon: 'users' },
  { id: 'messages', label: 'Messages', icon: 'message-square' },
];

export default function FamilyApp() {
  const [user, setUser] = useState(null);
  const [userKey, setUserKey] = useState(null);
  const [tab, setTab] = useState('home');
  const [notifPerm, setNotifPerm] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [notifBusy, setNotifBusy] = useState(false);

  const [readIdsArr, setReadIdsArr] = useLocalStorage('fpyc-read-msgs', []);
  const [messages] = useMessages();
  const [games]    = useGames();
  const readIds = new Set(readIdsArr);
  const markRead = (id) => setReadIdsArr(arr => arr.includes(id) ? arr : [...arr, id]);

  const handleBell = useCallback(async () => {
    if (notifBusy || notifPerm === 'denied' || notifPerm === 'unsupported') return;
    setNotifBusy(true);
    const result = await requestAndNotify(games);
    setNotifPerm(result);
    setNotifBusy(false);
  }, [notifBusy, notifPerm, games]);

  if (!user) return <FamilyLogin onLogin={who => { setUser(FAMILIES[who]); setUserKey(who); }} />;

  const unread = messages.filter(m => m.unread && !readIds.has(m.id)).length;
  const family = user;

  return (
    <div style={{
      minHeight: '100vh', background: '#F4F5F7', fontFamily: 'var(--font-body)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <header style={{
        background: 'var(--court-navy)', color: '#fff',
        borderBottom: '3px solid var(--varsity-gold)',
        position: 'sticky', top: 0, zIndex: 50,
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1 }}>{family.child.team}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>Family Portal</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{family.parent}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{family.child.name}</div>
            </div>
            {notifPerm !== 'unsupported' && (
              <button
                onClick={handleBell}
                title={notifPerm === 'granted' ? 'Notifications on' : notifPerm === 'denied' ? 'Notifications blocked in browser settings' : 'Enable game notifications'}
                style={{ all: 'unset', cursor: notifPerm === 'denied' ? 'not-allowed' : 'pointer', opacity: notifPerm === 'denied' ? 0.4 : 1, position: 'relative' }}
              >
                <Icon
                  name={notifPerm === 'granted' ? 'bell' : 'bell-off'}
                  size={18}
                  color={notifPerm === 'granted' ? 'var(--varsity-gold)' : 'rgba(255,255,255,0.45)'}
                />
                {notifPerm === 'granted' && (
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: 'var(--varsity-gold)', border: '1.5px solid var(--court-navy)' }} />
                )}
              </button>
            )}
            <button onClick={() => setUser(null)} style={{ all: 'unset', cursor: 'pointer' }}>
              <Icon name="log-out" size={16} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 640, width: '100%', margin: '0 auto', padding: '20px 16px', paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}>
        {tab === 'home'     && <HomeTab family={family} messages={messages} onTabChange={setTab} />}
        {tab === 'schedule' && <ScheduleTab familyKey={userKey} childTeam={family.child.team} />}
        {tab === 'stats'    && <StatsTab family={family} />}
        {tab === 'bracket'  && <BracketTab childTeam={family.child.team} />}
        {tab === 'roster'   && <RosterTab family={family} />}
        {tab === 'messages' && <MessagesTab messages={messages} readIds={readIds} onMarkRead={markRead} />}
        {tab === 'payments' && <PaymentsTab family={family} />}
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #E2E5EA',
        display: 'flex', zIndex: 50,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const showBadge = t.id === 'messages' && unread > 0;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 8px 12px', background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? 'var(--court-navy)' : '#9CA3AF',
              transition: 'color 160ms', position: 'relative',
            }}>
              {/* Active indicator */}
              {active && (
                <div style={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 3, background: 'var(--varsity-gold)', borderRadius: '0 0 3px 3px' }} />
              )}
              <div style={{ position: 'relative' }}>
                <Icon name={t.icon} size={22} color={active ? 'var(--court-navy)' : '#9CA3AF'} />
                {showBadge && (
                  <span style={{ position: 'absolute', top: -4, right: -6, width: 16, height: 16, borderRadius: '50%', background: 'var(--basketball-orange)', color: '#fff', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unread}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 10, fontWeight: active ? 800 : 600, letterSpacing: '0.02em' }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
