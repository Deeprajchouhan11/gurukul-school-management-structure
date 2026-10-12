import jwt from 'jsonwebtoken';
export const signToken = (p) => jwt.sign(p, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
export const verifyToken = (t) => jwt.verify(t, process.env.JWT_SECRET);