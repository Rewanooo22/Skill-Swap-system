import Badge from '../models/Badge.js';

/** GET /api/badges */
export const getBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find();
    res.json({ success: true, badges });
  } catch (err) { next(err); }
};
