import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { awardPoints, POINTS } from '../utils/gamification.js';

/** POST /api/skills */
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create({ ...req.body, owner: req.user._id });
    await awardPoints(req.user._id, POINTS.skill, 'skill_created');
    res.status(201).json({ success: true, skill });
  } catch (err) { next(err); }
};

/** GET /api/skills */
export const getSkills = async (req, res, next) => {
  try {
    const { search, tags, location, mode, type, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };
    if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim()) };
    if (location) filter.location = new RegExp(location, 'i');
    if (mode) filter.mode = mode;
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const skills = await Skill.find(filter)
      .populate('owner', 'name profilePhoto location trustScore averageRating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Skill.countDocuments(filter);
    res.json({ success: true, skills, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

/** GET /api/skills/:id */
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('owner', 'name profilePhoto bio location trustScore');
    if (!skill) throw new AppError('Skill not found', 404);
    res.json({ success: true, skill });
  } catch (err) { next(err); }
};

/** PUT /api/skills/:id */
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new AppError('Skill not found', 404);
    if (skill.owner.toString() !== req.user._id.toString()) throw new AppError('Not authorized', 403);
    Object.assign(skill, req.body);
    await skill.save();
    res.json({ success: true, skill });
  } catch (err) { next(err); }
};

/** DELETE /api/skills/:id */
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) throw new AppError('Skill not found', 404);
    if (skill.owner.toString() !== req.user._id.toString()) throw new AppError('Not authorized', 403);
    await skill.deleteOne();
    res.json({ success: true, message: 'Skill deleted' });
  } catch (err) { next(err); }
};

/** POST /api/skills/:id/favorite */
export const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.id;
    const idx = user.favorites.indexOf(id);
    if (idx > -1) user.favorites.splice(idx, 1);
    else user.favorites.push(id);
    await user.save();
    res.json({ success: true, favorites: user.favorites, favorited: idx === -1 });
  } catch (err) { next(err); }
};

/** GET /api/skills/favorites/list */
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: { path: 'owner', select: 'name profilePhoto' },
    });
    res.json({ success: true, skills: user.favorites });
  } catch (err) { next(err); }
};
