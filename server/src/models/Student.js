import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  admission_no: { type: String, unique: true },
  roll_no: String,
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  guardian_name: String,
  guardian_phone: String,
  dob: Date,
  address: String,
  previous_school: String,
  documents: Object,
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);