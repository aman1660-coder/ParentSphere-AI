import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';

// @desc    Create Razorpay order
// @route   POST /api/payments/order
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { amount, appointmentId } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    // Use dummy keys if real ones aren't provided
    const key_id = process.env.RAZORPAY_KEY_ID === 'dummy_key_id' ? 'rzp_test_dummy' : process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET === 'dummy_key_secret' ? 'dummy_secret' : process.env.RAZORPAY_KEY_SECRET;

    if (key_id === 'rzp_test_dummy') {
      // Mock Razorpay order creation
      res.json({
        id: `order_dummy_${Math.floor(Math.random() * 10000)}`,
        amount: options.amount,
        currency: "INR",
        isDummy: true
      });
      return;
    }

    const instance = new Razorpay({ key_id, key_secret });
    const order = await instance.orders.create(options);

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId, amount, isDummy } = req.body;

    let isAuthentic = false;

    if (isDummy) {
      isAuthentic = true; // Automatically verify dummy payments
    } else {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      isAuthentic = expectedSignature === razorpay_signature;
    }

    if (isAuthentic) {
      // Save payment
      await Payment.create({
        paymentId: razorpay_payment_id || `pay_dummy_${Math.floor(Math.random() * 10000)}`,
        orderId: razorpay_order_id,
        userId: req.user._id,
        appointmentId,
        amount,
        status: 'successful'
      });

      // Update appointment status
      const appointment = await Appointment.findById(appointmentId);
      if (appointment) {
        appointment.paymentStatus = 'completed';
        await appointment.save();
      }

      res.json({ success: true, message: 'Payment Verified Successfully' });
    } else {
      res.status(400);
      throw new Error('Invalid signature');
    }
  } catch (error) {
    next(error);
  }
};
