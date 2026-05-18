import express from 'express';
import {
  createSkill, getSkills, getSkill, updateSkill, deleteSkill, toggleFavorite, getFavorites,
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSkills);
router.get('/favorites/list', protect, getFavorites);
router.get('/:id', getSkill);
router.post('/', protect, createSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);
router.post('/:id/favorite', protect, toggleFavorite);

export default router;
