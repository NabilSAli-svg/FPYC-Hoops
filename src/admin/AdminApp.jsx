import { useState } from 'react';
import { useGames, usePlayers, TEAM_INFO, TEAMS_INFO } from '../shared/store.js';
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
import { Button } from '../shared/index.js';

const ALL_TEAM_NAMES = Object.keys(TEAMS_INFO);

export default function AdminApp() {
  const isMobile = useIsMobile();
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
    messages:    { title: 'Messages',           breadcrumb: '3 unread' },
    evaluations: { title: 'Evaluations',        breadcrumb: `${activeTeam.name} · ${activeTeam.division}` },
    draftboard:  { title: 'Draft Board',        breadcrumb: `${activeTeam.division} · Season 2025–26` },
    season:      { title: 'Season',             breadcrumb: `${activeTeam.division} · Season 2025–26` },
    stats:       { title: 'Player Stats',       breadcrumb: `${activeTeam.name} · Season 2025–26` },
    settings:    { title: 'Settings',           breadcrumb: 'FPYC Basketball · Coach console' },
  };
  const t = titleMap[view] || titleMap.dashboard;

  const topAction = view === 'dashboard'
    ? <Button kind="gold" icon="edit-3" onClick={() => handleGo('messages:compose')}>Quick note</Button>
    : view === 'schedule'
      ? <Button kind="gold" icon="calendar-plus" onClick={() => setOpenNewGame(true)}>New game</Button>
      : view === 'lineup'
        ? <Button kind="primary" icon="save">Save lineup</Button>
        : view === 'messages'
          ? <Button kind="gold" icon="edit-3" onClick={() => setMessagesAutoCompose(true)}>Compose</Button>
          : view === 'draftboard'
              ? <Button kind="gold" icon="save">Finalize teams</Button>
              : null;

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
          {view === 'messages'    && <MessagesView autoCompose={messagesAutoCompose} onAutoComposeUsed={() => setMessagesAutoCompose(false)} />}
          {view === 'evaluations' && <EvaluationsView players={teamPlayers.filter(p => p.status !== 'inactive')} />}
          {view === 'draftboard'  && <DraftBoardView />}
          {view === 'stats'       && <StatsView teamFilter={selectedTeamName} />}
          {view === 'season'      && <SeasonView games={teamGames} />}
          {view === 'settings'    && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
