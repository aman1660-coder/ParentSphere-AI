import { body } from 'express-validator';
import Video from '../models/Video.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const videoRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').isLength({ min: 20 }).withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('videoUrl').isURL().withMessage('Valid video URL is required'),
  body('thumbnail').isURL().withMessage('Valid thumbnail URL is required'),
  body('duration').notEmpty().withMessage('Duration is required')
];

export const listVideos = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const query = {};
  if (q) query.$text = { $search: q };
  if (category && category !== 'All') query.category = category;
  const videos = await Video.find(query).sort('-createdAt');
  res.json({ success: true, videos });
});

export const createVideo = asyncHandler(async (req, res) => {
  const video = await Video.create({ ...req.body, uploadedBy: req.user._id });
  res.status(201).json({ success: true, video });
});

export const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, video });
});

export const deleteVideo = asyncHandler(async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Video deleted' });
});
