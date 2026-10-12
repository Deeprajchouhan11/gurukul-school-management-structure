import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { success, error } from '../utils/apiResponse.js';

const r = Router();
r.use(authMiddleware);

// GET /api/parents/my-child — returns child details of logged-in parent
r.get('/my-child', requireRole('Parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    if (!parent || !parent.student_id) {
      // Fallback: try matching by guardian phone
      const user = await User.findById(req.user.id);
      const student = await Student.findOne({ guardian_phone: user.phone }).populate('user', 'name').populate('class_id');
      if (!student) return error(res, 'No child linked to your account', 404);
      return success(res, {
        student_id: student._id,
        student_name: student.user?.name,
        admission_no: student.admission_no,
        roll_no: student.roll_no,
        class_name: student.class_id?.name,
        section: student.class_id?.section,
        guardian_phone: student.guardian_phone,
      });
    }
    const student = await Student.findById(parent.student_id)
      .populate('user', 'name')
      .populate('class_id');

    return success(res, {
      student_id: student._id,
      student_name: student.user?.name,
      admission_no: student.admission_no,
      roll_no: student.roll_no,
      class_name: student.class_id?.name,
      section: student.class_id?.section,
      guardian_phone: student.guardian_phone,
    });
  } catch (e) {
    return error(res, e.message, 500);
  }
});

export default r;