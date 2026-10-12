import { Book, BookIssue } from '../models/Book.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';

export const listBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return success(res, books);
  } catch (e) { return error(res, e.message, 500); }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, isbn, category, total_copies } = req.body;
    const book = await Book.create({
      title, author, isbn, category,
      total_copies: total_copies || 1,
      available_copies: total_copies || 1,
    });
    return success(res, { id: book._id }, 'Book added', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const issueBook = async (req, res) => {
  try {
    const { book_id, user_id, due_date } = req.body;
    const book = await Book.findById(book_id);
    if (!book) return error(res, 'Book not found', 404);
    if (book.available_copies <= 0) return error(res, 'No copies available', 400);

    const issue = await BookIssue.create({
      book_id,
      user_id,
      issue_date: new Date().toISOString().slice(0, 10),
      due_date,
    });

    book.available_copies -= 1;
    await book.save();

    return success(res, issue, 'Book issued', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const returnBook = async (req, res) => {
  try {
    const issue = await BookIssue.findById(req.params.id);
    if (!issue) return error(res, 'Issue record not found', 404);
    if (issue.return_date) return error(res, 'Already returned', 400);

    const today = new Date();
    const dueDate = new Date(issue.due_date);
    let fine = 0;
    if (today > dueDate) {
      const days = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      fine = days * 5; // ₹5 per day
    }

    issue.return_date = today.toISOString().slice(0, 10);
    issue.fine = fine;
    await issue.save();

    await Book.findByIdAndUpdate(issue.book_id, { $inc: { available_copies: 1 } });

    return success(res, { fine }, 'Book returned');
  } catch (e) { return error(res, e.message, 500); }
};

export const listIssues = async (req, res) => {
  try {
    const issues = await BookIssue.find()
      .populate('book_id', 'title author')
      .populate({
        path: 'user_id',
        select: 'name email role',
      })
      .sort({ createdAt: -1 });

    return success(res, issues);
  } catch (e) { return error(res, e.message, 500); }
};

export const myIssues = async (req, res) => {
  try {
    const issues = await BookIssue.find({ user_id: req.user.id })
      .populate('book_id', 'title author')
      .sort({ createdAt: -1 });
    return success(res, issues);
  } catch (e) { return error(res, e.message, 500); }
};

export const removeBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    return success(res, null, 'Book deleted');
  } catch (e) { return error(res, e.message, 500); }
};