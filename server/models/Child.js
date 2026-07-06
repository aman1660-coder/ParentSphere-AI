import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  schoolGrade: {
    type: String,
  },
  growthRecords: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      height: {
        type: Number, // in cm
        required: true,
      },
      weight: {
        type: Number, // in kg
        required: true,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Child = mongoose.model('Child', childSchema);
export default Child;
