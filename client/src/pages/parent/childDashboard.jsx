import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  User, TrendingUp, BookOpen, FileSpreadsheet, CreditCard,
  CalendarCheck, Clock, Award, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChildDashboard() {
  const { user } = useAuth();
  const [child, setChild] = useState(null);
  const [stats, setStats] = useState({ attendance: 0, present: 0, absent: 0, late: 0 });
  const [homework, setHomework] = useState([]);
  const [exams, setExams] = useState([]);
  const [fees, setFees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/parents/my-child').then(({ data }) => setChild(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!child?.student_id) { setLoading(false); return; }

    Promise.all([
      api.get(`/attendance/student/${child.student_id}`).catch(() => ({ data: { data: [] } })),
      api.get('/homework').catch(() => ({ data: { data: [] } })),
      api.get('/exams').catch(() => ({ data: { data: [] } })),
      api.get(`/fees/student/${child.student_id}`).catch(() => ({ data: { data: [] } })),
    ]).then(([att, hw, ex, fe]) => {
      const records = att.data.data || [];
      const present = records.filter((a) => a.status === 'Present').length;
      const absent = records.filter((a) => a.status === 'Absent').length;
      const late = records.filter((a) => a.status === 'Late').length;
      const percent = records.length ? Math.round((present / records.length) * 100) : 0;

      setStats({ attendance: percent, present, absent, late });
      setAttendanceRecords(records.slice(0, 10));
      setHomework((hw.data.data || []).slice(0, 5));
      setExams((ex.data.data || []).slice(0, 5));
      setFees(fe.data.data || []);
    }).finally(() => setLoading(false));
  }, [child]);

  const pendingFees = fees.reduce(
    (s, f) => s + (Number(f.amount) - Number(f.paid_amount || 0)), 0
  );

  return (
    <div className="page">
      <Link to="/parent/dashboard" className="back-link">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* Child header */}
      {child && (
        <div className="child-profile-card big">
          <div className="child-avatar big">🧑‍🎓</div>
          <div style={{ flex: 1 }}>
            <h3>{child.student_name}</h3>
            <p>
              {child.class_name ? `${child.class_name} ${child.section || ''}` : ''}
              {child.roll_no && ` · Roll ${child.roll_no}`}
              {child.admission_no && ` · ${child.admission_no}`}
            </p>
          </div>
          <div className="child-meta">
            {child.guardian_phone && <span>📞 {child.guardian_phone}</span>}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <TrendingUp size={22} />
          </div>
          <div><h3>{stats.attendance}%</h3><p>Attendance</p></div>
        </div>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <BookOpen size={22} />
          </div>
          <div><h3>{homework.length}</h3><p>Homework</p></div>
        </div>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileSpreadsheet size={22} />
          </div>
          <div><h3>{exams.length}</h3><p>Exams</p></div>
        </div>
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <CreditCard size={22} />
          </div>
          <div><h3>₹{Number(pendingFees).toLocaleString()}</h3><p>Pending Fees</p></div>
        </div>
      </div>

      {/* Attendance summary */}
      <div className="section-title"><h3>Attendance Summary</h3></div>
      <div className="attendance-grid">
        <div className="att-box green">
          <h3>{stats.present}</h3>
          <p>Present</p>
        </div>
        <div className="att-box red">
          <h3>{stats.absent}</h3>
          <p>Absent</p>
        </div>
        <div className="att-box yellow">
          <h3>{stats.late}</h3>
          <p>Late</p>
        </div>
      </div>

      {/* Two columns: Attendance log + Homework */}
      <div className="two-columns">
        <div>
          <div className="section-title"><h3>Recent Attendance</h3></div>
          <div className="notices-card">
            {attendanceRecords.length === 0 && (
              <div className="empty-state"><CalendarCheck size={28} strokeWidth={1.5} /><p>No records</p></div>
            )}
            {attendanceRecords.map((a, i) => (
              <div className="notice-item" key={i}>
                <div className="notice-dot" />
                <div className="notice-body">
                  <h4>{a.date}</h4>
                  <span className={`badge badge-${a.status === 'Present' ? 'paid' : a.status === 'Absent' ? 'overdue' : 'pending'}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-title"><h3>Recent Homework</h3></div>
          <div className="notices-card">
            {homework.length === 0 && (
              <div className="empty-state"><BookOpen size={28} strokeWidth={1.5} /><p>No homework</p></div>
            )}
            {homework.map((h) => (
              <div className="notice-item" key={h._id || h.id}>
                <div className="notice-dot" />
                <div className="notice-body">
                  <h4>{h.title}</h4>
                  <p>{h.subject}</p>
                  <span className="notice-meta"><Clock size={12} /> Due {h.due_date || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fees */}
      <div className="section-title">
        <h3>Fee Details</h3>
        <Link to="/parent/fees" className="link-more">Manage fees →</Link>
      </div>
      <div className="notices-card">
        {fees.length === 0 && (
          <div className="empty-state"><CreditCard size={28} strokeWidth={1.5} /><p>No fee records</p></div>
        )}
        {fees.map((f) => (
          <div className="notice-item" key={f._id || f.id}>
            <div className="notice-dot" />
            <div className="notice-body">
              <h4>{f.title || 'Fee'}</h4>
              <p>Amount: ₹{Number(f.amount).toLocaleString()} · Paid: ₹{Number(f.paid_amount || 0).toLocaleString()}</p>
              <span className="notice-meta">
                <span className={`badge badge-${String(f.status).toLowerCase()}`}>{f.status}</span>
                {f.due_date && <span style={{ marginLeft: 8 }}>Due: {f.due_date}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}