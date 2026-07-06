import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const counsellorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: 'no-photo.jpg',
  },
  availability: [
    {
      day: String,
      slots: [String] // e.g., ['10:00 AM', '11:00 AM']
    }
  ],
  rating: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'counsellor',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
counsellorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
counsellorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Counsellor = mongoose.model('Counsellor', counsellorSchema);
export default Counsellor;
