import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  fee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['UPI', 'NetBanking', 'Card', 'Cash', 'Cheque', 'QR'],
    default: 'UPI',
  },
  transaction_id: String,
  receipt_no: { type: String, unique: true, sparse: true },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Success',
  },
  paid_at: { type: Date, default: Date.now },
  meta: Object,
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);