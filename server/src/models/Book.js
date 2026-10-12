import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  isbn: String,
  category: String,
  total_copies: { type: Number, default: 1 },
  available_copies: { type: Number, default: 1 },
}, { timestamps: true });

const issueSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue_date: String,
  due_date: String,
  return_date: String,
  fine: { type: Number, default: 0 },
}, { timestamps: true });

export const Book = mongoose.model('Book', bookSchema);
export const BookIssue = mongoose.model('BookIssue', issueSchema);