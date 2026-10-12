import { Router } from 'express';
import * as c from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);
r.get('/dashboard', c.dashboardStats);
r.get('/attendance', requireRole('Admin','Teacher'), c.attendanceReport);
r.get('/fees', requireRole('Admin','Accountant'), c.feeReport);
export default r;