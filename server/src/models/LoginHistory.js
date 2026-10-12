import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ip: String,
  user_agent: String,
  status: String,
}, { timestamps: { createdAt: 'login_at', updatedAt: false } });

export default mongoose.model('LoginHistory', schema);