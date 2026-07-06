import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Parenting',
        'Child Psychology',
        'Emotional Intelligence',
        'Child Nutrition',
        'Education',
        'Communication Skills'
      ]
    },
    pdfLink: { type: String, required: true },
    coverImage: { type: String, required: true },
    summary: { type: String, required: true },
    tags: [String],
    readingTime: { type: String, default: '45 min' },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

bookSchema.index({ title: 'text', author: 'text', category: 'text', summary: 'text' });

export default mongoose.model('Book', bookSchema);
