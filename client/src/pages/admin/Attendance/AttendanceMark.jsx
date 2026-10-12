import { useEffect, useState } from 'react';
import api from '../../../config/api.js';

export default function AttendanceMark() {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/classes').then(({ data }) => setClasses(data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!classId) return;
    api.get('/students')
      .then(({ data }) => {
        const filtered = data.data.filter(
          (s) => String(s.class_id) === String(classId)
        );
        setStudents(filtered);
        const st = {};
        filtered.forEach((s) => { st[s.id] = 'Present'; });
        setStatuses(st);
      })
      .catch(() => {});
  }, [classId]);

  const save = async () => {
    const records = students.map((s) => ({
      student_id: s.id,
      status: statuses[s.id] || 'Present',
    }));
    try {
      await api.post('/attendance/mark', { class_id: classId, date, records });
      setMessage('✅ Attendance saved');
      setTimeout(() => setMessage(''), 2500);
    } catch (e) {
      setMessage('❌ ' + (e.response?.data?.message || 'Failed'));
    }
  };

  return (
    <div className="page">
      <h2>Mark Attendance</h2>
      <div className="filter-bar">
        <select value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name} {c.section}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {students.length > 0 ? (
        <>
          <table className="data-table" style={{ marginTop: 16 }}>
            <thead><tr><th>Student</th><th>Status</th></tr></thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>
                    <select
                      value={statuses[s.id] || 'Present'}
                      onChange={(e) => setStatuses({ ...statuses, [s.id]: e.target.value })}
                    >
                      <option>Present</option>
                      <option>Absent</option>
                      <option>Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={save}>
            Save Attendance
          </button>
        </>
      ) : classId ? (
        <p style={{ marginTop: 16 }}>No students in this class.</p>
      ) : null}

      {message && <div className="alert" style={{ marginTop: 16 }}>{message}</div>}
    </div>
  );
}