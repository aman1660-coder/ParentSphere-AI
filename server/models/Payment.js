import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String, // Razorpay payment ID
    required: true,
  },
  orderId: {
    type: String, // Razorpay order ID
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  appointmentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['successful', 'failed', 'refunded'],
    default: 'successful',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
