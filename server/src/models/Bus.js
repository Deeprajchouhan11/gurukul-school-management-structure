import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  bus_no: String,
  driver_name: String,
  driver_phone: String,
  route: String,
  capacity: Number,
}, { timestamps: true });

const allocationSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  bus_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  stop: String,
  fee: Number,
}, { timestamps: true });

export const Bus = mongoose.model('Bus', busSchema);
export const TransportAllocation = mongoose.model('TransportAllocation', allocationSchema);