import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    slots: [{ type: String, required: true }]
  },
  { _id: false }
);

const counsellorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    specialization: {
      type: String,
      required: true,
      enum: [
        'Child Psychology',
        'Academic Counselling',
        'Parenting Guidance',
        'Adolescent Behaviour',
        'Family Counselling',
        'Mental Health Support',
        'Special Needs Counselling',
        'Career Guidance'
      ]
    },
    experience: { type: Number, required: true, min: 0 },
    qualification: { type: String, required: true },
    fee: { type: Number, required: true, min: 0 },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'
    },
    availability: [slotSchema],
    rating: { type: Number, default: 4.8, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    description: { type: String, required: true },
    languages: [{ type: String, default: 'English' }],
    mode: { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Online' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

counsellorSchema.index({ name: 'text', specialization: 'text', description: 'text' });

export default mongoose.model('Counsellor', counsellorSchema);
