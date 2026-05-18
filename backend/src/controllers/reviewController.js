import Review from '../models/Review.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { awardPoints, POINTS } from '../utils/gamification.js';

/** POST /api/reviews */
export const createReview = async (req, res, next) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const session = await Session.findById(sessionId);
    if (!session || session.status !== 'completed') throw new AppError('Invalid session', 400);

    const reviewee = session.host.toString() === req.user._id.toString() ? session.guest : session.host;
    const existing = await Review.findOne({ session: sessionId, reviewer: req.user._id });
    if (existing) throw new AppError('Already reviewed', 400);

    const review = await Review.create({
      session: sessionId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
    });

    const reviews = await Review.find({ reviewee });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const trustDelta = (rating - 3) * 5;
    await User.findByIdAndUpdate(reviewee, {
      averageRating: Math.round(avg * 10) / 10,
      reviewCount: reviews.length,
      $inc: { trustScore: trustDelta },
    });

    await awardPoints(req.user._id, POINTS.review, 'review');
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
};

/** GET /api/reviews/session/:sessionId */
export const getSessionReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ session: req.params.sessionId })
      .populate('reviewer', 'name profilePhoto');
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};
