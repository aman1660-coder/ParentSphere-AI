import mongoose from 'mongoose';
import validator from 'validator';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' }
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', contactMessageSchema);
