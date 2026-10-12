import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  Users, GraduationCap, UserCheck, CreditCard, TrendingUp,
  CalendarCheck, Megaphone, FileSpreadsheet, BookOpen, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    students: 0, teachers: 0, classes: 0,
    feesCollected: 0, feesPending: 0,
    attendancePercent: 0,
    homework: 0, exams: 0,
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [std, tch, cls, feeSummary, report, hw, ex, nt] = await Promise.all([
        api.get('/students').catch(() => ({ data: { data: [] } })),
        api.get('/teachers').catch(() => ({ data: { data: [] } })),
        api.get('/classes').catch(() => ({ data: { data: [] } })),
        api.get('/fees/summary').catch(() => ({ data: { data: { total: 0, collected: 0, pending: 0 } } })),
        api.get('/reports/dashboard').catch(() => ({ data: { data: {} } })),
        api.get('/homework').catch(() => ({ data: { data: [] } })),
        api.get('/exams').catch(() => ({ data: { data: [] } })),
        api.get('/notices').catch(() => ({ data: { data: [] } })),
      ]);

      setStats({
        students: std.data.data?.length || 0,
        teachers: tch.data.data?.length || 0,
        classes: cls.data.data?.length || 0,
        feesCollected: feeSummary.data.data?.collected || 0,
        feesPending: feeSummary.data.data?.pending || 0,
        attendancePercent: report.data.data?.attendancePercent || 0,
        homework: hw.data.data?.length || 0,
        exams: ex.data.data?.length || 0,
      });
      setNotices((nt.data.data || []).slice(0, 4));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Auto-refresh every 20 seconds for live data
    const timer = setInterval(load, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      {/* HERO */}
      <div className="teacher-hero admin-hero">
        <div className="teacher-hero-text">
          <p className="hero-eyebrow">Admin Panel</p>
          <h2>Welcome, {user?.name} 👋</h2>
          <p className="hero-sub">Live overview of Gurukul school activity.</p>
        </div>
        <div className="teacher-hero-badge">
          <TrendingUp size={20} />
          <span>Administrator</span>
        </div>
      </div>

      {/* MAIN STATS */}
      <div className="stats-grid">
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <GraduationCap size={22} />
          </div>
          <div><h3>{loading ? '—' : stats.students}</h3><p>Total Students</p></div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FCE7F3', color: '#BE185D' }}>
            <UserCheck size={22} />
          </div>
          <div><h3>{loading ? '—' : stats.teachers}</h3><p>Total Teachers</p></div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Building2 size={22} />
          </div>
          <div><h3>{loading ? '—' : stats.classes}</h3><p>Classes</p></div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <TrendingUp size={22} />
          </div>
          <div><h3>{loading ? '—' : `${stats.attendancePercent}%`}</h3><p>Attendance</p></div>
        </div>
      </div>

      {/* FINANCIAL + CONTENT */}
      <div className="stats-grid" style={{ marginTop: 16 }}>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <CreditCard size={22} />
          </div>
          <div>
            <h3>₹{loading ? '—' : Number(stats.feesCollected).toLocaleString()}</h3>
            <p>Fees Collected</p>
          </div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <CreditCard size={22} />
          </div>
          <div>
            <h3>₹{loading ? '—' : Number(stats.feesPending).toLocaleString()}</h3>
            <p>Fees Pending</p>
          </div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <BookOpen size={22} />
          </div>
          <div><h3>{loading ? '—' : stats.homework}</h3><p>Homework</p></div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div><h3>{loading ? '—' : stats.exams}</h3><p>Exams</p></div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="section-title"><h3>Quick Actions</h3></div>
      <div className="quick-actions">
        <Link to="/admin/students" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <GraduationCap size={22} />
          </div>
          <div><h4>Manage Students</h4><p>Add / edit students</p></div>
        </Link>

        <Link to="/admin/teachers" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FCE7F3', color: '#BE185D' }}>
            <UserCheck size={22} />
          </div>
          <div><h4>Manage Teachers</h4><p>Add / edit staff</p></div>
        </Link>

        <Link to="/admin/notices" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#92400E' }}>
            <Megaphone size={22} />
          </div>
          <div><h4>Post Notice</h4><p>Announce to school</p></div>
        </Link>

        <Link to="/admin/exams" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div><h4>Create Exam</h4><p>Schedule exams</p></div>
        </Link>

        <Link to="/admin/attendance" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            <CalendarCheck size={22} />
          </div>
          <div><h4>Attendance</h4><p>View records</p></div>
        </Link>

        <Link to="/admin/fees" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <CreditCard size={22} />
          </div>
          <div><h4>Fees</h4><p>Manage invoices</p></div>
        </Link>
      </div>

      {/* RECENT NOTICES */}
      <div className="section-title">
        <h3>Recent Notices</h3>
        <Link to="/admin/notices" className="link-more">View all →</Link>
      </div>
      <div className="notices-card">
        {notices.length === 0 && (
          <div className="empty-state">
            <Megaphone size={28} strokeWidth={1.5} />
            <p>No notices yet</p>
          </div>
        )}
        {notices.map((n) => (
          <div className="notice-item" key={n._id || n.id}>
            <div className="notice-dot" />
            <div className="notice-body">
              <h4>{n.title}</h4>
              <p>{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}