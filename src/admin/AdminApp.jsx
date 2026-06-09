import { useState, useEffect } from 'react';
import { useGames, usePlayers, TEAM_INFO, TEAMS_INFO } from '../shared/store.js';
import { supabase } from '../shared/supabase.js';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import { useIsMobile } from '../shared/useIsMobile.js';
import DashboardView from './DashboardView.jsx';
import RosterView from './RosterView.jsx';
import ScheduleView from './ScheduleView.jsx';
import LineupView from './LineupView.jsx';
import AttendanceView from './AttendanceView.jsx';
import MessagesView from './MessagesView.jsx';
import EvaluationsView from './EvaluationsView.jsx';
import DraftBoardView from './DraftBoardView.jsx';
import SeasonView from './SeasonView.jsx';
import SettingsView from './SettingsView.jsx';
import StatsView from './StatsView.jsx';
import AnnouncementsView from './AnnouncementsView.jsx';
import PlayoffsView from './PlayoffsView.jsx';
import { Button } from '../shared/index.js';

const ALL_TEAM_NAMES = Object.keys(TEAMS_INFO);

export default function AdminApp() {
  const isMobile = useIsMobile();
  const [authReady, setAuthReady] = useState(false);
  const [role, setRole] = useState(null); // 'commissioner' | 'coach' | null

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setAuthReady(true); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role === 'commissioner' || profile?.role === 'coach') setRole(profile.role);
      setAuthReady(true);
    });
  }, []);

  const [view, setView] = useState('dashboard');
  const [scheduleInitialTab, setScheduleInitialTab] = useState('games');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openNewGame, setOpenNewGame] = useState(false);
  const [messagesAutoCompose, setMessagesAutoCompose] = useState(false);
  const [selectedTeamName, setSelectedTeamName] = useState(TEAM_INFO.name);
  const [players, setPlayers] = usePlayers();
  const [games, setGames] = useGames();

  const teamPlayers = players.filter(p => p.team === selectedTeamName || p.team === 'Unassigned');
  const teamGames   = games.filter(g => !g.team || g.team === selectedTeamName);
  const activeTeam  = TEAMS_INFO[selectedTeamName] || TEAMS_INFO[TEAM_INFO.name];

  const saveScore = (id, result) =>
    setGames(gs => gs.map(g => g.id === id ? { ...g, ...result, status: 'final' } : g));

  const updateGame = (id, update) =>
    setGames(gs => gs.map(g => g.id === id ? { ...g, ...update } : g));

  const addGame = (game) => setGames(gs => [...gs, game]);

  function handleGo(target) {
    if (target === 'schedule:practices') {
      setScheduleInitialTab('practices');
      setView('schedule');
    } else if (target === 'messages:compose') {
      setMessagesAutoCompose(true);
      setView('messages');
    } else {
      setView(target);
    }
  }

  const TEAM = { name: activeTeam.name, division: activeTeam.division, number: teamPlayers.length };

  const titleMap = {
    dashboard:   { title: activeTeam.name,      breadcrumb: `${activeTeam.division} · Season 2025–26` },
    roster:      { title: 'Roster',             breadcrumb: `${activeTeam.name} · ${activeTeam.division}` },
    schedule:    { title: 'Schedule',           breadcrumb: `${activeTeam.name} · ${activeTeam.division}` },
    lineup:      { title: 'Lineup Builder',     breadcrumb: 'Sat, Dec 7 · vs. Vienna Storm' },
    attendance:  { title: 'Attendance',         breadcrumb: `${activeTeam.name} · Season 2025–26` },
    messages:      { title: 'Messages',       breadcrumb: '3 unread' },
    announcements: { title: 'Announcements', breadcrumb: 'Families see these in real time' },
    evaluations:   { title: 'Evaluations',   breadcrumb: `${activeTeam.name} · ${activeTeam.division}` },
    playoffs:    { title: 'Playoffs',            breadcrumb: 'Manage brackets · Enter scores' },
    draftboard:  { title: 'Draft Board',        breadcrumb: `${activeTeam.division} · Season 2025–26` },
    season:      { title: 'Season',             breadcrumb: `${activeTeam.division} · Season 2025–26` },
    stats:       { title: 'Player Stats',       breadcrumb: `${activeTeam.name} · Season 2025–26` },
    settings:    { title: 'Settings',           breadcrumb: `FPYC Basketball · ${role === 'commissioner' ? 'Commissioner' : 'Coach'} console` },
  };
  const t = titleMap[view] || titleMap.dashboard;

  const topAction = view === 'dashboard'
    ? <Button kind="gold" icon="edit-3" onClick={() => handleGo('messages:compose')}>Quick note</Button>
    : view === 'schedule'
      ? <Button kind="gold" icon="calendar-plus" onClick={() => setOpenNewGame(true)}>New game</Button>
      : view === 'lineup'
        ? <Button kind="primary" icon="save">Save lineup</Button>
        : view === 'announcements'
          ? null
          : view === 'messages'
          ? <Button kind="gold" icon="edit-3" onClick={() => setMessagesAutoCompose(true)}>Compose</Button>
          : view === 'draftboard'
              ? <Button kind="gold" icon="save">Finalize teams</Button>
              : null;

  if (!authReady) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bone)' }}>
      <div style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Loading…</div>
    </div>
  );

  if (!role) return <AdminLogin onSuccess={r => setRole(r)} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bone)' }}>
      <Sidebar
        active={view}
        onNav={v => { setView(v); setScheduleInitialTab('games'); if (isMobile) setSidebarOpen(false); }}
        team={TEAM}
        isMobile={isMobile}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar title={t.title} breadcrumb={t.breadcrumb} action={topAction} onMenuToggle={() => setSidebarOpen(o => !o)} />
        {/* Team selector strip */}
        <div style={{ borderBottom: '1px solid var(--border)', background: '#fff', padding: '8px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Team</span>
          {role === 'commissioner' && (
            <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 999, background: 'var(--varsity-gold)', color: 'var(--court-navy)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Commissioner
            </span>
          )}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ALL_TEAM_NAMES.map(name => {
              const ti = TEAMS_INFO[name];
              const active = name === selectedTeamName;
              return (
                <button key={name} onClick={() => setSelectedTeamName(name)} style={{
                  padding: '4px 12px', borderRadius: 999, border: `1.5px solid ${active ? ti.color : 'var(--border)'}`,
                  background: active ? ti.color : 'transparent', color: active ? '#fff' : 'var(--fg-muted)',
                  fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                  transition: 'all 120ms',
                }}>
                  {name}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: '24px 28px 64px', flex: 1 }}>
          {view === 'dashboard'   && <DashboardView team={TEAM} players={teamPlayers} games={teamGames} onGo={handleGo} />}
          {view === 'roster'      && <RosterView team={TEAM} players={teamPlayers} setPlayers={setPlayers} />}
          {view === 'schedule'    && <ScheduleView games={teamGames} onScoreSave={saveScore} onGameUpdate={updateGame} onGameAdd={addGame} onGo={handleGo} initialTab={scheduleInitialTab} openNewGame={openNewGame} onNewGameClose={() => setOpenNewGame(false)} />}
          {view === 'lineup'      && <LineupView players={teamPlayers.filter(p => p.status === 'active')} games={teamGames} />}
          {view === 'attendance'  && <AttendanceView players={teamPlayers} />}
          {view === 'messages'       && <MessagesView autoCompose={messagesAutoCompose} onAutoComposeUsed={() => setMessagesAutoCompose(false)} />}
          {view === 'announcements'  && <AnnouncementsView />}
          {view === 'evaluations' && <EvaluationsView players={teamPlayers.filter(p => p.status !== 'inactive')} />}
          {view === 'playoffs'    && <PlayoffsView />}
          {view === 'draftboard'  && <DraftBoardView />}
          {view === 'stats'       && <StatsView teamFilter={selectedTeamName} />}
          {view === 'season'      && <SeasonView games={teamGames} team={activeTeam.name} division={activeTeam.division} />}
          {view === 'settings'    && <SettingsView />}
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onSuccess }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: authErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authErr) { setLoading(false); setError(authErr.message); return; }

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    setLoading(false);
    if (profile?.role === 'commissioner' || profile?.role === 'coach') {
      onSuccess(profile.role);
    } else {
      setError('Your account does not have admin access. Contact the commissioner.');
      await supabase.auth.signOut();
    }
  }

  const inp = { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', marginTop: 6 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--court-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/assets/logo-fpyc-basketball.png" alt="FPYC" style={{ height: 48, objectFit: 'contain', marginBottom: 12 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', textTransform: 'uppercase' }}>Admin Console</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Commissioner / Coach access only</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: '28px 24px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#DC2626' }}>{error}</div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="coach@fpyc.org" style={inp} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} /></div>
            <button type="submit" disabled={loading} style={{ padding: '12px', borderRadius: 10, border: 'none', background: loading ? '#9CA3AF' : 'var(--court-navy)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
