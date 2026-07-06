import mongoose from 'mongoose';

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [
    {
      role: {
        type: String, // 'user' or 'assistant'
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AIChat = mongoose.model('AIChat', aiChatSchema);
export default AIChat;
