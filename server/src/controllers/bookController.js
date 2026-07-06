import { body } from 'express-validator';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const bookRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('pdfLink').isURL().withMessage('Valid PDF link is required'),
  body('coverImage').isURL().withMessage('Valid cover image is required'),
  body('summary').isLength({ min: 20 }).withMessage('Summary is required')
];

export const listBooks = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const query = {};
  if (q) query.$text = { $search: q };
  if (category && category !== 'All') query.category = category;
  const books = await Book.find(query).sort('-isFeatured title');
  res.json({ success: true, books });
});

export const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json({ success: true, book });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, book });
});

export const deleteBook = asyncHandler(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Book deleted' });
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const exists = user.savedBooks.some((bookId) => String(bookId) === req.params.id);
  user.savedBooks = exists
    ? user.savedBooks.filter((bookId) => String(bookId) !== req.params.id)
    : [...user.savedBooks, req.params.id];
  await user.save({ validateBeforeSave: false });
  const populated = await User.findById(user._id).populate('savedBooks');
  res.json({ success: true, savedBooks: populated.savedBooks, bookmarked: !exists });
});
