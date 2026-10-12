import { Router } from 'express';
import * as c from '../controllers/library.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const r = Router();
r.use(authMiddleware);

r.get('/books', c.listBooks);
r.post('/books', requireRole('Admin'), c.addBook);
r.delete('/books/:id', requireRole('Admin'), c.removeBook);
r.post('/issue', requireRole('Admin'), c.issueBook);
r.post('/return/:id', requireRole('Admin'), c.returnBook);
r.get('/issues', requireRole('Admin'), c.listIssues);
r.get('/my-issues', c.myIssues);

export default r;