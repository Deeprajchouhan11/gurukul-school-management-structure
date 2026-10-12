import { Router } from 'express';
import * as c from '../controllers/fee.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);

r.get('/', requireRole('Admin', 'Accountant'), c.listAll);
r.get('/summary', requireRole('Admin', 'Accountant'), c.summary);
r.get('/me', requireRole('Student'), c.myFees);
r.get('/student/:studentId', c.byStudent);
r.post('/', requireRole('Admin', 'Accountant'), c.create);
r.post('/:id/pay', requireRole('Admin', 'Accountant'), c.pay);

export default r;