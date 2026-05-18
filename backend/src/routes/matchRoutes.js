import express from 'express';
import { getMatches, connectMatch } from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', getMatches);
router.post('/:userId/connect', connectMatch);
export default router;
