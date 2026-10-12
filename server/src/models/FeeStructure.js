import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  frequency: {
    type: String,
    enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly', 'One-Time'],
    default: 'Yearly',
  },
  due_date: String,
  description: String,
  is_active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('FeeStructure', feeStructureSchema);