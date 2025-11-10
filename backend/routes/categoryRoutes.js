import express from 'express';
import {
    createCategory,
    getCategories,
    getCategoryByName,
    updateCategoryByName,
    deleteCategoryByName
} from '../controllers/categoryController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:name', getCategoryByName);

// Admin-only routes
router.post('/', protect, admin, createCategory);
router.put('/:name', protect, admin, updateCategoryByName);
router.delete('/:name', protect, admin, deleteCategoryByName);

export default router;
