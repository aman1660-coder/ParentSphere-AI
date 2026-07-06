import mongoose from 'mongoose';
import validator from 'validator';

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    source: { type: String, default: 'landing' }
  },
  { timestamps: true }
);

export default mongoose.model('Newsletter', newsletterSchema);
