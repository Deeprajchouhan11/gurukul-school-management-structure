import { error } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return error(res, 'Unauthorized', 401);
  if (!allowedRoles.includes(req.user.role)) {
    return error(res, 'Forbidden: insufficient permissions', 403);
  }
  next();
};