import express from 'express';
import { body } from 'express-validator';
import { contactRules, listTestimonials, submitContact, subscribeNewsletter } from '../controllers/contactController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/contact', validate(contactRules), submitContact);
router.post('/newsletter', validate([body('email').isEmail().withMessage('Valid email is required')]), subscribeNewsletter);
router.get('/testimonials', listTestimonials);

export default router;
