import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  section: String,
}, { timestamps: true });

export default mongoose.model('Class', classSchema);