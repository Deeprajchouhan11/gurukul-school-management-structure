import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  try {
    const users = await User.find().select('name email role is_active createdAt').sort({ createdAt: -1 });
    return success(res, users);
  } catch (e) { return error(res, e.message, 500); }
};

export const toggleActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 'Not found', 404);
    user.is_active = !user.is_active;
    await user.save();
    return success(res, null, 'Status updated');
  } catch (e) { return error(res, e.message, 500); }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email) return error(res, 'Name and email required', 400);

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return error(res, 'Email already registered', 400);

    const hash = await bcrypt.hash(password || 'changeme123', 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash: hash,
      role,
      is_active: true,
    });

    // If role is Student → also create student profile
    if (role === 'Student') {
      const Student = (await import('../models/Student.js')).default;
      await Student.create({
        user: user._id,
        admission_no: `ADM-${Date.now()}`,
      });
    }

    // If role is Teacher → also create teacher profile
    if (role === 'Teacher') {
      const Teacher = (await import('../models/Teacher.js')).default;
      await Teacher.create({
        user: user._id,
        employee_no: `T-${Date.now()}`,
      });
    }

    return success(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, 'User created successfully', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const removeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 'Not found', 404);
    if (user.email === 'admin@gurukul.edu') {
      return error(res, 'Cannot delete main admin', 400);
    }
    await User.findByIdAndDelete(req.params.id);
    return success(res, null, 'User deleted');
  } catch (e) { return error(res, e.message, 500); }
};