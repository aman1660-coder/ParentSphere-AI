import mongoose from 'mongoose';

const aiMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const aiChatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
    title: { type: String, default: 'Parenting Guidance Chat' },
    messages: [aiMessageSchema]
  },
  { timestamps: true }
);

export default mongoose.model('AIChat', aiChatSchema);
