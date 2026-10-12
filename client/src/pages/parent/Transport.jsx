import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  Bus, MapPin, Phone, Clock, User, Navigation, AlertCircle,
  CheckCircle, Circle, ArrowRight
} from 'lucide-react';

// Demo route stops for each bus — real data backend se aayega
const ROUTE_STOPS = {
  default: [
    { name: 'School Gate', time: '07:00 AM', status: 'done' },
    { name: 'Sector 12 Market', time: '07:15 AM', status: 'done' },
    { name: 'Sector 12 Main Road', time: '07:22 AM', status: 'done' },
    { name: 'Sector 10 Crossing', time: '07:30 AM', status: 'current' },
    { name: 'Sector 8 Park', time: '07:40 AM', status: 'pending' },
    { name: 'Student Stop', time: '07:50 AM', status: 'pending' },
  ],
};

export default function ParentTransport() {
  const { user } = useAuth();
  const [child, setChild] = useState(null);
  const [buses, setBuses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);

  // Fetch child + buses
  useEffect(() => {
    api.get('/parents/my-child').then(({ data }) => setChild(data.data)).catch(() => {});
    api.get('/transport/buses').catch(() => ({ data: { data: [] } }))
      .then(({ data }) => {
        const list = data.data || [];
        setBuses(list);
        if (list[0]) setSelected(list[0]);
      });
  }, []);

  // Live location simulator (real app uses GPS)
  useEffect(() => {
    if (!selected) return;

    const updateLocation = () => {
      setLiveLocation({
        lat: 19.1070 + (Math.random() - 0.5) * 0.02,
        lng: 77.3000 + (Math.random() - 0.5) * 0.02,
        speed: Math.round(20 + Math.random() * 30),
        updatedAt: new Date().toLocaleTimeString(),
        nextStop: 'Sector 8 Park',
        eta: `${Math.round(3 + Math.random() * 10)} min`,
      });
    };

    updateLocation();
    const timer = setInterval(updateLocation, 5000);
    return () => clearInterval(timer);
  }, [selected]);

  const stops = ROUTE_STOPS.default;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bus size={24} /> Transport Info
          </h2>
          <p>
            {child
              ? <>Tracking bus for <strong>{child.student_name}</strong></>
              : 'Track your child\'s school bus in real time.'}
          </p>
        </div>
      </div>

      <div className="transport-layout">
        {/* LEFT: Bus list */}
        <div className="transport-list">
          {buses.length === 0 && (
            <div className="empty-state">
              <Bus size={32} strokeWidth={1.5} />
              <p>No buses available</p>
            </div>
          )}
          {buses.map((b) => (
            <button
              key={b._id || b.id}
              className={`bus-card ${selected?._id === b._id ? 'active' : ''}`}
              onClick={() => setSelected(b)}
            >
              <div className="bus-icon">🚌</div>
              <div>
                <h4>{b.bus_no}</h4>
                <p>{b.route}</p>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT: Live tracking */}
        <div className="transport-main">
          {!selected ? (
            <div className="chat-empty">
              <Bus size={64} strokeWidth={1} />
              <h3>Select a bus</h3>
              <p>View live location and driver info.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bus-info-header">
                <div>
                  <h3>🚌 {selected.bus_no}</h3>
                  <p style={{ color: 'var(--text-soft)', fontSize: 13 }}>
                    Route: {selected.route}
                  </p>
                </div>
                <span className="live-badge">
                  <span className="live-dot" /> LIVE
                </span>
              </div>

              {/* Driver */}
              <div className="driver-card">
                <div className="driver-avatar"><User size={22} /></div>
                <div style={{ flex: 1 }}>
                  <h4>{selected.driver_name || 'Driver'}</h4>
                  <p>Driver · {selected.driver_phone || '—'}</p>
                </div>
                <a
                  href={`tel:${(selected.driver_phone || '').replace(/[^0-9]/g, '')}`}
                  className="btn btn-primary btn-sm"
                >
                  <Phone size={13} /> Call
                </a>
              </div>

              {/* Live map placeholder */}
              <div className="map-wrapper">
                <div className="map-placeholder">
                  <div className="map-grid" />
                  <div className="map-marker">
                    <Navigation size={28} />
                    <span>Bus {selected.bus_no}</span>
                  </div>
                  {liveLocation && (
                    <div className="map-coords">
                      <span>📍 {liveLocation.lat.toFixed(4)}, {liveLocation.lng.toFixed(4)}</span>
                      <span>⚡ {liveLocation.speed} km/h</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live stats */}
              {liveLocation && (
                <div className="live-stats">
                  <div className="live-stat">
                    <Clock size={16} />
                    <div>
                      <span>Next Stop</span>
                      <strong>{liveLocation.nextStop}</strong>
                    </div>
                  </div>
                  <div className="live-stat">
                    <MapPin size={16} />
                    <div>
                      <span>ETA</span>
                      <strong>{liveLocation.eta}</strong>
                    </div>
                  </div>
                  <div className="live-stat">
                    <AlertCircle size={16} />
                    <div>
                      <span>Updated</span>
                      <strong>{liveLocation.updatedAt}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Route timeline */}
              <div className="section-title" style={{ marginTop: 20 }}>
                <h3>Route & Stops</h3>
              </div>
              <div className="route-timeline">
                {stops.map((s, i) => (
                  <div key={i} className={`route-stop ${s.status}`}>
                    <div className="route-icon">
                      {s.status === 'done' && <CheckCircle size={18} />}
                      {s.status === 'current' && <Navigation size={18} />}
                      {s.status === 'pending' && <Circle size={18} />}
                    </div>
                    <div className="route-info">
                      <h4>{s.name}</h4>
                      <span>{s.time}</span>
                    </div>
                    {s.status === 'current' && (
                      <span className="route-badge">Bus is here</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="info-box" style={{ marginTop: 16 }}>
                ℹ️ Live tracking uses GPS data from the bus. Updates every 5 seconds.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}