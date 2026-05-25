import { Routes, Route, Navigate } from 'react-router-dom';
import WebsiteApp from './website/WebsiteApp.jsx';
import AdminApp from './admin/AdminApp.jsx';
import RegisterApp from './register/RegisterApp.jsx';
import FamilyApp from './family/FamilyApp.jsx';
import RefAdminApp from './refs/RefAdminApp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteApp />} />
      <Route path="/register" element={<RegisterApp />} />
      <Route path="/family" element={<FamilyApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/refs" element={<RefAdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
