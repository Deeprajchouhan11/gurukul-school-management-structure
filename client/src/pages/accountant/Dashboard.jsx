import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  CreditCard, TrendingUp, TrendingDown, IndianRupee,
  Receipt, FileText, Download, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AccountantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ total: 0, collected: 0, pending: 0 });
  const [recentFees, setRecentFees] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get('/fees/summary').then(({ data }) => setSummary(data.data)).catch(() => {});
    api.get('/fees').then(({ data }) => setRecentFees((data.data || []).slice(0, 6))).catch(() => {});
  }, []);

  const collectionRate = summary.total
    ? Math.round((summary.collected / summary.total) * 100)
    : 0;

  // Export all fees + payments as CSV
  const handleExport = async () => {
    setExporting(true);
    try {
      const [feesRes, paymentsRes] = await Promise.all([
        api.get('/fees').catch(() => ({ data: { data: [] } })),
        api.get('/payments/all').catch(() => ({ data: { data: [] } })),
      ]);

      const fees = feesRes.data.data || [];
      const payments = paymentsRes.data.data || [];

      // Build CSV content
      const lines = [];

      // Fees section
      lines.push('=== FEES REPORT ===');
      lines.push('');
      lines.push('Student,Title,Amount,Paid,Pending,Status,Due Date');
      fees.forEach((f) => {
        const pending = Number(f.amount) - Number(f.paid_amount || 0);
        lines.push([
          `"${f.student_name || ''}"`,
          `"${f.title || ''}"`,
          Number(f.amount || 0),
          Number(f.paid_amount || 0),
          pending,
          `"${f.status || ''}"`,
          `"${f.due_date || ''}"`,
        ].join(','));
      });
      lines.push('');

      // Payments section
      lines.push('=== PAYMENTS REPORT ===');
      lines.push('');
      lines.push('Receipt No,Student,Fee Title,Amount,Method,Transaction ID,Status,Paid At');
      payments.forEach((p) => {
        lines.push([
          `"${p.receipt_no || ''}"`,
          `"${p.student_id?.user?.name || ''}"`,
          `"${p.fee_id?.title || ''}"`,
          Number(p.amount || 0),
          `"${p.method || ''}"`,
          `"${p.transaction_id || ''}"`,
          `"${p.status || ''}"`,
          `"${p.paid_at ? new Date(p.paid_at).toLocaleString() : ''}"`,
        ].join(','));
      });
      lines.push('');

      // Summary
      lines.push('=== SUMMARY ===');
      lines.push(`Total Billed,${summary.total}`);
      lines.push(`Collected,${summary.collected}`);
      lines.push(`Pending,${summary.pending}`);
      lines.push(`Collection Rate,${collectionRate}%`);
      lines.push(`Exported At,${new Date().toLocaleString()}`);

      const csv = lines.join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Gurukul-Accounts-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed: ' + e.message);
    } finally {
      setExporting(false);
    }
  };

  const handleReceipts = () => {
    navigate('/accountant/receipts');
  };

  return (
    <div className="page">
      {/* HERO */}
      <div className="teacher-hero accountant-hero">
        <div className="teacher-hero-text">
          <p className="hero-eyebrow">Accounts Dashboard</p>
          <h2>Welcome, {user?.name} 👋</h2>
          <p className="hero-sub">Track fees, payments and financial reports.</p>
        </div>
        <div className="teacher-hero-badge">
          <IndianRupee size={20} />
          <span>Accountant</span>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <Receipt size={22} />
          </div>
          <div>
            <h3>₹{Number(summary.total).toLocaleString()}</h3>
            <p>Total Billed</p>
          </div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <h3>₹{Number(summary.collected).toLocaleString()}</h3>
            <p>Collected</p>
          </div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEE2E2', color: '#DC2626' }}>
            <TrendingDown size={22} />
          </div>
          <div>
            <h3>₹{Number(summary.pending).toLocaleString()}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card stat-card-modern">
          <div className="stat-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <h3>{collectionRate}%</h3>
            <p>Collection Rate</p>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="section-title"><h3>Collection Progress</h3></div>
      <div className="progress-card">
        <div className="progress-header">
          <span>Fee Collection</span>
          <span><strong>₹{Number(summary.collected).toLocaleString()}</strong> of ₹{Number(summary.total).toLocaleString()}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${collectionRate}%` }} />
        </div>
        <div className="progress-footer">
          <span><Clock size={12} /> {collectionRate}% complete</span>
          <span><AlertCircle size={12} /> ₹{Number(summary.pending).toLocaleString()} pending</span>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="section-title"><h3>Quick Actions</h3></div>
      <div className="quick-actions">
        <Link to="/accountant/fee-structure" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#FEF3C7', color: '#B45309' }}>
            <FileText size={22} />
          </div>
          <div><h4>Fee Structure</h4><p>Define class fees</p></div>
        </Link>

        <Link to="/accountant/fees" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <CreditCard size={22} />
          </div>
          <div><h4>Manage Fees</h4><p>Create & pay invoices</p></div>
        </Link>

        <Link to="/accountant/reports" className="quick-action-card">
          <div className="qa-icon" style={{ background: '#EDE9FE', color: '#6D28D9' }}>
            <FileText size={22} />
          </div>
          <div><h4>Fee Reports</h4><p>Detailed analysis</p></div>
        </Link>

        <button
          className="quick-action-card"
          onClick={handleExport}
          disabled={exporting}
          style={{ cursor: exporting ? 'wait' : 'pointer' }}
        >
          <div className="qa-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <Download size={22} />
          </div>
          <div>
            <h4>{exporting ? 'Exporting...' : 'Export Data'}</h4>
            <p>Download CSV report</p>
          </div>
        </button>

        <button
          className="quick-action-card"
          onClick={handleReceipts}
        >
          <div className="qa-icon" style={{ background: '#FCE7F3', color: '#BE185D' }}>
            <Receipt size={22} />
          </div>
          <div><h4>Receipts</h4><p>Payment history & PDF</p></div>
        </button>
      </div>

      {/* RECENT INVOICES */}
      <div className="section-title">
        <h3>Recent Invoices</h3>
        <Link to="/accountant/fees" className="link-more">View all →</Link>
      </div>
      <div className="notices-card">
        {recentFees.length === 0 && (
          <div className="empty-state"><Receipt size={28} strokeWidth={1.5} /><p>No invoices yet</p></div>
        )}
        {recentFees.map((f) => (
          <div className="notice-item" key={f.id || f._id}>
            <div className="notice-dot" />
            <div className="notice-body">
              <h4>{f.student_name || 'Student'} — {f.title || 'Fee'}</h4>
              <p>Amount: ₹{Number(f.amount).toLocaleString()} · Paid: ₹{Number(f.paid_amount || 0).toLocaleString()}</p>
              <span className="notice-meta">
                <span className={`badge badge-${String(f.status).toLowerCase()}`}>{f.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}