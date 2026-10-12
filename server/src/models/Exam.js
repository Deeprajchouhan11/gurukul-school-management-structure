// MySQL queries for exam entity.
import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  exam_date: String,
  published: { type: Boolean, default: false },
}, { timestamps: true });

const resultSchema = new mongoose.Schema({
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: String,
  marks: Number,
  max_marks: { type: Number, default: 100 },
  grade: String,
}, { timestamps: true });

export const Exam = mongoose.model('Exam', examSchema);
export const ExamResult = mongoose.model('ExamResult', resultSchema);