import { body } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';
import Newsletter from '../models/Newsletter.js';
import Testimonial from '../models/Testimonial.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const contactRules = [
  body('name').isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').isLength({ min: 3 }).withMessage('Subject is required'),
  body('message').isLength({ min: 10 }).withMessage('Message is required')
];

export const submitContact = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);
  res.status(201).json({ success: true, message });
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const subscription = await Newsletter.findOneAndUpdate(
    { email: req.body.email },
    { email: req.body.email, source: req.body.source || 'landing' },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ success: true, subscription });
});

export const listTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await Testimonial.find({}).sort('-rating -createdAt').limit(12);
  res.json({ success: true, testimonials });
});
