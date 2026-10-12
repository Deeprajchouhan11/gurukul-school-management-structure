import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import { Lock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.oldPassword || !form.newPassword) {
      return setError('All fields are required');
    }
    if (form.newPassword.length < 6) {
      return setError('New password must be at least 6 characters');
    }
    if (form.newPassword !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.oldPassword === form.newPassword) {
      return setError('New password must be different from old password');
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Password changed successfully!');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Link to={`/${user?.role?.toLowerCase()}/dashboard`} className="back-link">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="auth-card">
        <div className="auth-card-icon">
          <Lock size={28} />
        </div>
        <h2>Change Password</h2>
        <p className="auth-card-sub">Keep your account secure with a strong password.</p>

        {error && (
          <div className="login-error">
            <XCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
            {error}
          </div>
        )}
        {success && (
          <div className="login-success">
            <CheckCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
            {success}
          </div>
        )}

        <form onSubmit={submit}>
          <label>Current Password</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={onChange}
            placeholder="Enter current password"
            required
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
            placeholder="At least 6 characters"
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onChange}
            placeholder="Retype new password"
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}