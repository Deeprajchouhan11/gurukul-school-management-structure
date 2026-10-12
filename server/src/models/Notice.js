import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: String,
  audience: {
    type: String,
    enum: ['all', 'students', 'teachers', 'parents', 'accountants'],
    default: 'all'
  },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);