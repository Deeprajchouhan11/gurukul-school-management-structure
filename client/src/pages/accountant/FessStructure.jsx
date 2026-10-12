import { useEffect, useState } from 'react';
import api from '../../config/api.js';
import Table from '../../components/common/Table.jsx';
import Modal from '../../components/common/Modal.jsx';
import { Plus, Trash2, IndianRupee, Sparkles } from 'lucide-react';

const FREQUENCIES = ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'];

const empty = {
  class_id: '', title: '', amount: '',
  frequency: 'Yearly', due_date: '', description: '',
};

export default function FeeStructure() {
  const [items, setItems] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/fee-structure');
      setItems(data.data);
    } catch { setItems([]); }
  };

  useEffect(() => {
    load();
    api.get('/classes').then(({ data }) => setClasses(data.data)).catch(() => {});
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/fee-structure', form);
      setSuccess(data.message || 'Fee structure created');
      setOpen(false);
      setForm(empty);
      load();
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this fee structure? Students\' existing invoices will not be deleted.')) return;
    await api.delete(`/fee-structure/${id}`);
    load();
  };

  const columns = [
    { header: 'Class', render: (r) => `${r.class_id?.name || '—'} ${r.class_id?.section || ''}` },
    { header: 'Fee Title', key: 'title' },
    { header: 'Amount', render: (r) => `₹${Number(r.amount).toLocaleString()}` },
    { header: 'Frequency', key: 'frequency' },
    { header: 'Due Date', key: 'due_date' },
    {
      header: 'Actions',
      render: (r) => (
        <button className="btn btn-sm btn-danger" onClick={() => remove(r._id)}>
          <Trash2 size={13} />
        </button>
      ),
    },
  ];

  return (
    <div className="page">
      {success && (
        <div className="toast toast-success" style={{ position: 'fixed', top: 80, right: 24, zIndex: 200 }}>
          <Sparkles size={16} /> {success}
        </div>
      )}

      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IndianRupee size={24} /> Fee Structure
          </h2>
          <p>Define fees for each class. Invoices auto-generate for all students.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          <Plus size={15} /> Add Fee
        </button>
      </div>

      <Table columns={columns} data={items} empty="No fee structure defined yet" />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Fee Structure">
        <form onSubmit={submit} className="form-grid">
          <select name="class_id" value={form.class_id} onChange={onChange} required>
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name} {c.section}</option>
            ))}
          </select>

          <input name="title" placeholder="Fee Title (e.g., Tuition Fee)" value={form.title} onChange={onChange} required />
          <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={onChange} required />

          <select name="frequency" value={form.frequency} onChange={onChange}>
            {FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
          </select>

          <input name="due_date" type="date" value={form.due_date} onChange={onChange} />
          <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={onChange} />

          {error && <div className="form-error">{error}</div>}

          <div className="info-box">
            ⚡ Saving will <strong>auto-generate invoices</strong> for every student in the selected class.
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save & Generate Invoices</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}