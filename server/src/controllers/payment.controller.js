import Payment from '../models/Payment.js';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { success, error } from '../utils/apiResponse.js';

const generateReceiptNo = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `GKL-${y}${m}-${rand}`;
};

// POST /api/payments
export const makePayment = async (req, res) => {
  try {
    const { fee_id, amount, method, transaction_id } = req.body;

    if (!fee_id || !amount) return error(res, 'fee_id and amount required', 400);

    const fee = await Fee.findById(fee_id);
    if (!fee) return error(res, 'Fee not found', 404);

    const receipt_no = generateReceiptNo();

    const payment = await Payment.create({
      fee_id,
      student_id: fee.student_id,
      amount,
      method: method || 'UPI',
      transaction_id,
      receipt_no,
      status: 'Success',
    });

    // Update fee paid amount and status
    fee.paid_amount = Number(fee.paid_amount) + Number(amount);
    fee.status = fee.paid_amount >= fee.amount ? 'Paid' : 'Partial';
    fee.paid_at = new Date();
    await fee.save();

    return success(res, {
      payment,
      receipt_no: payment.receipt_no,
      fee_status: fee.status,
    }, 'Payment successful', 201);
  } catch (e) { return error(res, e.message, 500); }
};

// GET /api/payments/my
export const myPayments = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return error(res, 'Student not found', 404);

    const payments = await Payment.find({ student_id: student._id })
      .populate('fee_id', 'title amount')
      .sort({ createdAt: -1 });

    return success(res, payments);
  } catch (e) { return error(res, e.message, 500); }
};

// GET /api/payments/receipt/:id
export const getReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'fee_id',
        select: 'title amount',
      })
      .populate({
        path: 'student_id',
        populate: { path: 'user', select: 'name email' },
      });

    if (!payment) return error(res, 'Payment not found', 404);

    return success(res, payment);
  } catch (e) { return error(res, e.message, 500); }
};

// GET /api/payments/all (Admin/Accountant)
export const listAll = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('fee_id', 'title amount')
      .populate({
        path: 'student_id',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ createdAt: -1 });

    return success(res, payments);
  } catch (e) { return error(res, e.message, 500); }
};