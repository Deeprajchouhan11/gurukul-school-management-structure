import Notice from '../models/Notice.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  try {
    const items = await Notice.find().sort({ createdAt: -1 });
    return success(res, items);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

export const create = async (req, res) => {
  try {
    const { title, body, audience } = req.body;
    if (!title || !body) {
      return error(res, 'Title and body required', 400);
    }
    const notice = await Notice.create({
      title,
      body,
      audience: audience || 'all',
      created_by: req.user.id,
    });
    return success(res, notice, 'Notice published', 201);
  } catch (e) {
    return error(res, e.message, 500);
  }
};

export const remove = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    return success(res, null, 'Notice deleted');
  } catch (e) {
    return error(res, e.message, 500);
  }
};