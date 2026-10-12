import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="dashboard-shell">
      <Topbar onMenuClick={() => setOpen(!open)} />
      <div className="dashboard-body">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="dashboard-main"><Outlet /></main>
      </div>
    </div>
  );
}