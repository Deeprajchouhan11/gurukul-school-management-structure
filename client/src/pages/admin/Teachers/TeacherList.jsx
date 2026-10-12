import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

const emptyForm = {
  name: '', email: '', password: '', employee_no: '',
  subject: '', qualification: '', joining_date: ''
};

export default function TeacherList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await api.get('/teachers');
    setData(data.data);
  };
  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/teachers', form);
      setOpen(false); setForm(emptyForm); load();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete teacher?')) return;
    await api.delete(`/teachers/${id}`);
    load();
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Emp No', key: 'employee_no' },
    { header: 'Subject', key: 'subject' },
    { header: 'Qualification', key: 'qualification' },
    { header: 'Actions', render: (r) => (
      <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Delete</button>
    )},
  ];

  return (
    <div className="page">
      <div className="page-head">
        <h2>Teachers</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add Teacher</button>
      </div>
      <Table columns={columns} data={data} />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Teacher">
        <form onSubmit={submit} className="form-grid">
          <input name="name" placeholder="Full Name" value={form.name} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" placeholder="Password (default: teacher123)" value={form.password} onChange={onChange} />
          <input name="employee_no" placeholder="Employee No" value={form.employee_no} onChange={onChange} required />
          <input name="subject" placeholder="Subject" value={form.subject} onChange={onChange} />
          <input name="qualification" placeholder="Qualification" value={form.qualification} onChange={onChange} />
          <input name="joining_date" type="date" value={form.joining_date} onChange={onChange} />
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}