import express from 'express';
import {
    createProduct,
    getProducts,
    getProductByName,
    updateProductByName,
    deleteProductByName
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🌐 Public routes
router.get('/', getProducts); // Get all products
router.get('/:name', getProductByName); // Get single product by name

// 🔐 Admin-only routes
router.post('/', protect, admin, createProduct); // Create product (single or bulk)
router.put('/', protect, admin, updateProductByName); // ✅ Bulk update by body
router.delete('/', protect, admin, deleteProductByName); // ✅ Bulk delete by body

export default router;
