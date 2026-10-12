// MySQL queries for homework entity.
import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subject: String,
  title: String,
  description: String,
  due_date: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Homework', homeworkSchema);