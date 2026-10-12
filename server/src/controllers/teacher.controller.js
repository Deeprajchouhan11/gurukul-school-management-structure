import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Teacher from '../models/Teacher.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', 'name email');
    return success(res, teachers.map((t) => ({
      id: t._id,
      name: t.user?.name,
      email: t.user?.email,
      employee_no: t.employee_no,
      subject: t.subject,
      qualification: t.qualification,
      joining_date: t.joining_date,
    })));
  } catch (e) { return error(res, e.message, 500); }
};

export const create = async (req, res) => {
  try {
    const { name, email, password, employee_no, subject, qualification, joining_date } = req.body;
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return error(res, 'Email exists', 400);
    const hash = await bcrypt.hash(password || 'teacher123', 10);
    const user = await User.create({
      name, email: email.toLowerCase(), password_hash: hash, role: 'Teacher',
    });
    const teacher = await Teacher.create({
      user: user._id, employee_no, subject, qualification, joining_date,
    });
    return success(res, { id: teacher._id }, 'Teacher created', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const remove = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return error(res, 'Not found', 404);
    await User.findByIdAndDelete(teacher.user);
    await Teacher.findByIdAndDelete(req.params.id);
    return success(res, null, 'Teacher deleted');
  } catch (e) { return error(res, e.message, 500); }
};