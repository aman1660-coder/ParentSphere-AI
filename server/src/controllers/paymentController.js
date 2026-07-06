import { body } from 'express-validator';
import { AppError } from '../middleware/errorHandler.js';
import Appointment from '../models/Appointment.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { emailTemplates, sendEmail } from '../utils/email.js';
import { createRazorpayOrder, isRazorpayConfigured, verifyRazorpaySignature } from '../utils/razorpay.js';

export const createOrderRules = [body('appointmentId').notEmpty().withMessage('Appointment is required')];

export const createOrder = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({ _id: req.body.appointmentId, userId: req.user._id }).populate(
    'counsellorId'
  );
  if (!appointment) throw new AppError('Appointment not found', 404);
  if (appointment.paymentStatus === 'paid') throw new AppError('Appointment is already paid', 409);

  const amount = appointment.counsellorId.fee;
  const order = await createRazorpayOrder({ amount, receipt: `appointment_${appointment._id}` });
  const payment = await Payment.create({
    paymentId: order.id,
    orderId: order.id,
    amount,
    currency: order.currency || 'INR',
    userId: req.user._id,
    appointmentId: appointment._id,
    status: 'created',
    provider: order.demo ? 'demo' : 'razorpay'
  });

  res.status(201).json({
    success: true,
    order,
    payment,
    keyId: process.env.RAZORPAY_KEY_ID || 'demo',
    demo: !isRazorpayConfigured()
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const appointment = await Appointment.findOne({ _id: appointmentId, userId: req.user._id }).populate('counsellorId');
  if (!appointment) throw new AppError('Appointment not found', 404);

  const isValid = verifyRazorpaySignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });
  if (!isValid) throw new AppError('Payment signature verification failed', 400);

  const payment = await Payment.findOneAndUpdate(
    { appointmentId: appointment._id, orderId: razorpay_order_id },
    {
      $set: {
        paymentId: razorpay_payment_id || `demo_payment_${Date.now()}`,
        signature: razorpay_signature || 'demo_signature',
        status: 'paid',
        provider: razorpay_order_id?.startsWith('demo_order_') ? 'demo' : 'razorpay'
      },
      $setOnInsert: {
        orderId: razorpay_order_id,
        amount: appointment.counsellorId.fee,
        currency: 'INR',
        userId: req.user._id,
        appointmentId: appointment._id
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  appointment.paymentStatus = 'paid';
  appointment.bookingStatus = 'confirmed';
  appointment.meetingLink =
    appointment.meetingLink || `https://meet.jit.si/parentsphere-${appointment._id.toString().slice(-8)}`;
  await appointment.save();

  const dateText = appointment.date.toISOString().slice(0, 10);
  await sendEmail({ to: req.user.email, ...emailTemplates.payment(req.user.name, payment.amount) });
  await sendEmail({
    to: req.user.email,
    ...emailTemplates.booking(req.user.name, appointment.counsellorId.name, dateText, appointment.time)
  });

  res.json({ success: true, payment, appointment });
});

export const listPayments = asyncHandler(async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
  const payments = await Payment.find(query)
    .populate('userId', 'name email')
    .populate({
      path: 'appointmentId',
      populate: { path: 'counsellorId', model: 'Counsellor' }
    })
    .sort('-createdAt');
  res.json({ success: true, payments });
});
