import { Exam, ExamResult } from '../models/Exam.js';
import Student from '../models/Student.js';
import { success, error } from '../utils/apiResponse.js';

// Exam CRUD
export const listExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('class_id', 'name section').sort({ createdAt: -1 });
    return success(res, exams.map((e) => ({
      id: e._id,
      name: e.name,
      class_id: e.class_id?._id,
      class_name: e.class_id?.name,
      section: e.class_id?.section,
      exam_date: e.exam_date,
      published: e.published,
    })));
  } catch (e) { return error(res, e.message, 500); }
};

export const createExam = async (req, res) => {
  try {
    const { name, class_id, exam_date } = req.body;
    if (!name) return error(res, 'Name required', 400);
    const e = await Exam.create({ name, class_id: class_id || null, exam_date });
    return success(res, { id: e._id }, 'Exam created', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const removeExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    await ExamResult.deleteMany({ exam_id: req.params.id });
    return success(res, null, 'Exam deleted');
  } catch (e) { return error(res, e.message, 500); }
};

// Mark entry
export const saveResults = async (req, res) => {
  try {
    const { exam_id, results } = req.body; // [{student_id, subject, marks, max_marks}]
    if (!exam_id || !Array.isArray(results)) {
      return error(res, 'exam_id and results array required', 400);
    }

    for (const r of results) {
      // Calculate grade
      const percent = r.max_marks ? (r.marks / r.max_marks) * 100 : r.marks;
      let grade = 'F';
      if (percent >= 90) grade = 'A+';
      else if (percent >= 80) grade = 'A';
      else if (percent >= 70) grade = 'B+';
      else if (percent >= 60) grade = 'B';
      else if (percent >= 50) grade = 'C';
      else if (percent >= 40) grade = 'D';

      await ExamResult.findOneAndUpdate(
        { exam_id, student_id: r.student_id, subject: r.subject },
        {
          exam_id,
          student_id: r.student_id,
          subject: r.subject,
          marks: r.marks,
          max_marks: r.max_marks || 100,
          grade,
        },
        { upsert: true, new: true }
      );
    }

    return success(res, null, 'Marks saved successfully');
  } catch (e) { return error(res, e.message, 500); }
};

// Get marks for exam
export const getMarks = async (req, res) => {
  try {
    const { examId } = req.params;
    const { class_id } = req.query;

    const exam = await Exam.findById(examId).populate('class_id');
    if (!exam) return error(res, 'Exam not found', 404);

    // Get students of that class
    const students = await Student.find({ class_id: class_id || exam.class_id })
      .populate('user', 'name email')
      .sort({ roll_no: 1 });

    // Get results
    const results = await ExamResult.find({ exam_id: examId });

    const studentMarks = students.map((s) => {
      const studentResults = results.filter((r) => String(r.student_id) === String(s._id));
      const totalMarks = studentResults.reduce((sum, r) => sum + (r.marks || 0), 0);
      const totalMax = studentResults.reduce((sum, r) => sum + (r.max_marks || 100), 0);
      return {
        student_id: s._id,
        name: s.user?.name,
        roll_no: s.roll_no,
        admission_no: s.admission_no,
        results: studentResults,
        total: totalMarks,
        total_max: totalMax,
        percent: totalMax ? Math.round((totalMarks / totalMax) * 100) : 0,
      };
    });

    return success(res, { exam, studentMarks });
  } catch (e) { return error(res, e.message, 500); }
};

// Report card
export const reportCard = async (req, res) => {
  try {
    const { examId, studentId } = req.params;
    const results = await ExamResult.find({ exam_id: examId, student_id: studentId });
    const student = await Student.findById(studentId).populate('user', 'name').populate('class_id');

    const total = results.reduce((s, r) => s + (r.marks || 0), 0);
    const totalMax = results.reduce((s, r) => s + (r.max_marks || 100), 0);
    const percent = totalMax ? Math.round((total / totalMax) * 100) : 0;
    const grade = percent >= 90 ? 'A+' : percent >= 80 ? 'A' : percent >= 70 ? 'B+' :
                  percent >= 60 ? 'B' : percent >= 50 ? 'C' : percent >= 40 ? 'D' : 'F';

    return success(res, {
      student: {
        name: student?.user?.name,
        class_name: student?.class_id?.name,
        section: student?.class_id?.section,
        roll_no: student?.roll_no,
        admission_no: student?.admission_no,
      },
      results,
      total,
      total_max: totalMax,
      percent,
      grade,
      status: percent >= 40 ? 'PASS' : 'FAIL',
    });
  } catch (e) { return error(res, e.message, 500); }
};

// Publish exam results
export const publishExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, { published: true }, { new: true });
    if (!exam) return error(res, 'Not found', 404);
    return success(res, exam, 'Exam results published');
  } catch (e) { return error(res, e.message, 500); }
};