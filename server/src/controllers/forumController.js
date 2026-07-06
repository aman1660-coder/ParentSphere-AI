import { body } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import ForumPost from '../models/ForumPost.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const postRules = [
  body('title').isLength({ min: 5 }).withMessage('Title is required'),
  body('content').isLength({ min: 10 }).withMessage('Content is required')
];

export const listPosts = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const query = {};
  if (q) query.$text = { $search: q };
  if (category && category !== 'All') query.category = category;
  const posts = await ForumPost.find(query)
    .populate('author', 'name avatar role')
    .populate('comments.user', 'name avatar')
    .sort('-createdAt');
  res.json({ success: true, posts });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await ForumPost.create({ ...req.body, author: req.user._id });
  await post.populate('author', 'name avatar role');
  res.status(201).json({ success: true, post });
});

export const togglePostLike = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  const exists = post.likes.some((userId) => String(userId) === String(req.user._id));
  post.likes = exists
    ? post.likes.filter((userId) => String(userId) !== String(req.user._id))
    : [...post.likes, req.user._id];
  await post.save();
  res.json({ success: true, likes: post.likes.length, liked: !exists });
});

export const addPostComment = asyncHandler(async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  post.comments.push({ user: req.user._id, text: req.body.text });
  await post.save();
  await post.populate('comments.user', 'name avatar');
  res.status(201).json({ success: true, comments: post.comments });
});
