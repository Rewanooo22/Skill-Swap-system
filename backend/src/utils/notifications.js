import Notification from '../models/Notification.js';

export const createNotification = async ({ user, type, title, body, link, metadata }) => {
  return Notification.create({ user, type, title, body, link, metadata });
};
