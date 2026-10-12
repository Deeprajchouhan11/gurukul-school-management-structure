import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

export default function NoticeList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', audience: 'all' });

  const load = async () => {
    try {
      const { data } = await api.get('/notices');
      setData(data.data);
    } catch { setData([]); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/notices', form);
    setOpen(false);
    setForm({ title: '', body: '', audience: 'all' });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete notice?')) return;
    await api.delete(`/notices/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Notices</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Publish Notice</button>
      </div>
      <Table columns={[
        { header: 'Title', key: 'title' },
        { header: 'Audience', key: 'audience' },
        { header: 'Created', render: (r) => new Date(r.createdAt || r.created_at).toLocaleDateString() },
        { header: 'Action', render: (r) => (
          <button className="btn btn-danger btn-sm" onClick={() => remove(r._id || r.id)}>Delete</button>
        )},
      ]} data={data} />

      <Modal open={open} onClose={() => setOpen(false)} title="Publish Notice">
        <form onSubmit={submit} className="form-grid">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Message" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          <select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
            <option value="all">All</option>
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="parents">Parents</option>
            <option value="accountants">Accountants</option>
          </select>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Publish</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}