import express from 'express';
import { bookRules, createBook, deleteBook, listBooks, toggleBookmark, updateBook } from '../controllers/bookController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', listBooks);
router.post('/', protect, authorize('admin'), validate(bookRules), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);
router.post('/:id/bookmark', protect, authorize('parent', 'admin'), toggleBookmark);

export default router;
