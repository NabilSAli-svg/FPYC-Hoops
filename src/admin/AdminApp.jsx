import { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
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

const TEAM = { name: 'Fairfax Hawks', division: 'Boys 5–6 House', number: 12 };

const PLAYERS = [
  { id: 'p1',  number: 23, name: 'Jordan Reeves',   grade: '6th', school: 'Daniels Run ES', guardian: 'A. Reeves',   phone: '(703) 555-0123', position: 'Guard',   status: 'active',   waiver: true  },
  { id: 'p2',  number:  7, name: 'Maya Chen',        grade: '5th', school: 'Providence ES',  guardian: 'L. Chen',     phone: '(703) 555-0144', position: 'Guard',   status: 'active',   waiver: true  },
  { id: 'p3',  number: 14, name: 'Devon Brooks',     grade: '6th', school: 'Lanier MS',      guardian: 'K. Brooks',   phone: '(703) 555-0192', position: 'Forward', status: 'active',   waiver: true  },
  { id: 'p4',  number:  3, name: 'Sam Whitaker',     grade: '5th', school: 'Daniels Run ES', guardian: 'P. Whitaker', phone: '(703) 555-0118', position: 'Forward', status: 'active',   waiver: true  },
  { id: 'p5',  number: 32, name: 'Tariq Singh',      grade: '6th', school: 'Providence ES',  guardian: 'R. Singh',    phone: '(703) 555-0177', position: 'Center',  status: 'active',   waiver: true  },
  { id: 'p6',  number: 11, name: 'Alex Romero',      grade: '5th', school: 'Mosby Woods ES', guardian: 'M. Romero',   phone: '(703) 555-0166', position: 'Guard',   status: 'active',   waiver: true  },
  { id: 'p7',  number:  4, name: "Riley O'Connor",   grade: '6th', school: 'Lanier MS',      guardian: "S. O'Connor", phone: '(703) 555-0102', position: 'Guard',   status: 'active',   waiver: true  },
  { id: 'p8',  number: 21, name: 'Imani Walker',     grade: '5th', school: 'Daniels Run ES', guardian: 'B. Walker',   phone: '(703) 555-0151', position: 'Forward', status: 'active',   waiver: true  },
  { id: 'p9',  number: 15, name: 'Ethan Park',       grade: '6th', school: 'Lanier MS',      guardian: 'H. Park',     phone: '(703) 555-0189', position: 'Guard',   status: 'pending',  waiver: false },
  { id: 'p10', number:  9, name: 'Noah Patel',       grade: '5th', school: 'Providence ES',  guardian: 'V. Patel',    phone: '(703) 555-0173', position: 'Forward', status: 'active',   waiver: true  },
  { id: 'p11', number: 25, name: 'Luca Bianchi',     grade: '6th', school: 'Mosby Woods ES', guardian: 'G. Bianchi',  phone: '(703) 555-0128', position: 'Center',  status: 'active',   waiver: true  },
  { id: 'p12', number:  8, name: 'Chloe Adebayo',    grade: '5th', school: 'Daniels Run ES', guardian: 'O. Adebayo',  phone: '(703) 555-0145', position: 'Guard',   status: 'inactive', waiver: true  },
];

const GAMES_INITIAL = [
  { id: 'g1', status: 'scheduled', month: 'Dec', date: 7,  weekday: 'Sat', day: 'Sat, Dec 7',  time: '10:00 AM', opponent: 'Vienna Storm',       location: 'Robinson Secondary · Gym B', home: true,  refs: 'J. Park, M. Lee', countdown: 4, confirmed: 11, note: 'Carpool sheet posted — 3 families volunteered to drive.' },
  { id: 'g2', status: 'scheduled', month: 'Dec', date: 14, weekday: 'Sat', day: 'Sat, Dec 14', time: '11:30 AM', opponent: 'Reston Wolves',       location: 'South Lakes HS · Gym A',      home: false, countdown: 11, confirmed: 9 },
  { id: 'g3', status: 'scheduled', month: 'Dec', date: 21, weekday: 'Sat', day: 'Sat, Dec 21', time: '9:00 AM',  opponent: 'Burke Lakers',         location: 'Lake Braddock HS · Main',     home: false, countdown: 18, confirmed: 8 },
  { id: 'g4', status: 'final',     month: 'Nov', date: 30, weekday: 'Sat', day: 'Sat, Nov 30', time: '10:00 AM', opponent: 'Oakton Patriots',      location: 'Robinson Secondary · Gym B',  home: true,  us: 48, them: 39 },
  { id: 'g5', status: 'final',     month: 'Nov', date: 23, weekday: 'Sat', day: 'Sat, Nov 23', time: '10:00 AM', opponent: 'McLean Mustangs',      location: 'Cooper MS · Main',            home: false, us: 42, them: 47 },
  { id: 'g6', status: 'final',     month: 'Nov', date: 16, weekday: 'Sat', day: 'Sat, Nov 16', time: '11:30 AM', opponent: 'Centreville Eagles',   location: 'Robinson Secondary · Gym B',  home: true,  us: 55, them: 50 },
];

export default function AdminApp() {
  const [view, setView] = useState('dashboard');
  const [scheduleInitialTab, setScheduleInitialTab] = useState('games');
  const [openNewGame, setOpenNewGame] = useState(false);
  const [messagesAutoCompose, setMessagesAutoCompose] = useState(false);
  const [games, setGames] = useState(GAMES_INITIAL);

  const saveScore = (id, result) =>
    setGames(gs => gs.map(g => g.id === id ? { ...g, ...result, status: 'final' } : g));

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
      <Sidebar active={view} onNav={v => { setView(v); setScheduleInitialTab('games'); }} team={TEAM} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar title={t.title} breadcrumb={t.breadcrumb} action={topAction} />
        <div style={{ padding: '24px 28px 64px', flex: 1 }}>
          {view === 'dashboard'   && <DashboardView team={TEAM} players={PLAYERS} games={games} onGo={handleGo} />}
          {view === 'roster'      && <RosterView team={TEAM} players={PLAYERS} />}
          {view === 'schedule'    && <ScheduleView games={games} onScoreSave={saveScore} onGo={handleGo} initialTab={scheduleInitialTab} openNewGame={openNewGame} onNewGameClose={() => setOpenNewGame(false)} />}
          {view === 'lineup'      && <LineupView players={PLAYERS.filter(p => p.status === 'active')} game={games[0]} />}
          {view === 'attendance'  && <AttendanceView players={PLAYERS} />}
          {view === 'messages'    && <MessagesView autoCompose={messagesAutoCompose} onAutoComposeUsed={() => setMessagesAutoCompose(false)} />}
          {view === 'evaluations' && <EvaluationsView players={PLAYERS.filter(p => p.status !== 'inactive')} />}
          {view === 'draftboard'  && <DraftBoardView />}
          {view === 'season'      && <SeasonView games={games} />}
          {view === 'settings'    && <SettingsView />}
        </div>
      </div>
    </div>
  );
}
