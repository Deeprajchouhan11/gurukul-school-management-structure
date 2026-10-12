import Class from '../models/Class.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  try {
    const items = await Class.find().sort({ createdAt: -1 });
    return success(res, items.map((c) => ({ id: c._id, name: c.name, section: c.section })));
  } catch (e) { return error(res, e.message, 500); }
};

export const create = async (req, res) => {
  try {
    const { name, section } = req.body;
    if (!name) return error(res, 'Name required', 400);
    const c = await Class.create({ name, section });
    return success(res, { id: c._id }, 'Class created', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const remove = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    return success(res, null, 'Class deleted');
  } catch (e) { return error(res, e.message, 500); }
};