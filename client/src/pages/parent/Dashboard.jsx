import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  TrendingUp, BookOpen, FileSpreadsheet, CreditCard,
  Megaphone, Clock, Award, Eye, MessageCircle, Bus
} from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [child, setChild] = useState(null);
  const [stats, setStats] = useState({ attendance: 0, homework: 0, results: 0, pendingFees: 0 });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parent ka child fetch karo
    api.get('/parents/my-child')
      .then(({ data }) => setChild(data.data))
      .catch(() => setChild(null))
      .finally(() => setLoading(false));

    api.get('/notices').catch(() => ({ data: { data: [] } }))
      .then(({ data }) => setNotices((data.data || []).slice(0, 4)));
  }, []);

  // Child ke stats fetch karo
  useEffect(() => {
    if (!child?.student_id) return;

    Promise.all([
      api.get(`/attendance/student/${child.student_id}`).catch(() => ({ data: { data: [] } })),
      api.get('/homework').catch(() => ({ data: { data: [] } })),
      api.get('/exams').catch(() => ({ data: { data: [] } })),
      api.get(`/fees/student/${child.student_id}`).catch(() => ({ data: { data: [] } })),
    ]).then(([att, hw, ex, fees]) => {
      const attRecords = att.data.data || [];
      const present = attRecords.filter((a) => a.status === 'Present').length;
      const percent = attRecords.length ? Math.round((present / attRecords.length) * 100) : 0;

      const feeRecords = fees.data.data || [];
      const pending = feeRecords.reduce(
        (s, f) => s + (Number(f.amount) - Number(f.paid_amount || 0)), 0
      );

      setStats({
        attendance: percent,
        homework: (hw.data.data || []).length,
        results: (ex.data.data || []).length,
        pendingFees: pending,
      });
    });
  }, [child]);

  return (
    <div className="page">
      {/* HERO */}
      <div className="teacher-hero parent-hero">
        <div className="teacher-hero-text">
          <p className="hero-eyebrow">Parent Dashboard</p>
          <h2>Welcome, {user?.name} 👋</h2>
          {child ? (
            <p className="hero-sub">
              Monitoring: <strong style={{ color: '#FFEDD5' }}>{child.student_name}</strong>
              {child.class_name && ` · ${child.class_name} ${child.section || ''}`}
              {child.admission_no && ` · ${child.admission_no}`}
            </p>
          ) : (
            <p className="hero-sub">Monitor your child's progress and school updates.</p>
          )}
        </div>
        <div className="teacher-hero-badge">
          <Award size={20} />
          <span>Parent</span>
        </div>
      </div>

      {/* CHILD CARD */}
      {child && (
        <div className="child-profile-card">
          <div className="child-avatar">🧑‍🎓</div>
          <div style={{ flex: 1 }}>
            <h3>{child.student_name}</h3>
            <p>
              {child.class_name ? `${child.class_name} ${child.section || ''}` : 'No class assigned'}
              {child.roll_no && ` · Roll ${child.roll_no}`}
            </p>
          </div>
          <div className="child-meta">
            {child.guardian_phone && (
              <span>📞 {child.guardian_phone}</span>
            )}
            {child.admission_no && (
              <span>🎫 {child.admission_no}</span>
            )}
          </div>
        </div>
      )}

      {!child && !loading && (
        <div className="info-box" style={{ marginBottom: 20 }}>
          ℹ️ No child linked to your account yet. Please contact the school admin.
        </div>
      )}

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <TrendingUp size={22} />
          </div>
          <div><h3>{stats.attendance}%</h3><p>Child Attendance</p></div>
        </div>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <BookOpen size={22} />
          </div>
          <div><h3>{stats.homework}</h3><p>Homework</p></div>
        </div>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div><h3>{stats.results}</h3><p>Exam Results</p></div>
        </div>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <CreditCard size={22} />
          </div>
          <div><h3>₹{Number(stats.pendingFees).toLocaleString()}</h3><p>Pending Fees</p></div>
        </div>
      </div>

      {/* QUICK ACTIONS — NO DUPLICATES */}
      <div className="section-title"><h3>Quick Actions</h3></div>
      <div className="quick-actions">
        <a href="/parent/child-dashboard" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <Eye size={22} />
          </div>
          <div><h4>Child Dashboard</h4><p>Full view of child</p></div>
        </a>

        <a href="/parent/attendance" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            <Eye size={22} />
          </div>
          <div><h4>View Attendance</h4><p>Child's daily record</p></div>
        </a>

        <a href="/parent/results" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div><h4>Exam Results</h4><p>Marks & report card</p></div>
        </a>

        <a href="/parent/fees" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <CreditCard size={22} />
          </div>
          <div><h4>Pay Fees</h4><p>Online payment</p></div>
        </a>

        <a href="/parent/teacher-chat" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#25D36620', color: '#25D366' }}>
            <MessageCircle size={22} />
          </div>
          <div><h4>Teacher Chat</h4><p>WhatsApp teachers</p></div>
        </a>

        <a href="/parent/transport" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            <Bus size={22} />
          </div>
          <div><h4>Transport Info</h4><p>Live bus tracking</p></div>
        </a>

        <a href="/parent/notices" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#92400E' }}>
            <Megaphone size={22} />
          </div>
          <div><h4>Notices</h4><p>School announcements</p></div>
        </a>
      </div>

      {/* NOTICES */}
      <div className="section-title"><h3>Recent Notices</h3></div>
      <div className="notices-card">
        {notices.length === 0 && (
          <div className="empty-state"><Megaphone size={28} strokeWidth={1.5} /><p>No notices yet</p></div>
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