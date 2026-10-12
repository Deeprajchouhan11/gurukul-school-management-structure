import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

export default function FeeList() {
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student_id: '', title: '', amount: '', due_date: '' });

  const load = async () => {
    const { data } = await api.get('/fees');
    setData(data.data);
  };

  useEffect(() => {
    load();
    api.get('/students').then(({ data }) => setStudents(data.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/fees', form);
    setOpen(false);
    setForm({ student_id: '', title: '', amount: '', due_date: '' });
    load();
  };

  const pay = async (id) => {
    const amt = prompt('Enter amount to pay:');
    if (!amt) return;
    await api.post(`/fees/${id}/pay`, { amount: Number(amt) });
    load();
  };

  const columns = [
    { header: 'Student', key: 'student_name' },
    { header: 'Title', key: 'title' },
    { header: 'Amount', render: (r) => `₹${Number(r.amount).toLocaleString()}` },
    { header: 'Paid', render: (r) => `₹${Number(r.paid_amount).toLocaleString()}` },
    { header: 'Status', render: (r) => <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span> },
    { header: 'Due', key: 'due_date' },
    { header: 'Action', render: (r) => r.status !== 'Paid'
      ? <button className="btn btn-primary btn-sm" onClick={() => pay(r.id)}>Pay</button>
      : '—' },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <h2>Fees</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add Invoice</button>
      </div>
      <Table columns={columns} data={data} />

      <Modal open={open} onClose={() => setOpen(false)} title="Create Fee Invoice">
        <form onSubmit={submit} className="form-grid">
          <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} required>
            <option value="">Select Student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>)}
          </select>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}