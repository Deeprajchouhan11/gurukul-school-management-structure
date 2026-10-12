import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
  marked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

attendanceSchema.index({ student_id: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);