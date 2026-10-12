import { Router } from 'express';
import * as c from '../controllers/exam.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);

r.get('/', c.listExams);
r.post('/', requireRole('Admin', 'Teacher'), c.createExam);
r.delete('/:id', requireRole('Admin'), c.removeExam);
r.post('/results', requireRole('Admin', 'Teacher'), c.saveResults);
r.get('/marks/:examId', requireRole('Admin', 'Teacher'), c.getMarks);
r.get('/report/:examId/:studentId', c.reportCard);
r.patch('/:id/publish', requireRole('Admin', 'Teacher'), c.publishExam);

export default r;