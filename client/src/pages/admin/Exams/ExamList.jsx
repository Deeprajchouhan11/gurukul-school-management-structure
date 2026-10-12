import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

import { Link } from 'react-router-dom';
import { FileSpreadsheet } from 'lucide-react';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', class_id: '', exam_date: '' });

  const load = async () => {
    const { data } = await api.get('/exams');
    setExams(data.data);
  };

  const columns = [
  { header: 'Exam', key: 'name' },
  { header: 'Class', key: 'class_name' },
  { header: 'Date', key: 'exam_date' },
  {
    header: 'Actions',
    render: (r) => (
      <Link
        to={`/admin/exams/${r._id || r.id}/marks`}
        className="btn btn-sm btn-primary"
      >
        <FileSpreadsheet size={13} /> Marks
      </Link>
    ),
  },
];

  useEffect(() => {
    load();
    api.get('/classes').then(({ data }) => setClasses(data.data)).catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/exams', form);
    setOpen(false); setForm({ name: '', class_id: '', exam_date: '' }); load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Exams</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Create Exam</button>
      </div>
      <Table columns={[
        { header: 'Exam', key: 'name' },
        { header: 'Class', key: 'class_name' },
        { header: 'Date', key: 'exam_date' },
      ]} data={exams} />

      <Modal open={open} onClose={() => setOpen(false)} title="Create Exam">
        <form onSubmit={submit} className="form-grid">
          <input placeholder="Exam name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })}>
            <option value="">Select Class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name} {c.section}</option>)}
          </select>
          <input type="date" value={form.exam_date}
            onChange={(e) => setForm({ ...form, exam_date: e.target.value })} />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}