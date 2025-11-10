import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder); // Place order
router.get('/my', protect, getMyOrders); // User's orders
router.get('/', protect, admin, getAllOrders); // Admin: all orders
router.put('/status', protect, admin, updateOrderStatus); // Admin: update status

export default router;
