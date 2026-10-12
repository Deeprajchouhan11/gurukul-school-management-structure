import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const run = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/gurukul_db');
  const U = mongoose.connection.collection('users');

  const hash = await bcrypt.hash('admin123', 10);
  const r = await U.updateOne(
    { email: 'accountant@gurukul.edu' },
    { $set: { password_hash: hash, is_active: true, role: 'Accountant' } }
  );

  console.log('✅ Matched:', r.matchedCount, '| Modified:', r.modifiedCount);
  await mongoose.disconnect();
};

run().catch((e) => { console.error('❌', e.message); process.exit(1); });