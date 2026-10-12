import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import LoginHistory from '../models/LoginHistory.js';
import PasswordReset from '../models/PasswordReset.js';
import { signToken } from '../utils/token.js';
import { success, error } from '../utils/apiResponse.js';

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return error(res, 'All fields required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'Invalid credentials', 401);
    if (user.role !== role) return error(res, 'Role mismatch', 403);
    if (!user.is_active) return error(res, 'Account deactivated', 403);

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return error(res, 'Invalid credentials', 401);

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    LoginHistory.create({
      user_id: user._id,
      ip: req.ip,
      user_agent: req.headers['user-agent'] || '',
      status: 'success',
    }).catch(() => {});

    return success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    }, 'Login successful');
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return error(res, 'All fields required', 400);
    }
    if (password.length < 4) {
      return error(res, 'Password must be at least 4 characters', 400);
    }

    const allowedRoles = ['Admin', 'Teacher', 'Student', 'Parent', 'Accountant'];
    if (!allowedRoles.includes(role)) {
      return error(res, 'Invalid role', 400);
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return error(res, 'Email already registered', 400);

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash: hash,
      role,
      is_active: true,
    });

    if (role === 'Student') {
      try {
        await Student.create({
          user: user._id,
          admission_no: `ADM-${Date.now().toString().slice(-6)}`,
        });
      } catch (e) { /* optional */ }
    }

    if (role === 'Teacher') {
      try {
        await Teacher.create({
          user: user._id,
          employee_no: `T-${Date.now().toString().slice(-4)}`,
        });
      } catch (e) { /* optional */ }
    }

    return success(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, 'Account created successfully', 201);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// ================= ME =================
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email role avatar');
    if (!user) return error(res, 'Not found', 404);
    return success(res, user);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// ================= LOGOUT =================
export const logout = (req, res) => success(res, null, 'Logged out');

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const ok = await bcrypt.compare(oldPassword, user.password_hash);
    if (!ok) return error(res, 'Old password incorrect', 401);
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return success(res, null, 'Password changed');
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return error(res, 'Email required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return success(res, null, 'If that email exists, an OTP has been sent.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordReset.deleteMany({ user_id: user._id });
    await PasswordReset.create({ user_id: user._id, otp, expires_at, used: false });

    console.log('');
    console.log('========================================');
    console.log(`📧 OTP for ${user.email}`);
    console.log(`🔑 OTP: ${otp}`);
    console.log(`⏰ Valid 10 minutes`);
    console.log('========================================');
    console.log('');

    return success(res, { otp_dev: otp }, 'OTP generated — check server console');
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return error(res, 'Email and OTP required', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'Invalid request', 400);

    const reset = await PasswordReset.findOne({ user_id: user._id, otp, used: false });
    if (!reset) return error(res, 'Invalid OTP', 400);
    if (new Date() > reset.expires_at) return error(res, 'OTP expired', 400);

    return success(res, { verified: true }, 'OTP verified');
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return error(res, 'All fields required', 400);
    if (newPassword.length < 6) return error(res, 'Password must be 6+ characters', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return error(res, 'Invalid request', 400);

    const reset = await PasswordReset.findOne({ user_id: user._id, otp, used: false });
    if (!reset) return error(res, 'Invalid OTP', 400);
    if (new Date() > reset.expires_at) return error(res, 'OTP expired', 400);

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    reset.used = true;
    await reset.save();

    return success(res, null, 'Password reset successfully');
  } catch (e) {
    return error(res, e.message, 500);
  }
};