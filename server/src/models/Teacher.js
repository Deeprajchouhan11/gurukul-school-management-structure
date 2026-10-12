import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  employee_no: { type: String, unique: true },
  subject: String,
  qualification: String,
  joining_date: Date,
}, { timestamps: true });

export default mongoose.model('Teacher', teacherSchema);