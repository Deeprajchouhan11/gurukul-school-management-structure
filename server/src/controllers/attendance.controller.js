import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import { success, error } from '../utils/apiResponse.js';

// Mark attendance (bulk) — Teacher / Admin
export const markBulk = async (req, res) => {
  try {
    const { class_id, date, records } = req.body;
    if (!class_id || !date || !Array.isArray(records)) {
      return error(res, 'class_id, date, records required', 400);
    }

    for (const r of records) {
      await Attendance.findOneAndUpdate(
        { student_id: r.student_id, date },
        {
          student_id: r.student_id,
          class_id,
          date,
          status: r.status,
          marked_by: req.user.id,
        },
        { upsert: true, new: true }
      );
    }
    return success(res, null, 'Attendance saved');
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// Student apni attendance dekhe
export const myAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return error(res, 'Student profile not found', 404);

    const records = await Attendance.find({ student_id: student._id }).sort({ date: -1 });

    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const total = records.length;
    const percent = total ? Math.round((present / total) * 100) : 0;

    return success(res, {
      records,
      summary: { present, absent, late, total, percent },
    });
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// Parent apne child ki attendance dekhe
export const childAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ student_id: studentId }).sort({ date: -1 });

    const present = records.filter((r) => r.status === 'Present').length;
    const absent = records.filter((r) => r.status === 'Absent').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const total = records.length;
    const percent = total ? Math.round((present / total) * 100) : 0;

    return success(res, {
      records,
      summary: { present, absent, late, total, percent },
    });
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// By student ID
export const byStudent = async (req, res) => {
  try {
    const items = await Attendance.find({ student_id: req.params.studentId }).sort({ date: -1 });
    return success(res, items);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// By class + date
export const byClassDate = async (req, res) => {
  try {
    const { classId, date } = req.params;
    const items = await Attendance.find({ class_id: classId, date })
      .populate({ path: 'student_id', populate: { path: 'user', select: 'name' } });
    return success(res, items);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

// Monthly report
export const monthlyReport = async (req, res) => {
  try {
    const { classId, month } = req.params;
    const students = await Student.find({ class_id: classId }).populate('user', 'name');
    const result = [];

    for (const s of students) {
      const records = await Attendance.find({
        student_id: s._id,
        date: { $regex: `^${month}` },
      });
      result.push({
        student_id: s._id,
        name: s.user?.name,
        present: records.filter((r) => r.status === 'Present').length,
        absent: records.filter((r) => r.status === 'Absent').length,
        late: records.filter((r) => r.status === 'Late').length,
      });
    }
    return success(res, result);
  } catch (e) {
    return error(res, e.message, 500);
  }
};