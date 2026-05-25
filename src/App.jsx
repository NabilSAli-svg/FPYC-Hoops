import { Routes, Route, Navigate } from 'react-router-dom';
import WebsiteApp from './website/WebsiteApp.jsx';
import AdminApp from './admin/AdminApp.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsiteApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
