import express from 'express';
import { body } from 'express-validator';
import {
  appointmentRules,
  createAppointment,
  listAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', listAppointments);
router.post('/', authorize('parent', 'admin'), validate(appointmentRules), createAppointment);
router.patch(
  '/:id/status',
  authorize('admin', 'counsellor'),
  validate([body('bookingStatus').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled'])]),
  updateAppointmentStatus
);

export default router;
