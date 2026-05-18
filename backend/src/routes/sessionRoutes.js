import express from 'express';
import {
  proposeSession, getSessions, respondSession, cancelSession, completeSession,
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.get('/', getSessions);
router.post('/', proposeSession);
router.put('/:id/respond', respondSession);
router.put('/:id/cancel', cancelSession);
router.put('/:id/complete', completeSession);
export default router;
