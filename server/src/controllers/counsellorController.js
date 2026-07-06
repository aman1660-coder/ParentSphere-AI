import { body } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import Appointment from '../models/Appointment.js';
import Counsellor from '../models/Counsellor.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const counsellorRules = [
  body('name').isLength({ min: 2 }).withMessage('Name is required'),
  body('specialization').notEmpty().withMessage('Specialization is required'),
  body('experience').isFloat({ min: 0 }).withMessage('Experience must be a positive number'),
  body('qualification').notEmpty().withMessage('Qualification is required'),
  body('fee').isFloat({ min: 0 }).withMessage('Fee is required'),
  body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters')
];

export const listCounsellors = asyncHandler(async (req, res) => {
  const { q, specialization, mode } = req.query;
  const query = { isActive: true };
  if (specialization && specialization !== 'All') query.specialization = specialization;
  if (mode && mode !== 'All') query.mode = mode;
  if (q) query.$text = { $search: q };

  const counsellors = await Counsellor.find(query).sort('-rating experience');
  res.json({ success: true, counsellors });
});

export const getCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findById(req.params.id).populate('userId', 'name email phone');
  if (!counsellor) throw new AppError('Counsellor not found', 404);
  const appointments = await Appointment.find({
    counsellorId: counsellor._id,
    bookingStatus: { $in: ['pending', 'confirmed'] }
  }).select('date time bookingStatus');
  res.json({ success: true, counsellor, appointments });
});

export const createCounsellor = asyncHandler(async (req, res) => {
  const user = req.body.email
    ? await User.findOne({ email: req.body.email })
    : req.body.userId
      ? await User.findById(req.body.userId)
      : null;
  const counsellor = await Counsellor.create({ ...req.body, userId: user?._id });
  if (user && user.role !== 'counsellor') {
    user.role = 'counsellor';
    await user.save({ validateBeforeSave: false });
  }
  res.status(201).json({ success: true, counsellor });
});

export const updateCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findById(req.params.id);
  if (!counsellor) throw new AppError('Counsellor not found', 404);
  const isOwner = String(counsellor.userId || '') === String(req.user._id);
  if (req.user.role !== 'admin' && !isOwner) throw new AppError('Access denied', 403);
  Object.assign(counsellor, req.body);
  await counsellor.save();
  res.json({ success: true, counsellor });
});

export const deleteCounsellor = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findById(req.params.id);
  if (!counsellor) throw new AppError('Counsellor not found', 404);
  await counsellor.deleteOne();
  res.json({ success: true, message: 'Counsellor deleted' });
});
