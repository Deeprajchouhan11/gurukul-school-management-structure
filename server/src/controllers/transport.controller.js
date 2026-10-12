import { Bus, TransportAllocation } from '../models/Bus.js';
import { success, error } from '../utils/apiResponse.js';

export const listBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    return success(res, buses);
  } catch (e) { return error(res, e.message, 500); }
};

export const addBus = async (req, res) => {
  try {
    const { bus_no, driver_name, driver_phone, route, capacity } = req.body;
    const bus = await Bus.create({ bus_no, driver_name, driver_phone, route, capacity });
    return success(res, { id: bus._id }, 'Bus added', 201);
  } catch (e) { return error(res, e.message, 500); }
};

export const allocate = async (req, res) => {
  try {
    const { student_id, bus_id, stop, fee } = req.body;
    await TransportAllocation.create({ student_id, bus_id, stop, fee });
    return success(res, null, 'Allocated');
  } catch (e) { return error(res, e.message, 500); }
};

export const listAllocations = async (req, res) => {
  try {
    const items = await TransportAllocation.find()
      .populate('bus_id')
      .populate({ path: 'student_id', populate: { path: 'user', select: 'name' } });
    return success(res, items);
  } catch (e) { return error(res, e.message, 500); }
};