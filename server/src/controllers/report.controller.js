import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import { success, error } from '../utils/apiResponse.js';

export const dashboardStats = async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const teachers = await Teacher.countDocuments();
    const fees = await Fee.find();
    const feesCollected = fees.reduce((s, f) => s + Number(f.paid_amount || 0), 0);
    const totalAtt = await Attendance.countDocuments();
    const presentAtt = await Attendance.countDocuments({ status: 'Present' });
    const attendancePercent = totalAtt ? Math.round((presentAtt / totalAtt) * 1000) / 10 : 0;
    return success(res, { students, teachers, feesCollected, attendancePercent });
  } catch (e) { return error(res, e.message, 500); }
};

export const attendanceReport = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name').populate('class_id', 'name');
    const result = [];
    for (const s of students) {
      const records = await Attendance.find({ student_id: s._id });
      result.push({
        name: s.user?.name,
        class_name: s.class_id?.name,
        present: records.filter((r) => r.status === 'Present').length,
        absent: records.filter((r) => r.status === 'Absent').length,
        late: records.filter((r) => r.status === 'Late').length,
      });
    }
    return success(res, result);
  } catch (e) { return error(res, e.message, 500); }
};

export const feeReport = async (req, res) => {
  try {
    const fees = await Fee.find()
      .populate({ path: 'student_id', populate: { path: 'user', select: 'name' } });
    return success(res, fees.map((f) => ({
      name: f.student_id?.user?.name,
      title: f.title,
      amount: f.amount,
      paid_amount: f.paid_amount,
      status: f.status,
      due_date: f.due_date,
    })));
  } catch (e) { return error(res, e.message, 500); }
};