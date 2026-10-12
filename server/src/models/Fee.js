// MySQL queries for fee entity.
import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: String,
  amount: { type: Number, required: true },
  paid_amount: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Paid', 'Overdue', 'Partial'], default: 'Pending' },
  due_date: String,
  paid_at: Date,
}, { timestamps: true });

export default mongoose.model('Fee', feeSchema);