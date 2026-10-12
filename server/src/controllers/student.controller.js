import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { success, error } from '../utils/apiResponse.js';

// GET /api/students
export const list = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email is_active')
      .populate('class_id', 'name section')
      .sort({ createdAt: -1 });

    return success(res, students.map((s) => ({
      id: s._id,
      name: s.user?.name,
      email: s.user?.email,
      admission_no: s.admission_no,
      roll_no: s.roll_no,
      class_id: s.class_id?._id,
      class_name: s.class_id?.name,
      section: s.class_id?.section,
      guardian_name: s.guardian_name,
      guardian_phone: s.guardian_phone,
    })));
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// GET /api/students/:id
export const get = async (req, res) => {
  try {
    const s = await Student.findById(req.params.id)
      .populate('user', 'name email')
      .populate('class_id', 'name section');
    if (!s) return error(res, 'Not found', 404);
    return success(res, s);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// POST /api/students
export const create = async (req, res) => {
  try {
    const {
      name, email, password, admission_no, roll_no, class_id,
      guardian_name, guardian_phone, dob, address,
    } = req.body;

    if (!name || !email) return error(res, 'Name and email are required', 400);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return error(res, 'Email already exists', 400);

    const hash = await bcrypt.hash(password || 'student123', 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash: hash,
      role: 'Student',
    });

    const student = await Student.create({
      user: user._id,
      admission_no,
      roll_no,
      class_id: class_id || null,
      guardian_name,
      guardian_phone,
      dob: dob || null,
      address,
    });

    return success(res, { id: student._id }, 'Student created', 201);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// PUT /api/students/:id
export const update = async (req, res) => {
  try {
    const { name, email, roll_no, class_id, guardian_name, guardian_phone, dob, address } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return error(res, 'Not found', 404);

    await User.findByIdAndUpdate(student.user, { name, email });
    await Student.findByIdAndUpdate(req.params.id, {
      roll_no,
      class_id: class_id || null,
      guardian_name,
      guardian_phone,
      dob,
      address,
    });
    return success(res, null, 'Student updated');
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// DELETE /api/students/:id
export const remove = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return error(res, 'Not found', 404);
    await User.findByIdAndDelete(student.user);
    await Student.findByIdAndDelete(req.params.id);
    return success(res, null, 'Student deleted');
  } catch (e) {
    return error(res, e.message, 500);
  }
};