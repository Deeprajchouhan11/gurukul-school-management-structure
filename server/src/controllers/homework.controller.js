import Homework from '../models/Homework.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  try {
    const items = await Homework.find().populate('class_id', 'name').sort({ createdAt: -1 });
    return success(res, items.map((h) => ({
      id: h._id, class_name: h.class_id?.name,
      subject: h.subject, title: h.title,
      description: h.description, due_date: h.due_date,
    })));
  } catch (e) { return error(res, e.message, 500); }
};

export const create = async (req, res) => {
  try {
    const { class_id, subject, title, description, due_date } = req.body;
    const h = await Homework.create({
      class_id, subject, title, description, due_date, created_by: req.user.id,
    });
    return success(res, { id: h._id }, 'Homework created', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const remove = async (req, res) => {
  try {
    await Homework.findByIdAndDelete(req.params.id);
    return success(res, null, 'Deleted');
  } catch (e) { return error(res, e.message, 500); }
};