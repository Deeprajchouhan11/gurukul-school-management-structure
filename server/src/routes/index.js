import { Router } from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import classRoutes from './class.routes.js';
import attendanceRoutes from './attendance.routes.js';
import feeRoutes from './fee.routes.js';
import examRoutes from './exam.routes.js';
import homeworkRoutes from './homework.routes.js';
import libraryRoutes from './library.routes.js';
import transportRoutes from './transport.routes.js';
import noticeRoutes from './notice.routes.js';
import userRoutes from './user.routes.js';
import feeStructureRoutes from './feeStructure.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', app: 'Gurukul' }));

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/fees', feeRoutes);
router.use('/exams', examRoutes);
router.use('/homework', homeworkRoutes);
router.use('/library', libraryRoutes);
router.use('/transport', transportRoutes);
router.use('/notices', noticeRoutes);
router.use('/users', userRoutes);

router.use('/fee-structure', feeStructureRoutes);
router.use('/payments', paymentRoutes);

export default router;