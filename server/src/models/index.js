import { Router } from 'express';
import authRoutes from './auth.routes.js';
import studentRoutes from './student.routes.js';
import teacherRoutes from './teacher.routes.js';
import classRoutes from './class.routes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ status: 'ok', app: 'Gurukul' }));

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);

export default router;