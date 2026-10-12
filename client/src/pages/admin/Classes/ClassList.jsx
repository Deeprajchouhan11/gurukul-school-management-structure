import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

export default function ClassList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', section: '' });

  const load = async () => {
    const { data } = await api.get('/classes');
    setData(data.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/classes', form);
    setOpen(false); setForm({ name: '', section: '' }); load();
  };

  const remove = async (id) => {
    if (!confirm('Delete class?')) return;
    await api.delete(`/classes/${id}`);
    load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Classes & Sections</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add Class</button>
      </div>
      <Table columns={[
        { header: 'Class', key: 'name' },
        { header: 'Section', key: 'section' },
        { header: 'Actions', render: (r) => (
          <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Delete</button>
        )},
      ]} data={data} />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Class">
        <form onSubmit={submit} className="form-grid">
          <input placeholder="Class name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Section" value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })} />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}