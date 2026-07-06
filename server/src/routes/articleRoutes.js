import express from 'express';
import { body } from 'express-validator';
import {
  addComment,
  articleRules,
  createArticle,
  deleteArticle,
  getArticle,
  listArticles,
  toggleLike,
  updateArticle
} from '../controllers/articleController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listArticles);
router.get('/:id', getArticle);
router.post('/', protect, authorize('admin'), validate(articleRules), createArticle);
router.put('/:id', protect, authorize('admin'), updateArticle);
router.delete('/:id', protect, authorize('admin'), deleteArticle);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, validate([body('text').isLength({ min: 2 }).withMessage('Comment is required')]), addComment);

export default router;
