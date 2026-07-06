import Counsellor from '../models/Counsellor.js';

// @desc    Get all counsellors
// @route   GET /api/counsellors
// @access  Public
export const getCounsellors = async (req, res, next) => {
  try {
    const counsellors = await Counsellor.find({}).select('-password');
    res.json(counsellors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single counsellor
// @route   GET /api/counsellors/:id
// @access  Public
export const getCounsellorById = async (req, res, next) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id).select('-password');
    if (counsellor) {
      res.json(counsellor);
    } else {
      res.status(404);
      throw new Error('Counsellor not found');
    }
  } catch (error) {
    next(error);
  }
};
