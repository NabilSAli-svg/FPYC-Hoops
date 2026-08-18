import { Routes, Route, Navigate } from 'react-router-dom';
import { REGISTER_URL } from './shared/store.js';
import RequireRole from './shared/RequireRole.jsx';
import WebsiteApp from './website/WebsiteApp.jsx';
import AdminApp from './admin/AdminApp.jsx';
import FamilyApp from './family/FamilyApp.jsx';
import RefAdminApp from './refs/RefAdminApp.jsx';
import CommissionerApp from './commissioner/CommissionerApp.jsx';
import CoachApp from './coach/CoachApp.jsx';
import SchedulerApp from './scheduler/SchedulerApp.jsx';
import ScorekeeperApp from './scorekeeper/ScorekeeperApp.jsx';
import ScoreboardApp from './scoreboard/ScoreboardApp.jsx';
import BoardCoaches from './website/BoardCoaches.jsx';
import SoccerPage from './website/SoccerPage.jsx';
import SoccerAgeGroups from './website/SoccerAgeGroups.jsx';
import SoccerFields from './website/SoccerFields.jsx';
import SoccerResources from './website/SoccerResources.jsx';
import SoccerBylaws from './website/SoccerBylaws.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteApp />} />
      {/* Registration runs on FPYC's Ottosport portal this season. */}
      <Route path="/register" element={<ExternalRedirect to={REGISTER_URL} />} />
      <Route path="/family" element={<FamilyApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/refs" element={<RequireRole allow={['admin', 'ops_director', 'ref_director', 'ref']} title="Referee Portal"><RefAdminApp /></RequireRole>} />
      <Route path="/commissioner" element={<RequireRole allow={['admin']} title="Commissioner Console"><CommissionerApp /></RequireRole>} />
      <Route path="/coach" element={<CoachApp />} />
      <Route path="/scheduler" element={<RequireRole allow={['admin', 'ops_director']} title="Master Scheduler"><SchedulerApp /></RequireRole>} />
      <Route path="/scorekeeper" element={<RequireRole allow={['admin', 'ops_director', 'league_director', 'coach', 'ref']} title="Scorekeeper"><ScorekeeperApp /></RequireRole>} />
      {/* Scoreboard is a read-only gym display — intentionally public. */}
      <Route path="/scoreboard" element={<ScoreboardApp />} />
      <Route path="/board" element={<BoardCoaches />} />
      <Route path="/sports/soccer" element={<SoccerPage />} />
      <Route path="/sports/soccer/age-groups" element={<SoccerAgeGroups />} />
      <Route path="/sports/soccer/fields" element={<SoccerFields />} />
      <Route path="/sports/soccer/resources" element={<SoccerResources />} />
      <Route path="/sports/soccer/bylaws" element={<SoccerBylaws />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ExternalRedirect({ to }) {
  if (typeof window !== 'undefined') window.location.replace(to);
  return null;
}
