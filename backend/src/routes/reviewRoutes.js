import express from 'express';
import { createReview, getSessionReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/session/:sessionId', getSessionReviews);
router.post('/', protect, createReview);
export default router;
