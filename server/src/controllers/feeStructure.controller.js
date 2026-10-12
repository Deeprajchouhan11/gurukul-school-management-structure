import FeeStructure from '../models/FeeStructure.js';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  try {
    const items = await FeeStructure.find()
      .populate('class_id', 'name section')
      .sort({ createdAt: -1 });
    return success(res, items);
  } catch (e) { return error(res, e.message, 500); }
};

export const byClass = async (req, res) => {
  try {
    const items = await FeeStructure.find({ class_id: req.params.classId, is_active: true });
    return success(res, items);
  } catch (e) { return error(res, e.message, 500); }
};

export const create = async (req, res) => {
  try {
    const { class_id, title, amount, frequency, due_date, description } = req.body;
    if (!class_id || !title || !amount) {
      return error(res, 'class_id, title, amount required', 400);
    }
    const item = await FeeStructure.create({
      class_id, title, amount, frequency, due_date, description,
    });

    // Auto-generate invoices for all students of that class
    const students = await Student.find({ class_id });
    for (const s of students) {
      await Fee.create({
        student_id: s._id,
        title: `${title} (${frequency})`,
        amount,
        due_date,
        status: 'Pending',
      });
    }

    return success(res, item, `Fee created + ${students.length} invoices generated`, 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const update = async (req, res) => {
  try {
    const item = await FeeStructure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return error(res, 'Not found', 404);
    return success(res, item, 'Updated');
  } catch (e) { return error(res, e.message, 500); }
};

export const remove = async (req, res) => {
  try {
    await FeeStructure.findByIdAndDelete(req.params.id);
    return success(res, null, 'Deleted');
  } catch (e) { return error(res, e.message, 500); }
};