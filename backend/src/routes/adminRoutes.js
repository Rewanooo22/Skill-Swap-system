import express from 'express';
import {
  getStats, getReports, updateReport, suspendUser, getAllUsers, createReport, getSuspicious,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.post('/reports', protect, createReport);
router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', suspendUser);
router.get('/suspicious', getSuspicious);
export default router;
