import express from 'express';
import {
    createProduct,
    getProducts,
    getProductByName,
    updateProductByName,
    deleteProductByName
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; // ✅ multer-storage-cloudinary middleware

const router = express.Router();

// 🌐 Public routes
router.get('/', getProducts);            // Get all products
router.get('/:name', getProductByName);  // Get single product by name

// 🔐 Admin-only routes
// ✅ Create product with multiple images
router.post('/', protect, admin, upload.array('images', 8), createProduct);

// ✅ Update product(s) with optional new images
router.put('/', protect, admin, upload.array('images', 8), updateProductByName);

// ✅ Delete product(s) and clean up Cloudinary images
router.delete('/', protect, admin, deleteProductByName);

export default router;
