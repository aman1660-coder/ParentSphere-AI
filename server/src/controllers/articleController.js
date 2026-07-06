import { body } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import Article from '../models/Article.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const articleRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').isLength({ min: 50 }).withMessage('Article content must be meaningful'),
  body('excerpt').isLength({ min: 20 }).withMessage('Excerpt is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('image').isURL().withMessage('Valid image URL is required')
];

export const listArticles = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const query = { isPublished: true };
  if (q) query.$text = { $search: q };
  if (category && category !== 'All') query.category = category;
  const articles = await Article.find(query).populate('author', 'name').sort('-createdAt');
  res.json({ success: true, articles });
});

export const getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findOne({
    $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined }, { slug: req.params.id }]
  })
    .populate('author', 'name avatar')
    .populate('comments.user', 'name avatar');
  if (!article) throw new AppError('Article not found', 404);
  res.json({ success: true, article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const article = await Article.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, article });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, article });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Article deleted' });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new AppError('Article not found', 404);
  const exists = article.likes.some((userId) => String(userId) === String(req.user._id));
  article.likes = exists
    ? article.likes.filter((userId) => String(userId) !== String(req.user._id))
    : [...article.likes, req.user._id];
  await article.save();
  res.json({ success: true, likes: article.likes.length, liked: !exists });
});

export const addComment = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new AppError('Article not found', 404);
  article.comments.push({ user: req.user._id, text: req.body.text });
  await article.save();
  await article.populate('comments.user', 'name avatar');
  res.status(201).json({ success: true, comments: article.comments });
});
