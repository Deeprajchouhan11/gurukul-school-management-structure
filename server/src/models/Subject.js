// MySQL queries for subject entity.
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: String,
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);