import { useState } from 'react';
import { useGames, usePlayers, TEAM_INFO } from '../shared/store.js';
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
import { Button } from '../shared/index.js';

const TEAM = { name: TEAM_INFO.name, division: TEAM_INFO.division, number: 12 };

export default function AdminApp() {
  const isMobile = useIsMobile();
  const [view, setView] = useState('dashboard');
  const [scheduleInitialTab, setScheduleInitialTab] = useState('games');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openNewGame, setOpenNewGame] = useState(false);
  const [messagesAutoCompose, setMessagesAutoCompose] = useState(false);
  const [players, setPlayers] = usePlayers();
  const [games, setGames] = useGames();

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

  const titleMap = {
    dashboard:   { title: TEAM.name,         breadcrumb: `${TEAM.division} · Season 2025–26` },
    roster:      { title: 'Roster',          breadcrumb: `${TEAM.name} · ${TEAM.division}` },
    schedule:    { title: 'Schedule',        breadcrumb: `${TEAM.name} · ${TEAM.division}` },
    lineup:      { title: 'Lineup Builder',  breadcrumb: 'Sat, Dec 7 · vs. Vienna Storm' },
    attendance:  { title: 'Attendance',      breadcrumb: `${TEAM.name} · Season 2025–26` },
    messages:    { title: 'Messages',        breadcrumb: '3 unread' },
    evaluations: { title: 'Evaluations',     breadcrumb: `${TEAM.name} · ${TEAM.division}` },
    draftboard:  { title: 'Draft Board',     breadcrumb: 'Boys 5–6 House · Season 2025–26' },
    season:      { title: 'Season',          breadcrumb: 'Boys 5–6 House · Season 2025–26' },
    settings:    { title: 'Settings',        breadcrumb: 'FPYC Basketball · Coach console' },
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
        <div style={{ padding: '24px 28px 64px', flex: 1 }}>
          {view === 'dashboard'   && <DashboardView team={TEAM} players={players} games={games} onGo={handleGo} />}
          {view === 'roster'      && <RosterView team={TEAM} players={players} setPlayers={setPlayers} />}
          {view === 'schedule'    && <ScheduleView games={games} onScoreSave={saveScore} onGameUpdate={updateGame} onGameAdd={addGame} onGo={handleGo} initialTab={scheduleInitialTab} openNewGame={openNewGame} onNewGameClose={() => setOpenNewGame(false)} />}
          {view === 'lineup'      && <LineupView players={players.filter(p => p.status === 'active')} games={games} />}
          {view === 'attendance'  && <AttendanceView players={players} />}
          {view === 'messages'    && <MessagesView autoCompose={messagesAutoCompose} onAutoComposeUsed={() => setMessagesAutoCompose(false)} />}
          {view === 'evaluations' && <EvaluationsView players={players.filter(p => p.status !== 'inactive')} />}
          {view === 'draftboard'  && <DraftBoardView />}
          {view === 'season'      && <SeasonView games={games} />}
          {view === 'settings'    && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
