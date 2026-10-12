import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import { ROLE_AVATARS, ROLE_LABELS, ROLE_DASHBOARD } from '../../utils/rolePermissions.js';
import { LogIn, UserPlus, Mail, Lock, Shield, CheckCircle, XCircle, GraduationCap } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({ email: '', password: '', role: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', role: 'Student' });

  const onLoginChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onRegChange = (e) => setRegForm({ ...regForm, [e.target.name]: e.target.value });

  const onLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password || !form.role) return setError('Please fill all fields.');
    const res = await login(form.email, form.password, form.role);
    if (res.success) navigate(ROLE_DASHBOARD[res.user.role] || '/');
    else setError(res.message);
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!regForm.name || !regForm.email || !regForm.password) {
      return setError('Please fill all fields.');
    }
    if (regForm.password.length < 4) {
      return setError('Password must be at least 4 characters.');
    }
    try {
      await api.post('/auth/register', regForm);
      setSuccess('Account created! You can now log in.');
      setTimeout(() => {
        setTab('login');
        setForm({ email: regForm.email, password: regForm.password, role: regForm.role });
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-icon">
          <GraduationCap size={38} />
        </div>

        <h1>Gurukul <span>EduSphere</span></h1>
        <p className="login-sub">School Management System</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={tab === 'login' ? 'active' : ''}
            onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
          >
            <LogIn size={15} /> Login
          </button>
          <button
            className={tab === 'register' ? 'active' : ''}
            onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
          >
            <UserPlus size={15} /> Register
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="login-error">
            <XCircle size={15} /> {error}
          </div>
        )}
        {success && (
          <div className="login-success">
            <CheckCircle size={15} /> {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form onSubmit={onLogin}>
            <label>Email / User ID</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                name="email"
                value={form.email}
                onChange={onLoginChange}
                placeholder="admin@gurukul.edu"
              />
            </div>

            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onLoginChange}
                placeholder="••••••••"
              />
            </div>

            <label>Role</label>
            <div className="input-wrap">
              <Shield size={16} className="input-icon" />
              <select name="role" value={form.role} onChange={onLoginChange}>
                <option value="">Select your role</option>
                {Object.keys(ROLE_LABELS).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {form.role && (
              <div className="role-hint">
                <span>{ROLE_AVATARS[form.role]}</span>
                <span>{ROLE_LABELS[form.role]}</span>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in to Gurukul'}
            </button>

            <div className="login-footer">
              <a href="/forgot-password">Forgot password?</a>
              <a href="/forgot-password">Verify email/OTP</a>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={onRegister}>
            <label>Full Name</label>
            <div className="input-wrap">
              <UserPlus size={16} className="input-icon" />
              <input
                name="name"
                value={regForm.name}
                onChange={onRegChange}
                placeholder="Your full name"
                required
              />
            </div>

            <label>Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                value={regForm.email}
                onChange={onRegChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <label>Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                value={regForm.password}
                onChange={onRegChange}
                placeholder="At least 4 characters"
                required
              />
            </div>

            <label>Role</label>
            <div className="input-wrap">
              <Shield size={16} className="input-icon" />
              <select name="role" value={regForm.role} onChange={onRegChange}>
                {Object.keys(ROLE_LABELS).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Create Account
            </button>

            <p className="register-note">
              By registering you agree to Gurukul's terms of use.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}