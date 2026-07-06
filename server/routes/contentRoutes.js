import express from 'express';
import { getBooks, getArticles, getArticleById, likeArticle } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/books', getBooks);
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.put('/articles/:id/like', protect, likeArticle);

export default router;
