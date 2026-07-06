import express from 'express';
import { body } from 'express-validator';
import { addPostComment, createPost, listPosts, postRules, togglePostLike } from '../controllers/forumController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', listPosts);
router.post('/', validate(postRules), createPost);
router.post('/:id/like', togglePostLike);
router.post('/:id/comments', validate([body('text').isLength({ min: 2 }).withMessage('Comment is required')]), addPostComment);

export default router;
