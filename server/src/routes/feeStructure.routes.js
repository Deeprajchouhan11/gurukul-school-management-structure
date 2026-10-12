import { Router } from 'express';
import * as c from '../controllers/feeStructure.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);

r.get('/', c.list);
r.get('/by-class/:classId', c.byClass);
r.post('/', requireRole('Admin', 'Accountant'), c.create);
r.put('/:id', requireRole('Admin', 'Accountant'), c.update);
r.delete('/:id', requireRole('Admin', 'Accountant'), c.remove);

export default r;