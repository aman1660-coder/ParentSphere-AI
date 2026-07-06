import mongoose from 'mongoose';

const forumCommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const forumPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Behaviour', 'Education', 'Health', 'Nutrition', 'Technology', 'Parent Stories'],
      default: 'Parent Stories'
    },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [forumCommentSchema],
    isResolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

forumPostSchema.index({ title: 'text', content: 'text', category: 'text' });

export default mongoose.model('ForumPost', forumPostSchema);
