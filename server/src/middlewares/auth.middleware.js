import { verifyToken } from '../utils/token.js';
import { error } from '../utils/apiResponse.js';

export const authMiddleware = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return error(res, 'No token provided', 401);

    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};