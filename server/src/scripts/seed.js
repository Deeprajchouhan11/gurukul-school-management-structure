import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Class from '../models/Class.js';
import Fee from '../models/Fee.js';
import Notice from '../models/Notice.js';
import { Book } from '../models/Book.js';
import { Bus } from '../models/Bus.js';

async function seed() {
  await connectDB();

  console.log('🧹 Clearing old data...');
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    Class.deleteMany({}),
    Fee.deleteMany({}),
    Book.deleteMany({}),
    Notice.deleteMany({}),
    Bus.deleteMany({}),
  ]);

  console.log('👤 Creating users...');
  const hash = await bcrypt.hash('admin123', 10);

  const users = await User.insertMany([
    { name: 'Gurukul Admin', email: 'admin@gurukul.edu', password_hash: hash, role: 'Admin' },
    { name: 'Mrs. Sharma', email: 'teacher@gurukul.edu', password_hash: hash, role: 'Teacher' },
    { name: 'Rahul Kumar', email: 'student@gurukul.edu', password_hash: hash, role: 'Student' },
    { name: 'Mr. Kumar', email: 'parent@gurukul.edu', password_hash: hash, role: 'Parent' },
    { name: 'Ms. Verma', email: 'accountant@gurukul.edu', password_hash: hash, role: 'Accountant' },
  ]);

  console.log('🏫 Creating class...');
  const cls = await Class.create({ name: 'Class 10', section: 'A' });

  console.log('👩‍🏫 Creating teacher...');
  await Teacher.create({
    user: users[1]._id,
    employee_no: 'T-1001',
    subject: 'Mathematics',
    qualification: 'M.Sc., B.Ed.',
    joining_date: new Date('2020-06-01'),
  });

  console.log('🎓 Creating student...');
  const student = await Student.create({
    user: users[2]._id,
    admission_no: 'ADM-2026-001',
    roll_no: '10A-01',
    class_id: cls._id,
    guardian_name: 'Mr. Kumar',
    guardian_phone: '+91-9000000001',
  });

  console.log('💰 Creating fee...');
  await Fee.create({
    student_id: student._id,
    title: 'Tuition Fee - Q1',
    amount: 15000,
    paid_amount: 0,
    status: 'Pending',
    due_date: '2026-04-30',
  });

  console.log('📚 Creating books...');
  await Book.insertMany([
    { title: 'NCERT Mathematics X', author: 'NCERT', isbn: '978-81-7450-634-5', category: 'Textbook', total_copies: 20, available_copies: 20 },
    { title: 'Concepts of Physics', author: 'H.C. Verma', category: 'Reference', total_copies: 10, available_copies: 10 },
  ]);

  console.log('🚌 Creating buses...');
  await Bus.insertMany([
    { bus_no: 'GKL-01', driver_name: 'Ramesh Yadav', driver_phone: '+91-9000001001', route: 'Sector 12 → School', capacity: 40 },
    { bus_no: 'GKL-02', driver_name: 'Suresh Nair', driver_phone: '+91-9000001002', route: 'Sector 8 → School', capacity: 40 },
  ]);

  console.log('📢 Creating notice...');
  await Notice.create({
    title: 'Welcome to Gurukul',
    body: 'New academic year begins Monday. Report by 8:00 AM.',
    audience: 'all',
    created_by: users[0]._id,
  });

  console.log('');
  console.log('✅ MongoDB seeded successfully!');
  console.log('');
  console.log('Login credentials (password: admin123)');
  console.log('  admin@gurukul.edu       → Admin');
  console.log('  teacher@gurukul.edu     → Teacher');
  console.log('  student@gurukul.edu     → Student');
  console.log('  parent@gurukul.edu      → Parent');
  console.log('  accountant@gurukul.edu  → Accountant');
  console.log('');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e.message);
  process.exit(1);
});