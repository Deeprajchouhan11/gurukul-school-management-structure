import { Router } from 'express';
import * as c from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);

r.post('/', c.makePayment);
r.get('/my', requireRole('Student'), c.myPayments);
r.get('/receipt/:id', c.getReceipt);
r.get('/all', requireRole('Admin', 'Accountant'), c.listAll);

export default r;