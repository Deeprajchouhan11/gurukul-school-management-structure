import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';

export default function TransportList() {
  const [buses, setBuses] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ bus_no: '', driver_name: '', driver_phone: '', route: '', capacity: '' });

  const load = async () => {
    const { data } = await api.get('/transport/buses');
    setBuses(data.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/transport/buses', form);
    setOpen(false); setForm({ bus_no: '', driver_name: '', driver_phone: '', route: '', capacity: '' }); load();
  };

  return (
    <div className="page">
      <div className="page-head">
        <h2>Transport</h2>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>+ Add Bus</button>
      </div>
      <Table columns={[
        { header: 'Bus No', key: 'bus_no' },
        { header: 'Driver', key: 'driver_name' },
        { header: 'Phone', key: 'driver_phone' },
        { header: 'Route', key: 'route' },
        { header: 'Capacity', key: 'capacity' },
      ]} data={buses} />

      <Modal open={open} onClose={() => setOpen(false)} title="Add Bus">
        <form onSubmit={submit} className="form-grid">
          <input placeholder="Bus No" value={form.bus_no} onChange={(e) => setForm({ ...form, bus_no: e.target.value })} required />
          <input placeholder="Driver Name" value={form.driver_name} onChange={(e) => setForm({ ...form, driver_name: e.target.value })} />
          <input placeholder="Driver Phone" value={form.driver_phone} onChange={(e) => setForm({ ...form, driver_phone: e.target.value })} />
          <input placeholder="Route" value={form.route} onChange={(e) => setForm({ ...form, route: e.target.value })} />
          <input type="number" placeholder="Capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}