import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';

export default function ReportsPage() {
  const [tab, setTab] = useState('attendance');
  const [attendance, setAttendance] = useState([]);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    api.get('/reports/attendance').then(({ data }) => setAttendance(data.data)).catch(() => {});
    api.get('/reports/fees').then(({ data }) => setFees(data.data)).catch(() => {});
  }, []);

  return (
    <div className="page">
      <h2>Reports</h2>
      <div className="tabs">
        <button className={tab === 'attendance' ? 'active' : ''} onClick={() => setTab('attendance')}>Attendance</button>
        <button className={tab === 'fees' ? 'active' : ''} onClick={() => setTab('fees')}>Fees</button>
      </div>

      {tab === 'attendance' && (
        <Table columns={[
          { header: 'Student', key: 'name' },
          { header: 'Class', key: 'class_name' },
          { header: 'Present', key: 'present' },
          { header: 'Absent', key: 'absent' },
          { header: 'Late', key: 'late' },
        ]} data={attendance} />
      )}

      {tab === 'fees' && (
        <Table columns={[
          { header: 'Student', key: 'name' },
          { header: 'Title', key: 'title' },
          { header: 'Amount', render: (r) => `₹${r.amount}` },
          { header: 'Paid', render: (r) => `₹${r.paid_amount}` },
          { header: 'Status', key: 'status' },
          { header: 'Due', key: 'due_date' },
        ]} data={fees} />
      )}
    </div>
  );
}