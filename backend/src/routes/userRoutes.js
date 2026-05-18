import express from 'express';
import {
  getUser, updateProfile, uploadAvatar, deleteAccount, getUserReviews, getLeaderboard,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUser);
router.get('/:id/reviews', getUserReviews);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('photo'), uploadAvatar);
router.delete('/account', protect, deleteAccount);

export default router;
