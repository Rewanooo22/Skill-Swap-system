import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';

/** GET /api/users/:id */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('badges');
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

/** PUT /api/users/profile */
export const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'location', 'availability', 'languages', 'offeredSkills', 'requestedSkills'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

/** POST /api/users/avatar */
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const photo = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, { profilePhoto: photo }, { new: true });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

/** DELETE /api/users/account */
export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(password))) throw new AppError('Incorrect password', 401);
    await Skill.deleteMany({ owner: user._id });
    await User.findByIdAndDelete(user._id);
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) { next(err); }
};

/** GET /api/users/:id/reviews */
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate('reviewer', 'name profilePhoto')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

/** GET /api/users/leaderboard */
export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ isSuspended: false })
      .select('name profilePhoto points trustScore averageRating completedSessions')
      .sort({ points: -1 })
      .limit(20);
    res.json({ success: true, users });
  } catch (err) { next(err); }
};
