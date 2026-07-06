import express from 'express';
import {
  counsellorRules,
  createCounsellor,
  deleteCounsellor,
  getCounsellor,
  listCounsellors,
  updateCounsellor
} from '../controllers/counsellorController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listCounsellors);
router.get('/:id', getCounsellor);
router.post('/', protect, authorize('admin'), validate(counsellorRules), createCounsellor);
router.put('/:id', protect, authorize('admin', 'counsellor'), updateCounsellor);
router.delete('/:id', protect, authorize('admin'), deleteCounsellor);

export default router;
