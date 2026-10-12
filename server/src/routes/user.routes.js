import { Router } from 'express';
import * as c from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware, requireRole('Admin'));
r.get('/', c.list);
r.post('/', c.createUser);
r.patch('/:id/toggle', c.toggleActive);
r.delete('/:id', c.removeUser);
export default r;