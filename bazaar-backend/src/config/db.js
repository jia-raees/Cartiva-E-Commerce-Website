import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('Missing MONGO_URI in environment variables. Check your .env file.');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}
