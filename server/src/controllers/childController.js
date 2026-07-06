import { body } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import Book from '../models/Book.js';
import Child from '../models/Child.js';
import Counsellor from '../models/Counsellor.js';
import Video from '../models/Video.js';
import { buildRecommendations } from '../utils/ai.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const childRules = [
  body('name').isLength({ min: 2 }).withMessage('Child name is required'),
  body('age').isFloat({ min: 0, max: 18 }).withMessage('Age must be between 0 and 18'),
  body('height').isFloat({ min: 1 }).withMessage('Height is required'),
  body('weight').isFloat({ min: 1 }).withMessage('Weight is required'),
  body('schoolGrade').notEmpty().withMessage('School grade is required')
];

const findOwnedChild = async (id, parent) => {
  const child = await Child.findOne({ _id: id, parent });
  if (!child) throw new AppError('Child profile not found', 404);
  return child;
};

export const listChildren = asyncHandler(async (req, res) => {
  const children = await Child.find({ parent: req.user._id }).sort('-createdAt');
  res.json({ success: true, children });
});

export const createChild = asyncHandler(async (req, res) => {
  const child = await Child.create({
    ...req.body,
    parent: req.user._id,
    growthRecords: [{ height: req.body.height, weight: req.body.weight, date: new Date() }]
  });
  res.status(201).json({ success: true, child });
});

export const updateChild = asyncHandler(async (req, res) => {
  const child = await findOwnedChild(req.params.id, req.user._id);
  Object.assign(child, req.body);
  await child.save();
  res.json({ success: true, child });
});

export const addGrowth = asyncHandler(async (req, res) => {
  const child = await findOwnedChild(req.params.id, req.user._id);
  child.height = req.body.height;
  child.weight = req.body.weight;
  child.growthRecords.push({ height: req.body.height, weight: req.body.weight, date: req.body.date || new Date() });
  await child.save();
  res.json({ success: true, child });
});

export const getGrowthRecommendations = asyncHandler(async (req, res) => {
  const child = await findOwnedChild(req.params.id, req.user._id);
  const [books, counsellors, videos] = await Promise.all([
    Book.find({}).limit(6),
    Counsellor.find({ isActive: true }).limit(6),
    Video.find({}).limit(6)
  ]);
  res.json({ success: true, recommendations: buildRecommendations({ child, books, counsellors, videos }) });
});

export const deleteChild = asyncHandler(async (req, res) => {
  const child = await findOwnedChild(req.params.id, req.user._id);
  await child.deleteOne();
  res.json({ success: true, message: 'Child profile deleted' });
});
