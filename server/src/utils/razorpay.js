import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';

export const isRazorpayConfigured = () => Boolean(env.razorpayKeyId && env.razorpayKeySecret);

export const createRazorpayOrder = async ({ amount, receipt }) => {
  if (!isRazorpayConfigured()) {
    return {
      id: `demo_order_${Date.now()}`,
      amount: amount * 100,
      currency: env.razorpayCurrency,
      receipt,
      demo: true
    };
  }

  const razorpay = new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret
  });

  return razorpay.orders.create({
    amount: amount * 100,
    currency: env.razorpayCurrency,
    receipt,
    payment_capture: 1
  });
};

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  if (!isRazorpayConfigured() || orderId?.startsWith('demo_order_')) return true;
  const expected = crypto
    .createHmac('sha256', env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};
