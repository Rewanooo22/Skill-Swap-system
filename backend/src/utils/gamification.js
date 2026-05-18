import User from '../models/User.js';
import Badge from '../models/Badge.js';
import { createNotification } from './notifications.js';

const POINTS = { session: 25, review: 10, skill: 5, match: 5 };

export const awardPoints = async (userId, amount, reason) => {
  const user = await User.findByIdAndUpdate(userId, { $inc: { points: amount } }, { new: true });
  await checkBadges(user);
  return user;
};

export const checkBadges = async (user) => {
  const badges = await Badge.find();
  for (const badge of badges) {
    if (user.badges?.includes(badge._id)) continue;
    let earned = false;
    if (badge.name === 'First Swap' && user.completedSessions >= 1) earned = true;
    if (badge.name === 'Skill Master' && user.completedSessions >= 10) earned = true;
    if (badge.name === 'Rising Star' && user.points >= badge.pointsRequired) earned = true;
    if (badge.name === 'Trusted Trader' && user.trustScore >= 80) earned = true;
    if (earned) {
      await User.findByIdAndUpdate(user._id, { $addToSet: { badges: badge._id } });
      await createNotification({
        user: user._id,
        type: 'system',
        title: 'Badge Earned!',
        body: `You earned the "${badge.name}" badge`,
      });
    }
  }
};

export const checkMilestones = async (userId) => {
  const user = await User.findById(userId);
  const updates = {};
  if (user.completedSessions >= 1 && !user.milestones?.firstSwap) {
    updates['milestones.firstSwap'] = true;
    await awardPoints(userId, 50, 'first_swap');
  }
  if (user.completedSessions >= 10 && !user.milestones?.tenSwaps) {
    updates['milestones.tenSwaps'] = true;
    await awardPoints(userId, 100, 'ten_swaps');
  }
  if (Object.keys(updates).length) await User.findByIdAndUpdate(userId, updates);
};

export { POINTS };
