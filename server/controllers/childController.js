import Child from '../models/Child.js';

// @desc    Add a child
// @route   POST /api/children
// @access  Private
export const addChild = async (req, res, next) => {
  try {
    const { name, age, schoolGrade, height, weight } = req.body;

    const child = await Child.create({
      userId: req.user._id,
      name,
      age,
      schoolGrade,
      growthRecords: [{ height, weight }]
    });

    res.status(201).json(child);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's children
// @route   GET /api/children
// @access  Private
export const getMyChildren = async (req, res, next) => {
  try {
    const children = await Child.find({ userId: req.user._id });
    res.json(children);
  } catch (error) {
    next(error);
  }
};

// @desc    Add growth record
// @route   POST /api/children/:id/growth
// @access  Private
export const addGrowthRecord = async (req, res, next) => {
  try {
    const { height, weight } = req.body;
    const child = await Child.findById(req.params.id);

    if (child && child.userId.toString() === req.user._id.toString()) {
      child.growthRecords.push({ height, weight });
      await child.save();
      res.json(child);
    } else {
      res.status(404);
      throw new Error('Child not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};
