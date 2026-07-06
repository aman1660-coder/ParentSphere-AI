import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created'
    },
    provider: { type: String, enum: ['razorpay', 'demo'], default: 'razorpay' },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
