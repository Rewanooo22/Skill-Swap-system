import User from '../models/User.js';
import Session from '../models/Session.js';
import Skill from '../models/Skill.js';
import Report from '../models/Report.js';
import Review from '../models/Review.js';
import { AppError } from '../middleware/errorHandler.js';

/** GET /api/admin/stats */
export const getStats = async (req, res, next) => {
  try {
    const [users, skills, sessions, reports, reviews] = await Promise.all([
      User.countDocuments(),
      Skill.countDocuments(),
      Session.countDocuments(),
      Report.countDocuments({ status: 'open' }),
      Review.countDocuments(),
    ]);
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const suspended = await User.countDocuments({ isSuspended: true });
    res.json({
      success: true,
      stats: { users, skills, sessions, completedSessions, openReports: reports, reviews, suspended },
    });
  } catch (err) { next(err); }
};

/** GET /api/admin/reports */
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter reportedUser', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) { next(err); }
};

/** PUT /api/admin/reports/:id */
export const updateReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, report });
  } catch (err) { next(err); }
};

/** PUT /api/admin/users/:id/suspend */
export const suspendUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended: req.body.suspend ?? true },
      { new: true }
    );
    if (!user) throw new AppError('User not found', 404);
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

/** GET /api/admin/users */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
};

/** POST /api/admin/reports - user submits report */
export const createReport = async (req, res, next) => {
  try {
    const report = await Report.create({ ...req.body, reporter: req.user._id });
    res.status(201).json({ success: true, report });
  } catch (err) { next(err); }
};

/** GET /api/admin/suspicious */
export const getSuspicious = async (req, res, next) => {
  try {
    const users = await User.find({
      $or: [{ trustScore: { $lt: 20 } }, { isSuspended: true }],
    }).select('name email trustScore isSuspended averageRating');
    res.json({ success: true, users });
  } catch (err) { next(err); }
};
