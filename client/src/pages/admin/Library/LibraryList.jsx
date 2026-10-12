import { useEffect, useState } from 'react';
import api from '../../../config/api.js';
import Table from '../../../components/common/Table.jsx';
import Modal from '../../../components/common/Modal.jsx';
import { Book, Plus, Trash2, UserCheck, BookOpen, RotateCcw, Clock } from 'lucide-react';

export default function LibraryList() {
  const [tab, setTab] = useState('books');
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [openBook, setOpenBook] = useState(false);
  const [openIssue, setOpenIssue] = useState(false);
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
  const [issueForm, setIssueForm] = useState({ book_id: '', user_id: '', due_date: '' });

  const load = async () => {
    try {
      const [b, i] = await Promise.all([
        api.get('/library/books'),
        api.get('/library/issues').catch(() => ({ data: { data: [] } })),
      ]);
      setBooks(b.data.data);
      setIssues(i.data.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    load();
    api.get('/users').then(({ data }) => {
      setStudents(data.data.filter((u) => u.role === 'Student' || u.role === 'Teacher'));
    }).catch(() => {});
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    await api.post('/library/books', bookForm);
    setOpenBook(false);
    setBookForm({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
    load();
  };

  const issueBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/library/issue', issueForm);
      setOpenIssue(false);
      setIssueForm({ book_id: '', user_id: '', due_date: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const returnBook = async (id) => {
    if (!confirm('Mark this book as returned?')) return;
    try {
      const { data } = await api.post(`/library/return/${id}`);
      if (data.data?.fine > 0) {
        alert(`Book returned. Fine: ₹${data.data.fine}`);
      }
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const removeBook = async (id) => {
    if (!confirm('Delete this book?')) return;
    await api.delete(`/library/books/${id}`);
    load();
  };

  const bookColumns = [
    { header: 'Title', key: 'title' },
    { header: 'Author', key: 'author' },
    { header: 'Category', key: 'category' },
    { header: 'Available', key: 'available_copies' },
    { header: 'Total', key: 'total_copies' },
    {
      header: 'Actions',
      render: (r) => (
        <button className="btn btn-sm btn-danger" onClick={() => removeBook(r._id)}>
          <Trash2 size={13} />
        </button>
      ),
    },
  ];

  const issueColumns = [
    { header: 'Book', render: (r) => r.book_id?.title || '—' },
    { header: 'Issued To', render: (r) => r.user_id?.name || '—' },
    { header: 'Issue Date', key: 'issue_date' },
    { header: 'Due Date', key: 'due_date' },
    {
      header: 'Status',
      render: (r) => r.return_date
        ? <span className="badge badge-paid">Returned {r.return_date}</span>
        : <span className="badge badge-pending">Issued</span>,
    },
    {
      header: 'Fine',
      render: (r) => r.fine > 0 ? `₹${r.fine}` : '—',
    },
    {
      header: 'Action',
      render: (r) => !r.return_date && (
        <button className="btn btn-sm btn-primary" onClick={() => returnBook(r._id)}>
          <RotateCcw size={13} /> Return
        </button>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Book size={24} /> Library
          </h2>
          <p>Manage books and issue/return records.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={() => setOpenIssue(true)}>
            <BookOpen size={14} /> Issue Book
          </button>
          <button className="btn btn-primary" onClick={() => setOpenBook(true)}>
            <Plus size={14} /> Add Book
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={tab === 'books' ? 'active' : ''} onClick={() => setTab('books')}>
          Books ({books.length})
        </button>
        <button className={tab === 'issues' ? 'active' : ''} onClick={() => setTab('issues')}>
          Issues ({issues.length})
        </button>
      </div>

      {tab === 'books' && <Table columns={bookColumns} data={books} />}
      {tab === 'issues' && <Table columns={issueColumns} data={issues} empty="No issues recorded" />}

      {/* Add Book Modal */}
      <Modal open={openBook} onClose={() => setOpenBook(false)} title="Add Book">
        <form onSubmit={addBook} className="form-grid">
          <input placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required />
          <input placeholder="Author" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />
          <input placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} />
          <input placeholder="Category" value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })} />
          <input type="number" placeholder="Total Copies" value={bookForm.total_copies} onChange={(e) => setBookForm({ ...bookForm, total_copies: e.target.value })} />
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpenBook(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      {/* Issue Book Modal */}
      <Modal open={openIssue} onClose={() => setOpenIssue(false)} title="Issue Book">
        <form onSubmit={issueBook} className="form-grid">
          <select value={issueForm.book_id} onChange={(e) => setIssueForm({ ...issueForm, book_id: e.target.value })} required>
            <option value="">Select Book</option>
            {books.filter((b) => b.available_copies > 0).map((b) => (
              <option key={b._id} value={b._id}>{b.title} ({b.available_copies} left)</option>
            ))}
          </select>

          <select value={issueForm.user_id} onChange={(e) => setIssueForm({ ...issueForm, user_id: e.target.value })} required>
            <option value="">Select Member</option>
            {students.map((s) => (
              <option key={s._id || s.id} value={s._id || s.id}>
                {s.name} ({s.role})
              </option>
            ))}
          </select>

          <input type="date" value={issueForm.due_date} onChange={(e) => setIssueForm({ ...issueForm, due_date: e.target.value })} required />

          <div className="info-box">ℹ️ Fine: ₹5 per day after due date.</div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setOpenIssue(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Issue</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}