import express from 'express';
import {
    createProduct,
    getProducts,
    getProductByName,
    getProductById,        // ✅ new import
    updateProductByName,
    deleteProductByName
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// 🌐 Public routes
router.get('/', getProducts);             // Get all products
router.get('/id/:id', getProductById);    // ✅ Get product by ID
router.get('/:name', getProductByName);   // Get product by name

// 🔐 Admin-only routes
router.post('/', protect, admin, upload.array('images', 8), createProduct);
router.put('/', protect, admin, upload.array('images', 8), updateProductByName);
router.delete('/', protect, admin, deleteProductByName);

export default router;
