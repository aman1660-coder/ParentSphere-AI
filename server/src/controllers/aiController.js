import { body } from 'express-validator';
import AIChat from '../models/AIChat.js';
import Book from '../models/Book.js';
import Child from '../models/Child.js';
import Counsellor from '../models/Counsellor.js';
import Video from '../models/Video.js';
import { askParentingAssistant, buildRecommendations } from '../utils/ai.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const chatRules = [body('message').isLength({ min: 2 }).withMessage('Message is required')];

export const getChatHistory = asyncHandler(async (req, res) => {
  const chats = await AIChat.find({ userId: req.user._id }).sort('-updatedAt').populate('childId', 'name age');
  res.json({ success: true, chats });
});

export const chat = asyncHandler(async (req, res) => {
  const child = req.body.childId ? await Child.findOne({ _id: req.body.childId, parent: req.user._id }) : null;
  let chatDoc = await AIChat.findOne({ userId: req.user._id, childId: child?._id || undefined });
  if (!chatDoc) {
    chatDoc = await AIChat.create({
      userId: req.user._id,
      childId: child?._id,
      title: req.body.message.slice(0, 60),
      messages: []
    });
  }

  const history = [...chatDoc.messages];
  chatDoc.messages.push({ role: 'user', content: req.body.message });
  const answer = await askParentingAssistant({
    message: req.body.message,
    child: child?.toObject() || req.body.child || {},
    history
  });
  chatDoc.messages.push({ role: 'assistant', content: answer });
  await chatDoc.save();

  res.json({ success: true, answer, chat: chatDoc });
});

export const recommendations = asyncHandler(async (req, res) => {
  const child = req.body.childId
    ? await Child.findOne({ _id: req.body.childId, parent: req.user._id })
    : req.body.child || {};
  const [books, counsellors, videos] = await Promise.all([
    Book.find({}).limit(8),
    Counsellor.find({ isActive: true }).sort('-rating').limit(8),
    Video.find({}).limit(8)
  ]);

  res.json({
    success: true,
    recommendations: buildRecommendations({
      child: child?.toObject ? child.toObject() : child,
      books,
      counsellors,
      videos
    })
  });
});
