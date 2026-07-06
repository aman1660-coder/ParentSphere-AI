import mongoose from 'mongoose';

const growthRecordSchema = new mongoose.Schema(
  {
    height: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { _id: true }
);

const childSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 18 },
    height: { type: Number, required: true, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    schoolGrade: { type: String, required: true },
    interests: [String],
    behaviorNotes: { type: String, default: '' },
    growthRecords: [growthRecordSchema]
  },
  { timestamps: true }
);

export default mongoose.model('Child', childSchema);
