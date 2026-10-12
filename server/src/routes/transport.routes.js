import { Router } from 'express';
import * as c from '../controllers/transport.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);
r.get('/buses', c.listBuses);
r.post('/buses', requireRole('Admin'), c.addBus);
r.post('/allocate', requireRole('Admin'), c.allocate);
r.get('/allocations', requireRole('Admin'), c.listAllocations);
export default r;