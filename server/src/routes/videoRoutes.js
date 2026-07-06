import express from 'express';
import { createVideo, deleteVideo, listVideos, updateVideo, videoRules } from '../controllers/videoController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listVideos);
router.post('/', protect, authorize('admin'), validate(videoRules), createVideo);
router.put('/:id', protect, authorize('admin'), updateVideo);
router.delete('/:id', protect, authorize('admin'), deleteVideo);

export default router;
