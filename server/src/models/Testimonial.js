import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
