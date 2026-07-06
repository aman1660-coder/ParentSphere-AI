import mongoose from 'mongoose';
import slugify from 'slugify';

const articleCommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    category: {
      type: String,
      enum: ['Child Growth', 'Parenting Tips', 'Education', 'Technology', 'Health'],
      required: true
    },
    image: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [articleCommentSchema],
    readTime: { type: String, default: '5 min read' },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

articleSchema.pre('validate', function makeSlug(next) {
  if (!this.slug && this.title) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now()}`;
  }
  next();
});

articleSchema.index({ title: 'text', content: 'text', category: 'text', excerpt: 'text' });

export default mongoose.model('Article', articleSchema);
