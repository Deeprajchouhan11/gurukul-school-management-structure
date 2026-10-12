import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  LayoutDashboard, CalendarCheck, BookOpen, FileSpreadsheet,
  CreditCard, Megaphone, Clock, Award, TrendingUp, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    attendance: 0, present: 0, absent: 0, late: 0,
    homework: 0, exams: 0, pendingFees: 0,
  });
  const [notices, setNotices] = useState([]);
  const [homework, setHomework] = useState([]);
  const [exams, setExams] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/attendance/me').catch(() => ({ data: { data: { records: [], summary: {} } } })),
      api.get('/homework').catch(() => ({ data: { data: [] } })),
      api.get('/exams').catch(() => ({ data: { data: [] } })),
      api.get('/fees/me').catch(() => ({ data: { data: { fees: [], pending: 0 } } })),
      api.get('/notices').catch(() => ({ data: { data: [] } })),
    ]).then(([att, hw, ex, fee, nt]) => {
      const attData = att.data.data || {};
      const summary = attData.summary || {};

      setStats({
        attendance: summary.percent || 0,
        present: summary.present || 0,
        absent: summary.absent || 0,
        late: summary.late || 0,
        homework: (hw.data.data || []).length,
        exams: (ex.data.data || []).length,
        pendingFees: fee.data.data?.pending || 0,
      });

      setAttendanceRecords((attData.records || []).slice(0, 8));
      setHomework((hw.data.data || []).slice(0, 5));
      setExams((ex.data.data || []).slice(0, 5));
      setNotices((nt.data.data || []).slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      {/* HERO */}
      <div className="teacher-hero student-hero">
        <div className="teacher-hero-text">
          <p className="hero-eyebrow">Student Dashboard</p>
          <h2>Hello, {user?.name} </h2>
          <p className="hero-sub">Here's your learning progress today.</p>
        </div>
        <div className="teacher-hero-badge">
          <Award size={20} />
          <span>Student</span>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <TrendingUp size={22} />
          </div>
          <div><h3>{loading ? '—' : `${stats.attendance}%`}</h3><p>Attendance</p></div>
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

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <CreditCard size={22} />
          </div>
          <div>
            <h3>₹{loading ? '—' : Number(stats.pendingFees).toLocaleString()}</h3>
            <p>Pending Fees</p>
          </div>
        </div>
      </div>

      {/* ATTENDANCE SUMMARY */}
      <div className="section-title">
        <h3>Attendance Summary</h3>
        <Link to="/student/attendance" className="link-more">View all →</Link>
      </div>
      <div className="attendance-grid">
        <div className="att-box green">
          <CheckCircle size={20} style={{ marginBottom: 8 }} />
          <h3>{stats.present}</h3>
          <p>Present</p>
        </div>
        <div className="att-box red">
          <XCircle size={20} style={{ marginBottom: 8 }} />
          <h3>{stats.absent}</h3>
          <p>Absent</p>
        </div>
        <div className="att-box yellow">
          <AlertCircle size={20} style={{ marginBottom: 8 }} />
          <h3>{stats.late}</h3>
          <p>Late</p>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="section-title"><h3>Quick Links</h3></div>
      <div className="quick-actions">
        <a href="/student/attendance" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            <CalendarCheck size={22} />
          </div>
          <div><h4>My Attendance</h4><p>Full record</p></div>
        </a>

        <a href="/student/homework" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <BookOpen size={22} />
          </div>
          <div><h4>Homework</h4><p>Pending assignments</p></div>
        </a>

        <a href="/student/exams" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div><h4>Exams</h4><p>Schedule & results</p></div>
        </a>

        <a href="/student/fees" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <CreditCard size={22} />
          </div>
          <div><h4>My Fees</h4><p>Invoices & payments</p></div>
        </a>

        <a href="/student/library" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FCE7F3', color: '#BE185D' }}>
            <BookOpen size={22} />
          </div>
          <div><h4>Library</h4><p>Browse books</p></div>
        </a>

        <a href="/student/notices" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#92400E' }}>
            <Megaphone size={22} />
          </div>
          <div><h4>Notices</h4><p>Announcements</p></div>
        </a>
      </div>

      {/* HOMEWORK + EXAMS + NOTICES */}
      <div className="two-columns">
        <div>
          <div className="section-title">
            <h3>Recent Homework</h3>
            <Link to="/student/homework" className="link-more">View all →</Link>
          </div>
          <div className="notices-card">
            {homework.length === 0 && (
              <div className="empty-state">
                <BookOpen size={28} strokeWidth={1.5} />
                <p>No homework yet</p>
              </div>
            )}
            {homework.map((h) => (
              <div className="notice-item" key={h._id || h.id}>
                <div className="notice-dot" />
                <div className="notice-body">
                  <h4>{h.title}</h4>
                  <p>{h.subject}</p>
                  <span className="notice-meta">
                    <Clock size={12} /> Due {h.due_date || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title">
            <h3>Upcoming Exams</h3>
            <Link to="/student/exams" className="link-more">View all →</Link>
          </div>
          <div className="notices-card">
            {exams.length === 0 && (
              <div className="empty-state">
                <FileSpreadsheet size={28} strokeWidth={1.5} />
                <p>No exams scheduled</p>
              </div>
            )}
            {exams.map((e) => (
              <div className="notice-item" key={e._id || e.id}>
                <div className="notice-dot" />
                <div className="notice-body">
                  <h4>{e.name}</h4>
                  <p>{e.class_name || ''}</p>
                  <span className="notice-meta">
                    <Clock size={12} /> {e.exam_date || '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NOTICES */}
      <div className="section-title">
        <h3>Recent Notices</h3>
        <Link to="/student/notices" className="link-more">View all →</Link>
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
                <Clock size={12} /> {new Date(n.createdAt || n.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}