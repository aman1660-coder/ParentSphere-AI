import express from 'express';
import { body } from 'express-validator';
import { createOrder, createOrderRules, listPayments, verifyPayment } from '../controllers/paymentController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', listPayments);
router.post('/create-order', authorize('parent', 'admin'), validate(createOrderRules), createOrder);
router.post(
  '/verify',
  authorize('parent', 'admin'),
  validate([body('appointmentId').notEmpty().withMessage('Appointment is required')]),
  verifyPayment
);

export default router;
