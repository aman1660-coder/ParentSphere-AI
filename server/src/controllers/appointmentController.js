import { body } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import Appointment from '../models/Appointment.js';
import Counsellor from '../models/Counsellor.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const appointmentRules = [
  body('counsellorId').notEmpty().withMessage('Counsellor is required'),
  body('date').isISO8601().withMessage('A valid date is required'),
  body('time').notEmpty().withMessage('Time slot is required')
];

export const listAppointments = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'parent') query.userId = req.user._id;
  if (req.user.role === 'counsellor') {
    const profile = await Counsellor.findOne({ userId: req.user._id });
    query = { counsellorId: profile?._id };
  }

  const appointments = await Appointment.find(query)
    .populate('userId', 'name email phone')
    .populate('counsellorId')
    .sort('-createdAt');
  res.json({ success: true, appointments });
});

export const createAppointment = asyncHandler(async (req, res) => {
  const counsellor = await Counsellor.findById(req.body.counsellorId);
  if (!counsellor || !counsellor.isActive) throw new AppError('Counsellor is not available', 404);

  const date = new Date(req.body.date);
  const duplicate = await Appointment.findOne({
    counsellorId: counsellor._id,
    date,
    time: req.body.time,
    bookingStatus: { $in: ['pending', 'confirmed'] }
  });
  if (duplicate) throw new AppError('This slot is already booked', 409);

  const appointment = await Appointment.create({
    userId: req.user._id,
    counsellorId: counsellor._id,
    date,
    time: req.body.time,
    notes: req.body.notes || ''
  });

  res.status(201).json({ success: true, appointment, counsellor });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate('counsellorId');
  if (!appointment) throw new AppError('Appointment not found', 404);
  if (req.user.role === 'counsellor' && String(appointment.counsellorId.userId) !== String(req.user._id)) {
    throw new AppError('Access denied', 403);
  }
  appointment.bookingStatus = req.body.bookingStatus || appointment.bookingStatus;
  appointment.notes = req.body.notes ?? appointment.notes;
  appointment.meetingLink = req.body.meetingLink ?? appointment.meetingLink;
  await appointment.save();
  res.json({ success: true, appointment });
});
