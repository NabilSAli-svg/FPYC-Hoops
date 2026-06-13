import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../shared/useLocalStorage.js';
import { useMessages, useGames, useAnnouncements } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';
import Icon from '../shared/Icon.jsx';
import FamilyLogin from './FamilyLogin.jsx';
import HomeTab from './HomeTab.jsx';
import ScheduleTab from './ScheduleTab.jsx';
import RosterTab from './RosterTab.jsx';
import MessagesTab from './MessagesTab.jsx';
import PaymentsTab from './PaymentsTab.jsx';
import StatsTab from './StatsTab.jsx';
import BracketTab from './BracketTab.jsx';

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
      icon: '/assets/logo-fpyc-basketball-v3.png',
      badge: '/assets/logo-fpyc-basketball-v3.png',
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

// Build the family object shape the rest of the app expects
function profileToFamily(profile, player) {
  return {
    parent:     profile.parent_name || profile.email,
    firstName:  profile.first_name  || (profile.parent_name || profile.email).split(' ')[0],
    email:      profile.email,
    child: player ? {
      name:     player.name,
      number:   player.number,
      position: player.position || 'Player',
      grade:    player.grade    || '',
      status:   player.status   || 'active',
      team:     player.team     || 'FPYC',
    } : {
      name: 'Player', number: '?', position: '', grade: '', status: 'active', team: 'FPYC',
    },
  };
}

export default function FamilyApp() {
  const [family, setFamily] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [playerLinked, setPlayerLinked] = useState(true);
  const [tab, setTab] = useState('home');
  const [userKey, setUserKey] = useState(null);

  // Load session on mount, listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadFamily(session.user);
      else setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) loadFamily(session.user);
      else { setFamily(null); setAuthLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function loadFamily(authUser) {
    setAuthLoading(true);
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (!profile) {
      // Profile not yet created (trigger may not have fired) — create it
      await supabase.from('profiles').insert({
        id: authUser.id,
        email: authUser.email,
        parent_name: authUser.user_metadata?.parent_name || '',
        first_name:  authUser.user_metadata?.first_name  || '',
      });
      setFamily(profileToFamily({ email: authUser.email, parent_name: authUser.user_metadata?.parent_name || '' }, null));
      setPlayerLinked(false);
      setAuthLoading(false);
      return;
    }

    setUserKey(authUser.id);

    // Fetch linked player if any
    let player = null;
    if (profile.player_id) {
      const { data } = await supabase.from('players').select('*').eq('id', profile.player_id).single();
      player = data;
    }

    setPlayerLinked(!!player);
    setFamily(profileToFamily(profile, player));
    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }
  const [notifPerm, setNotifPerm] = useState(() =>
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [notifBusy, setNotifBusy] = useState(false);

  const [readIdsArr, setReadIdsArr] = useLocalStorage('fpyc-read-msgs', []);
  const [seenAnnIds, setSeenAnnIds] = useLocalStorage('fpyc-seen-announcements', []);
  const [messages]      = useMessages();
  const [games]         = useGames();
  const [announcements] = useAnnouncements();
  const readIds = new Set(readIdsArr);
  const markRead = (id) => setReadIdsArr(arr => arr.includes(id) ? arr : [...arr, id]);
  const markAnnouncementsSeen = (ids) => setSeenAnnIds(arr => {
    const s = new Set(arr);
    ids.forEach(id => s.add(id));
    return [...s];
  });

  const handleBell = useCallback(async () => {
    if (notifBusy || notifPerm === 'denied' || notifPerm === 'unsupported') return;
    setNotifBusy(true);
    const result = await requestAndNotify(games);
    setNotifPerm(result);
    setNotifBusy(false);
  }, [notifBusy, notifPerm, games]);

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--court-navy)' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 48, objectFit: 'contain', marginBottom: 16, opacity: 0.8 }} />
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Loading…</div>
      </div>
    </div>
  );

  if (!family) return <FamilyLogin />;

  if (!playerLinked) return <LinkPlayerScreen family={family} onLinked={player => { setFamily(profileToFamily({ ...family, player_id: player.id }, player)); setPlayerLinked(true); }} onSignOut={handleSignOut} />;

  const unread = messages.filter(m => m.unread && !readIds.has(m.id)).length;

  // Count unseen announcements relevant to this family
  const seenSet = new Set(seenAnnIds);
  const unseenAnnouncements = announcements.filter(
    a => (a.target === 'All families' || a.target === family.child.team) && !seenSet.has(a.id)
  ).length;

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
            <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 32, objectFit: 'contain' }} />
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
            <button onClick={handleSignOut} style={{ all: 'unset', cursor: 'pointer' }}>
              <Icon name="log-out" size={16} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 640, width: '100%', margin: '0 auto', padding: '20px 16px', paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}>
        {tab === 'home'     && <HomeTab family={family} messages={messages} onTabChange={setTab} onAnnouncementsSeen={markAnnouncementsSeen} />}
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
          const showBadge = (t.id === 'messages' && unread > 0) || (t.id === 'home' && unseenAnnouncements > 0);
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
                    {t.id === 'messages' ? unread : unseenAnnouncements}
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

// ── Link Player Screen ────────────────────────────────────────────────────────
// Shown after sign-up when no player is linked to the account yet.

function LinkPlayerScreen({ family, onLinked, onSignOut }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState('');

  async function search(q) {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from('players')
      .select('id, name, number, team, grade, position')
      .ilike('name', `%${q.trim()}%`)
      .limit(8);
    setResults(data || []);
    setSearching(false);
  }

  async function linkPlayer(player) {
    setLinking(true); setError('');
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase
      .from('profiles')
      .update({ player_id: player.id })
      .eq('id', user.id);
    setLinking(false);
    if (err) { setError('Could not link player — try again or contact your commissioner.'); return; }
    onLinked(player);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/assets/logo-fpyc-basketball-v3.png" alt="FPYC" style={{ height: 48, objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase' }}>Find your player</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>Search by your child's name to link their roster spot to your account.</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <Icon name="search" size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={query}
              onChange={e => search(e.target.value)}
              placeholder="Search player name…"
              autoFocus
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 38px', borderRadius: 8, border: '1.5px solid #E2E5EA', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none' }}
            />
          </div>

          {error && <div style={{ fontSize: 13, color: '#DC2626', marginBottom: 12 }}>{error}</div>}

          {searching && <div style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', padding: 12 }}>Searching…</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map(p => (
              <button key={p.id} onClick={() => linkPlayer(p)} disabled={linking} style={{
                all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10, border: '1.5px solid #E2E5EA',
                background: '#F9FAFB', transition: 'border-color 120ms',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--court-navy)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E5EA'}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--varsity-gold)', flexShrink: 0 }}>
                  {p.number}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--court-navy)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{p.team} · {p.grade} · {p.position}</div>
                </div>
                <Icon name="arrow-right" size={14} color="#9CA3AF" />
              </button>
            ))}
          </div>

          {query.length >= 2 && !searching && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 13, color: '#9CA3AF' }}>
              No players found. Your commissioner may need to add your child to the roster.
            </div>
          )}
        </div>

        <button onClick={onSignOut} style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, margin: '20px auto 0', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          <Icon name="log-out" size={13} color="rgba(255,255,255,0.4)" /> Sign out
        </button>
      </div>
    </div>
  );
}
