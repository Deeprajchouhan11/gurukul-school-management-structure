import { useEffect, useState } from 'react';
import api from '../../config/api.js';
import { Receipt, Download, Search, IndianRupee, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Receipts() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments/all')
      .then(({ data }) => setPayments(data.data || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  const downloadReceipt = (payment) => {
    const doc = new jsPDF();
    const studentName = payment.student_id?.user?.name || 'Student';
    const feeTitle = payment.fee_id?.title || 'Fee';

    // Header
    doc.setFillColor(11, 43, 79);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('GURUKUL EduSphere', 105, 18, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('English Medium School · Nanded', 105, 26, { align: 'center' });
    doc.text('Fee Payment Receipt', 105, 33, { align: 'center' });

    doc.setFillColor(212, 162, 76);
    doc.rect(0, 40, 210, 1.5, 'F');

    // Receipt info
    doc.setTextColor(11, 43, 79);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Receipt No: ${payment.receipt_no}`, 15, 55);
    doc.text(`Date: ${new Date(payment.paid_at).toLocaleDateString()}`, 15, 62);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 107, 126);
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${payment.transaction_id || '—'}`, 15, 70);
    doc.text(`Payment Method: ${payment.method}`, 15, 77);

    // Student info
    doc.setTextColor(11, 43, 79);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Student Details', 15, 92);

    autoTable(doc, {
      startY: 96,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      body: [
        ['Name', studentName],
        ['Fee Description', feeTitle],
        ['Status', payment.status],
      ],
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [90, 107, 126], cellWidth: 50 },
        1: { textColor: [11, 43, 79] },
      },
    });

    // Payment details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 43, 79);
    doc.text('Payment Details', 15, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 19,
      head: [['Description', 'Amount (INR)']],
      body: [['Amount Paid', `Rs. ${Number(payment.amount).toLocaleString()}`]],
      foot: [['Total Paid', `Rs. ${Number(payment.amount).toLocaleString()}`]],
      headStyles: { fillColor: [11, 43, 79], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [212, 162, 76], textColor: [11, 43, 79], fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 4 },
    });

    // PAID stamp
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(1);
    doc.roundedRect(140, finalY, 55, 20, 3, 3);
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', 167.5, finalY + 13, { align: 'center' });

    // Footer
    doc.setTextColor(90, 107, 126);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.text('This is a computer-generated receipt. No signature required.', 105, 285, { align: 'center' });
    doc.text('Thank you for your payment!', 105, 292, { align: 'center' });

    doc.save(`Gurukul-Receipt-${payment.receipt_no}.pdf`);
  };

  const filtered = payments.filter((p) => {
    const s = filter.toLowerCase();
    if (!s) return true;
    return (
      (p.receipt_no || '').toLowerCase().includes(s) ||
      (p.student_id?.user?.name || '').toLowerCase().includes(s) ||
      (p.fee_id?.title || '').toLowerCase().includes(s)
    );
  });

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Receipt size={24} /> Payment Receipts
          </h2>
          <p>All successful payments with downloadable PDF receipts.</p>
        </div>
        <div className="fee-summary-badge" style={{ background: 'linear-gradient(135deg, #DCFCE7, #A7F3D0)', borderColor: '#6EE7B7' }}>
          <span style={{ color: '#065F46' }}>Total Collected</span>
          <strong style={{ color: '#065F46' }}>₹{Number(totalCollected).toLocaleString()}</strong>
        </div>
      </div>

      <div className="filter-bar">
        <Search size={15} style={{ color: 'var(--text-muted)' }} />
        <input
          placeholder="Search by receipt no, student, or fee title…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ flex: 1, minWidth: 240 }}
        />
        <div className="stats-inline">
          <span><strong>{payments.length}</strong> receipts</span>
        </div>
      </div>

      {loading ? (
        <div className="empty-state card">
          <p>Loading receipts…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <Receipt size={40} strokeWidth={1.2} />
          <h3 style={{ marginTop: 12 }}>No receipts found</h3>
          <p>Once students make payments, receipts will appear here.</p>
        </div>
      ) : (
        <div className="receipts-grid">
          {filtered.map((p) => (
            <div className="receipt-card" key={p._id}>
              <div className="receipt-card-head">
                <div className="receipt-badge">
                  <CheckCircle size={14} /> {p.status}
                </div>
                <span className="receipt-no">{p.receipt_no}</span>
              </div>

              <h3>{p.student_id?.user?.name || 'Student'}</h3>
              <p className="receipt-fee">{p.fee_id?.title || 'Fee'}</p>

              <div className="receipt-amount">
                <IndianRupee size={18} />
                <strong>{Number(p.amount).toLocaleString()}</strong>
              </div>

              <div className="receipt-meta">
                <span>{p.method}</span>
                <span>{new Date(p.paid_at).toLocaleDateString()}</span>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => downloadReceipt(p)}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}