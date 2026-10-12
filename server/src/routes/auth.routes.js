import { Router } from 'express';
import * as c from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const r = Router();
r.post('/forgot-password', c.forgotPassword);
r.post('/verify-otp', c.verifyOTP);
r.post('/reset-password', c.resetPassword);
r.post('/login', c.login);
r.post('/register', c.register);
r.get('/me', authMiddleware, c.me);
r.post('/logout', authMiddleware, c.logout);
r.post('/change-password', authMiddleware, c.changePassword);

export default r;