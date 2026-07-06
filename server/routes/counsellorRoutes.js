import express from 'express';
import { getCounsellors, getCounsellorById } from '../controllers/counsellorController.js';

const router = express.Router();

router.get('/', getCounsellors);
router.get('/:id', getCounsellorById);

export default router;
