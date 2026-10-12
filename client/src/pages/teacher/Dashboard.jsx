import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  Users, BookOpen, FileSpreadsheet, CalendarCheck,
  Megaphone, Award, Clock, TrendingUp, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    classes: 0, students: 0, homework: 0, exams: 0, todayPresent: 0, todayAbsent: 0,
  });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [cls, std, hw, ex, nt] = await Promise.all([
        api.get('/classes').catch(() => ({ data: { data: [] } })),
        api.get('/students').catch(() => ({ data: { data: [] } })),
        api.get('/homework').catch(() => ({ data: { data: [] } })),
        api.get('/exams').catch(() => ({ data: { data: [] } })),
        api.get('/notices').catch(() => ({ data: { data: [] } })),
      ]);

      setStats({
        classes: cls.data.data?.length || 0,
        students: std.data.data?.length || 0,
        homework: hw.data.data?.length || 0,
        exams: ex.data.data?.length || 0,
        todayPresent: 0,
        todayAbsent: 0,
      });
      setNotices((nt.data.data || []).slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 20000);
    return () => clearInterval(timer);
  }, []);

  const statCards = [
    { label: 'My Classes',  value: stats.classes,  icon: GraduationCap, color: '#1E6A8C' },
    { label: 'My Students', value: stats.students, icon: Users,         color: '#16A34A' },
    { label: 'Homework',    value: stats.homework, icon: BookOpen,      color: '#D4A24C' },
    { label: 'Exams',       value: stats.exams,    icon: FileSpreadsheet, color: '#7C3AED' },
  ];

  return (
    <div className="page">
      <div className="teacher-hero">
        <div className="teacher-hero-text">
          <p className="hero-eyebrow">Welcome back</p>
          <h2>Hello, {user?.name} 👋</h2>
          <p className="hero-sub">Here's what's happening in your classes today.</p>
        </div>
        <div className="teacher-hero-badge">
          <Award size={20} />
          <span>Teacher</span>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="stat-card stat-card-modern" key={i}>
              <div className="stat-icon" style={{ background: s.color + '15', color: s.color }}>
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h3>{loading ? '—' : s.value}</h3>
                <p>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-title"><h3>Quick Actions</h3></div>
      <div className="quick-actions">
        <Link to="/teacher/attendance" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            <CalendarCheck size={22} />
          </div>
          <div>
            <h4>Mark Attendance</h4>
            <p>Record today's attendance</p>
          </div>
        </Link>

        <Link to="/teacher/homework" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h4>Assign Homework</h4>
            <p>Create a new assignment</p>
          </div>
        </Link>

        <Link to="/teacher/exams" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h4>Enter Marks</h4>
            <p>Grade students' exams</p>
          </div>
        </Link>

        <Link to="/teacher/notices" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FCE7F3', color: '#BE185D' }}>
            <Megaphone size={22} />
          </div>
          <div>
            <h4>Post Notice</h4>
            <p>Announce to students</p>
          </div>
        </Link>
      </div>

      <div className="section-title">
        <h3>Recent Notices</h3>
        <Link to="/teacher/notices" className="link-more">View all →</Link>
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
              <span className="notice-meta">
                <Clock size={12} />
                {new Date(n.createdAt || n.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}