import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';
import { Users, Plus, Shield, ShieldOff, Trash2, UserPlus, CheckCircle, XCircle } from 'lucide-react';

const ROLES = ['Admin', 'Teacher', 'Student', 'Parent', 'Accountant'];
const emptyForm = { name: '', email: '', password: '', role: 'Student' };

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data);
    } catch { setUsers([]); }
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email) {
      return setError('Name and email are required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError('Please enter a valid email address');
    }
    if (form.password && form.password.length < 4) {
      return setError('Password must be at least 4 characters');
    }

    try {
      await api.post('/users', form);
      setOpen(false);
      setForm(emptyForm);
      load();
      showToast(`User "${form.name}" created successfully!`, 'success');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const toggle = async (id, name) => {
    try {
      await api.patch(`/users/${id}/toggle`);
      load();
      showToast(`Status updated for "${name}"`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const remove = async (id, name, email) => {
    if (email === 'admin@gurukul.edu') {
      return showToast('Cannot delete main admin', 'error');
    }
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      load();
      showToast(`User "${name}" deleted`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const s = filter.toLowerCase();
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleBadge = (role) => {
    const colors = {
      Admin: 'badge-admin', Teacher: 'badge-teacher', Student: 'badge-student',
      Parent: 'badge-parent', Accountant: 'badge-accountant',
    };
    return <span className={`badge ${colors[role] || ''}`}>{role}</span>;
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Role', render: (r) => roleBadge(r.role) },
    {
      header: 'Status',
      render: (r) => (
        <span className={`status-pill ${r.is_active ? 'status-active' : 'status-inactive'}`}>
          <span className="dot" />
          {r.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (r) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`btn btn-sm ${r.is_active ? 'btn-danger' : 'btn-success'}`}
            onClick={() => toggle(r._id || r.id, r.name)}
          >
            {r.is_active ? <><ShieldOff size={13} /> Deactivate</> : <><Shield size={13} /> Activate</>}
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => remove(r._id || r.id, r.name, r.email)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={24} /> Users & Roles
          </h2>
          <p>Create and manage all system users.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setError(''); setOpen(true); }}>
          <UserPlus size={15} /> Add User
        </button>
      </div>

      <div className="filter-bar">
        <input
          placeholder="🔍 Search by name or email…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <div className="stats-inline">
          <span><strong>{users.length}</strong> total</span>
          <span className="dot-sep">·</span>
          <span><strong>{users.filter(u => u.is_active).length}</strong> active</span>
        </div>
      </div>

      <Table columns={columns} data={filtered} empty="No users found" />

      <Modal open={open} onClose={() => setOpen(false)} title="Register New User">
        <form onSubmit={submit} className="form-grid">
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            name="password"
            type="text"
            placeholder="Password (default: changeme123)"
            value={form.password}
            onChange={onChange}
          />
          <select name="role" value={form.role} onChange={onChange}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>

          {error && <div className="form-error">{error}</div>}

          <div className="info-box">
            ℹ️ User will be able to login immediately with this email and password.
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><Plus size={14} /> Register User</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}