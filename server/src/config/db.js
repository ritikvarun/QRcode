import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️ [Database Warning] MONGODB_URI is not configured with valid credentials in server/.env.');
    console.warn('⚠️ Please add your MongoDB Atlas connection string to server/.env:');
    console.warn('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dynamic_qr_db\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [MongoDB Connected] Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    return false;
  }
};
