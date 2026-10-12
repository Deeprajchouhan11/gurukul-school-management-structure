import { Router } from 'express';
import * as c from '../controllers/attendance.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);

r.post('/mark', requireRole('Admin', 'Teacher'), c.markBulk);
r.get('/me', requireRole('Student'), c.myAttendance);
r.get('/student/:studentId', c.byStudent);
r.get('/child/:studentId', requireRole('Parent', 'Admin'), c.childAttendance);
r.get('/class/:classId/:date', requireRole('Admin', 'Teacher'), c.byClassDate);
r.get('/report/:classId/:month', requireRole('Admin', 'Teacher'), c.monthlyReport);

export default r;