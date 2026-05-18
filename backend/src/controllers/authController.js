import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { AppError } from '../middleware/errorHandler.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/auth/register */
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, email, password } = req.body;
    if (!emailRegex.test(email)) throw new AppError('Invalid email format', 400);
    if (await User.findOne({ email })) throw new AppError('Email already registered', 400);

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

/** POST /api/auth/login */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) throw new AppError('Invalid credentials', 401);
    if (user.isSuspended) throw new AppError('Account suspended', 403);

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) { next(err); }
};

/** GET /api/auth/me */
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('badges');
  res.json({ success: true, user });
};
