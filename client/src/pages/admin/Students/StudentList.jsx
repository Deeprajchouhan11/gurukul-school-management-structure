import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

const emptyForm = {
  name: '', email: '', password: '', admission_no: '', roll_no: '',
  class_id: '', guardian_name: '', guardian_phone: '', dob: '', address: ''
};

export default function StudentList() {
  const [data, setData] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/students');
      setData(data.data);
    } catch { setData([]); }
  };

  const loadClasses = async () => {
    try {
      const { data } = await api.get('/classes');
      console.log('Classes loaded:', data.data);
      setClasses(data.data);
    } catch (e) {
      console.error('Failed to load classes:', e);
    }
  };

  useEffect(() => {
    load();
    loadClasses();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/students', form);
      setOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    load();
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    { header: 'Admission No', key: 'admission_no' },
    { header: 'Class', render: (r) => `${r.class_name || '-'} ${r.section || ''}` },
    { header: 'Guardian', key: 'guardian_name' },
    { header: 'Actions', render: (r) => (
      <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Delete</button>
    )},
  ];

  return (
    <div className="page">
      <div className="page-head">
        <h2>Students</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add Student</button>
      </div>
      <Table columns={columns} data={data} />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Student">
        <form onSubmit={submit} className="form-grid">
          <input name="name" placeholder="Full Name" value={form.name} onChange={onChange} required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input name="password" placeholder="Password (default: student123)" value={form.password} onChange={onChange} />
          <input name="admission_no" placeholder="Admission No" value={form.admission_no} onChange={onChange} required />
          <input name="roll_no" placeholder="Roll No" value={form.roll_no} onChange={onChange} />

          <select name="class_id" value={form.class_id} onChange={onChange}>
            <option value="">Select Class</option>
            {classes.length === 0 && (
              <option value="" disabled>Loading classes...</option>
            )}
            {classes.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.name} {c.section ? `- ${c.section}` : ''}
              </option>
            ))}
          </select>

          <input name="guardian_name" placeholder="Guardian Name" value={form.guardian_name} onChange={onChange} />
          <input name="guardian_phone" placeholder="Guardian Phone" value={form.guardian_phone} onChange={onChange} />
          <input name="dob" type="date" value={form.dob} onChange={onChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={onChange} />
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