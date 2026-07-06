import express from 'express';
import { sendChatMessage, getChatHistory } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', protect, sendChatMessage);
router.get('/history', protect, getChatHistory);

export default router;
