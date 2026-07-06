import Appointment from '../models/Appointment.js';
import Article from '../models/Article.js';
import Book from '../models/Book.js';
import ContactMessage from '../models/ContactMessage.js';
import Counsellor from '../models/Counsellor.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Video from '../models/Video.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const analytics = asyncHandler(async (_req, res) => {
  const [users, counsellors, appointments, payments, books, articles, videos, messages] = await Promise.all([
    User.countDocuments(),
    Counsellor.countDocuments(),
    Appointment.countDocuments(),
    Payment.find({ status: 'paid' }),
    Book.countDocuments(),
    Article.countDocuments(),
    Video.countDocuments(),
    ContactMessage.countDocuments({ status: 'new' })
  ]);

  const revenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'paid' } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const bookingStatus = await Appointment.aggregate([
    { $group: { _id: '$bookingStatus', count: { $sum: 1 } } }
  ]);

  const roleBreakdown = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);

  const topCounsellors = await Appointment.aggregate([
    { $group: { _id: '$counsellorId', sessions: { $sum: 1 } } },
    { $sort: { sessions: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'counsellors', localField: '_id', foreignField: '_id', as: 'counsellor' } },
    { $unwind: '$counsellor' },
    { $project: { name: '$counsellor.name', sessions: 1, specialization: '$counsellor.specialization' } }
  ]);

  res.json({
    success: true,
    analytics: {
      totals: { users, counsellors, appointments, revenue, books, articles, videos, messages },
      monthlyRevenue,
      bookingStatus,
      roleBreakdown,
      topCounsellors
    }
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({}).sort('-createdAt').populate('savedBooks', 'title');
  res.json({ success: true, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true });
  res.json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});
