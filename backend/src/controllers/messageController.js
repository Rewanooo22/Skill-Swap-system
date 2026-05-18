import Message from '../models/Message.js';
import { AppError } from '../middleware/errorHandler.js';
import { createNotification } from '../utils/notifications.js';

const getConversationId = (a, b) => [a, b].sort().join('_');

/** GET /api/messages/conversations */
export const getConversations = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate('sender receiver', 'name profilePhoto')
      .sort({ createdAt: -1 });

    const map = new Map();
    for (const msg of messages) {
      const otherId = msg.sender._id.toString() === req.user._id.toString()
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();
      if (!map.has(otherId)) {
        map.set(otherId, {
          user: msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender,
          lastMessage: msg,
          unread: 0,
        });
      }
      if (!msg.read && msg.receiver._id.toString() === req.user._id.toString()) {
        map.get(otherId).unread++;
      }
    }
    res.json({ success: true, conversations: [...map.values()] });
  } catch (err) { next(err); }
};

/** GET /api/messages/:userId */
export const getMessages = async (req, res, next) => {
  try {
    const convId = getConversationId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ conversationId: convId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });
    await Message.updateMany(
      { conversationId: convId, receiver: req.user._id, read: false },
      { read: true }
    );
    res.json({ success: true, messages });
  } catch (err) { next(err); }
};

/** POST /api/messages/:userId */
export const sendMessage = async (req, res, next) => {
  try {
    const { content, messageType = 'text', attachmentUrl = '' } = req.body;
    const convId = getConversationId(req.user._id.toString(), req.params.userId);
    const message = await Message.create({
      conversationId: convId,
      sender: req.user._id,
      receiver: req.params.userId,
      content,
      messageType,
      attachmentUrl: attachmentUrl || (req.file ? `/uploads/${req.file.filename}` : ''),
    });
    await createNotification({
      user: req.params.userId,
      type: 'message',
      title: 'New Message',
      body: `${req.user.name}: ${content?.slice(0, 50) || 'Sent an attachment'}`,
      link: `/messages/${req.user._id}`,
    });
    const populated = await message.populate('sender', 'name profilePhoto');
    res.status(201).json({ success: true, message: populated });
  } catch (err) { next(err); }
};
