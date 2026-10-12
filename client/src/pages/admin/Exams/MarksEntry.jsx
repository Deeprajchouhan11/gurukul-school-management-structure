import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../config/api.js';
import { FileSpreadsheet, Save, ArrowLeft, CheckCircle } from 'lucide-react';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'];

export default function MarksEntry() {
  const { examId } = useParams();
  const [data, setData] = useState(null);
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get(`/exams/marks/${examId}`);
      setData(data.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, [examId]);

  const handleMarkChange = (studentId, subject, value) => {
    setMarks({
      ...marks,
      [`${studentId}_${subject}`]: value,
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const results = [];
      Object.keys(marks).forEach((key) => {
        const [student_id, subject] = key.split('_');
        if (marks[key] !== '' && marks[key] !== null) {
          results.push({
            student_id,
            subject,
            marks: Number(marks[key]),
            max_marks: 100,
          });
        }
      });

      await api.post('/exams/results', { exam_id: examId, results });
      setMessage(`✅ ${results.length} marks saved successfully`);
      load();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed'));
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="page">
      <Link to="/admin/exams" className="back-link">
        <ArrowLeft size={14} /> Back to Exams
      </Link>

      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileSpreadsheet size={24} /> Marks Entry
          </h2>
          <p>{data.exam.name} — {data.exam.class_id?.name} {data.exam.class_id?.section}</p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          <Save size={15} /> {saving ? 'Saving...' : 'Save All Marks'}
        </button>
      </div>

      {message && <div className="alert" style={{ marginBottom: 16 }}>{message}</div>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student</th>
              {SUBJECTS.map((s) => <th key={s}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.studentMarks.map((s) => (
              <tr key={s.student_id}>
                <td>{s.roll_no || '—'}</td>
                <td><strong>{s.name}</strong></td>
                {SUBJECTS.map((sub) => {
                  const existing = s.results.find((r) => r.subject === sub);
                  const key = `${s.student_id}_${sub}`;
                  return (
                    <td key={sub}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        style={{
                          width: 70,
                          padding: '6px 10px',
                          border: '1.5px solid var(--border)',
                          borderRadius: 8,
                          fontFamily: 'inherit',
                          background: 'var(--bg-soft)',
                        }}
                        placeholder={existing ? String(existing.marks) : '—'}
                        value={marks[key] ?? (existing ? existing.marks : '')}
                        onChange={(e) => handleMarkChange(s.student_id, sub, e.target.value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-box" style={{ marginTop: 16 }}>
        ℹ️ Marks are out of 100. Empty fields will not be saved.
      </div>
    </div>
  );
}