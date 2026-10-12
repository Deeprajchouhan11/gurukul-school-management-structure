import { pool } from '../config/db.js';
import { success, error } from '../utils/apiResponse.js';

export const list = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT s.*, c.name AS class_name FROM subjects s
    LEFT JOIN classes c ON s.class_id=c.id ORDER BY s.id DESC`);
  return success(res, rows);
};

export const create = async (req, res) => {
  const { name, code, class_id, teacher_id } = req.body;
  if (!name) return error(res, 'Name required', 400);
  const [r] = await pool.query(
    'INSERT INTO subjects (name,code,class_id,teacher_id) VALUES (?,?,?,?)',
    [name, code, class_id || null, teacher_id || null]);
  return success(res, { id: r.insertId }, 'Subject created', 201);
};

export const remove = async (req, res) => {
  await pool.query('DELETE FROM subjects WHERE id=?', [req.params.id]);
  return success(res, null, 'Subject deleted');
};