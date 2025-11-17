import express from 'express';
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    cancelOrder,
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder); // Place order
router.get('/my', protect, getMyOrders); // User's orders
router.get('/', protect, admin, getAllOrders); // Admin: all orders
router.put('/status', protect, admin, updateOrderStatus); // Admin: update status
router.delete('/:orderId', protect, deleteOrder); // user or admin can delete
router.put('/:orderId/cancel', protect, cancelOrder); // user cancels own order
export default router;
