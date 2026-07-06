import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    counsellorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counsellor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    notes: { type: String, default: '' },
    meetingLink: { type: String, default: '' }
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, counsellorId: 1, date: 1, time: 1 });

export default mongoose.model('Appointment', appointmentSchema);
