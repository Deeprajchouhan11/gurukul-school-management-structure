import { Router } from 'express';
import * as c from '../controllers/student.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);
r.get('/', requireRole('Admin', 'Teacher'), c.list);
r.get('/:id', c.get);
r.post('/', requireRole('Admin'), c.create);
r.put('/:id', requireRole('Admin'), c.update);
r.delete('/:id', requireRole('Admin'), c.remove);
export default r;