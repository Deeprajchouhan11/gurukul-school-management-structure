import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// ⚠️ REPLACE WITH YOUR ATLAS CONNECTION STRING
const ATLAS_URI = 'mongodb+srv://deeprajchouhan2004_db_user:aPtAw6fMuBFY0UGi@gurukul.ijz9vne.mongodb.net/gurukul_db?retryWrites=true&w=majority';

const run = async () => {
  await mongoose.connect(ATLAS_URI);
  console.log('✅ Connected to Atlas');

  const db = mongoose.connection.db;

  await Promise.all([
    db.collection('users').deleteMany({}),
    db.collection('classes').deleteMany({}),
    db.collection('students').deleteMany({}),
    db.collection('teachers').deleteMany({}),
    db.collection('fees').deleteMany({}),
    db.collection('notices').deleteMany({}),
    db.collection('books').deleteMany({}),
    db.collection('buses').deleteMany({}),
  ]);

  const hash = await bcrypt.hash('admin123', 10);

  await db.collection('users').insertMany([
    { name: 'Gurukul Admin', email: 'admin@gurukul.edu', password_hash: hash, role: 'Admin', is_active: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Mrs. Sharma', email: 'teacher@gurukul.edu', password_hash: hash, role: 'Teacher', is_active: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Rahul Kumar', email: 'student@gurukul.edu', password_hash: hash, role: 'Student', is_active: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Mr. Kumar', email: 'parent@gurukul.edu', password_hash: hash, role: 'Parent', is_active: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Ms. Verma', email: 'accountant@gurukul.edu', password_hash: hash, role: 'Accountant', is_active: true, createdAt: new Date(), updatedAt: new Date() },
  ]);

  await db.collection('classes').insertMany([
    { name: 'Class 8', section: 'A', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Class 9', section: 'A', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Class 10', section: 'A', createdAt: new Date(), updatedAt: new Date() },
    { name: 'Class 10', section: 'B', createdAt: new Date(), updatedAt: new Date() },
  ]);

  console.log('✅ Atlas seeded!');
  console.log('Login: admin@gurukul.edu / admin123');
  await mongoose.disconnect();
};

run().catch((e) => { console.error('❌', e.message); process.exit(1); });