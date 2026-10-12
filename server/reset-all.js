import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const run = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/gurukul_db');
  const U = mongoose.connection.collection('users');

  const hash = await bcrypt.hash('admin123', 10);

  const users = [
    { email: 'admin@gurukul.edu',      role: 'Admin' },
    { email: 'teacher@gurukul.edu',    role: 'Teacher' },
    { email: 'student@gurukul.edu',    role: 'Student' },
    { email: 'parent@gurukul.edu',     role: 'Parent' },
    { email: 'accountant@gurukul.edu', role: 'Accountant' },
  ];

  for (const u of users) {
    const r = await U.updateOne(
      { email: u.email },
      { $set: { password_hash: hash, is_active: true, role: u.role } }
    );
    console.log(`✅ ${u.email} (${u.role}) — Matched: ${r.matchedCount}`);
  }

  console.log('\n🔑 All passwords = admin123');
  await mongoose.disconnect();
};

run().catch((e) => { console.error('❌', e.message); process.exit(1); });