import { useEffect, useState } from 'react';
import api from '../../config/api.js';
import { Book, Clock, AlertCircle } from 'lucide-react';

export default function StudentLibrary() {
  const [books, setBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [tab, setTab] = useState('browse');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/library/books').then(({ data }) => setBooks(data.data)).catch(() => {});
    api.get('/library/my-issues').then(({ data }) => setMyIssues(data.data)).catch(() => {});
  }, []);

  const filtered = books.filter((b) =>
    !search || b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Book size={24} /> Library
          </h2>
          <p>Browse books and track your issued books.</p>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'browse' ? 'active' : ''} onClick={() => setTab('browse')}>Browse ({books.length})</button>
        <button className={tab === 'mine' ? 'active' : ''} onClick={() => setTab('mine')}>My Books ({myIssues.length})</button>
      </div>

      {tab === 'browse' && (
        <>
          <div className="filter-bar">
            <input
              placeholder="🔍 Search by title or author…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 240 }}
            />
          </div>

          <div className="books-grid">
            {filtered.length === 0 && (
              <div className="empty-state card">
                <Book size={32} strokeWidth={1.5} />
                <p>No books found</p>
              </div>
            )}
            {filtered.map((b) => (
              <div className="book-card" key={b._id}>
                <div className="book-cover">📖</div>
                <div className="book-info">
                  <h4>{b.title}</h4>
                  <p>{b.author}</p>
                  <span className={`badge ${b.available_copies > 0 ? 'badge-paid' : 'badge-overdue'}`}>
                    {b.available_copies > 0 ? `${b.available_copies} available` : 'Out of stock'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'mine' && (
        <div className="notices-card">
          {myIssues.length === 0 && (
            <div className="empty-state">
              <Book size={28} strokeWidth={1.5} />
              <p>No books issued yet</p>
            </div>
          )}
          {myIssues.map((i) => (
            <div className="notice-item" key={i._id}>
              <div className="notice-dot" />
              <div className="notice-body">
                <h4>{i.book_id?.title || 'Book'}</h4>
                <p>Issued: {i.issue_date} · Due: {i.due_date}</p>
                <span className="notice-meta">
                  {i.return_date ? (
                    <><span className="badge badge-paid">Returned {i.return_date}</span></>
                  ) : (
                    <><Clock size={12} /> Not returned</>
                  )}
                  {i.fine > 0 && <span style={{ marginLeft: 8, color: '#DC2626', fontWeight: 700 }}>Fine: ₹{i.fine}</span>}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}