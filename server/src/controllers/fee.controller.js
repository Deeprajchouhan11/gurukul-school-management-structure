import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { success, error } from '../utils/apiResponse.js';

// List all fees (Admin / Accountant)
export const listAll = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate({ path: 'student_id', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });

    return success(res, fees.map((f) => ({
      id: f._id,
      student_name: f.student_id?.user?.name,
      title: f.title,
      amount: f.amount,
      paid_amount: f.paid_amount,
      status: f.status,
      due_date: f.due_date,
    })));
  } catch (e) { return error(res, e.message, 500); }
};

// Summary (Admin / Accountant)
export const summary = async (req, res) => {
  try {
    const fees = await Fee.find();
    const total = fees.reduce((s, f) => s + Number(f.amount), 0);
    const collected = fees.reduce((s, f) => s + Number(f.paid_amount), 0);
    return success(res, { total, collected, pending: total - collected });
  } catch (e) { return error(res, e.message, 500); }
};

// Student apni fees dekhe
export const myFees = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return error(res, 'Student profile not found', 404);

    const fees = await Fee.find({ student_id: student._id }).sort({ createdAt: -1 });
    const pending = fees.reduce(
      (s, f) => s + (Number(f.amount) - Number(f.paid_amount || 0)),
      0
    );

    return success(res, { fees, pending });
  } catch (e) { return error(res, e.message, 500); }
};

// Fees by student ID
export const byStudent = async (req, res) => {
  try {
    const fees = await Fee.find({ student_id: req.params.studentId }).sort({ createdAt: -1 });
    return success(res, fees);
  } catch (e) { return error(res, e.message, 500); }
};

// Create fee
export const create = async (req, res) => {
  try {
    const { student_id, title, amount, due_date } = req.body;
    if (!student_id || !amount) return error(res, 'student_id and amount required', 400);
    const fee = await Fee.create({ student_id, title, amount, due_date });
    return success(res, { id: fee._id }, 'Fee created', 201);
  } catch (e) { return error(res, e.message, 500); }
};

// Pay fee
export const pay = async (req, res) => {
  try {
    const { amount } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return error(res, 'Not found', 404);

    fee.paid_amount = Number(fee.paid_amount) + Number(amount);
    fee.status = fee.paid_amount >= fee.amount ? 'Paid' : 'Partial';
    fee.paid_at = new Date();
    await fee.save();

    return success(res, null, 'Payment recorded');
  } catch (e) { return error(res, e.message, 500); }
};