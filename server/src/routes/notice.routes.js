import { Router } from 'express';
import * as c from '../controllers/notice.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);
r.get('/', c.list);
r.post('/', requireRole('Admin', 'Teacher'), c.create);
r.delete('/:id', requireRole('Admin'), c.remove);

export default r;