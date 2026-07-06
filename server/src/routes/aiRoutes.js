import express from 'express';
import { chat, chatRules, getChatHistory, recommendations } from '../controllers/aiController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('parent', 'admin'));
router.get('/history', getChatHistory);
router.post('/chat', validate(chatRules), chat);
router.post('/recommendations', recommendations);

export default router;
