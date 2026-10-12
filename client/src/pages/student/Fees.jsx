import { useEffect, useState } from 'react';
import api from '../../config/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  CreditCard, Download, IndianRupee, QrCode, Building2,
  Smartphone, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function StudentFees() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [pending, setPending] = useState(0);
  const [paying, setPaying] = useState(null);
  const [payForm, setPayForm] = useState({ amount: '', method: 'UPI' });
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [success, setSuccess] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/fees/me');
      setFees(data.data.fees || []);
      setPending(data.data.pending || 0);
    } catch { setFees([]); setPending(0); }
  };

  useEffect(() => { load(); }, []);

  const openPay = (fee) => {
    setPaying(fee);
    const remaining = Number(fee.amount) - Number(fee.paid_amount || 0);
    setPayForm({ amount: remaining, method: 'UPI' });
    setReceipt(null);
    setSuccess('');
  };

  const handlePay = async () => {
    if (!payForm.amount || Number(payForm.amount) <= 0) {
      return alert('Enter a valid amount');
    }
    setProcessing(true);

    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        const { data } = await api.post('/payments', {
          fee_id: paying._id || paying.id,
          amount: Number(payForm.amount),
          method: payForm.method,
          transaction_id: `TXN${Date.now()}`,
        });
        setReceipt(data.data);
        setSuccess('Payment successful!');
        load();
      } catch (err) {
        alert(err.response?.data?.message || 'Payment failed');
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  const downloadReceipt = (payment, fee, studentName) => {
    const doc = new jsPDF();

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

    // Gold divider
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
        ['Name', studentName || '—'],
        ['Fee Description', fee.title || 'Fee'],
        ['Status', payment.status],
      ],
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [90, 107, 126], cellWidth: 50 },
        1: { textColor: [11, 43, 79] },
      },
    });

    // Payment details table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 43, 79);
    doc.text('Payment Details', 15, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 19,
      head: [['Description', 'Amount (INR)']],
      body: [
        ['Fee Amount', `Rs. ${Number(fee.amount).toLocaleString()}`],
        ['Amount Paid', `Rs. ${Number(payment.amount).toLocaleString()}`],
      ],
      foot: [['Total Paid', `Rs. ${Number(payment.amount).toLocaleString()}`]],
      headStyles: { fillColor: [11, 43, 79], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [212, 162, 76], textColor: [11, 43, 79], fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 4 },
    });

    // Status stamp
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

    doc.setFontSize(8);
    doc.text('Thank you for your payment!', 105, 292, { align: 'center' });

    doc.save(`Gurukul-Receipt-${payment.receipt_no}.pdf`);
  };

  const getStatusBadge = (status) => {
    const map = {
      Paid: 'badge-paid',
      Pending: 'badge-pending',
      Partial: 'badge-partial',
      Overdue: 'badge-overdue',
    };
    return <span className={`badge ${map[status] || ''}`}>{status}</span>;
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CreditCard size={24} /> My Fees
          </h2>
          <p>View and pay your class fees online.</p>
        </div>
        <div className="fee-summary-badge">
          <span>Pending</span>
          <strong>₹{Number(pending).toLocaleString()}</strong>
        </div>
      </div>

      {fees.length === 0 ? (
        <div className="empty-state card">
          <IndianRupee size={40} strokeWidth={1.2} />
          <h3 style={{ marginTop: 12 }}>No fees assigned</h3>
          <p>Your class fee structure hasn't been defined yet.</p>
        </div>
      ) : (
        <div className="fee-cards">
          {fees.map((f) => {
            const remaining = Number(f.amount) - Number(f.paid_amount || 0);
            const percent = f.amount ? Math.round((Number(f.paid_amount || 0) / Number(f.amount)) * 100) : 0;
            return (
              <div className="fee-card" key={f._id || f.id}>
                <div className="fee-card-head">
                  <div>
                    <h3>{f.title || 'Fee'}</h3>
                    <p>Due: {f.due_date || '—'}</p>
                  </div>
                  {getStatusBadge(f.status)}
                </div>

                <div className="fee-amount-row">
                  <div>
                    <span>Total</span>
                    <strong>₹{Number(f.amount).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>Paid</span>
                    <strong style={{ color: '#16A34A' }}>₹{Number(f.paid_amount || 0).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span>Pending</span>
                    <strong style={{ color: '#DC2626' }}>₹{remaining.toLocaleString()}</strong>
                  </div>
                </div>

                <div className="fee-progress">
                  <div className="fee-progress-fill" style={{ width: `${percent}%` }} />
                </div>
                <p className="fee-percent">{percent}% paid</p>

                {f.status !== 'Paid' && (
                  <button className="btn btn-primary" onClick={() => openPay(f)}>
                    <IndianRupee size={14} /> Pay Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paying && (
        <div className="modal-backdrop" onClick={() => !processing && setPaying(null)}>
          <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Pay Fee — {paying.title}</h3>
              <button className="modal-close" onClick={() => !processing && setPaying(null)}>✕</button>
            </div>

            {!receipt ? (
              <>
                <div className="payment-amount-display">
                  <span>Amount to Pay</span>
                  <div className="amount-input-wrap">
                    <span>₹</span>
                    <input
                      type="number"
                      value={payForm.amount}
                      onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                      disabled={processing}
                    />
                  </div>
                </div>

                <div className="payment-methods">
                  <h4>Select Payment Method</h4>
                  <div className="method-grid">
                    <button
                      className={`method-btn ${payForm.method === 'UPI' ? 'active' : ''}`}
                      onClick={() => setPayForm({ ...payForm, method: 'UPI' })}
                    >
                      <Smartphone size={22} />
                      <span>UPI</span>
                    </button>
                    <button
                      className={`method-btn ${payForm.method === 'NetBanking' ? 'active' : ''}`}
                      onClick={() => setPayForm({ ...payForm, method: 'NetBanking' })}
                    >
                      <Building2 size={22} />
                      <span>NetBanking</span>
                    </button>
                    <button
                      className={`method-btn ${payForm.method === 'Card' ? 'active' : ''}`}
                      onClick={() => setPayForm({ ...payForm, method: 'Card' })}
                    >
                      <CreditCard size={22} />
                      <span>Card</span>
                    </button>
                    <button
                      className={`method-btn ${payForm.method === 'QR' ? 'active' : ''}`}
                      onClick={() => setPayForm({ ...payForm, method: 'QR' })}
                    >
                      <QrCode size={22} />
                      <span>QR Code</span>
                    </button>
                  </div>
                </div>

                {payForm.method === 'QR' && (
                  <div className="qr-box">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=gurukul@upi%26pn=Gurukul%20School%26am=${payForm.amount}%26cu=INR`}
                      alt="QR Code"
                    />
                    <p>Scan with any UPI app</p>
                    <small>UPI ID: gurukul@upi</small>
                  </div>
                )}

                {payForm.method === 'UPI' && (
                  <div className="upi-input">
                    <label>Enter UPI ID</label>
                    <input placeholder="yourname@upi" />
                  </div>
                )}

                {payForm.method === 'NetBanking' && (
                  <div className="bank-grid">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'BOB'].map((b) => (
                      <button key={b} className="bank-btn">{b}</button>
                    ))}
                  </div>
                )}

                {payForm.method === 'Card' && (
                  <div className="card-form">
                    <input placeholder="Card Number" maxLength="19" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <input placeholder="MM/YY" maxLength="5" />
                      <input placeholder="CVV" maxLength="4" type="password" />
                    </div>
                    <input placeholder="Cardholder Name" />
                  </div>
                )}

                <div className="modal-actions">
                  <button className="btn" onClick={() => setPaying(null)} disabled={processing}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handlePay} disabled={processing}>
                    {processing ? '⏳ Processing...' : `Pay ₹${Number(payForm.amount || 0).toLocaleString()}`}
                  </button>
                </div>
              </>
            ) : (
              <div className="payment-success">
                <div className="success-icon">
                  <CheckCircle size={56} />
                </div>
                <h3>Payment Successful!</h3>
                <p>{success}</p>

                <div className="receipt-info">
                  <div><span>Receipt No:</span><strong>{receipt.receipt_no}</strong></div>
                  <div><span>Amount:</span><strong>₹{Number(payForm.amount).toLocaleString()}</strong></div>
                  <div><span>Method:</span><strong>{payForm.method}</strong></div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => downloadReceipt(receipt.payment, paying, user?.name)}
                >
                  <Download size={15} /> Download Receipt (PDF)
                </button>

                <button className="btn" onClick={() => { setPaying(null); setReceipt(null); }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}