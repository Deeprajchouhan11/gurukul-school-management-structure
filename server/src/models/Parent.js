import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  relation: String,
  phone: String,
  occupation: String,
}, { timestamps: true });

export default mongoose.model('Parent', parentSchema);