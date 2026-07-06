import express from 'express';
import { addChild, getMyChildren, addGrowthRecord } from '../controllers/childController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addChild).get(protect, getMyChildren);
router.route('/:id/growth').post(protect, addGrowthRecord);

export default router;
