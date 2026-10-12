import mongoose from 'mongoose';

const URI = 'mongodb+srv://deeprajchouhan2004_db_user:aPtAw6fMuBFY0UGi@gurukul.ijz9vne.mongodb.net/gurukul_db?retryWrites=true&w=majority';

const run = async () => {
  try {
    console.log('Connecting...');
    await mongoose.connect(URI, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ Connected!');
    console.log('Host:', mongoose.connection.host);
    console.log('DB:', mongoose.connection.name);
    await mongoose.disconnect();
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
};

run();