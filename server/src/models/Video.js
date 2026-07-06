import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Parenting Courses', 'Child Development Videos', 'Webinars'],
      required: true
    },
    videoUrl: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

videoSchema.index({ title: 'text', description: 'text', category: 'text' });

export default mongoose.model('Video', videoSchema);
