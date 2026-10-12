import { Router } from 'express';
import * as c from '../controllers/teacher.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);
r.get('/', requireRole('Admin'), c.list);
r.post('/', requireRole('Admin'), c.create);
r.delete('/:id', requireRole('Admin'), c.remove);
export default r;