import User from '../models/User.js';
import Match from '../models/Match.js';
import { computeMatchScore } from '../utils/matchmaking.js';
import { createNotification } from '../utils/notifications.js';
import { awardPoints, POINTS } from '../utils/gamification.js';

/** GET /api/matches */
export const getMatches = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const candidates = await User.find({
      _id: { $ne: req.user._id },
      isSuspended: false,
    }).select('-password');

    const scored = candidates
      .map((c) => {
        const { score, reasons } = computeMatchScore(currentUser, c);
        return { user: c, score, reasons };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    for (const m of scored.slice(0, 5)) {
      await Match.findOneAndUpdate(
        { user: req.user._id, matchedUser: m.user._id },
        { score: m.score, reasons: m.reasons },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, matches: scored });
  } catch (err) { next(err); }
};

/** POST /api/matches/:userId/connect */
export const connectMatch = async (req, res, next) => {
  try {
    const match = await Match.findOneAndUpdate(
      { user: req.user._id, matchedUser: req.params.userId },
      { status: 'connected' },
      { new: true }
    );
    await createNotification({
      user: req.params.userId,
      type: 'match',
      title: 'New Connection',
      body: `${req.user.name} connected with you`,
      link: `/profile/${req.user._id}`,
    });
    await awardPoints(req.user._id, POINTS.match, 'match_connect');
    res.json({ success: true, match });
  } catch (err) { next(err); }
};
