import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

export default function HomeworkList() {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ class_id: '', subject: '', title: '', description: '', due_date: '' });

  const load = async () => {
    const { data } = await api.get('/homework');
    setData(data.data);
  };

  useEffect(() => {
    load();
    api.get('/classes').then(({ data }) => setClasses(data.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/homework', form);
    setOpen(false); setForm({ class_id: '', subject: '', title: '', description: '', due_date: '' }); load();
  };

  const remove = async (id) => {
    if (!confirm('Delete homework?')) return;
    await api.delete(`/homework/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Homework</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Assign Homework</button>
      </div>
      <Table columns={[
        { header: 'Class', key: 'class_name' },
        { header: 'Subject', key: 'subject' },
        { header: 'Title', key: 'title' },
        { header: 'Due', key: 'due_date' },
        { header: 'Action', render: (r) => (
          <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Delete</button>
        )},
      ]} data={data} />

      <Modal open={open} onClose={() => setOpen(false)} title="Assign Homework">
        <form onSubmit={submit} className="form-grid">
          <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </select>
          <input placeholder="Subject" value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <input placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="date" value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}