import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/parentsphere';
  mongoose.set('strictQuery', true);
  const connection = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  return connection;
};
