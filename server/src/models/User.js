import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import validator from 'validator';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['parent', 'counsellor', 'admin'],
      default: 'parent'
    },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokens: [refreshTokenSchema],
    savedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    preferences: {
      childAgeRange: String,
      interests: [String],
      concerns: [String]
    }
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.safeProfile = function safeProfile() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  delete user.passwordResetToken;
  delete user.emailVerificationToken;
  return user;
};

export default mongoose.model('User', userSchema);
