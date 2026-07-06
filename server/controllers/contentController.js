import Book from '../models/Book.js';
import Article from '../models/Article.js';

// @desc    Get all books
// @route   GET /api/content/books
// @access  Public
export const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all articles
// @route   GET /api/content/articles
// @access  Public
export const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article
// @route   GET /api/content/articles/:id
// @access  Public
export const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      res.json(article);
    } else {
      res.status(404);
      throw new Error('Article not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Like an article
// @route   PUT /api/content/articles/:id/like
// @access  Private
export const likeArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      article.likes += 1;
      await article.save();
      res.json({ message: 'Article liked', likes: article.likes });
    } else {
      res.status(404);
      throw new Error('Article not found');
    }
  } catch (error) {
    next(error);
  }
};
