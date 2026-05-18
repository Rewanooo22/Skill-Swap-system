import Session from '../models/Session.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notifications.js';
import { awardPoints, checkMilestones, POINTS } from '../utils/gamification.js';

/** POST /api/sessions */
export const proposeSession = async (req, res, next) => {
  try {
    const session = await Session.create({ ...req.body, host: req.user._id, status: 'proposed' });
    await createNotification({
      user: req.body.guest,
      type: 'session',
      title: 'Session Proposal',
      body: `${req.user.name} proposed a session: ${req.body.title}`,
      link: '/sessions',
      metadata: { sessionId: session._id },
    });
    res.status(201).json({ success: true, session });
  } catch (err) { next(err); }
};

/** GET /api/sessions */
export const getSessions = async (req, res, next) => {
  try {
    const filter = {
      $or: [{ host: req.user._id }, { guest: req.user._id }],
    };
    if (req.query.status) filter.status = req.query.status;
    const sessions = await Session.find(filter)
      .populate('host guest skill', 'name profilePhoto title')
      .sort({ proposedTime: -1 });
    res.json({ success: true, sessions });
  } catch (err) { next(err); }
};

/** PUT /api/sessions/:id/respond */
export const respondSession = async (req, res, next) => {
  try {
    const { action } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) throw new AppError('Session not found', 404);
    if (session.guest.toString() !== req.user._id.toString()) throw new AppError('Not authorized', 403);

    session.status = action === 'accept' ? 'accepted' : 'rejected';
    await session.save();

    await createNotification({
      user: session.host,
      type: 'session',
      title: `Session ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
      body: `${req.user.name} ${action}ed your session proposal`,
      link: '/sessions',
    });
    res.json({ success: true, session });
  } catch (err) { next(err); }
};

/** PUT /api/sessions/:id/cancel */
export const cancelSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) throw new AppError('Session not found', 404);
    const isParticipant = [session.host.toString(), session.guest.toString()].includes(req.user._id.toString());
    if (!isParticipant) throw new AppError('Not authorized', 403);

    session.status = 'cancelled';
    session.cancelledBy = req.user._id;
    await session.save();

    const other = session.host.toString() === req.user._id.toString() ? session.guest : session.host;
    await createNotification({
      user: other,
      type: 'cancellation',
      title: 'Session Cancelled',
      body: `${req.user.name} cancelled the session`,
      link: '/sessions',
    });
    res.json({ success: true, session });
  } catch (err) { next(err); }
};

/** PUT /api/sessions/:id/complete */
export const completeSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) throw new AppError('Session not found', 404);
    session.status = 'completed';
    await session.save();

    for (const uid of [session.host, session.guest]) {
      await awardPoints(uid, POINTS.session, 'session_complete');
      await checkMilestones(uid);
    }
    await Session.findByIdAndUpdate(session._id, { reviewed: false });
    const User = (await import('../models/User.js')).default;
    await User.updateMany(
      { _id: { $in: [session.host, session.guest] } },
      { $inc: { completedSessions: 1 } }
    );
    res.json({ success: true, session });
  } catch (err) { next(err); }
};
