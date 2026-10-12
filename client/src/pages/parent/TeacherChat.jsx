import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../config/api.js';
import {
  MessageCircle, Phone, Search, Send, Users, ExternalLink, ArrowLeft
} from 'lucide-react';

export default function TeacherChat() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch teachers (already existing endpoint)
    api.get('/teachers').catch(() => ({ data: { data: [] } }))
      .then(({ data }) => {
        const list = (data.data || []).map((t) => ({
          ...t,
          // Demo WhatsApp number — backend mein parent/teacher ke real numbers store karne hain
          whatsapp: t.guardian_phone || t.whatsapp || '+919000000001',
        }));
        setTeachers(list);
      });
  }, []);

  const filtered = teachers.filter((t) =>
    !search || (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  const openWhatsApp = (teacher) => {
    const number = (teacher.whatsapp || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${teacher.name}, I'm ${user?.name}, parent of a student in your class.`
    );
    const url = `https://wa.me/${number}?text=${text}`;
    window.open(url, '_blank');
  };

  const sendSMS = (teacher) => {
    const number = (teacher.whatsapp || '').replace(/[^0-9]/g, '');
    window.open(`sms:${number}`, '_blank');
  };

  const callPhone = (teacher) => {
    const number = (teacher.whatsapp || '').replace(/[^0-9]/g, '');
    window.open(`tel:+${number}`, '_blank');
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MessageCircle size={24} /> Teacher Chat
          </h2>
          <p>Chat directly with your child's teachers on WhatsApp.</p>
        </div>
      </div>

      <div className="chat-layout">
        {/* LEFT: Teacher list */}
        <div className="chat-sidebar">
          <div className="chat-search">
            <Search size={15} />
            <input
              placeholder="Search teacher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state" style={{ padding: 30 }}>
              <Users size={28} strokeWidth={1.5} />
              <p>No teachers found</p>
            </div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.id || t._id}
                className={`chat-user ${selected?.id === t.id ? 'active' : ''}`}
                onClick={() => setSelected(t)}
              >
                <div className="chat-avatar">👩‍🏫</div>
                <div className="chat-user-info">
                  <h4>{t.name}</h4>
                  <p>{t.subject || 'Teacher'}</p>
                </div>
                <span className="wa-dot" title="Available on WhatsApp" />
              </button>
            ))
          )}
        </div>

        {/* RIGHT: Chat preview / actions */}
        <div className="chat-main">
          {!selected ? (
            <div className="chat-empty">
              <MessageCircle size={64} strokeWidth={1} />
              <h3>Select a teacher to start chatting</h3>
              <p>You can chat via WhatsApp, SMS or call directly.</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="chat-avatar big">👩‍🏫</div>
                <div>
                  <h3>{selected.name}</h3>
                  <p>{selected.subject || 'Teacher'} · {selected.whatsapp}</p>
                </div>
              </div>

              <div className="chat-body">
                <div className="chat-info-card">
                  <h4>💬 Chat Options</h4>
                  <p>Choose how you'd like to contact <strong>{selected.name}</strong>:</p>
                </div>

                <div className="chat-actions-grid">
                  <button
                    className="chat-action wa"
                    onClick={() => openWhatsApp(selected)}
                  >
                    <MessageCircle size={20} />
                    <span>WhatsApp</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    className="chat-action call"
                    onClick={() => callPhone(selected)}
                  >
                    <Phone size={20} />
                    <span>Call</span>
                    <ExternalLink size={12} />
                  </button>

                  <button
                    className="chat-action sms"
                    onClick={() => sendSMS(selected)}
                  >
                    <Send size={20} />
                    <span>SMS</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                <div className="chat-compose">
                  <input
                    placeholder="Type a quick message (optional)…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const number = (selected.whatsapp || '').replace(/[^0-9]/g, '');
                      const text = encodeURIComponent(message || `Hello ${selected.name},`);
                      window.open(`https://wa.me/${number}?text=${text}`, '_blank');
                    }}
                  >
                    <Send size={14} /> Open in WhatsApp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}