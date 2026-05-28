import { Routes, Route, Navigate } from 'react-router-dom';
import WebsiteApp from './website/WebsiteApp.jsx';
import AdminApp from './admin/AdminApp.jsx';
import RegisterApp from './register/RegisterApp.jsx';
import FamilyApp from './family/FamilyApp.jsx';
import RefAdminApp from './refs/RefAdminApp.jsx';
import CommissionerApp from './commissioner/CommissionerApp.jsx';
import CoachApp from './coach/CoachApp.jsx';
import SchedulerApp from './scheduler/SchedulerApp.jsx';
import ScorekeeperApp from './scorekeeper/ScorekeeperApp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteApp />} />
      <Route path="/register" element={<RegisterApp />} />
      <Route path="/family" element={<FamilyApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/refs" element={<RefAdminApp />} />
      <Route path="/commissioner" element={<CommissionerApp />} />
      <Route path="/coach" element={<CoachApp />} />
      <Route path="/scheduler" element={<SchedulerApp />} />
      <Route path="/scorekeeper" element={<ScorekeeperApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
